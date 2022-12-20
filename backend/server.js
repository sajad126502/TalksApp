const express = require("express")
const app = express()

const chats = require("./dummydata")
const dotEnv = require("dotenv")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const connectDB = require("./config/db")
const path =require("path")
const messageRoutes = require("./routes/messageRoutes")
dotEnv.config()
connectDB()
app.use(express.json())
const port = process.env.PORT || 9000
app.use("/api/user/", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
//************DEPLOYMENT************* */

const __dirname1=path.resolve()
if(process.env.NODE_ENV==="production"){
app.use(express.static(path.join(__dirname1,'/frontend/build')))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
})
}
else{
    app.get("/",(req,res)=>{ 
        res.send("API IS RUNNING ....")
    })
}




//********************************** */
const server = app.listen(port, console.log(`SERVER IS RUNNING ON PORT ${port}`))
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }

})
io.on("connection", (socket) => {
    console.log("connected")
    socket.on("setup", (user) => {
        socket.join(user._id)
        //  console.log("connected")
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("user joined room", room)

    })
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat
        console.log(newMessageRecieved)
        if (!chat.users) return console.log("users not defined")
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })
    socket.on("typing",(id,selectedChat)=>{
        console.log("typing"+id)
        socket.in(id).emit("sender typing",selectedChat)
    })

})



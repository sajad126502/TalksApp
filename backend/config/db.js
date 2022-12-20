const mongoose=require("mongoose")
const connectDB=async ()=>{
    
   try {
    const con = await mongoose.connect(process.env.DATABASE_URI,{
        useNewUrlParser: true,
        useUnifiedTopology:true
       })
       console.log("Database connected successfully:"+con.connection.host)
   } catch (error) {
    console.log("Database not connected:"+error)
   }
}
module.exports=connectDB
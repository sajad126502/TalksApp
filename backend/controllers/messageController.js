const Chat = require("../Models/chatModels")
const Message=require("../Models/messageModel")
const User = require("../Models/userModel")
const sendMessage=async(req,res)=>{
    console.log(req.user)
const {content,chatId}=req.body
if(!content || !chatId){
    res.status(400).json({errorMessage:"Enter all details"})
    return
}
try {
    var newMessage=await Message.create({
        sender:req.user.id,
        content,
        chat:chatId
    })
    newMessage=await newMessage.populate("sender","name pic")
    newMessage=await newMessage.populate("chat")
    newMessage=await User.populate(newMessage,{
        path:"chat.users",
        select:" name pic email"
        
    })

     await Chat.findByIdAndUpdate(chatId,{latestMessage:newMessage._id})
    

    res.status(200).json(newMessage)
    
} catch (error) {
    res.status(400).json({errorMessage:`${error.message}`})
}


}
const getChatMessages=async(req,res)=>{
    const {chatId}=req.params
    if(!chatId){
        res.status(400).json({errorMessage:"you dont give the chat id"})
    return
    }
     try {
        let chatMessages=await Message.find({chat:chatId})
        .populate("sender","name pic email")
        .populate("chat")
        res.status(200).json(chatMessages)
     } catch (error) {
        res.status(400).json({errorMessage:`${error.message}`})
        
     }

}

module.exports={sendMessage,getChatMessages}
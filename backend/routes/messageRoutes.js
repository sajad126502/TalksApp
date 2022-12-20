const express=require("express")
const { sendMessage, getChatMessages } = require("../controllers/messageController")
const router=express.Router()
const authMiddleware = require("../middlewares/authMiddleware")

//router.route("/").post(registerUser)

 router.post("/",authMiddleware,sendMessage)
 router.get("/:chatId",authMiddleware,getChatMessages)

module.exports=router

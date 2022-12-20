const express=require("express")
const chatController = require("../controllers/chatContoller")
const router=express.Router()
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/",authMiddleware,chatController.fetchChats)
router.post("/",authMiddleware,chatController.accessChat)
router.post("/creategroup",authMiddleware,chatController.createGroup)
router.put("/renamegroup",authMiddleware,chatController.renameGroup)
router.put("/addgroup",authMiddleware,chatController.addToGroup)
router.put("/groupremove",authMiddleware,chatController.removeFromGroup)






module.exports=router
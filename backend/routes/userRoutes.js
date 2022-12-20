const express=require("express")
const router=express.Router()
const {registerUser,loginUser, getAllUsers} =require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")

//router.route("/").post(registerUser)

router.post("/signup",registerUser)
router.get("/",authMiddleware,getAllUsers)
router.post("/login",loginUser)
module.exports=router

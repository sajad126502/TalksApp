const jwt = require("jsonwebtoken")
const User = require("../Models/userModel")
const authMiddleware = async (req, res, next) => {

    try {
        //  console.log(req.headers.authorization)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            const token = req.headers.authorization.split(" ")[1]
            const { user } = jwt.verify(token, process.env.JWT_SECRET)
            const userData = await User.findById(user._id).select("-password")
            req.user = userData
            next()

        }
        else{
            console.log("not authorized")
            res.status(400).json({errorMessage:"Not authorized"})
        }
    } catch (error) {

        res.status(400).json({errorMessage:`${error.message}`})

    }




}
module.exports = authMiddleware
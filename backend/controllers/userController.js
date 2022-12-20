const asyncHandler = require("express-async-handler")
const generateToken = require("../config/generateToken")
const User = require("../Models/userModel")

//****** Registers the user ********** */
const registerUser = async (req, res) => {
    console.log(req.body)
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400).json({ errorMessage: "plz enter all details" })

    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400).json({ errorMessage: "User already exists" })
        return
    }

    const user = await User.create(
        {
            name,
            email,
            password,
            pic
        }
    )
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user)
        })

    }
    else {
        res.status(400).send({ errorMessage: "Registeration failed" })
    }
}
// **************** For login ***********************
const loginUser = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({ errorMessage: "Plx enter all details" })

    }
    else {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ errorMessage: "Plz chk your inputs" })
        }
        else {
            if (await user.comparePassword(password)) {
                res.status(200).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    profile: user.pic,
                    token: generateToken(user)
                })
            }
            else {
                res.status(400).json({ errorMessage: "Password incorrect" })
            }

        }

    }


}
//****************** GET ALL USERS *********************** */
const getAllUsers = async(req, res) => {
    const keyword = req.query.search ?
        {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        }:{}
console.log(req.user)
    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
   res.status(200).json(users)
    
}
module.exports = { registerUser, loginUser, getAllUsers }
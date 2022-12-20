const Chat = require("../Models/chatModels")
const User = require("../Models/userModel")
const accessChat = async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        console.log("Plx send the user id with params")
        return res.sendStatus(400)

    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }


        ]

    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })


    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({
                _id: createdChat._id
            }).populate("users", "-password")
            res.status(201).send(fullChat)
        } catch (error) {
            res.status(400).json({ errorMessage: " Chat not created: Something went wrong " })

        }

    }

}
const fetchChats = async (req, res) => {
    try {
        let userChats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
     
        // userChats = User.populate(userChats, {
        //     path: "latestMessage.sender",
        //     select: "name pic email"
        // })
        res.status(200).send(userChats)
    } catch (error) {
        res.status(400).json({ errorMessage: "failed to fetch chat" })

    }
}
const createGroup = async (req, res) => {
    console.log(req.body)
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ errorMessage: "plz enter all details" })
        }
        var users = JSON.parse(req.body.users)
        if (users.length < 2) {
            return res.status(400).json({ errorMessage: "More then 2 users required to create a group chat" })
        }
        users.push(req.user)

        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(201).json(fullGroupChat)

    } catch (error) {
        console.log(error)
        res.status(400).json({ errorMessage: `${error.message}` })
    }


}
const renameGroup = async (req, res) => {
    try {
        const chatName = req.body.chatName
        const chatId = req.body.chatId
        const group = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!group) {
            return res.status(400).json({ errorMessage: "Group not found" })
        }
        else {
            res.status(201).json(group)
        }
    } catch (error) {
        return res.status(400).json({ errorMessage: `${error.message}` })
    }

}
const addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const added = await Chat.findByIdAndUpdate(chatId, { $addToSet: { users: userId } }, { new: true })//$addToSet:pushes without duplicaton
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            if(!added){
                return res.status(400).json({ errorMessage: "chat not found" })
            }
        res.status(201).json(added)
    } catch (error) {
        return res.status(400).json({ errorMessage: `${error.message}` })
    }




}
const removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            if(!removed){
                return res.status(400).json({ errorMessage: "chat not found" })
            }
        res.status(201).json(removed)
    } catch (error) {
        return res.status(400).json({ errorMessage: `${error.message}` })
    }




}
module.exports = { accessChat, fetchChats, createGroup, renameGroup ,addToGroup,removeFromGroup}
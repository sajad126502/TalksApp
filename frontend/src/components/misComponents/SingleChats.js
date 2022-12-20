import { ArrowBackIcon } from '@chakra-ui/icons'
import { Avatar, Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/context'
import { getSender } from '../../helper/getSender'
import { getSenderObj } from '../../helper/getSenderObj'
import ProfileModel from "./ProfileModel"
import UpadatedGroupChatModel from './UpadatedGroupChatModel'
import axios from "axios"
import "./mystyle.css"
import Message from './Message'
import { isItMe } from '../../helper/isItMe'
import io from "socket.io-client"
import { fetchChats } from '../../helper/fetchChats'
const ENDPOINT = "http://localhost:8000"

export default function SingleChats({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat, indicator, setIndicator,setChats } = ChatState()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [loading, setLoading] = useState(false)
    const [typing, setTyping] = useState(false)
    const [sender, setSender] = useState()
    const toast = useToast()
    var socket, selectedChatCompare;

    useEffect(() => {

        socket = io(ENDPOINT)
        try {
            socket.emit("setup", user)
            socket.on("connection", () => {
                setSocketConnected(true)
            })



        } catch (error) {
            console.log(error)
        }


    })

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
        if (selectedChat) { setSender(getSenderObj(user, selectedChat.users)) }
    }, [selectedChat])



    useEffect(() => {


        socket.on("message recieved", (newMessageRecieved) => {
            setTyping(false)

            if (!selectedChat || selectedChat._id != newMessageRecieved.chat._id) {
                fetchChats(user).then((data)=>{
                    console.log(data)
                   setChats(data)
                  }).catch((e)=>{
              
                    Toast({
                      title: `${e.message}`,
                      status: 'warning',
                      duration: 1000,
                      isClosable: true,
                      position: "top-left"
                    })
                  })
                setIndicator(true)
            }
            else {
                setIndicator(false)
                setMessages([...messages, newMessageRecieved])
            }
        })


        socket.on("sender typing", ({ _id }) => {

            if (_id === selectedChat._id)
                setTyping(true)
            setTimeout(() => {
                setTyping(false)
            }, 1000)


        })

    }, [selectedChat, messages])








    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            setLoading(true)
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setLoading(false)
            setMessages(data)
            socket.emit("join chat", selectedChat._id)


        } catch (e) {
            toast({
                title: `${e.message}`,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "top-left"
            })
            setLoading(false)
        }

    }

    const sendMessage = async (e) => {

        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                setNewMessage("")
                socket.emit("new message", data)
                setMessages([...messages, data])


            } catch (e) {
                toast({
                    title: `${e.message}`,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top-left"
                })
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        //  typing indicator logic here
        socket.emit("typing", sender._id, selectedChat)

    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            display={"flex"}
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon></ArrowBackIcon>}
                                onClick={() => {
                                    setSelectedChat("")
                                    setMessages([])
                                }}
                            >

                            </IconButton>


                            {!selectedChat.isGroupChat ? (
                                <>{getSender(user, selectedChat.users)}
                                    <ProfileModel user={getSenderObj(user, selectedChat.users)}>

                                    </ProfileModel>

                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpadatedGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></UpadatedGroupChatModel>
                                </>
                            )}


                        </Text>
                        <Box
                            display={"flex"}
                            flexDir="column"
                            justifyContent={"flex-end"}
                            p={3}
                            bg={"#E8E8E8"}
                            w="100%"
                            height={"100%"}
                            borderRadius="lg"
                            overflowY={"hidden"}
                            position={"relative"}
                        >


                            {loading ? (
                                <Spinner
                                    size={"xl"}
                                    alignSelf="center"
                                    margin={"auto"}

                                ></Spinner>
                            ) : (<div className='messages'>

                                {
                                    messages ? (messages.map((message) => {


                                        return <Box display={"flex"}
                                            justifyContent={"start"}
                                            width="200px"
                                            flexWrap={"wrap"}
                                            mr={{ base: "2px", md: "5px" }}
                                            p={2}
                                            bg={isItMe(user, message.sender) ? "#BDEFF5" : "#F49C70"}
                                            borderRadius={"xl"}
                                            key={message._id}
                                            alignSelf={isItMe(user, message.sender) ? "end" : "start"}
                                        >
                                            {!isItMe(user, message.sender) ? <Avatar size={"xs"} src={message.sender.pic}></Avatar> : ""}
                                            <Text w={"100%"} ml={2} >{message.content}</Text>
                                        </Box>
                                    })) : ""
                                }



                            </div>)}
                            {typing ? <Text position={"absolute"} bottom="50px" color={"blue"} fontSize={"xs"} p={2}>typing....</Text> : ""}
                            <FormControl position={"relative"} onKeyDown={sendMessage} isRequired mt={3}  >



                                <Input onChange={typingHandler} value={newMessage} placeholder='Enter a message...' variant={"filled"} bg="#D1F2EB" type={"text"}></Input>
                            </FormControl>

                        </Box>



                    </>
                ) : (
                    <Box display={"flex"} justifyContent="center" alignItems={"center"} height="100%">
                        <Text color={"blackAlpha.400"} >Click user to start the chat</Text>
                    </Box>
                )
            }
        </>
    )
}

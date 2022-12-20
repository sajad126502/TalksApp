import { Box, Button, useToast, Text, VStack, Stack, Toast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/context'
import {fetchChats} from '../../helper/fetchChats'
import { getSender } from '../../helper/getSender'
import ChatLoading from './ChatLoading'
import GroupChatModel from './GroupChatModel'

export default function MyChats({ fetchAgain }) {
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState()
  const [loggedUser, setLoggedUser] = useState()
  const toast = useToast()
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
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
  }, [fetchAgain])
  return (


    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      height="100%"

    >
      <Box
        pb={3}
        px={3}
        w="100%"
        fontSize={{ base: "20px", md: "18px" }}
        fontFamily="Work sans"
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}

      >
        <Text>My Chats</Text>
        <GroupChatModel>

          <Button
            display={"flex"}
            fontSize={{ base: "15px", md: "10px", lg: "17px" }}
          >Group Chat +</Button>
        </GroupChatModel>

      </Box>
      <VStack p={3}
        w="100%"

      >
        {chats ? (
          <Stack
            w="100%"
            paddingTop={3}

          >

            {chats.map((chat) => (
              <Box onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                w="100%"
                overflow={"hidden"}
                height="70px"
              >
                <Text fontSize={18} fontWeight={"bold"}>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : (chat.chatName)}
                </Text>
                  <Text fontSize={13}  color={"green"} >{!chat.latestMessage?"":(!chat.latestMessage.content.length>9?(chat.latestMessage.content):(chat.latestMessage.content.substring(0,9)+"..."))}</Text>

              </Box>

            )

            )}
          </Stack>

        ) : (
          <ChatLoading />
        )}

      </VStack>




    </Box>


  )
}

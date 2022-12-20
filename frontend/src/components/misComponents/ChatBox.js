import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/context'
import SingleChats from './SingleChats'

export default function ChatBox({fetchAgain,setFetchAgain}) {
  const { selectedChat } = ChatState()
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir={"column"}
 p={3}
 bg="white"
 w={{base:"100%" ,md:"70%"}}
 height={"100%"}
 
 borderWidth={"1px"}
>
      <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></SingleChats>
    </Box>
  )
}

import React, { useEffect, useState } from 'react'

import { ChatState } from '../context/context'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/misComponents/SideDrawer'
import MyChats from '../components/misComponents/MyChats'
import ChatBox from "../components/misComponents/ChatBox"
export default function ChatPage() {
  const [data, setData] = useState([])
  const { user, setUser } = ChatState()
  const [fetchAgain,setFetchAgain]=useState()
  useEffect(() => {

  }, [user])

  return (
  <Box w={"100%"} >

      {user && <SideDrawer  />}
      <Box h={"92%"}
       display={"flex"}
       >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}


      </Box>
  </Box>

   )
}

import React, { useEffect } from 'react'
import { Box, Text, Container,Tab,TabList,Tabs ,TabPanels,TabPanel} from "@chakra-ui/react"
import SignUp from '../components/authComp/SignUp'
import SignIn from '../components/authComp/SignIn'
import { useNavigate } from 'react-router-dom'


export default function HomePage() {
  console.log("homepage")
  const navigate=useNavigate()
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
     const userInfo = JSON.parse(localStorage.getItem("userInfo"))
     navigate("/chat")
    }
    else {
        navigate("/")
    }
}, [navigate])
  return (
    <Container maxW='xl' centerContent>
      <Box d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >

        <Text textAlign="center" fontSize="3xl" fontFamily="Work sans">TalksApp</Text>

      </Box>
      <Box
        d="flex"
        w="100%"
        bg="white"
        p={"4"}
        borderRadius="lg" >

        <Tabs variant='soft-rounded' >
          <TabList>
            <Tab w={"50%"}>Sign Up</Tab>
            <Tab w={"50%"}>Login</Tab>
           
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* SignUp */}
              <SignUp></SignUp>
            </TabPanel>
            <TabPanel>
              {/* SignIn */}
              <SignIn></SignIn>
            </TabPanel>
            
          </TabPanels>
        </Tabs>


      </Box>
    </Container>
  )
}

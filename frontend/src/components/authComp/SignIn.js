import {React,useState} from 'react'
import { FormControl, FormLabel, VStack, Input, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"

import {useNavigate} from "react-router-dom"






export default function SignIn() {
    const navigate=useNavigate()
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        
        email:"",
        password:"",

    })
   
    const onChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
       

    }
   
    const submitForm=async ()=>{
        setLoading(true)
        const {email, password } = formData
        if (!email || !password ) {
            toast({
                title: 'Plz fill all details',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false)
            return
        }
       

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const {data} = await axios.post("/api/user/login", {  email, password}, config)
         
            toast({
                title: 'Login successfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false)
            navigate("/chat")
        } catch (error) {
            toast({
                title: 'Error',
                description:error.response.data.errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false)

        }





    }
    return (
        <VStack>
           
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input onChange={onChange} name="email" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input onChange={onChange} name="password" />
            </FormControl>
         
           
            <Button
                colorScheme={"blue"}
                width="100%"
                style={{ marginTop: "15px" }}
                onClick={submitForm}
                isLoading={loading}
            >
               Login

            </Button>
            <Button
                colorScheme={"red"}
                width="100%"
                style={{ marginTop: "15px" }}
                onClick={()=>{setFormData({email:"guest@example.com",password:"123456"})}}
            >
               Login As Guest

            </Button>


        </VStack>
    )
}



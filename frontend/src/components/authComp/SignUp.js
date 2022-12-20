import { FormControl, FormLabel, VStack, Input, Button } from '@chakra-ui/react'
import React, {  useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useNavigate} from "react-router-dom"


export default function SignUp() {
    const navigate=useNavigate()
    const [pic, setPic] = useState()
    
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    })
   
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })


    }
    //******** */
    const imageChange = (pic) => {
        setLoading(true)

        if (pic === undefined) {

            toast({
                title: 'upload failed',
                description: "plx select the profile picture",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false)
            return;
        }
        const data = new FormData()
        data.append("file", pic)
        data.append("upload_preset", "talksapp")
        data.append("cloud_name", "dsce4u4um")
        fetch("https://api.cloudinary.com/v1_1/dsce4u4um/image/upload", {
            method: "post",
            body: data,

        }).then((res) => res.json()).then((data) => {
            setPic(data.url.toString())
            console.log(data.url.toString())
            setLoading(false)

        }).catch((e) => {
            setLoading(false)
            toast({
                title: 'Upload failed',
                description: `${e.message}`,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })


        })
    }
    /**************************** */
    const submitForm = async () => {
        setLoading(true)
        const { name, email, password, cpassword } = formData
        if (!name || !email || !password || !cpassword) {
            toast({
                title: 'Plz fill all details',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false)
            return
        }
        if (password !== cpassword) {
            toast({
                title: 'Password dont match',
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
            console.log("758639006036060346046406700440")
            console.log(pic)
            console.log("758639006036060346046406700440")

            const {data} = await axios.post("/api/user/signup", { name, email, password, pic }, config)
         
            toast({
                title: 'Registeration successfull',
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
                <FormLabel>Name</FormLabel>
                <Input onChange={onChange} name="name" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input onChange={onChange} name="email" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input onChange={onChange} name="password" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input onChange={onChange} name="cpassword" />
            </FormControl>
            <FormControl >
                <FormLabel>Profile</FormLabel>
                <Input type="file" accept="image/*" p={1.5} onChange={(e) => { imageChange(e.target.files[0]) }} name="cpassword" />
            </FormControl>
            <Button
                colorScheme={"blue"}
                width="100%"
                style={{ marginTop: "15px" }}
                onClick={submitForm}
                isLoading={loading}
            >
                Sign Up

            </Button>

        </VStack>
    )
}

import {
    Box, Button, Menu, MenuButton, MenuItem, Text,
    Tooltip, MenuList, Avatar,
    MenuDivider, Drawer,
    DrawerBody,

    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,
    VStack,
    useToast,

} from '@chakra-ui/react'
import { ChevronDownIcon, BellIcon, Icon } from "@chakra-ui/icons"
import React, { useState } from 'react'
import { ChatState } from '../../context/context'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import ChatCard from './ChatCard'
import axios from 'axios'
import ChatLoading from './ChatLoading'



export default function SideDrawer() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const navigate = useNavigate()
    const { user, setSelectedChat, chats, setChats, indicator,setIndicator } = ChatState()
    const toast = useToast()

    const logOut = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()


    //handle search
    const handleSearch = async (e) => {
        if (!search) {
            toast({
                title: 'Type Something in Search',
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: "top-left"
            })
            return;

        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios(`/api/user?search=${search}`, config)

            setSearchResult(data)
            setLoading(false)

        } catch (e) {
            toast({
                title: `${e.message}`,
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: "top-left"
            })
        }

    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("/api/chat", { userId }, config)
            setSelectedChat(data)
            setLoadingChat(false)
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            onClose()


        } catch (e) {
            toast({
                title: `${e.message}`,
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: "top-left"
            })

        }
    }

    return (
        <>
            <Box
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
                bg={"white"}
                padding="5px"
                borderWidth={"5px"}

            >
                {/* search users button  */}
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>

                    <Button onClick={onOpen} variant="ghost" ><i className="fa-solid fa-magnifying-glass"></i>
                        <Text fontFamily="Work sans" fontSize={"15px"} display={{ base: "none", md: "flex" }} paddingLeft={"4px"}> Search  </Text>
                    </Button>
                </Tooltip>

                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Search Users</DrawerHeader>

                        <DrawerBody>
                            <Box display={"flex"}>

                                <Input onChange={(e) => { setSearch(e.target.value) }} value={search} placeholder='Type here...' />
                                <Button onClick={handleSearch} marginLeft={"5px"} >Go</Button>
                            </Box>
                            {loading ? <ChatLoading /> :
                                <VStack padding={"10px 3px"}>
                                    {searchResult.length > 0 ? (searchResult.map((user) => {

                                        return (<ChatCard key={user._id} user={user} handleFunction={() => accessChat(user._id)}></ChatCard>)
                                    })) : (
                                        ""
                                    )}


                                </VStack>}
                        </DrawerBody>


                    </DrawerContent>
                </Drawer>



                {/* title of the app */}
                <Text
                    fontSize={"2xl"} fontFamily="Work sans">
                    TalksApp
                </Text>
                <div>
                    <Menu>
                        <MenuButton position={"relative"}>
                            {indicator?( <Icon viewBox='0 0 200 200' color='red.500' position={"absolute"} top={1.5} left={4} size="5px">
                                <path
                                    fill='currentColor'
                                    d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
                                />
                            </Icon>):""}
                           
                            <BellIcon fontSize={"2xl"} margin={2} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Download</MenuItem>
                        

                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar bg={"gray"} size={"sm"} cursor="pointer" src={user.pic} name={user.name} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>

                                <MenuItem >My profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={logOut}>Log Out</MenuItem>

                        </MenuList>
                    </Menu>
                </div>


            </Box>

        </>
    )
}

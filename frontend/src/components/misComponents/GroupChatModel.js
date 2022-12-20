import { Button, FormControl, FormLabel, Input, Modal, Box, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/context'
import ChatCard from './ChatCard'
import UserBadgeItem from './UserBadgeItem'

export default function GroupChatModel({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        // setSearch(query)
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${query}`, config)
            console.log(data)

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
    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: `Fill all  Inputs`,
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
            const { data } = await axios.post(`/api/chat/creategroup`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(user=>user._id))
            } ,config)
            setChats([data,...chats])
            onClose()
            toast({
                title: `New group created${data.chatName}`,
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: "top-left"
            })
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
    const handleGroup = (user) => {

        if (selectedUsers.includes(user)) {

            toast({
                title: `User already added`,
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: "top-left"
            })
        }
        else {

            setSelectedUsers([...selectedUsers, user])
        }

    }
    const deleteUser = (id) => {
       const data= selectedUsers.filter((user) => user._id !== id)
       setSelectedUsers(data)
    }


    return (
        <>

            <span onClick={onOpen}>{children}</span>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}

            >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}
                        display={"flex"}
                        flexDir="column"
                        alignItems={"center"}
                    >
                        <FormControl>

                            <Input ref={initialRef} onChange={((e) => setGroupChatName(e.target.value))} placeholder='Chat Name' />
                        </FormControl>

                        <FormControl mt={4}>
                            <Input placeholder='Add Users' onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box
                            h={"30vh"}
                            overflowY={"scroll"}
                            width="100%"
                        >

                            <Box display={"flex"}
                            m={3}
                            
                            
                            >

                                {selectedUsers.length>0 ? (selectedUsers.map((user) => {
                                    return <UserBadgeItem key={user._id} user={user} handleFunction={() => deleteUser(user._id)}></UserBadgeItem>
                                })) : <span>no user add yet</span>}
                            </Box>
                            {/* slected users */}
                            {loading ? <div>loading...</div> : (
                                searchResult.slice(0, 4).map((user) => {
                                    return <ChatCard key={user._id} user={user} handleFunction={() => { handleGroup(user) }}></ChatCard>
                                })
                            )}
                        </Box>


                    </ModalBody>

                    <ModalFooter>

                        <Button onClick={handleSubmit}>Create Chat</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

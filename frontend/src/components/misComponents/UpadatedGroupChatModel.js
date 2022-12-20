import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Box,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/context'
import UserBadgeItem from './UserBadgeItem'

export default function UpadatedGroupChatModel() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()


    const removeUser=(id)=>{

    }


    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    return (
        <>
            <IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon></ViewIcon>} />


            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Box 
                        display={"flex"}
                        >

                            {selectedChat.users.map((user) => {
                                return <UserBadgeItem key={user._id} user={user} handleFunction={() => removeUser(user._id)}></UserBadgeItem>;
                            })}
                        </Box>

                        {/* <FormControl>
            <FormLabel>First name</FormLabel>
            <Input ref={initialRef} placeholder='First name' />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last name</FormLabel>
            <Input placeholder='Last name' />
          </FormControl> */}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

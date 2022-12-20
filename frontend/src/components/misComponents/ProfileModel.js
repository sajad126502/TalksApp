import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from "@chakra-ui/icons"
import React from 'react'

function ProfileModel({ user, children }) {


    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? (<span onClick={onOpen}>{children}</span>) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal onClose={onClose} isOpen={isOpen} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        textAlign={"center"}

                        fontWeight={"bold"}
                    >{user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        alignItems={"center"}

                    >
                        <Image
                            src={user.pic}
                            alt={user.name}
                            borderRadius="full"
                            boxSize={"150px"}

                        />
                        <Text
                            marginTop={"10px"}

                        ><span>Email</span>{" : " + user.email}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}



export default ProfileModel
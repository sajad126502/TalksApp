import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

export default function ChatCard({ user, handleFunction }) {
    const { name, email, pic } = user
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            display={"flex"}
            justifyContent="start"
            padding={"3px 3px 3px 10px"}
            borderRadius={"4px"}
            alignItems={"center"}
            width="100%"
            mt={3}
            bg={"lightgray"}>
            <Avatar size={"sm"} cursor="pointer" src={pic} />
            {/* <Image src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}></Image> */}
            <Box
                padding={"5px"}>
                <Text fontSize={"xs"} >{name}</Text>
                <Text fontSize={"xs"} ><span style={{ fontWeight: "bold" }}>Email:</span> {email}</Text>
            </Box>
        </Box>
    )
}

import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function ({handleFunction,user}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={"lg"}
    m={1}
    mb={2}
    
    varient={"solid"}
    fontSize={10}
    bg="purple"
    color={"white"}
    cursor={"pointer"}
    onClick={handleFunction}

    >
        {user.name}
        <CloseIcon pl={1}></CloseIcon>

    </Box>
  )
}

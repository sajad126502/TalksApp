import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const ChatContext = createContext()
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat,setSelectedChat]=useState()
    const [chats, setChats]=useState([])
    const [indicator,setIndicator]=useState(false)
    const navigate=useNavigate()
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
         const userInfo = JSON.parse(localStorage.getItem("userInfo"))
         setUser(userInfo)
        }
        else {
            navigate("/")
        }
    }, [navigate])
    return <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,indicator,setIndicator }}>{children}</ChatContext.Provider>
}
export const ChatState=()=>{
    return useContext(ChatContext)
}
export default ChatProvider
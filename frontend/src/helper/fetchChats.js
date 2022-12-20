
import axios from "axios"


export const fetchChats = async (user) => {
    console.log("gfgjf")
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get("/api/chat", config)
      // console.log(data)
      console.log(data+"ghyuguyguygyu")
      return data

    } catch (e) {

    throw new Error(e.message)
    }
  }
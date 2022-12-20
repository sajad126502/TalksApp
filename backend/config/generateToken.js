const jwt=require("jsonwebtoken")
const generateToken=(user)=>{
    console.log("======generate token========")
    console.log(user)
    try {
        return jwt.sign({user},process.env.JWT_SECRET,{
            expiresIn:"30d"
            
        })
        
    } catch (error) {
        console.log(error)
        
    }
    
   
}
module.exports=generateToken
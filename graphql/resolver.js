const bcrypt=require("bcryptjs")
const User=require("../models/user")

module.exports={
   createdUser: async({userInput},req)=>{
       const email=userInput.email
       const name=userInput.name
       const password=userInput.password

       const exitingUser=await User.findOne({email:email})
       if(exitingUser){
           const error=new Error("user already exits")
           throw error
       }
   }
}
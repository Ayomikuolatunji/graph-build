const bcrypt=require("bcryptjs")
const User=require("../models/user")

module.exports={
   createUser: async({userInput},req)=>{
       const email=userInput.email
       const name=userInput.name
       const password=userInput.password

       const exitingUser=await User.findOne({email:email})
       if(exitingUser){
           const error=new Error("user already exits")
           throw error
       }
       const hashPwd=await bcrypt(password, 12)
       const user=new User({
           email:email,
           name:name,
           password:password
       })
       const createdUser=await user.save()
       return {...createdUser._doc,_id:createdUser._id.toString()}
   }
}
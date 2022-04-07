const bcrypt=require("bcryptjs")
const User=require("../models/user")
const Post=require("../models/post")
const validator=require("validator")

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
       const hashPwd=await bcrypt.hash(password, 12)
       const user=new User({
           email:email,
           name:name,
           password:hashPwd
       })
       const createdUser=await user.save()
       return {...createdUser._doc,_id:createdUser._id.toString()}
   },
   name(){
       return "String"
   },
   createPost: async({userPost}, req)=>{
      const title=userPost.title
      const content=userPost.content
      const imageUrl=userPost.imageUrl

      const post=new Post({
          title:title,
          content:content,
          imageUrl:imageUrl
      })
      const postCreated=await post.save()
      return {...postCreated._doc, _id:postCreated._id.toString()}
   }
}
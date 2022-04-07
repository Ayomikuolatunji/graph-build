const User=requre("../models/user")

module.exports={
   createdUser: async({userInput},req)=>{
       const email=userInput.email
       const name=userInput.name
       const password=userInput.password
   }
}
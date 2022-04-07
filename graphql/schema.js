const {buildSchema}=require("graphql")

module.exports=buildSchema(`
  type TestData {
     text : String!
     views: Int
     name: String!
  } 
   type RootQuery {
       hello : TestData!
   }
    schema {
       query: RootQuery 
    }
`)
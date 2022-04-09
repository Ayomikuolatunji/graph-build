const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    type AuthData {
        token: String!
        userId: String!
    }
    type PostData {
        posts:[Post!]!
        totalPosts:Int!
    }
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page:Int!):PostData
    }
    input PostInputData {
        title:String!
        content:String!
        imageUrl:String!
    }
    type RootMutation {
        createPost(postInput: PostInputData): Post!
        createUser(userInput: UserInputData): User!
    }
   
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

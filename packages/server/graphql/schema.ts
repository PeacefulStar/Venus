import {gql} from 'graphql-tag';

const typeDefs = gql`
  scalar Date
  input Create {
      name: String!
      email: String!
      password: String!
  }
  input Sign {
      email: String!
      password: String!
  }
  type User {
      _id: String!
      name: String
      email: String
      password: String
      cretedAt: Date
  }
  type IsAuthenticated {
    status: Int!
  }
  type SignIn {
    isAuthenticated: Boolean!
  }
  type SignOut {
      status: Int!
  }
  type CreateAccountPayload {
    _id: String!
    token: String!
    email: String!
  }
  
  input GetUserByEmail {
    email: String!
  }
  
  type Query {
    getUserByEmail(input: GetUserByEmail): User
    isAuthenticated: IsAuthenticated
  }
  type Mutation {
    createUser(input: Create): CreateAccountPayload!
    signInUser(input: Sign): SignIn!
    signOutUser: SignOut
  }
`;

export default typeDefs;

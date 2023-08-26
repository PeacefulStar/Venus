import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String
    email: String
    password: String
    createdAt: Date
  }
  type Registration {
    id: ID!
    mail: String
    createdAt: Date
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
    id: ID!
    token: String!
    email: String!
  }
  type Chat {
    id: ID!
    answer: String
  }

  input GetUser {
    email: String!
  }
  input WebAuthn {
    mail: String!
  }
  input Create {
    name: String!
    email: String!
    password: String!
  }
  input Sign {
    email: String!
    password: String!
  }
  input question {
    question: String!
  }

  type Query {
    getRegistration(input: WebAuthn): Registration
    getUser(input: GetUser): User
    isAuthenticated: IsAuthenticated
  }
  type Mutation {
    createRegistration(input: WebAuthn): Registration
    createUser(input: Create): CreateAccountPayload!
    signInUser(input: Sign): SignIn!
    signOutUser: SignOut
    #    updateUser(id: ID!, name: String, email: String, password: String): User
    #    deleteUser(id: ID!): User
    chat(input: question): Chat!
  }
`;

export default typeDefs;

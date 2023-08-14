import {gql} from 'graphql-tag';

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        name: String
        email: String
        password: String
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

    input GetUser {
        email: String!
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

    type Query {
        getUser(input: GetUser): User
        isAuthenticated: IsAuthenticated
    }
    type Mutation {
        createUser(input: Create): CreateAccountPayload!
        signInUser(input: Sign): SignIn!
        signOutUser: SignOut
        updateUser(id: ID!, name: String, email: String, password: String): User
        deleteUser(id: ID!): User
    }
`;

export default typeDefs;

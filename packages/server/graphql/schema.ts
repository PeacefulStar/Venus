import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String
    email: String
    #    password: String
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
  type RP {
    id: String!
    name: String!
  }
  type CredentialUser {
    id: String!
    name: String!
    displayName: String!
  }
  type PubKey {
    alg: Int!
    type: String
  }
  type Selection {
    residentKey: String
    requireResidentKey: Boolean
  }
  type Extensions {
    credProps: Boolean
  }
  type PublicKeyCredential {
    challenge: String
    rp: RP
    user: CredentialUser
    pubKeyCredParams: [PubKey]
    timeout: Int
    attestation: String
    authenticatorSelection: Selection
    extensions: Extensions
  }
  type RegistrationOptions {
    options: PublicKeyCredential
    url: String
  }
  type RegistrationInfo {
    fmt: String
    counter: Int
    aaguid: String
    credentialID: [Int]
    credentialPublicKey: [Int]
    attestationObject: [Int]
    credentialType: String
    userVerified: Boolean
    credentialDeviceType: String
    credentialBackedUp: Boolean
    origin: String
    rpID: String
  }
  type ResponseOpts {
    verified: Boolean
    registrationInfo: RegistrationInfo
  }
  type RegistrationResponse {
    options: ResponseOpts
  }
  type VerifiedResponse {
    verified: Boolean
  }
  type AuthenticationPayload {
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
  input CredProps {
    rk: Boolean
  }
  input ClientExtensionResults {
    credProps: CredProps
  }
  input Response {
    attestationObject: String
    authenticatorData: String
    clientDataJSON: String
    publicKey: String
    publicKeyAlgorithm: Int
    transports: [String]
  }
  input CredentialObj {
    authenticatorAttachment: String
    clientExtensionResults: ClientExtensionResults
    id: String
    rawId: String
    response: Response
    type: String
  }
  input Credential {
    response: CredentialObj
    expectedChallenge: String
    expectedOrigin: String
    expectedRPID: String
    requireUserVerification: Boolean
  }
  input Create {
    name: String!
    email: String!
    #    password: String!
  }
  input Sign {
    email: String!
    password: String!
  }

  type Query {
    getUser(email: String!): User
    isAuthenticated: IsAuthenticated
  }
  type Mutation {
#    createUser(input: Create): AuthenticationPayload!
    generateRegistration(name: String!, email: String!): RegistrationOptions!  
#    signInUser(input: Sign): SignIn!
#    signOutUser: SignOut
    #    updateUser(id: ID!, name: String, email: String, password: String): User
    #    deleteUser(id: ID!): User
    verifyRegistration(options: Credential): VerifiedResponse!
    chat(question: String!): Chat!
  }
`;

export default typeDefs;

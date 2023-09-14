import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(input: { name: $name, email: $email }) {
      token
    }
  }
`;

export const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(input: { email: $email, password: $password }) {
      isAuthenticated
    }
  }
`;

export const SIGN_OUT_USER = gql`
  mutation SignOutUser {
    signOutUser {
      status
    }
  }
`;

export const VERIFY_REGISTRATION = gql`
  mutation VerifyRegistration($options: Credential) {
    verifyRegistration(input: { options: $options }) {
      options {
        verified
        registrationInfo {
          fmt
          counter
          aaguid
          credentialID
          credentialPublicKey
          attestationObject
          credentialType
          userVerified
          credentialDeviceType
          credentialBackedUp
          origin
          rpID
        }
      }
    }
  }
`;

export const CHAT = gql`
  mutation Chat($question: String!) {
    chat(input: { question: $question }) {
      answer
    }
  }
`;

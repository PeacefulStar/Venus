import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(input: { email: $email }) {
      id
    }
  }
`;

export const GENERATE_REGISTRATION = gql`
  query GenerateRegistration {
    generateRegistration {
      options {
        challenge
        rp {
          id
          name
        }
        user {
          id
          name
          displayName
        }
        pubKeyCredParams {
          alg
          type
        }
        timeout
        attestation
        authenticatorSelection {
          residentKey
          requireResidentKey
        }
        extensions {
          credProps
        }
      }
      url
    }
  }
`;

export const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated {
      status
    }
  }
`;

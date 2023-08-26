import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(input: { email: $email }) {
      id
    }
  }
`;

export const GET_Registration = gql`
  query GetRegistration($mail: String!) {
    getRegistration(input: { mail: $mail }) {
      id
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

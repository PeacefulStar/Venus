import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(input: { name: $name, email: $email, password: $password }) {
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

export const CHAT = gql`
  mutation Chat($question: String!) {
    chat(input: { question: $question }) {
      answer
    }
  }
`;

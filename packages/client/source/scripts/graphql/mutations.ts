import {gql} from '@apollo/client';

export const GENERATE_REGISTRATION = gql`
  mutation GenerateRegistration($name: String!, $email: String!) {
    generateRegistration(name: $name, email: $email ) {
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

// export const SIGN_IN_USER = gql`
//   mutation SignInUser($email: String!, $password: String!) {
//     signInUser(input: { email: $email, password: $password }) {
//       isAuthenticated
//     }
//   }
// `;

// export const SIGN_OUT_USER = gql`
//   mutation SignOutUser {
//     signOutUser {
//       status
//     }
//   }
// `;

export const VERIFY_REGISTRATION = gql`
  mutation VerifyRegistration($options: Credential) {
    verifyRegistration(options: $options) {
      verified
    }
  }
`;

export const CHAT = gql`
  mutation Chat($question: String!) {
    chat(question: $question) {
      answer
    }
  }
`;

import React, { useEffect, useState } from 'react';
import type {Dispatch, FC, SetStateAction, SyntheticEvent} from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { startRegistration } from '@simplewebauthn/browser';
import type {VerifyRegistrationResponseOpts} from '@simplewebauthn/server';
import type {PublicKeyCredentialCreationOptionsJSON} from '@simplewebauthn/types'
import { GET_USER } from '../graphql/queries';
import { GENERATE_REGISTRATION, VERIFY_REGISTRATION } from '../graphql/mutations';

const Registration: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [registered, setRegistered] = useState(false)
  const [options, setOptions] = useState<VerifyRegistrationResponseOpts>({
    response: {
      id: '',
      rawId: '',
      response: {
        attestationObject: '',
        authenticatorData: '',
        clientDataJSON: '',
        publicKey: '',
        publicKeyAlgorithm: 0,
        transports: []
      },
      clientExtensionResults: {
        credProps: {
          rk: false
        }
      },
      type: 'public-key'
    },
    expectedChallenge: '',
    expectedOrigin: '',
    expectedRPID: '',
    requireUserVerification: true,
  });

  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (res: {getUser: object | null}) => {
      setLoading(false);
      if (res.getUser != null) {
        setRegistered(true);
      } else {
        setConfirm(true);
      }
    },
    onError: (err) => {
      setLoading(false);
      setErrorMsg(err);
    },
  });

  const [generateRegistration] = useMutation(GENERATE_REGISTRATION, {
    onCompleted: (response: {generateRegistration: {options: PublicKeyCredentialCreationOptionsJSON, url: string}}): void => {
      const genOpts = response.generateRegistration.options;
      const credential = startRegistration(genOpts);
      credential
        .then((res) => {
          options.response = res;
          options.expectedChallenge = genOpts.challenge;
          options.expectedOrigin = response.generateRegistration.url;
          options.expectedRPID = genOpts.rp.id;
          setOptions((prev) => ({...prev}));
        })
        .catch((err) => {
          console.error(err);
          // setErrorMsg(err)
        });
    },
    onError: (err): void => {
      setErrorMsg(err)
    }
  })

  const [verifyRegistration] = useMutation(VERIFY_REGISTRATION, {
    onCompleted: (res: {verifyRegistration: {verified: boolean}}): void => {
      if (res.verifyRegistration.verified) {
        setConfirm(false)
        setCompleted(true)
      }
    },
    onError: (err): void => {
      setErrorMsg(err)
    },
  });

  const handleChange = (setter: Dispatch<SetStateAction<string>>) => (e: {target: {value: string}}): void => {
    setter(e.target.value);
  };

  const handleContinue = async (e: SyntheticEvent):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await getUser({ variables: { email } });
  };

  const handleRegister = async (e: SyntheticEvent):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await generateRegistration({ variables: { name, email } });
  };

  useEffect(() => {
    if (options.expectedOrigin) {
      verifyRegistration({ variables: { options } })
        .then((r) => console.log(r))
        .catch((err) => console.error(err));
    }
  }, [options]);

  useEffect(() => {
    console.log(errorMsg)
  }, [errorMsg]);

  return (
    <section className={'centering'}>
      <div>
        <h1>Registration</h1>
      </div>
      <div className={'frame'}>
        {registered ? (
          <div>This email address is already registered</div>
        ) : confirm ? (
          <>
            <div>Would you like to register?</div>
            <div>
              <ul>
                <li>Name : {name}</li>
                <li>Mail Address : {email}</li>
                {/*<li>Password : {password}</li>*/}
              </ul>
            </div>
            <div className={'button'} onClick={handleRegister}>
              {loading ? 'Sending...' : 'Register'}
            </div>
          </>
        ) : completed ? (
          <div>registered an account</div>
        ) : (
          <form onSubmit={handleContinue}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleChange(setName)}
            />
            <input
              type="email"
              placeholder="Mail Address"
              value={email}
              onChange={handleChange(setEmail)}
            />
            {/*<input*/}
            {/*  type="password"*/}
            {/*  placeholder="Password"*/}
            {/*  value={password}*/}
            {/*  onChange={handleChange(setPassword)}*/}
            {/*/>*/}
            {/*<span>{error || ''}</span>*/}
            <button type="submit">{loading ? 'Sending...' : 'Continue'}</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Registration;

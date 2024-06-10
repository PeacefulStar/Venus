import type { FC, SyntheticEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER } from '../graphql/queries';
import { CREATE_USER } from '../graphql/mutations';

const SignUp: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (res) => {
      console.log(res)
      setLoading(false);
      const registered = res.getUser;
      if (registered) {
        console.log(registered);
      } else {
        setConfirm(true);
      }
    },
    onError: (err) => {
      setLoading(false);
      setError(err);
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: (res): void => {
      const {
        createUser: { token },
      } = res;
      if (token) {
        setLoading(false);
        setConfirm(false);
        setCompleted(true);
        window.location.href = '/authentication';
      }
    },
    onError: (err): void => {
      setLoading(false);
      setError(err);
    },
  });

  const handleChange = (setter: any) => (e: {target: {value: string}}) => {
    console.log(setter)
    setter(e.target.value);
  };

  const handleContinue = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await getUser({ variables: { email } });
  };

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await createUser({ variables: { name, email } });
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log(window.PublicKeyCredential);
  }, []);

  return (
    <section className={'centering'}>
      <div>
        <h1>Sign up</h1>
      </div>
      <div className={'frame'}>
        {confirm ? (
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

export default SignUp;

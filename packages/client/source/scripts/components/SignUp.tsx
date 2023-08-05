import React, {useContext, useEffect, useState} from 'react';
// import {withRouter} from 'react-router-dom';
import {useMutation} from '@apollo/client';
import {CREATE_USER} from '../graphql/mutations';
// import {GlobalContext} from '../context/globalstate';
import style from '../../styles/scss/main.module.scss';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  // const {signUp, authUser} = useContext(GlobalContext);

  const handleChange = (setter: any) => (e: any) => {
    setter(e.target.value);
  };

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: (res): void => {
      const {createUser: { token }} = res;
      if (token) {
        window.location.href = '/';
      }
    },
    onError: (err): void => {
      setError(err)
      console.log('create account error', err.message);
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await createUser({ variables: { name, email, password } })
  };

  return (
    <section className={style.centering}>
      <div>
        <h1>Sign up</h1>
      </div>
      <div className={style.frame}>
        <form onSubmit={handleSubmit}>
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange(setPassword)}
          />
          {/*<span>{error || ''}</span>*/}
          <button
            type="submit"
            value={loading ? 'Verifying...' : 'Register'}>
            send
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignUp;

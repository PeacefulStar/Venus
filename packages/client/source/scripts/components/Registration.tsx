import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_Registration } from '../graphql/queries';
// import { CREATE_USER } from '../graphql/mutations';
import style from '../../styles/scss/main.module.scss';

const Registration = () => {
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  const [getRegistration] = useLazyQuery(GET_Registration, {
    onCompleted: (res) => {
      setLoading(false);
      console.log(res);
      const registered = res.getRegistration;
      if (registered) {
        // onToggleView('createAccount', email);
      } else {
        // setConfirm(true);
      }
    },
    onError: (err) => {
      setLoading(false);
      // setError(err);
    },
  });

  // const handleChange = (setter: any) => (e: any) => {
  //   setter(e.target.value);
  // };

  return (
    <section className={style.centering}>
      <div className={style.frame}></div>
    </section>
  );
};

export default Registration;

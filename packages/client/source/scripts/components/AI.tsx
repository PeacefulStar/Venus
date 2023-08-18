import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import style from '../../styles/scss/main.module.scss';
import { CHAT } from '../graphql/mutations';

const AI = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [chat] = useMutation(CHAT, {
    onCompleted: (res) => {
      if (res.chat) {
        setAnswer(res.chat.answer);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const handleChange = (e: any) => {
    setQuestion(e.target.value);
  };

  const handleAsk = () => {
    chat({ variables: { question } })
      .then((r) => console.log(r))
      .catch((err) => console.error(err));
  };

  return (
    <section className={style.centering}>
      <div className={style.frame}>
        <textarea placeholder={'Ask me anything...'} onChange={handleChange} />
        <div className={style.button} onClick={handleAsk}>
          Ask
        </div>
        <div className={style.answer}>{answer}</div>
      </div>
    </section>
  );
};

export default AI;

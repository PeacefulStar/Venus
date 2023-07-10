import React, {useContext, useState} from 'react';
// import {withRouter} from 'react-router-dom';
import fetch from 'cross-fetch';
// import {GlobalContext} from '../context/globalstate';
import style from '../../styles/scss/main.module.scss';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // const {signUp, authUser} = useContext(GlobalContext);

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const inputData = {
            query: `mutation {
                        createUser(userInput: {
                            email: "${email}",
                            password: "${password}",
                            confirm: "${password}"
                        }) {
                            _id
                            token
                            email
                        }
                    }`,
        };

        console.log(inputData);

        const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(inputData),
        };

        console.log(requestOptions);

        try {
            await fetch('http://localhost:8080/graphql', requestOptions)
                .then((res) => {
                    console.log(res);
                    if (res.status >= 400) {
                        throw new Error('Bad response from server');
                    }
                    return res.json();
                })
                .then((user) => {
                    console.log(user.errors);
                    console.log(user.data);
                })
                .catch((err) => {
                    console.error(err);
                });

            // if (data.errors) {
            //     setError(data.errors[0].message);
            //     setLoading(false);
            // } else {
            //     setError(null);
            //     setLoading(false);
            //     const {_id, token} = await data.data.createUser;
            //
            //     dispatch({
            //         type: actions.SET_AUTH_USER,
            //         authUser: {
            //             _id,
            //             email,
            //         },
            //     });
            //     localStorage.setItem('token', token);
            //     props.history.push('/');
            // }
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return (
        <section className={style.centering}>
            <div>
                <h1>Sign up</h1>
            </div>
            <div className={style.frame}>
                <form onSubmit={submit}>
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
                    <span>{error || ''}</span>
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

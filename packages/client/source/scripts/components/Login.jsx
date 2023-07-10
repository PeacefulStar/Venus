import React, {useState} from 'react';
import fetch from 'cross-fetch';
import style from '../../styles/scss/main.module.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // const dispatch = useDispatch();

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requestBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            _id
                            token
                            email
                        }
                    }
                `,
            };

            const {data} = await fetch('http://localhost/graphql', requestBody);

            // if (data.errors) {
            //     setError(data.errors[0].message);
            //     setLoading(false);
            // } else {
            //     setError(null);
            //     setLoading(false);
            //     const {_id, token} = await data.data.login;
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
            <h1>Login</h1>
            <div>test</div>
            <div className={style.frame}>
                <form onSubmit={submit}>
                    <input
                        type="email"
                        placeholder="Mail Address"
                        value={email}
                        onChange={handleChange(setEmail)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={handleChange(setPassword)}
                    />
                    <button type="submit" value="Login">
                        Send
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;

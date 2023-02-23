import React, { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import { signIn } from "../../features/userActions";
import './Login.scss';
import {getError} from "../../features/userSlice";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const errorMessage = useSelector(getError);

    const login = (e) => {
        e.preventDefault();
        dispatch(signIn({
            email,
            password,
            navigate
        }));
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div className="login">
            <form onSubmit={(e) => login(e, dispatch)}>
                <input id="email" onChange={handleEmailChange} value={email} className="input-form" type="email" placeholder="Email" required/>
                <input id="password" onChange={handlePasswordChange} value={password} className="input-form" type="password" placeholder="Password" required/>
                <span className="error">{errorMessage}</span>
                <button id="login-button" type="submit">LOGIN</button>
                <a id="sign-up" href="/signup">Sign Up</a>
            </form>
        </div>
    );
}
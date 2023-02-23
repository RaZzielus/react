import React, {useState} from "react";
import axios from "axios";
import jwt from 'jwt-decode'
import { signUp } from "../../features/userActions";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getError} from "../../features/userSlice";

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errorMessage = useSelector(getError);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const login = async (e) => {
        e.preventDefault();
        dispatch(signUp({
            name,
            email,
            password,
            navigate
        }));
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div className="sing-up">
            <form onSubmit={login}>
                <input id="name" onChange={handleNameChange} value={name} className="input-form" type="text" placeholder="Name" required/>
                <input id="email" onChange={handleEmailChange} value={email} className="input-form" type="email" placeholder="Email" required/>
                <input id="password" onChange={handlePasswordChange} value={password} className="input-form" type="password" placeholder="Password" required/>
                <span className="error">{errorMessage}</span>
                <button id="login-button" type="submit">SIGNUP</button>
            </form>
        </div>
    );
}
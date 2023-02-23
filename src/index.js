import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import Todos from "./components/todos/Todos";
import { Provider, useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { PersistGate } from 'redux-persist/integration/react';
import axios from "axios";
import { persistor, store } from "./app/store";
import './app.scss';
let isRefreshing = false;

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

    return config;
},async (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if(error.response.status === 401 && !isRefreshing){
            isRefreshing = true;
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/refresh-token`);

            if(response?.data?.access_token){
                localStorage.setItem('access_token', response?.data?.access_token)
                originalConfig.headers['Authorization'] = `Bearer ${response?.data?.access_token}`;
                isRefreshing = false;

                return axios(originalConfig);
            }
        }

        return Promise.reject(error);
    }
);

export default function App() {
    let user = useSelector(selectUser);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/todos" element={ user?.isLoggedIn ? <Todos /> :  <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

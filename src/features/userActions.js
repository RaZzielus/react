import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const signIn = createAsyncThunk(
    'user/signin',
    async ({ email, password, navigate }, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                email: email,
                password: password
            });

            return {...response, navigate};
        } catch (error) {
            if (error.response && error.response.data.message) {
                if(error?.response?.data?.statusCode === 403 || error?.response?.data?.statusCode === 401){
                    return rejectWithValue("Wrong email or password");
                }
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const signUp = createAsyncThunk(
    'user/signup',
    async ({ name, email, password, navigate }, { rejectWithValue }) => {
        try {
            let response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
                name: name,
                email: email,
                password: password
            });

            return {...response, navigate};
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async ({}, { rejectWithValue }) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`);

            return true;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)
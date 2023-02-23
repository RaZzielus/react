import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { signIn, signUp, logout } from "./userActions";

const authPendingReducer = (state) => {
    state.error = null
};

const authFulfilledReducer = (state, { payload }) => {
    const token = payload?.data?.access_token;
    if(token){
        const user = jwtDecode(token);
        state.user = {
            ...user,
            isLoggedIn: true
        }

        localStorage.setItem('access_token', token);
    }
    state.error = null
    payload.navigate('/todos');
};

const authRejectionReducer = (state, { payload }) => {
    state.loading = false
    state.error = payload
};

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {},
    extraReducers: {
        [signIn.pending]: authPendingReducer,
        [signIn.fulfilled]: authFulfilledReducer,
        [signIn.rejected]: authRejectionReducer,
        [signUp.pending]: authPendingReducer,
        [signUp.fulfilled]: authFulfilledReducer,
        [signUp.rejected]: authRejectionReducer,
        [logout.pending]: authPendingReducer,
        [logout.fulfilled]: (state, {}) => {
            state.user = null;
            state.error = null
        },
        [logout.rejected]: authRejectionReducer,
    },
});

export const selectUser = (state) => state?.user;
export const getError = (state) => state?.error;
export default userSlice.reducer;
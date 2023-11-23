import {createSlice} from "@reduxjs/toolkit";

const loginUserSlice = createSlice({
    name: 'loginUser',
    initialState: {
        isUserLogin : false,
    },
    reducers: {
        setUser(state, action) {
            state.isUserLogin = action.payload
        },
        deleteUser(state) {
            state.isUserLogin = false
        }
    }
});

export default loginUserSlice.reducer;
export const {setUser, deleteUser} = loginUserSlice.actions;
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import videoReducer from "./redusers/video-reducer";
import loginReducer from "./redusers/login-reducer";
import {VideoItemInterface} from "../types";

export interface RootState {
    allVideos:  {
        videos : VideoItemInterface,
    },
    loginUser: {
        isUserLogin : boolean,
    },
}

const rootReducer = combineReducers({
    allVideos: videoReducer,
    loginUser: loginReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});
import {createSlice} from "@reduxjs/toolkit";
import {VideoItemInterface} from "../../types";

const videoSlice = createSlice({
    name: 'videoList',
    initialState: {
        videos : {} as VideoItemInterface,
    },
    reducers: {
        addVideo(state, action) {
            state.videos = {...action.payload, ...state.videos };
        },
        addShareLink(state, {payload : {fileName, url}}) {
            state.videos[fileName].url = url;
        },
        deleteVideo(state, action) {
            delete state.videos[action.payload];
        }
    }
});

export default videoSlice.reducer;
export const {addVideo, deleteVideo, addShareLink} = videoSlice.actions;
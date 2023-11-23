import {VideoItemInterface} from "../types";
const moment = require("moment");

export const sortVideos = (videos: VideoItemInterface) => Object.entries(videos)
    .sort((a,b) => {
        const newA = a[0].replace('.webm','');
        const newB = b[0].replace('.webm','');
        const momentA = new moment(newA, 'DD-MM-YY-h-m-s');
        const momentB = new moment(newB, 'DD-MM-YY-h-m-s');
        return momentA.diff(momentB) * -1;
    })
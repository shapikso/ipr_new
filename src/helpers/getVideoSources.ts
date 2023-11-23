import {saveVideoResponse, VideoItemInterface} from "../types";
import {toast} from "react-toastify";
const { ipcRenderer } = window.require('electron');

const recordedChunks: BlobPart[] = [];

const handleDataAvailable = (e: BlobEvent) => {
    recordedChunks.push(e.data);
}

const handleStop = async () : Promise<saveVideoResponse> => {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    const response = await ipcRenderer.invoke('save-video-data', buffer);
    toast.success('record saved');
    recordedChunks.length = 0;
    return response;
}

export const starRecording = (stream: MediaStream, onStopAction: (data: VideoItemInterface) => void) => {
    const option = { mimeType: 'video/webm; codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, option);

    const onStopHandler = async () => {
       const {code, data} = await handleStop();
       if (code === 'error') return;
       onStopAction(data);
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = onStopHandler;
    return mediaRecorder;
}

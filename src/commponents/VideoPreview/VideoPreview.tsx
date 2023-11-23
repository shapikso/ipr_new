import React, {useEffect, useRef, useState} from 'react';
import {DesktopCapturerSource} from "electron";
import {getVideoOptions} from "../../helpers/getVideoOptions";
import {starRecording} from "../../helpers/getVideoSources";
import {useDispatch} from "react-redux";
import {VideoItemInterface} from "../../types";
import {addVideo} from "../../redux/redusers/video-reducer";
import Button from "../common/Button/Button";
import {toast} from "react-toastify";

const { ipcRenderer } = window.require('electron');
const { Menu, Tray } = window.require('@electron/remote');

const tray = new Tray('./public/logo192.png');

const VideoPreview = () => {
    const dispatch = useDispatch()
    const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(null);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const addNewVideo = (videoData: VideoItemInterface) => {
        dispatch(addVideo(videoData))
    }
    const selectSource = async (source: DesktopCapturerSource) => {
        if (!videoRef.current) { return }
        const constraints = getVideoOptions(source.id);

        const onlyVideoStream = await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints);
        videoRef.current.srcObject = onlyVideoStream;
        videoRef.current.play();

        const mediaRecorderNew = starRecording(onlyVideoStream, addNewVideo);
        setMediaRecorder(mediaRecorderNew);
    }
    const getVideoSources = async () => {
        const inputSources: DesktopCapturerSource[] = await ipcRenderer.invoke('get-video-sources');
        const videoOptionMenu = Menu.buildFromTemplate(
            inputSources.map(source => ({
                label: source.name,
                click: () => selectSource(source)
            }))
        );
        videoOptionMenu.popup();
    }

    const onStartHandler = () => {
        if (!mediaRecorder) {
            toast.error('choose screen for record')
            return;
        }
        toast.success('record started')
        setIsVideoRecording(!isVideoRecording);
        mediaRecorder.start();
    }

    const onStopHandler = async () => {
        if (!mediaRecorder) return;
        setIsVideoRecording(!isVideoRecording);
        mediaRecorder.stop();
    }

    useEffect(() => {
        const template = [
            {
                label: 'Create record',
                click:  onStartHandler,
            },
            {
                label: 'Exit',
                click: () => {ipcRenderer.invoke('close-app')},
            }
        ]

        const contextMenu = Menu.buildFromTemplate(template);
        tray.setContextMenu(contextMenu);

    }, [mediaRecorder]);

    return (
        <div className="p-5">
            <h1 className="font-sans text-2xl font-medium text-slate-900 dark:text-slate-200 mb-4">Screen Demo</h1>
            <video className="w-full aspect-video bg-black mb-4" muted ref={videoRef} />
            <div className="flex gap-4">
                <Button onClick={getVideoSources}>Choose Screen</Button>
                {isVideoRecording
                    ? <Button onClick={onStopHandler} >End record</Button>
                    : <Button onClick={onStartHandler} >Start record</Button>
                }
            </div>
        </div>
    );
};

export default VideoPreview;
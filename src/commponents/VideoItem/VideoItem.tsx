import React, {useEffect, useState} from 'react';
import {createThumbnail} from "../../helpers/createThumbnail";
import {useDispatch, useSelector} from "react-redux";
import {addShareLink, deleteVideo} from "../../redux/redusers/video-reducer";
import Button from "../common/Button/Button";
import {toast} from "react-toastify";
import axios from 'axios';
import {toggleScroll} from "../../helpers/toggleScroll";
import LoadingPopUp from "../LoadingPopUp/LoadingPopUp";
import {RootState} from "../../redux";
const { ipcRenderer } = window.require('electron');

interface VideoItemInterface {
    path: string;
    url?: string;
    fileName: string;
}

const VideoItem = ({path, fileName, url}: VideoItemInterface) => {
    const [thumbnail, setThumbnail] = useState('');
    const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const isUserLogin = useSelector((state: RootState) => state.loginUser.isUserLogin);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const videoData: BlobPart = await ipcRenderer.invoke('get-video-data', path);
                const blob = new Blob([videoData], {
                    type: 'video/webm; codecs=vp9'
                });
                const newFile = new File([blob], fileName, { type: blob.type });
                setVideoFile(newFile);
                const thumbnail = await createThumbnail(newFile);
                setThumbnail(thumbnail as string);
            } catch {
                toast.error('File not found');
            }
        })();
    },[fileName,path]);

    const onDeleteClick = async () => {
        try {
            await ipcRenderer.invoke('delete-video', path);
            toast.success('File deleted successfully.');
            dispatch(deleteVideo(fileName));
        } catch {
            toast.error('File not deleted');
        }
    }

    const onCopyClick = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        toast.success('Copied');
    }

    const onShareClick = async () => {
        try {
            setIsLoading(true);
            toggleScroll();
            const uploadURL: string = await ipcRenderer.invoke('upload-video', fileName);

            await axios.put(uploadURL, videoFile, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = uploadURL.split('?')[0];
            dispatch(addShareLink({fileName, url: imageUrl}));
            toast.success(`Video ${fileName} Uploaded successfully`);
        } catch {
            toast.error('Something went wrong');
        }
        setIsLoading(false);
        toggleScroll();
    }

    return (
        <div className="flex flex-col gap-2 py-2 px-3 border rounded max-w-[32.5%]">
            {
                isLoading &&
                <div className="absolute w-[100vw] h-[100vh] left-0 top-0 bg-[#00000094]">
                    <LoadingPopUp/>
                </div>
            }
            <img src={thumbnail}/>
            <h2 className="font-sans text-xl font-medium text-slate-900 dark:text-slate-200">
                {fileName}
            </h2>
            <Button
                onClick={onDeleteClick}
            >
                Delete
            </Button>
            { !url && isUserLogin &&
                <Button
                    onClick={onShareClick}
                >
                    Share
                </Button>
            }

            { url && isUserLogin &&
                <div className="flex items-center space-x-2">
                    <input type="text" disabled className="border p-2 w-full rounded-md" value={url}/>
                    <Button
                        onClick={onCopyClick}
                    >
                        Copy
                    </Button>
                </div>
            }
        </div>
    );
};

export default VideoItem;
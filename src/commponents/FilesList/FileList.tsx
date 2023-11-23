import React, { useEffect } from 'react';
import VideoItem from "../VideoItem/VideoItem";
import {useDispatch, useSelector} from "react-redux";
import {addVideo} from "../../redux/redusers/video-reducer";
import {Link} from "react-router-dom";
import Button from "../common/Button/Button";
import {RootState} from "../../redux";
import { sortVideos } from '../../helpers/sortVideos';
import {isObjectEmpty} from "../../helpers/isObjectEmpty";
const pathModule = window.require('path');
const { ipcRenderer } = window.require('electron');
const { app } = window.require('@electron/remote')

const FileList = () => {

    const path = app.getAppPath();
    const dispatch = useDispatch();
    const videos = useSelector((state: RootState) => state.allVideos.videos);
    useEffect(
        () => {
            (async () => {
                (await ipcRenderer.invoke('get-video-files', path) as string[])
                    .map((file: string) => {
                        const videoObj = {
                            [file.replace('.webp','') as string]: {
                                path: pathModule.join(path, `./Downloads/${file}`) as string
                            }
                        }
                        dispatch(addVideo(videoObj));
                        return videoObj;
                    })
            })();
        },
        [path]
    );
    const isVideosEmpty = isObjectEmpty(videos);
    console.log(isVideosEmpty);

    return (
        <div className="mt-2 w-full px-4">
            <div className="flex justify-between pb-4">
                <h1 className="font-sans text-2xl font-medium text-slate-900 dark:text-slate-200">
                    Latest Videos
                </h1>
                { !isVideosEmpty &&
                    <Button>
                        <Link to={'/videos'}>
                            Show More
                        </Link>
                    </Button>
                }
            </div>
            <div className="flex gap-1.5 min-h-[265px]">
                {  isVideosEmpty
                    ? <div className="font-sans text-xl font-medium text-slate-900 dark:text-slate-200 text-center h-fit m-auto">
                        No Videos Found
                    </div>
                    : sortVideos(videos)
                        .slice(0,3)
                        .map(([fileName, video ]) =>
                            <VideoItem
                                key={fileName}
                                path={video.path}
                                fileName={fileName}
                                url={video.url}
                            />)
                }
            </div>
        </div>
    )
};

export default FileList;
import React from 'react';
import VideoItem from "../../commponents/VideoItem/VideoItem";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Button from "../../commponents/common/Button/Button";
import {RootState} from "../../redux";
import {sortVideos} from "../../helpers/sortVideos";

const Videos = () => {
    const videos = useSelector((state: RootState) => state.allVideos.videos);

    return (
        <div className="px-4">
            <div className="flex justify-between pb-4 items-center text-center">
                <h1 className="font-sans text-2xl font-medium text-slate-900 dark:text-slate-200">
                    All Videos
                </h1>
                <Button>
                    <Link to={'/'}>
                        Back
                    </Link>
                </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {
                    sortVideos(videos)
                        .map(([fileName, video]) =>
                            <VideoItem
                                key={fileName}
                                path={video.path}
                                fileName={fileName}
                                url={video.url}
                            />
                    )
                }
            </div>
        </div>
    );
};

export default Videos;
import React from 'react';
import FileList from "../../commponents/FilesList/FileList";
import VideoPreview from "../../commponents/VideoPreview/VideoPreview";

const MainPage = () => {
    return (
        <div>
            <FileList/>
            <VideoPreview/>
        </div>
    );
};

export default MainPage;
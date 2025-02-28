import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }: any) => {
    return (
        <div className="relative rounded-lg">
            <ReactPlayer
                url={url}
                controls={true}
                height={377}
                className='react-player'
            />
        </div>
    );
};

export default VideoPlayer;

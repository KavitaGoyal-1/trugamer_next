import { useState } from "react";
import VideoPlayIcon from "../../../../public/icons/play-circle.svg";
import YouTubePlayIcon from "../../../../public/icons/youtubeplayicon.svg";
import Image from "next/image";

const VideoCardComponent = ({
  videoId,
  videoName,
  videoTitle,
  handleOpenModal,
  thumbnailUrl,
}: any) => {
  const [isModalOpenVideo, setIsModalOpenVideo] = useState(false);
  const handleOpenModal2 = () => {
    setIsModalOpenVideo(true);
  };
  console.log(thumbnailUrl, "thumbnail", videoTitle);
  return (
    <div className="w-full flex flex-col rounded-lg bg-cBlack-main p-2.5 gap-3 sm:gap-4 md:mb-0 mb-4 min-w-[256px]">
      <div className="relative">
        {isModalOpenVideo ? (
          <iframe
            style={{ height: "160px" }}
            className="rounded-lg w-full min-h-[136px]"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            {/* Thumbnail with Play Icon */}
            <Image
              src={thumbnailUrl} // Use the thumbnail URL here
              alt={videoTitle}
              className="rounded-lg w-full h-auto cursor-pointer"
              style={{ height: "160px", objectFit: "cover" }} // Adjust height and fit as needed
              onClick={handleOpenModal2} // Open modal on click
              width={120}
              height={160}
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handleOpenModal2} // Open modal on click
            >
              <Image
                src={YouTubePlayIcon}
                alt="Watch Video"
                height={60}
                width={60}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-start flex-col gap-3 sm:gap-4">
        <span className="text-base sm:text-xl font-semibold text-start w-full break-words ">
          {videoTitle?.length > 8
            ? videoTitle?.slice(0, 20) + "..."
            : videoTitle}
        </span>

        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-2xl bg-[#59618466] break-words text-sm font-medium ">
            {videoName?.length > 8 ? videoName?.slice(0, 8) + "..." : videoName}
          </span>

          <div
            className="inline-flex gap-2 items-center cursor-pointer"
            onClick={handleOpenModal}
          >
            <Image
              src={VideoPlayIcon}
              alt="Watch Video"
              height={20}
              width={20}
            />
            <span className="text-sm sm:text-base font-semibold leading-5 sm:leading-6 text-cBlue-light">
              Watch Video
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardComponent;

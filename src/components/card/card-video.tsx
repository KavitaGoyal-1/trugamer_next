import React, { useState } from "react";
import { FiPlayCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io"; // Import the IoMdClose icon for the close button
import No_thumbnail from "@assets/VedioThumbnails/No_thumbnail.png";
import Play_button from "@assets/buttonicons/Play_button.png";
import Image from "next/image";

export enum VideoType {
  Trailer = "Trailer",
  Review = "Review",
}

interface vedioCardProps {
  thumbnail: string;
  title: string;
  subtitle: string;
  type: VideoType;
  vediolink: string;
  rawData: any;
}

const CardVideo: React.FC<vedioCardProps> = ({
  thumbnail,
  title,
  subtitle,
  type,
  rawData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const playVideo = () => {
    setModalOpen(true);
  };

  const closeVideo = () => {
    setModalOpen(false);
  };

  return (
    <div className="bg-[#101A30] p-4 rounded-xl max-w-[80%] sm:w-full md:max-w-[256px] flex flex-col card-video-box justify-between">
      <>
        <div className="relative">
          <Image
            // src={thumbnail ? thumbnail : No_thumbnail}
            src={typeof thumbnail === "string" ? thumbnail : No_thumbnail.src}
            title="play icon"
            alt="play icon"
            className="rounded-xl sm:w-[100%] md:w-[full] sm:h-[10rem]"
            width={40}
            height={40}
          />
          {thumbnail && (
            <div onClick={playVideo} className="cursor-pointer">
              <Image
                src={Play_button}
                alt="Play Button"
                title="Play Button"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 z-1"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>

        <h2 className="text-start mt-1 text-[20px] min-h-[90px] whitespace-pre-line break-all overflow-visible">
          {title}
        </h2>
        <h2 className="text-start text-[20px] whitespace-pre-line break-all overflow-visible">
          {subtitle}
        </h2>
      </>
      <div className="flex flex-row justify-between items-center">
        {type && (
          <div className="text-white h-[32px] w-[100px] flex items-center justify-center rounded-full bg-cPurple-light bg-opacity-40 mt-4 pl-1 pr-1">
            {type}
          </div>
        )}

        <div className="flex flex-row items-center text-xs">
          <FiPlayCircle className="mt-4 text-xl text-[#00bfff]" />{" "}
          <h2
            onClick={playVideo}
            className="mt-4 cursor-pointer ml-1 font-semibold text-[#00bfff]"
          >
            Watch video
          </h2>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              onClick={closeVideo}
              className="cursor-pointer flex justify-end"
            >
              <IoMdClose className="text-3xl text-white font-bold" />
            </div>
            {rawData?.html && (
              <div dangerouslySetInnerHTML={{ __html: rawData?.html }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardVideo;

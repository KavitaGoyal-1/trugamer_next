import { useState } from "react";
import VideoPlayer from "./video-player";
import Profile from "../../../../public/icons/Profile.svg";
import Report from "../../../../public/icons/reportbutton.svg";
import Comments from "../../../../public/icons/comments.svg";
import Share from "../../../../public/icons/Share.svg";
import ThumbUp from "../../../../public/icons/hand-up.svg";
import ThumbDown from "../../../../public/icons/ThumbsDown.svg";
import ReportIcon from "../../../../public/icons/reporticon.svg";
import NotInterested from "../../../../public/icons/eye.svg";
import Block from "../../../../public/icons/block.svg";
import Image from "next/image";

const VideoPost = ({ initialLikes, initialComments, initialShares }: any) => {
  const [likes, setLikes] = useState(initialLikes || 102);
  const [dislikes, setDislikes] = useState(53);
  const [comments, setComments] = useState(initialComments || 20);
  const [shares, setShares] = useState(initialShares || 3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleShare = () => {
    setShares(shares + 1);
    // Handle share logic here
  };

  const handleOptionClick = (optionName: string) => {
    setIsMenuOpen(false);
  };

  const options = [
    {
      name: "Report",
      icon: (
        <Image
          src={ReportIcon}
          alt="Report"
          className="h-6 w-6"
          width={24}
          height={24}
        />
      ),
    },
    {
      name: "Not Interested",
      icon: (
        <Image
          src={NotInterested}
          alt="Not Interested"
          className="h-6 w-6"
          width={24}
          height={24}
        />
      ),
    },
    {
      name: "Block",
      icon: (
        <Image
          src={Block}
          alt="Block"
          className="h-6 w-6"
          width={24}
          height={24}
        />
      ),
    },
  ];

  return (
    <div className="bg-cBlack-main px-3 py-4 rounded-3xl shadow-lg w-full relative md:p-5">
      {/* Username and Report */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            src={Profile}
            alt="profile"
            className="h-9 w-9 md:h-10 md:w-10"
            width={36}
            height={36}
          />
          <div className="flex flex-col">
            <span className="md:text-base font-medium text-xs text-start">
              username
            </span>
            <span className="md:text-sm font-light text-[#9DACEC] text-[10px]">
              10 days ago
            </span>
          </div>
        </div>
        <button onClick={handleMenuToggle}>
          <Image
            src={Report}
            alt="report"
            className="h-6 w-6"
            width={24}
            height={24}
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 top-12 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.name}
                onClick={() => handleOptionClick(option.name)}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#344054]"
              >
                <span className="mr-2">{option.icon}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="md:text-lg font-medium text-start leading-7 md:mb-3 text-sm mb-2">
        Midnight Sapphire Raid: 10 operatives, countless enemies, and one
        mission - to secure a nice cold Meltdown Mango at the bar!
        <span className="text-cBlue-light font-bold">
          {" "}
          #FFP #gameplay #guns
        </span>
      </div>

      {/* Video */}
      <div className="mb-3">
        <VideoPlayer url="https://www.youtube.com/watch?v=svZJbP1P-sA" />
      </div>

      {/* Actions: Likes, Comments, Shares */}
      <div className="flex gap-3 items-center text-gray-400 text-sm mt-3">
        <div className="bg-[#344054] flex items-center gap-2 rounded-lg border border-[#7DA0E2]  px-2.5">
          <button
            onClick={handleLike}
            style={{ borderRight: "0.47 solid #2659BA", paddingRight: "10px" }}
            className="flex items-center space-x-1 text-[#D4D4D4] hover:text-[#00ADFF] py-1.5 border-r border-[#2659BA] pr-2.5"
          >
            <Image
              src={ThumbUp}
              alt="Like Icon"
              className="md:h-6 md:w-6 h-5 w-5"
              width={24}
              height={24}
            />
            <span>{likes}</span>
          </button>

          <button
            onClick={handleDislike}
            className="flex items-center space-x-1 text-[#D4D4D4] hover:text-[#00ADFF] py-1.5"
          >
            <Image
              src={ThumbDown}
              alt="Dislike"
              className="md:h-6 md:w-6 h-5 w-5"
              width={24}
              height={24}
            />
            <span>{dislikes}</span>
          </button>
        </div>

        <div className="bg-[#344054] flex items-center gap-2 py-1.5 px-2.5 rounded-lg border border-[#7DA0E2]">
          <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
            <Image
              src={Comments}
              alt="Comments"
              className="md:h-6 md:w-6 h-5 w-5"
              width={24}
              height={24}
            />
            <span className="text-[#D4D4D4] md:text-sm font-medium text-xs">
              {comments} <span className="hidden sm:inline">Comments</span>
            </span>
          </button>
        </div>

        <div className="bg-[#344054] flex items-center gap-2 py-1.5 px-2.5 rounded-lg border border-[#7DA0E2]">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
          >
            <Image
              src={Share}
              alt="Share"
              className="md:h-6 m5 w-5"
              width={24}
              height={24}
            />
            <span className="text-[#D4D4D4] md:text-sm font-medium text-xs">
              {shares} <span className="hidden sm:inline">Shares</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;

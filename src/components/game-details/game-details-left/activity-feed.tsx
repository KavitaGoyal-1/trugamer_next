import React from "react";
import Profile from "../../../../public/icons/user.svg";
import Play from "../../../../public/icons/play.svg";
import PlayingNext from "../../../../public/icons/forward.svg";
import Awards from "../../../../public/icons/awards.svg";
import { formatDistanceToNow, parseISO } from "date-fns";
import ShelvedAndLibrary from "../../../../public/icons/shelved-and-library.svg";
import { IGame } from "@/types/game";
import Image from "next/image";

// Define a type for the activity object
interface Activity {
  username: string;
  action: string;
  time: string;
  avatar: string;
  profileImage: string;
  status: string;
  timeAgo: string;
  rate: number;
}

interface ActivityFeedProps {
  isVideo: boolean;
  activityFeedData?: Activity[];
  activityMode: any;
  game_data?: any;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  isVideo,
  activityFeedData,
  activityMode,
  game_data,
}) => {
  const game: IGame = game_data?.data[0];

  return (
    <>
      <div className="flex justify-between relative details-gradient pe-1.5 items-center">
        <h3 className="section-card-heading font-bold text-lg">
          Activity Feed
        </h3>
      </div>
      <div
        className={`${
          !isVideo
            ? `${
                activityMode
                  ? "mt-2 h-auto max-h-[266px] overflow-y-auto custom-scrollbar block xl:flex flex-wrap"
                  : "mt-2 h-auto max-h-[266px] gap-4 overflow-y-auto custom-scrollbar"
              }`
            : "flex flex-wrap max-h-[292px] overflow-y-auto"
        } ${
          game?.attributes?.videos && game?.attributes?.videos?.length > 0
            ? "w-full"
            : "sm:flex-wrap sm:items-start"
        }`}
      >
        {activityFeedData &&
          activityFeedData?.length > 0 &&
          activityFeedData.slice(0, 10)?.map(
            (
              activity,
              index // Limiting to the first 10 entries
            ) => (
              <div
                key={index}
                className={`${
                  !isVideo
                    ? `${
                        activityMode
                          ? "flex items-center py-2 md:p-2 hover:bg-[#1D2235] rounded-md"
                          : "flex w-[98%] items-center py-2 md:p-2 hover:bg-[#1D2235] rounded-md"
                      }`
                    : " flex items-center py-2 md:p-2 hover:bg-[#1D2235] rounded-md grow min-w-[50%]"
                } ${
                  game?.attributes?.videos &&
                  game?.attributes?.videos?.length > 0
                    ? "min-w-[50%] xl:min-w-full"
                    : "min-w-[50%]"
                }`}
              >
                <div className="flex items-center w-full">
                  <Image
                    src={
                      activity?.profileImage ? activity?.profileImage : Profile
                    }
                    alt={activity.username}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div className="ml-3 w-full">
                    <div className="text-sm font-normal text-white text-start">
                      {activity.username}
                    </div>
                    <div className="inline-flex items-left w-full">
                      <Image
                        src={
                          activity.status == "playingNow"
                            ? Play
                            : activity.status == "playingNext"
                            ? PlayingNext
                            : activity.status == "shelved" ||
                              activity.status == "library"
                            ? ShelvedAndLibrary
                            : activity.status == "recentlyPlayed"
                            ? Play
                            : activity.status == "review"
                            ? Awards
                            : ""
                        }
                        alt={activity.action}
                        title={activity.action}
                        height={12}
                        width={12}
                        className="min-w-[12px]"
                      />
                      {activity.status == "review" && (
                        <span className="text-[10px] font-medium text-[#C1C9ED] ms-1">
                          {activity?.rate}/10{" "}
                        </span>
                      )}
                      <div className="text-[10px] font-normal text-[#C1C9ED] capitalize px-1 border-r border-[#C1C9ED] break-words">
                        {activity.status == "playingNow"
                          ? " Playing Now"
                          : activity.status == "playingNext"
                          ? " Playing Next"
                          : activity.status == "shelved"
                          ? " Shelved"
                          : activity.status == "library"
                          ? " Library"
                          : activity.status == "recentlyPlayed"
                          ? " Recently Played"
                          : activity.status == "review"
                          ? " Review"
                          : ""}
                      </div>
                      <div className="text-[10px] font-normal text-[#C1C9ED] pl-2">
                        {formatDistanceToNow(activity.timeAgo, {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </>
  );
};

export default ActivityFeed;

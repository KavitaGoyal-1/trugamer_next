import GameDetailsButtons from "./game-details-buttons";
import Calendar from "../../../../public/icons/calendar.svg";
import Platform from "../../../../public/icons/Platform.svg";
import CountdownTimer from "../game-details-right/countdown-timer";
import { PiShieldStar } from "react-icons/pi";
import { parseISO } from "date-fns";
import { parse } from "date-fns";
import { ImageData } from "@/types/game";
import Image from "next/image";
interface GameDetailsTitle {
  isUserAuth: boolean;
  rating: number | undefined | null;
  title: string;
  image: ImageData;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  analytics?: any;
  getPlayedAndQueuedCount?: any;
  slug?: string;
  handlePlayedHoursUpdate?: any;
  gameData?: any;
  selectedDevices?: any;
  handleDeviceClick?: any;
  progressData?: any;
  beatStatus?: any;
  setBeatStatus?: any;
  hoursPlayed?: number;
  setHoursPlayed?: number;
  handleEditClick?: any;
  handleSubmitProgressFromGameStatus?: any;
}

const GameDetailsTitle = ({
  isUserAuth,
  title,
  image,
  analytics,
  setIsModalOpen,
  getPlayedAndQueuedCount,
  slug,
  handlePlayedHoursUpdate,
  activeTab,
  setActiveTab,
  gameData,
  selectedDevices,
  handleDeviceClick,
  progressData,
  handleSubmitProgressFromGameStatus,
}: any) => {
  const { url, alternativeText } = image?.data?.attributes || {};
  const formatDate = (dateString: string): string => {
    const date = parseISO(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };
  const releaseDetails = gameData?.releaseByPlatforms?.release.map(
    (release: any) => {
      return {
        releaseDate: release?.releaseDate,
        deviceName: release?.device?.data?.attributes?.name,
      };
    }
  );
  let latestRelease: string | undefined;
  if (releaseDetails && releaseDetails.length > 0) {
    latestRelease = formatDate(
      releaseDetails.sort(
        (a: any, b: any) =>
          parseISO(b.releaseDate).getTime() - parseISO(a.releaseDate).getTime()
      )[0].releaseDate
    );
  }
  let earlierReleaseDate: string | undefined;
  if (releaseDetails && releaseDetails.length > 0) {
    earlierReleaseDate = formatDate(
      releaseDetails.sort(
        (a: any, b: any) =>
          parseISO(a.releaseDate).getTime() - parseISO(b.releaseDate).getTime()
      )[0].releaseDate
    );
  }

  let timeGap = "";
  let timeGapText = "";
  if (latestRelease) {
    let latestDate: any;
    let currentDate: any;
    latestDate = parseISO(latestRelease);
    currentDate = new Date();

    // Calculate the absolute difference in time
    const isFuture = latestDate > currentDate;
    let diffInMilliseconds = Math.abs(latestDate - currentDate);

    // Calculate the difference in days, months, and years
    let years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    diffInMilliseconds -= years * 1000 * 60 * 60 * 24 * 365;

    let months = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    diffInMilliseconds -= months * 1000 * 60 * 60 * 24 * 30.44;

    let days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    // Construct the time gap message showing only the largest time unit
    if (years > 0) {
      timeGap = `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      timeGap = `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
      timeGap = `${days} day${days > 1 ? "s" : ""}`;
    } else {
      timeGap = "Today";
    }

    timeGapText = isFuture
      ? `In ${timeGap}`
      : timeGap === "Today"
      ? "Today"
      : `${timeGap} ago`;
  }

  let earlierTimeGap = "";
  let earlierTimeGapText = "";
  if (earlierReleaseDate) {
    let earlierDate: any;
    let currentDate: any;
    // earlierDate = parseISO(earlierReleaseDate);
    // console.log(earlierDate, "earlierDate", earlierReleaseDate);
    earlierDate = parse(earlierReleaseDate, "MM/dd/yyyy", new Date());
    console.log(earlierDate, "earlierDate", earlierReleaseDate);
    currentDate = new Date();

    // Calculate the absolute difference in time
    const isFuture = earlierDate > currentDate;
    let diffInMilliseconds = Math.abs(earlierDate - currentDate);

    // Calculate the difference in days, months, and years
    let years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    diffInMilliseconds -= years * 1000 * 60 * 60 * 24 * 365;

    let months = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    diffInMilliseconds -= months * 1000 * 60 * 60 * 24 * 30.44;

    let days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    // Construct the time gap message showing only the largest time unit
    if (years > 0) {
      earlierTimeGap = `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      earlierTimeGap = `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
      earlierTimeGap = `${days} day${days > 1 ? "s" : ""}`;
    } else {
      earlierTimeGap = "Today";
    }

    // Add appropriate message for past or future
    earlierTimeGapText = isFuture
      ? `In ${earlierTimeGap}`
      : earlierTimeGap === "Today"
      ? "Today"
      : `${earlierTimeGap} ago`;
  }

  return (
    <>
      <div className="flex sm:flex-row items-center sm:gap-8 gap-2 mb-0 md:hidden">
        <div className="hedimg">
          <Image
            src={url ? url : "/placeholder.png"}
            alt={`${alternativeText || `${title} image`}`}
            width={150}
            height={200}
            className="rounded-xl sm:w-[150px] w-[90px] sm:h-[200px] h-[120px] object-cover"
          />
        </div>
        <div className="">
          <h1 className="font-bold sm:text-4xl text-[20px] capitalize text-start mb-0">
            {title}
          </h1>

          <div className="flex justify-between mt-3 items-start max-md:flex-wrap max-md:gap-y-3 flex-wrap gap-2 md:gap-2 md:pb-0 pb-5">
            <GameDetailsButtons
              setIsModalOpen={setIsModalOpen}
              isUserAuth={isUserAuth}
              getPlayedAndQueuedCount={getPlayedAndQueuedCount}
              slug={slug}
              analytics={analytics}
              handlePlayedHoursUpdate={handlePlayedHoursUpdate}
              handleDeviceClick={handleDeviceClick}
              progressData={progressData}
              selectedDevices={selectedDevices}
              handleSubmitProgressFromGameStatus={
                handleSubmitProgressFromGameStatus
              }
              gameData={gameData}
            />
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col  sm:gap-8 gap-4 mb-5">
        <div className="md:block hidden">
          <Image
            src={url ? url : "/placeholder.png"}
            alt={`${alternativeText || `${title} image`}`}
            width={150}
            height={200}
            className="rounded-xl sm:w-[150px] w-[90px] sm:h-[200px] h-[120px] object-cover"
          />
        </div>

        <div className="pt-0 xl:w-[80%] lg:w-[80%] w-full ">
          <div className="flex flex-col items-start gap-2 max-md:flex-wrap">
            <h1 className="sm:font-bold font-semibold text-lg sm:text-3xl 2xl:text-4xl  capitalize text-start mb-0 md:block hidden ">
              {title}
            </h1>
            {earlierReleaseDate && (
              <>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-start gap-1.5 pr-2">
                    <Image
                      src={Calendar}
                      alt="calendar"
                      width={22}
                      height={22}
                    />
                    <span className="font-normal text-xs sm:text-base leading-5 text-left">
                      Release Date:{" "}
                      <span className="font-semibold text-xs sm:text-base leading-5 text-left">
                        {" "}
                        {earlierReleaseDate} ({earlierTimeGapText})
                      </span>
                    </span>
                  </div>
                </div>
              </>
            )}
            {latestRelease && (
              <div className="block sm:hidden m-auto mt-2">
                <CountdownTimer latestReleaseDate={latestRelease} />
              </div>
            )}
            <div className="flex items-start gap-1.5 ">
              {gameData?.devices &&
                gameData?.devices?.data &&
                gameData?.devices?.data.length > 0 && (
                  <>
                    <Image
                      src={Platform}
                      alt="platform"
                      width={22}
                      height={22}
                    />
                    <span className="font-normal text-xs sm:text-base leading-5 text-start line-clamp-1">
                      Platforms:
                      <span className="font-semibold text-xs sm:text-base leading-5 text-start ml-1">
                        {gameData?.devices?.data.map(
                          (device: any, index: number) => (
                            <span key={index}>
                              {device?.attributes?.name}
                              {index < gameData?.devices?.data.length - 1 &&
                                ",  "}
                            </span>
                          )
                        )}
                      </span>
                    </span>
                  </>
                )}
            </div>

            {/* Mobile Tabs */}
            <div className="flex space-x-2 bg-gray-800 p-0.5 sm:p-1 rounded-lg lg:hidden mt-3">
              <button
                className={`px-4 py-1.5 text-xs font-normal rounded-md ${
                  activeTab === "details"
                    ? "bg-blue-500 text-white !font-bold"
                    : "text-[#C1C9EDCC]"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Game Details
              </button>
              <button
                className={`px-4 py-1.5 text-xs font-normal rounded-md ${
                  activeTab === "stats"
                    ? "bg-blue-500 text-white !font-bold"
                    : "text-[#C1C9EDCC]"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Game Insights
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 ">
            {/* Tags section */}
            {(gameData.isExpansion || gameData.isSeason) && (
              <div className="flex items-center gap-[8px] mt-[16px]">
                <span className="inline-flex bg-[#00ADFF33] py-[6px] px-[9px] border-[1px] border-cBlue-light rounded-full text-[12px] font-[400]">
                  {gameData.isExpansion == "true"
                    ? "Expansion"
                    : gameData.isSeason == "true"
                    ? "Season"
                    : ""}
                </span>
              </div>
            )}
            {gameData?.editorialAnticipatedRelease && (
              <div className="">
                <span
                  className="text-[8px] mt-3 sm:text-[10px] h-8 font-semibold flex gap-1 bg-[#02699a] border border-[#00ADFF] px-3 py-0.5  items-center rounded-2xl w-auto whitespace-nowrap"
                  style={{ background: "#00adffcc" }}
                >
                  <PiShieldStar size={16} />
                  Anticipated
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className=" md:flex hidden justify-between items-start mt-[20px] max-md:flex-wrap max-md:gap-y-3 flex-wrap gap-2 md:gap-2 md:pb-0 pb-5">
            <GameDetailsButtons
              setIsModalOpen={setIsModalOpen}
              isUserAuth={isUserAuth}
              getPlayedAndQueuedCount={getPlayedAndQueuedCount}
              slug={slug}
              analytics={analytics}
              handlePlayedHoursUpdate={handlePlayedHoursUpdate}
              handleDeviceClick={handleDeviceClick}
              progressData={progressData}
              selectedDevices={selectedDevices}
              handleSubmitProgressFromGameStatus={
                handleSubmitProgressFromGameStatus
              }
              gameData={gameData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameDetailsTitle;

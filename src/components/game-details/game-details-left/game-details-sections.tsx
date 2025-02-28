import { useEffect, useState } from "react";
import GameDetailsReview from "./game-details-review";
import { formatReleaseTimePeriod } from "../utills/formatted-date";
import SectionHeading from "@/components/section-heading";
const GameDetailsSections = ({
  reviewId,
  showMoadl,
  setLoadModal,
  gameData,
  userId,
  fetchLikeCountsAndReports,
  reviews,
  setReviews,
  token,
  gameSlug,
  isGreater,
  setLoadFromDetails,
}: any) => {
  const [showMore, setShowMore] = useState(false);
  const [truncationLength, setTruncationLength] = useState(540);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  // Description text
  const description = gameData?.description;

  const toggleShowMore = () => {
    setShowMore(!showMore);
    if (!showMore) setShowAdditionalDetails(false); // Reset additional details when collapsing
  };

  const toggleAdditionalDetails = () => {
    setShowAdditionalDetails(!showAdditionalDetails);
  };

  useEffect(() => {
    setShowMore(false); // Reset showMore to false when gameData.title changes
  }, [gameData?.title]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1800) {
        setTruncationLength(300);
      } else {
        setTruncationLength(440);
      }
    }

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncatedDescription =
    description && description.slice(0, truncationLength);
  const isDescriptionLong =
    description && description.length > truncationLength;
  const releaseDates =
    gameData?.releaseByPlatforms &&
    gameData?.releaseByPlatforms?.release &&
    gameData?.releaseByPlatforms?.release?.length > 0 &&
    gameData?.releaseByPlatforms?.release
      .filter(
        (release: any) => release?.releaseTimePeriod !== null // Remove entries with null releaseTimePeriod
      )
      .map((release: any) => {
        const deviceName = release?.device?.data?.attributes?.name;
        const exactTimeperiod = release?.releaseTimePeriod;
        const formattedTimePeriod = formatReleaseTimePeriod(exactTimeperiod);
        return `${deviceName}: ${formattedTimePeriod}`;
      })
      .filter(
        (item: string, index: number, self: string[]) =>
          self.indexOf(item) === index
      ); // Remove duplicates

  const releaseDatesFormatted =
    gameData?.releaseByPlatforms &&
    gameData?.releaseByPlatforms?.release &&
    gameData?.releaseByPlatforms?.release?.length > 0 &&
    gameData?.releaseByPlatforms?.release
      .filter(
        (release: any) => release?.releaseTimePeriod !== null // Remove entries with null releaseTimePeriod
      )
      .map((release: any) => {
        const exactTimePeriod = release?.releaseDate;
        return exactTimePeriod; // Keep only the releaseDate
      })
      .filter(
        (item: string, index: number, self: string[]) =>
          self.indexOf(item) === index // Remove duplicate dates
      )
      .every((date: string) => {
        const releaseDate = new Date(date); // Convert string to Date object
        const currentDate = new Date(); // Get current date
        return releaseDate > currentDate; // Check if the date is in the future
      });

  const developers =
    (gameData &&
      gameData?.developer &&
      gameData?.developer?.data &&
      gameData?.developer?.data?.length > 0 &&
      gameData?.developer?.data?.map((dev: any) => dev?.attributes?.Name)) ||
    [];

  // Map through publishers to get their names
  const publishers =
    (gameData &&
      gameData?.publisher &&
      gameData?.publisher?.data &&
      gameData?.publisher?.data?.length > 0 &&
      gameData?.publisher?.data?.map((pub: any) => pub?.attributes?.Name)) ||
    [];
  const details = [
    {
      title: "Main Developers",
      values: developers,
    },
    {
      title: "Publishers",
      values: publishers,
    },
    {
      title: "Game Modes",
      values: gameData?.game_modes,
    },

    {
      title: "Genres",
      values: gameData?.genres,
    },
    {
      title: "Release Dates",
      values: releaseDates,
    },

    {
      title: "Player Perspectives",
      values: gameData?.player_perspective,
    },
    {
      title: "Themes",
      values: gameData?.themes,
    },
  ];

  const additionalDetails = [
    { title: "Series", values: gameData?.series ? [gameData?.series] : [] },
    {
      title: "Is a spin-off of",
      values: gameData?.isSpinOff ? [gameData?.isSpinOff] : [],
    },
    { title: "Franchises", values: gameData?.franchises },
    { title: "Game Engine", values: gameData?.game_engines },
  ];

  return (
    <>
      {/* {showMoadl && ( */}
      <div className="flex flex-col sm:flex gap-3">
        <div className="w-full flex justify-start bg-[#15182B] flex-col rounded-14px">
          <SectionHeading title={"Details"} />
          <p className="p-5 pt-0 text-xs sm:text-base text-[#FFF6F6] font-light leading-[25px] inline-block line-clamp-2 text-justify md:text-left">
            {/* Truncated description */}
            {/* {!showMore ? truncatedDescription : description} */}
            {description}
            {/* {!showMore && isDescriptionLong && (
                <b
                  className="cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light"
                  onClick={toggleShowMore}
                >
                  <span className="text-[#FFF6F6]">...</span> Show More
                </b>
              )} */}

            {!showMore && (
              <b
                className="cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light"
                onClick={toggleShowMore}
              >
                <span className="text-[#FFF6F6]">..</span> Show More
              </b>
            )}

            {/* {showMore && (
                <b
                  className="cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light"
                  onClick={toggleShowMore}
                >
                  Show Less
                </b>
              )} */}
          </p>

          {/* Details shown when "Show More" is clicked */}
          {showMore && (
            <>
              <div className="relative details-gradient mt-4"></div>
              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-light  text-left p-5 pt-3">
                  {details?.map((detail, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-lg font-semibold text-[#F2F4F7] font-roboto mb-2 pb-2">
                        {detail?.title}
                      </span>
                      {detail?.values && detail?.values?.length > 0
                        ? detail?.values.map((value: any, idx: any) => (
                            <span
                              key={idx}
                              className="text-base font-normal text-[#FFFFFF] leading-6 opacity-60 font-roboto mb-2"
                            >
                              {value}
                            </span>
                          ))
                        : "N/A"}
                    </div>
                  ))}
                </div>
                {!showAdditionalDetails && (
                  <b
                    className="cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light flex justify-end mt-0 mr-5 mb-3"
                    onClick={toggleAdditionalDetails}
                  >
                    Show More
                  </b>
                )}
                {showAdditionalDetails && (
                  <>
                    <div className="relative details-gradient"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-light text-left p-5 pt-2 pb-0 mt-0">
                      {additionalDetails?.map((detail, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="text-lg font-semibold text-[#F2F4F7] font-roboto mb-2">
                            {detail?.title}
                          </span>
                          {detail?.values && detail?.values?.length > 0
                            ? detail?.values?.map((value: any, idx: any) => (
                                <span
                                  key={idx}
                                  className="text-base font-normal text-[#FFFFFF] leading-6 opacity-60 font-roboto"
                                >
                                  {value}
                                </span>
                              ))
                            : "N/A"}
                        </div>
                      ))}
                    </div>
                    <b
                      className="cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light flex justify-end mt-0 mr-5 mb-3"
                      onClick={toggleShowMore}
                    >
                      Show Less
                    </b>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Conditional rendering for GameDetailsReview */}
        {!isGreater && (
          <div className="w-full flex justify-start bg-[#15182B] flex-col rounded-14px md:p-5 px-3 py-4">
            <GameDetailsReview
              reviewId={reviewId}
              setLoadModal={setLoadModal}
              userId={userId}
              fetchLikeCountsAndReports={fetchLikeCountsAndReports}
              reviews={reviews}
              setReviews={setReviews}
              token={token}
              gameSlug={gameSlug}
              showMoadl={showMoadl}
              gameData={gameData}
              setLoadFromDetails={setLoadFromDetails}
            />
          </div>
        )}
      </div>
      {/* )} */}
    </>
  );
};

export default GameDetailsSections;

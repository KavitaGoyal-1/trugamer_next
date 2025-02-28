import GameDirectoryCard from "./game-directory-card";
import { useEffect, useMemo, useState } from "react";
import LoaderSpinner from "../loader-spinner";
import GameDirectoryList from "./game-directory-card/index-call-list";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa";
import { gameCalendarFormatTimeframe } from "@/utills/game-calendar-new";
import Image from "next/image";

const Results = ({
  toggleVisible,
  selectedCardOrList,
  gameCalendar,
  upLaoding,
  downLaoding,
  selectedOption,
  fetchMoreGames,
  showMoreLoading,
  noDataAddedInShowMore,
}: any) => {
  const [visibleGames, setVisibleGames] = useState<{ [week: string]: number }>(
    {}
  );
  const [expandedWeeks, setExpandedWeeks] = useState<{
    [week: string]: boolean;
  }>({});

  useEffect(() => {
    const updatedVisibleGames: { [week: string]: number } = {};
    gameCalendar.forEach((item: any) => {
      updatedVisibleGames[item.date] = item?.response?.length; // Set initial visible count for each week (e.g., 8)
    });
    setVisibleGames(updatedVisibleGames);
  }, [gameCalendar, showMoreLoading]);

  // console.log(gameCalendar, "gameCalendar");

  const handleToggleVisibility = (
    week: any,
    gamesCount: any,
    totalGamesCount: any,
    games: any
  ) => {
    if (!expandedWeeks[week] && gamesCount < totalGamesCount) {
      if (week > new Date().toLocaleDateString("sv-SE")) {
        fetchMoreGames(week, "up", gamesCount, games);
      } else {
        fetchMoreGames(week, "down", gamesCount, games);
      }
    }
    setExpandedWeeks((prevState) => ({
      ...prevState,
      [week]: !prevState[week],
    }));

    setVisibleGames((prevState) => ({
      ...prevState,
      [week]:
        expandedWeeks[week] && gamesCount >= totalGamesCount
          ? 8
          : totalGamesCount,
    }));
  };

  const scroll = useMemo(() => {
    return (
      <>
        {upLaoding && !downLaoding && (
          <h2 className="text-white flex item-center justify-center w-[100%] mt-10  mb-10">
            <LoaderSpinner />
          </h2>
        )}
        <div id="govt" className="flex gap-0 w-full justify-between flex-wrap">
          {Array?.isArray(gameCalendar) &&
            gameCalendar?.length > 0 &&
            gameCalendar?.map((item: any, index: number) => {
              const games = Array?.isArray(item?.response)
                ? item?.response
                : [];
              const visibleCount =
                (!expandedWeeks[item?.date] &&
                  games?.length >= item?.totalGamesCount) ||
                undefined
                  ? 10
                  : visibleGames[item.date];

              const gamesToDisplay = games.slice(0, visibleCount);

              return (
                <>
                  <h3 id="date-height" style={{ visibility: "hidden" }}>
                    FOR SCROLLING UP
                  </h3>
                  {Array?.isArray(item?.response) &&
                    item?.response?.length > 0 && (
                      <div
                        key={item?.date || index}
                        id={item?.date}
                        className={`flex gap-4 md:gap-4 2xl:gap-5 w-full justify-center lg:justify-start flex-wrap ${item?.date}`}
                      >
                        <div className="flex gap-4 items-center justify-center mt-0 mb-5 lg:mb-5 w-[90%] mx-auto overflow-hidden sm:w-full">
                          <Image
                            src="/gameCalender/Divider.png"
                            className=" w-full "
                            alt="played game"
                            title="played game"
                            width={20}
                            height={20}
                          />
                          <span className="flex gap-1 md:gap-3 font-semibold text-sm sm:text-lg w-full 2xl:w-auto mx-2 justify-center whitespace-nowrap">
                            {" "}
                            <Image
                              src="/icons/calendar.svg"
                              className=" w-6 h-6"
                              alt="played game"
                              title="played game"
                              width={20}
                              height={20}
                            />
                            {Array?.isArray(item?.response) &&
                              item?.response?.length > 0 &&
                              item.formattedTimeframe}
                          </span>
                          <Image
                            src="/gameCalender/Divider.png"
                            className=" w-full ml-0 md:ml-0 rotate-180 "
                            alt="played game"
                            title="played game"
                            width={20}
                            height={20}
                          />
                        </div>
                        {selectedOption == "card" ? (
                          <GameDirectoryCard
                            games={gamesToDisplay} // Only show the visible games
                            toggleVisible={toggleVisible}
                            timeframe={gameCalendarFormatTimeframe(
                              item.timeframe,
                              item?.date
                            )}
                          />
                        ) : (
                          <GameDirectoryList
                            games={gamesToDisplay} // Only show the visible games
                            toggleVisible={toggleVisible}
                            timeframe={gameCalendarFormatTimeframe(
                              item.timeframe,
                              item?.date
                            )}
                          />
                        )}

                        <div className="text-center w-full flex items-center justify-center">
                          {Array?.isArray(games) &&
                            games?.length >= 10 &&
                            (games?.length < item?.totalGamesCount ||
                              expandedWeeks[item.date] ||
                              visibleCount === 10) &&
                            item?.totalGamesCount > 10 && (
                              <>
                                <button
                                  onClick={() =>
                                    handleToggleVisibility(
                                      item?.date,
                                      games?.length,
                                      item?.totalGamesCount,
                                      games
                                    )
                                  }
                                  className="min-h-[38px] sm:min-h-[44px] bg-cBlue-light py-1 sm:py-1.5 px-[14px] sm:px-[18px] cursor-pointer text-white text-sm sm:text-base font-semibold rounded-[10px] flex justify-center items-center shadow-cShadow-main gap-2"
                                >
                                  {expandedWeeks[item?.date] &&
                                  item?.totalGamesCount &&
                                  showMoreLoading ? (
                                    <LoaderSpinner />
                                  ) : (
                                    <>
                                      {expandedWeeks[item.date] &&
                                      Array?.isArray(games) &&
                                      games?.length >= item?.totalGamesCount
                                        ? "Show Less"
                                        : "Show More"}
                                      {expandedWeeks[item.date] &&
                                      Array?.isArray(games) &&
                                      games?.length >= item?.totalGamesCount ? (
                                        <FaMinus
                                          className="text-lg font-bold "
                                          size={20}
                                        />
                                      ) : (
                                        <FiPlus
                                          className="text-lg font-bold "
                                          size={22}
                                        />
                                      )}
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                    )}
                </>
              );
            })}
        </div>
      </>
    );
  }, [
    gameCalendar,
    visibleGames,
    expandedWeeks,
    upLaoding,
    downLaoding,
    selectedOption,
    noDataAddedInShowMore,
  ]);

  return scroll;
};

export default Results;

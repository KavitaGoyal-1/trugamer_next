import React, { useState, useEffect } from "react";
import LightBlueBtn from "../../buttons/light-blue-btn";
import HomeSubtitle from "../home-subtitle";
import GameCard from "../../card/game-card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import ShadowLeft from "../../carousel/shadow-left";
import ShadowRight from "../../carousel/shadow-right";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getApi } from "@/utills/get-api";
import { INewRelease } from "@/types/new-release";
import LoaderBar from "@/components/loader-bar";

interface UpcomingGamesProps {
  upcomingGames?: INewRelease[];
}

const UpcomingGames = ({ upcomingGames }: UpcomingGamesProps) => {
  const router = useRouter();
  // const [upcomingGames, setUpcomingGames] = useState<INewRelease[] | null>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getUpcomingGames();
  // }, []);

  // const getUpcomingGames = async (filter: string = "") => {
  //   setLoading(true);
  //   try {
  //     const currentDate = new Date();
  //     const futureDate = new Date();
  //     futureDate.setMonth(futureDate.getMonth() + 3);

  //     const games = await axios.get(`${getApi()}/upcoming-games`);

  //     const uniqueGamesMap = new Map<number, INewRelease>();

  //     games &&
  //       games?.data &&
  //       games?.data?.games &&
  //       games?.data?.games?.length > 0 &&
  //       games?.data?.games?.forEach((game: INewRelease) => {
  //         const gameId = game.id;
  //         const releaseByPlatforms = game?.attributes?.releaseByPlatforms;
  //         if (releaseByPlatforms) {
  //           // Find the latest release date for the game
  //           const latestRelease = releaseByPlatforms?.release?.reduce(
  //             (latest: any, release: any) => {
  //               const releaseDate = new Date(release.releaseDate);
  //               if (!latest || releaseDate > new Date(latest.releaseDate)) {
  //                 return { ...release, gameId: gameId };
  //               }
  //               return latest;
  //             },
  //             null
  //           );
  //           // Check if game ID is unique and add to the map
  //           if (latestRelease && !uniqueGamesMap.has(gameId)) {
  //             uniqueGamesMap.set(gameId, {
  //               id: gameId,
  //               release: latestRelease,
  //               attributes: game.attributes,
  //             });
  //           }
  //         }
  //       });
  //     // Sort releases by ascending order of release date
  //     const upcomingReleases = Array.from(uniqueGamesMap.values())
  //       .map((game) => ({
  //         ...game,
  //         releaseDate: game.release.releaseDate,
  //       }))
  //       .filter((release) => {
  //         const releaseDate = new Date(release.releaseDate);
  //         const releaseYear = releaseDate.getFullYear();
  //         const releaseMonth = releaseDate.getMonth();

  //         const currentYear = currentDate.getFullYear();
  //         const currentMonth = currentDate.getMonth();

  //         // Only include games where release year and month are strictly in the future
  //         return releaseDate >= currentDate && releaseDate <= futureDate;
  //       })
  //       .sort(
  //         (a, b) =>
  //           new Date(a.releaseDate).getTime() -
  //           new Date(b.releaseDate).getTime()
  //       );
  //     if (upcomingReleases.length > 10) {
  //       setUpcomingGames(upcomingReleases.slice(0, 10));
  //     } else {
  //       setUpcomingGames(upcomingReleases);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch upcoming games:", error);
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };

  const adjustSlideWidth = () => {
    const slides = document.querySelectorAll(
      ".upcoming-card .swiper-slide"
    ) as NodeListOf<HTMLElement>;
    slides?.forEach((slide) => {
      slide.style.width = "236px"; // Custom width
    });
  };
  useEffect(() => {
    adjustSlideWidth();

    // Re-adjust width on window resize
    window.addEventListener("resize", adjustSlideWidth);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustSlideWidth);
    };
  }, []);

  useEffect(() => {
    // Ensure navigation buttons are correctly attached
    const nextButton = document.querySelector(".swiper-button-next-up");
    const prevButton = document.querySelector(".swiper-button-prev-up");
    if (nextButton && prevButton) {
      nextButton.classList.add("swiper-navigation-active");
      prevButton.classList.add("swiper-navigation-active");
    }
  }, []);

  return (
    <React.Fragment>
      <section className="flex flex-col gap-[20px] mb-8 md:mb-0 md:gap-[10px] mx-0 md:mx-auto w-full mt-10 md:mt-0">
        <div className="flex items-center justify-start md:justify-between w-[90%] md:w-[81%] mx-auto details-gradient relative pb-3">
          <div className="flex justify-center md:justify-start">
            <HomeSubtitle text="Upcoming Releases" />
          </div>
          <div className="row-start-4 md:row-start-1 row-end-5 md:row-end-2 col-start-1 md:col-start-2 col-end-2 col-end-3 max-md:hidden">
            <LightBlueBtn hrefString="/game-calendar" text={"See All"} />
          </div>
        </div>
        {/* {loading ? (
          <div className="md:pl-[10%] 2xl:pl-[9.5%]">
            <LoaderBar />
          </div>
        ) : ( */}
        <div className="relative w-full sm:pb-12 pb-0 z-[9] px-5 md:px-0 md:pl-[10%] 2xl:pl-[9.5%]">
          {/**This divs are for the shadows left and right */}
          <ShadowLeft tag="upcomingGame" />
          <ShadowRight tag="upcomingGame" />
          {/* <CustomCarousel spaceBetween={30}> */}
          <div className="relative">
            {upcomingGames?.length !== 0 && upcomingGames && (
              <>
                <div className="absolute top-[130px] md:top-[169px] xl:top-[193px] left-[-25px] md:left-[-30px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                  <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-prev-up">
                    {" "}
                    <FaChevronLeft
                      className=" w-4 h-4 sm:w-5 sm:h-5"
                      size={22}
                    />{" "}
                  </span>
                </div>

                {/* Right Arrow */}
                <div className="absolute top-[130px] md:top-[169px] xl:top-[193px] right-[-22px] md:right-[0px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                  <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-next-up">
                    {" "}
                    <FaChevronRight
                      className=" w-4 h-4 sm:w-5 sm:h-5"
                      size={22}
                    />{" "}
                  </span>
                </div>
              </>
            )}

            {upcomingGames?.length !== 0 && upcomingGames ? (
              <Swiper
                navigation={{
                  nextEl: ".swiper-button-next-up",
                  prevEl: ".swiper-button-prev-up",
                }}
                modules={[Navigation]}
                spaceBetween={30}
                className="w-full sm:w-11/12 md:w-full pt-6 px-0 2xl:pl-[0rem] upcoming-card  mySwiperMargin-gaming newRelaes_game"
                onInit={(swiper) => {
                  const slides = swiper.slides;
                  slides?.forEach((slide) => {
                    slide.style.width = "236px"; // Custom width
                  });
                }}
                onSlideChange={(swiper) => {
                  const slides = swiper.slides;
                  slides?.forEach((slide) => {
                    slide.style.width = "236px"; // Custom width
                  });
                }}
                loop={false}
                slidesPerView={"auto"}
              >
                {upcomingGames && upcomingGames.length > 0 ? (
                  upcomingGames.map((game, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-[146px] md:w-[236px] sm:w-full px-0 h-full rounded-2xl mx-auto">
                        <GameCard
                          game={game}
                          key={index}
                          onClick={() =>
                            router.push(`/game/${game?.attributes?.slug}`)
                          }
                        />{" "}
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="flex mx-2 justify-center mt-5">
                    <p className="text-[22px] text-center">
                      You don't have any games yet
                    </p>
                  </div>
                )}

                <SwiperSlide className="hidden md:block"></SwiperSlide>
              </Swiper>
            ) : (
              <div className="flex mx-4 justify-center mt-5 ">
                <p className="text-[22px] text-center">
                  You aren't playing any games yet
                </p>
              </div>
            )}
          </div>
        </div>
        {/*)}*/}
        <div className="block md:hidden w-[90%] md:w-[80%] mx-auto">
          <LightBlueBtn hrefString="/game-calendar" text={"Show more"} />
        </div>
      </section>
    </React.Fragment>
  );
};

export default UpcomingGames;

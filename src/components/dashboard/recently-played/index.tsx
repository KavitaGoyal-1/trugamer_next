import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ShadowLeft from "../../carousel/shadow-left";
import ShadowRight from "../../carousel/shadow-right";
import RegularHeading from "../../regular-heading";
import RecentlyPlayedCard from "./recently-played-card";

interface IProps {
  beatGames: any;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
}

const RecentlyPlayed = ({
  beatGames,
  setVisible,
  visible,
  setSelectedGame,
  selectedGame,
}: IProps) => {
  const [Game, setGame] = useState(beatGames);

  useEffect(() => {
    if (beatGames?.length) {
      const reverseBeatGames = [...beatGames].sort(
        (a: any, b: any) => b.id - a.id
      );
      if (reverseBeatGames?.length > 0) {
        setGame(reverseBeatGames);
      }
    }
  }, [beatGames]);
  const adjustSlideWidth = () => {
    const slides = document.querySelectorAll(
      ".recent-play .swiper-slide"
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
  }, [Game]);
  return (
    <>
      {
        <div className="mx-auto pb-6 px-[5%] md:px-[10%]">
          <RegularHeading text="Recently Played" />
        </div>
      }

      <div className="relative w-full sm:pb-24 pb-0 z-20 md:pl-[8.5%] 2xl:pl-[9.5%]">
        {/**This divs are for the shadows left and right */}
        <ShadowLeft />
        <ShadowRight />

        {beatGames?.length !== 0 ? (
          <Swiper
            spaceBetween={30}
            className="w-full pb-6 pt-10 pe-6 pl-3 recent-play"
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
            {Game &&
              Game?.length > 0 &&
              Game?.map((item: any, index: any) => (
                <SwiperSlide key={index}>
                  <RecentlyPlayedCard
                    visible={visible}
                    setVisible={setVisible}
                    setSelectedGame={setSelectedGame}
                    selectedGame={selectedGame}
                    game={item}
                    index={index}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        ) : (
          <div className="flex md:mx-48 justify-center mt-5">
            <p className="text-[22px]">You don't have any games yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RecentlyPlayed;

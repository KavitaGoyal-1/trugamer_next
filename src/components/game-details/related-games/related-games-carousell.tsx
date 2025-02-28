import RelatedGameCard from "./related-game-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect } from "react";
import { IGame } from "@/types/game";

const RelatedGamesCarousel = ({
  games,
  visible,
  setVisible,
  selectedGame,
  setSelectedGame,
  token,
  setUpdatedAnalytics,
  setIsOpenLoginStatus,
}: {
  games: IGame[];
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGame: boolean;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  token?: string;
  setUpdatedAnalytics?: any;
  fetchSelectedDevices?: any;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const adjustSlideWidth = () => {
    const slides = document.querySelectorAll(
      ".playing-now .swiper-slide"
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
  }, [RelatedGamesCarousel]);

  return (
    <div className="relative w-full  z-20">
      {/**This divs are for the shadows left and right */}
      <div className="block absolute top-0 left-0 bottom-0 h-full  z-[100]"></div>
      <div
        className="block absolute top-0 right-0 bottom-0 h-full  z-[100]"
        style={{
          background:
            "linear-gradient(271.74deg, #090A16 28.32%, rgba(9, 10, 22, 0) 98.68%)",
        }}
      ></div>

      <div className="max-w-full mx-auto relative w-full  pb-0 z-20 px-2 sm:px-0 !pr-0 sm:!pr-6 ">
        <Swiper
          spaceBetween={30}
          className="pt-4 md:pt-3 px-4 2xl:px-4 !pr-0"
          slidesPerView={4}
          breakpoints={{
            1920: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1400: {
              slidesPerView: 4.8,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 4.8,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3.4,
              spaceBetween: 16,
            },
            580: {
              slidesPerView: 2.8,
              spaceBetween: 16,
            },
            320: {
              slidesPerView: 1.6,
              spaceBetween: 16,
            },
          }}
          pagination={{ clickable: true }}
        >
          {games
            .slice()
            .reverse()
            .map((item: IGame, index: any) => (
              <SwiperSlide key={index}>
                <RelatedGameCard
                  token={token}
                  game={item}
                  setIsOpenLoginStatus={setIsOpenLoginStatus}
                  index={index}
                  visible={visible}
                  setVisible={setVisible}
                  setSelectedGame={setSelectedGame}
                  selectedGame={selectedGame}
                  setUpdatedAnalytics={setUpdatedAnalytics}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedGamesCarousel;

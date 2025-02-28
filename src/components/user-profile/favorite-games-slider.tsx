import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface FavoriteGamesSliderProps {
  userGames: any[];
  onDelete: (game: any, index: number) => void;
  onDragEnd: (result: any) => void;
}

const FavoriteGamesSlider: React.FC<FavoriteGamesSliderProps> = ({
  userGames,
  onDelete,
  onDragEnd,
}) => {
  const maxGames = 10;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const paddedUserGames = [
    ...userGames,
    ...Array.from({ length: Math.max(0, maxGames - userGames?.length) })?.map(
      () => null
    ),
  ];

  const scrollContainer = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 264; // Fixed scroll amount
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const updateArrowsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    updateArrowsVisibility();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", updateArrowsVisibility);
    }
    return () => {
      ref?.removeEventListener("scroll", updateArrowsVisibility);
    };
  }, [userGames]);

  return (
    <div className="relative w-full pb-0 z-20 pl-2">
      {/* Left Navigation Arrow */}
      {showLeftArrow && (
        <div
          className="absolute top-1/2 left-[-25px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14"
          onClick={() => scrollContainer("left")}
        >
          <span className="bg-white border border-[#00ADFF] z-30 w-7 h-7 rounded-full p-2 flex items-center justify-center swiper-button-prev-news">
            <FaChevronLeft className="w-5 h-5" size={22} />
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-x-3 overflow-x-auto scrollbar-hide scroll-smooth overflow-hidden"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="games" direction="horizontal">
            {(provided) => (
              <div
                className="flex  gap-x-2.5 md:gap-3 pt-3 "
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Array.isArray(userGames) && userGames?.length > 0
                  ? paddedUserGames
                      ?.slice(0, 10)
                      ?.map((game: any, index: number) => (
                        <Draggable
                          key={game?.id}
                          draggableId={game?.id?.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided?.innerRef}
                              {...provided?.draggableProps}
                              {...provided?.dragHandleProps}
                              className=" w-[88px] md:w-[100px] 2xl:w-[120px] rounded-[13.3px] mb-4 md:mb-0 shadow-[5.01px_1.47px_15.03px_-0.73px_#000000] !relative !top-0 !left-0  z-50"
                            >
                              {game && (
                                <div
                                  onClick={() => onDelete(game, index)}
                                  className="absolute grid place-content-center bg-cPurple-light border-cBlack-dark border-[4.95px] rounded-[8.66px] w-[32.69px] h-[32.69px] top-[-10px] right-[-10px]"
                                >
                                  <Image
                                    src="/icons/closing-x.svg"
                                    alt={game ? "close icon" : ""}
                                    width={17}
                                    height={17}
                                    className="w-[19.32px] h-[19.32px] hover:cursor-pointer"
                                  />
                                </div>
                              )}
                              {game ? (
                                <Link
                                  href={game?.slug && `/game/${game?.slug}`}
                                  className="block"
                                >
                                  <Image
                                    src={
                                      game?.coverImage?.url
                                        ? game?.coverImage?.url
                                        : "/placeholder.png"
                                    }
                                    alt={game ? "favorite game" : ""}
                                    width={128}
                                    height={184}
                                    className="w-full h-full min-h-[120px] md:min-h-[140px] max-h-[140px] 2xl:min-h-[174px] 2xl:max-h-[174px] object-cover rounded-xl hover:cursor-pointer"
                                  />
                                </Link>
                              ) : (
                                <Image
                                  src=""
                                  alt=""
                                  width={128}
                                  height={184}
                                  className="w-full h-full min-h-[120px] md:min-h-[140px] max-h-[140px] 2xl:min-h-[174px] 2xl:max-h-[174px] object-cover rounded-xl hover:cursor-pointer"
                                />
                              )}
                              <span
                                className={`absolute text-[42px] font-bold ${
                                  index === 0
                                    ? "text-[#F5D25C]"
                                    : index === 1
                                    ? "text-[#D0D0D0]"
                                    : index === 2
                                    ? "text-[#CD7F32]"
                                    : "text-cPurple-light"
                                } leading-4 bottom-[10px] left-[-5px]`}
                                style={{
                                  textShadow:
                                    "4px 0 4px #0F111F, -2px 0 4px #0F111F, 0 4px 6px #0F111F, 0 -4px 6px #0F111F",
                                }}
                              >
                                {index + 1}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))
                  : Array.from({ length: 10 })?.map((_, index) => (
                      <SwiperSlide
                        key={index}
                        className="fav-accont-slide w-[88px] md:w-[100px] 2xl:w-[120px]"
                      >
                        <div
                          className={`relative w-[88px] md:w-[100px] 2xl:w-[120px] rounded-[13.3px] mb-4 md:mb-0 shadow-[5.01px_1.47px_15.03px_-0.73px_#000000] ${
                            index === 0
                              ? "border border-[#F5D25C]"
                              : index === 1
                              ? "border border-[#D0D0D0]"
                              : index === 2
                              ? "border border-[#CD7F32]"
                              : "border border-cPurple-light"
                          } `}
                        >
                          <div className="block w-full h-full min-h-[120px] md:min-h-[140px] max-h-[140px] 2xl:min-h-[174px] 2xl:max-h-[174px] object-cover rounded-xl  bg-transparent"></div>
                          <span
                            className={`absolute text-[42px] font-bold ${
                              index === 0
                                ? "text-[#F5D25C]"
                                : index === 1
                                ? "text-[#D0D0D0]"
                                : index === 2
                                ? "text-[#CD7F32]"
                                : "text-cPurple-light"
                            } leading-4 bottom-[10px] left-[-5px]`}
                            style={{
                              textShadow:
                                "4px 0 4px #0F111F, -2px 0 4px #0F111F, 0 4px 6px #0F111F, 0 -4px 6px #0F111F",
                            }}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </SwiperSlide>
                    ))}
                {provided?.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <div
          className="absolute top-1/2 right-0 z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14"
          onClick={() => scrollContainer("right")}
        >
          <span className="bg-white border border-[#00ADFF] z-30 w-7 h-7 rounded-full p-2 flex items-center justify-center swiper-button-next-news">
            <FaChevronRight className="w-5 h-5" size={22} />
          </span>
        </div>
      )}
    </div>
  );
};

export default FavoriteGamesSlider;

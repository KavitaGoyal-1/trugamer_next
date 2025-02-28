import React, { useEffect, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import ShadowLeft from "../../carousel/shadow-left";
import ShadowRight from "../../carousel/shadow-right";
import PlayingNextCard from "./playing-next-card";
import AddGameHere from "../modal/add-game";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RegularHeading from "@/components/regular-heading";
import Image from "next/image";

interface IProps {
  playingNext: any[];
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  heading?: string;
  gamesArray: any[];
  setGamesArray: React.Dispatch<React.SetStateAction<any[]>>;
  handleGames: (newGame: any) => void;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  word: string;
  gameData: any[];
  token?: string;
  handleAddPlayingNext: () => void;
  handleHideAddModal: () => void;
  handleShowAddModal: () => void;
  visibleAddModal?: boolean;
  setVisibleAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
  addGameVerificationMessage?: string | null;
  handleUserUpdateForPlayingNextAndShelved?: any;
  debouncedHandleUserUpdateForPlayingNextAndShelved?: any;
}

const PlayingNext = ({
  playingNext,
  setVisible,
  setSelectedGame,
  visible,
  selectedGame,
  heading,
  gameData,
  word,
  gamesArray,
  setGamesArray,
  handleGames,
  setWord,
  handleAddPlayingNext,
  handleHideAddModal,
  handleShowAddModal,
  setVisibleAddModal,
  visibleAddModal,
  token,
  addGameVerificationMessage,
  debouncedHandleUserUpdateForPlayingNextAndShelved,
}: IProps) => {
  const [playingNextState, setPlayingNextState] = useState<any[]>([]);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (Array.isArray(playingNext) && playingNext?.length > 0) {
      const uniquePlayingNext = [...playingNext]
        .reverse()
        .filter(
          (game, index, self) =>
            index === self.findIndex((g) => g.id === game.id)
        );
      setPlayingNextState(uniquePlayingNext);
    }
  }, [playingNext]);

  const adjustSlideWidth = () => {
    const slides = document.querySelectorAll(
      ".playing-next .swiper-slide"
    ) as NodeListOf<HTMLElement>;
    slides?.forEach((slide) => {
      slide.style.width = "236px"; // Custom width
    });
  };

  useEffect(() => {
    adjustSlideWidth();
    window.addEventListener("resize", adjustSlideWidth);
    return () => {
      window.removeEventListener("resize", adjustSlideWidth);
    };
  }, [playingNextState]);

  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const items = Array.from(playingNextState);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    // Remove duplicates
    const uniqueItems = items?.filter(
      (game, index, self) => index === self.findIndex((g) => g.id === game.id)
    );

    setPlayingNextState(uniqueItems);

    // Update the original playingNow array in the parent using the debounced function
    if (debouncedHandleUserUpdateForPlayingNextAndShelved) {
      const updatedPlayingNow = [...uniqueItems].reverse();
      debouncedHandleUserUpdateForPlayingNextAndShelved(
        updatedPlayingNow,
        heading
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const updateArrowsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateArrowsVisibility();
  }, [playingNextState]);

  const scrollContainer = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="!mx-auto pb-3 px-[5%] md:px-[10%]">
        <div className="details-gradient relative pb-3">
          <RegularHeading text={heading || "Playing Next"} />
        </div>
      </div>

      <div className="relative w-full z-20 pb-16 md:pl-[8.5%] 2xl:pl-[9.5%]">
        <div className="relative">
          {/* Left Arrow Button */}
          {Array.isArray(playingNext) &&
            playingNext?.length > 0 &&
            showLeftArrow && (
              <div className="absolute top-[150px] md:top-[185px] left-[-25px] md:left-[-30px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                <span
                  className="bg-[#ccc] !w-8 !h-8 rounded-full p-1 md:p-2 flex items-center justify-center custom-prev-new"
                  onClick={() => scrollContainer("left")}
                >
                  {" "}
                  <FaChevronLeft
                    className=" w-4 h-4 sm:w-5 sm:h-5"
                    size={22}
                  />{" "}
                </span>
              </div>
            )}

          {/* Right Arrow Button */}

          {/* Right Arrow */}
          {Array.isArray(playingNext) &&
            playingNext?.length > 0 &&
            showRightArrow && (
              <div className="absolute top-[150px] md:top-[185px] right-[0px] md:right-[0px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                <span
                  className="bg-[#ccc] !w-8 !h-8  rounded-full p-1 md:p-2 flex items-center justify-center custom-next-new"
                  onClick={() => scrollContainer("right")}
                >
                  {" "}
                  <FaChevronRight
                    className=" w-4 h-4 sm:w-5 sm:h-5"
                    size={22}
                  />{" "}
                </span>
              </div>
            )}
        </div>

        <ShadowLeft tag="playingNext" />
        <ShadowRight />

        {Array.isArray(playingNextState) && playingNextState?.length !== 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="playingNext" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  // ref={provided.innerRef}
                  ref={(el) => {
                    provided.innerRef(el);
                    scrollRef.current = el; // Assign ref here
                    if (el) {
                      el.addEventListener("scroll", updateArrowsVisibility);
                    }
                  }}
                  onScroll={updateArrowsVisibility}
                  className="w-full pt-6 pe-6 pl-6 md:pl-3 flex overflow-x-auto playing-next"
                >
                  {Array.isArray(playingNextState) &&
                    playingNextState?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mr-[30px] flex-shrink-0"
                            style={{
                              width: "236px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <PlayingNextCard
                              visible={visible}
                              heading={heading}
                              setVisible={setVisible}
                              setSelectedGame={setSelectedGame}
                              selectedGame={selectedGame}
                              game={item}
                              setIsOpenLoginStatus={setIsOpenLoginStatus}
                              index={index}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided?.placeholder}
                  {heading !== "Shelved" && token && (
                    <div
                      className="flex justify-center md:justify-start md:pl-0 md:mr-10 flex-shrink-0"
                      style={{ width: "236px" }}
                    >
                      <div
                        onClick={handleShowAddModal}
                        className="relative bg-[#ffffff1a] mt-[0px] h-[273px] w-[216px] md:h-[340px] md:w-[236px] rounded-lg flex justify-center flex-col gap-3 items-center border-dashed border-[1px] border-cPurple-light hover:cursor-pointer min-h-[150px]"
                      >
                        <Image
                          src="/icons/Icon-plus.svg"
                          alt="add icon"
                          width={24}
                          height={24}
                          className="place-self-center "
                        />
                        <p className="text-lg text-center font-semibold mb-0">
                          ADD HERE
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : heading === "Shelved" ? (
          <div className="flex mx-2 justify-center mt-5">
            <p className="text-[22px] text-center">
              You don't have any games yet
            </p>
          </div>
        ) : (
          heading !== "Shelved" &&
          token && (
            <SwiperSlide className="flex justify-start md:justify-start pl-5 md:pl-5 md:mr-10">
              <div
                onClick={handleShowAddModal}
                className="relative bg-[#ffffff1a] mt-[15px] h-[273px] w-[216px] rounded-[13.3px] flex justify-center flex-col gap-3 items-center border-dashed border-[1px] border-cPurple-light hover:cursor-pointer min-h-[150px]"
              >
                <Image
                  src="/icons/Icon-plus.svg"
                  alt="add here"
                  title="add here"
                  width={24}
                  height={24}
                  className="place-self-center"
                />
                <p className="text-[18px] text-center font-medium mb-[18px]">
                  ADD HERE
                </p>
              </div>
            </SwiperSlide>
          )
        )}
      </div>
      {heading !== "Shelved" && (
        <AddGameHere
          show={visibleAddModal}
          setShow={setVisibleAddModal}
          closeAddModal={handleHideAddModal}
          setWord={setWord}
          word={word}
          gameData={gameData}
          gamesArray={gamesArray}
          setGamesArray={setGamesArray}
          handleGames={handleGames}
          handleAddPlayingNow={handleAddPlayingNext}
          addGameVerificationMessage={addGameVerificationMessage}
        />
      )}
    </>
  );
};

export default PlayingNext;

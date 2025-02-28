import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ShadowLeft from "../../carousel/shadow-left";
import ShadowRight from "../../carousel/shadow-right";
import PlayingNowCard from "./playing-now-card";
import AddGameHere from "../modal/add-game";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IGame } from "@/types/game";
import Image from "next/image";

interface IProps {
  playingNow: any;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  isLoading?: boolean;
  visibleAddModal?: boolean;
  setVisibleAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGame?: boolean;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  word: string;
  token?: string;
  gameData: any[];
  gamesArray: any[];
  setGamesArray: React.Dispatch<React.SetStateAction<IGame[]>>;
  handleGames: (newGame: IGame) => void;
  handleAddPlayingNow: () => void;
  handleHideAddModal: () => void;
  handleShowAddModal: () => void;
  addGameVerificationMessage?: string | null;
  debouncedHandleUserUpdate?: any;
}

const PlayingNow: React.FC<IProps> = ({
  playingNow,
  setVisible,
  visible,
  isLoading,
  setSelectedGame,
  handleAddPlayingNow,
  handleShowAddModal,
  selectedGame,
  word,
  token,
  setWord,
  visibleAddModal,
  setVisibleAddModal,
  handleHideAddModal,
  gameData,
  gamesArray,
  setGamesArray,
  handleGames,
  addGameVerificationMessage,
  debouncedHandleUserUpdate,
}) => {
  const [games, setGames] = useState<any[]>([]);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isFirstScroll = useRef(true); // Track first-time scroll
  const isLastScroll = useRef(false); // Track last scroll state
  useEffect(() => {
    if (Array.isArray(playingNow) && playingNow?.length > 0) {
      const uniqueGames = [...playingNow]
        .reverse()
        .filter(
          (game, index, self) =>
            index === self.findIndex((g) => g.id === game.id)
        );
      setGames(uniqueGames);
    } else {
      setGames([]);
    }
  }, [playingNow]);

  useEffect(() => {
    if (scrollRef.current) {
      setShowButtons(
        scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      );
    }
  }, [games]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(games);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const uniqueItems = items.filter(
      (game, index, self) => index === self.findIndex((g) => g.id === game.id)
    );

    setGames(uniqueItems);

    if (debouncedHandleUserUpdate) {
      const updatedPlayingNow = [...items].reverse();
      debouncedHandleUserUpdate(updatedPlayingNow);
    }
  };

  const updateArrowsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      isLastScroll.current = scrollLeft + clientWidth >= scrollWidth;
    }
  };

  useEffect(() => {
    updateArrowsVisibility();
  }, [games]);

  const scrollContainer = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    let scrollAmount = 264; // Default scroll amount for intermediate scrolls

    if (isFirstScroll.current || isLastScroll.current) {
      scrollAmount = 288; // Use 288px for first and last scroll
    }

    // const scrollAmount = 288;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    // After first scroll, mark it as false
    isFirstScroll.current = false;

    // Update last scroll tracking
    setTimeout(updateArrowsVisibility, 500);
  };

  return (
    <>
      <div className="w-full mx-auto max-md:pt-0 pt-0 pb-3 grid grid-cols-1 px-[5%] md:px-[10%]">
        <div className="details-gradient relative pb-3">
          <h1 className="font-bold text-3xl md:text-4xl justify-self-start capitalize">
            Playing Now
          </h1>
        </div>
      </div>
      <div className="relative w-full z-20 pb-10 md:pl-[8.5%] 2xl:pl-[9.5%]">
        <div className="relative">
          {/* Left Arrow Button */}
          {Array.isArray(games) && games.length > 0 && showLeftArrow && (
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
          {Array.isArray(games) && games?.length > 0 && showRightArrow && (
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

        <ShadowLeft tag="playingNow" />
        <ShadowRight tag="playingNow" />

        {Array.isArray(games) && games?.length !== 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="games" direction="horizontal">
              {(provided) => (
                <div
                  {...provided?.droppableProps}
                  ref={(el) => {
                    provided.innerRef(el);
                    scrollRef.current = el; // Assign ref here
                    if (el) {
                      el.addEventListener("scroll", updateArrowsVisibility);
                    }
                  }}
                  onScroll={updateArrowsVisibility}
                  className="flex overflow-x-auto pt-6 px-4 2xl:px-3 playing-now scrollbar-hide "
                  id="scrollContainer"
                >
                  {Array.isArray(games) &&
                    games?.length > 0 &&
                    games?.map((item: any, index: number) => (
                      <Draggable
                        key={item?.id}
                        draggableId={item?.id?.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided?.innerRef}
                            {...provided?.draggableProps}
                            {...provided?.dragHandleProps}
                            className="mr-[30px] flex-shrink-0"
                            style={{
                              width: "236px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <PlayingNowCard
                              game={item}
                              visible={visible}
                              setIsOpenLoginStatus={setIsOpenLoginStatus}
                              token={token}
                              setVisible={setVisible}
                              setSelectedGame={setSelectedGame}
                              selectedGame={selectedGame}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided?.placeholder}
                  {token && (
                    <div
                      className="flex justify-center md:justify-start md:pl-0 md:mr-10 flex-shrink-0 "
                      style={{ width: "236px" }}
                    >
                      <div
                        onClick={handleShowAddModal}
                        className="relative bg-[#ffffff1a] h-[273px] xl:h-[339px] w-[216px] md:w-[236px] rounded-md flex justify-center flex-col gap-3 items-center border-dashed border-[1px] border-cPurple-light hover:cursor-pointer min-h-[150px]"
                      >
                        <Image
                          src="/icons/Icon-plus.svg"
                          alt="add here"
                          // title="add here"
                          width={24}
                          height={24}
                          className="place-self-center "
                        />
                        <p className=" text-lg text-center font-semibold mb-0">
                          ADD HERE
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          token && (
            <div className="flex justify-start md:justify-start pl-5 md:pl-5 md:mr-10 ">
              <div
                onClick={handleShowAddModal}
                className="relative bg-[#ffffff1a] h-[273px] w-[216px] rounded-[13.3px] mt-[15px] flex justify-center flex-col gap-3 items-center border-dashed border-[1px] border-cPurple-light hover:cursor-pointer min-h-[150px] "
              >
                <Image
                  src="/icons/Icon-plus.svg"
                  alt="add here Icon"
                  // title="add here Icon"
                  width={24}
                  height={24}
                  className="place-self-center "
                />
                <p className="text-lg text-center font-semibold mb-0">
                  ADD HERE
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <AddGameHere
        show={visibleAddModal}
        onSreachInPlayingNow={true}
        setShow={setVisibleAddModal}
        closeAddModal={handleHideAddModal}
        setWord={setWord}
        word={word}
        isLoading={isLoading}
        gameData={gameData}
        gamesArray={gamesArray}
        setGamesArray={setGamesArray}
        handleGames={handleGames}
        handleAddPlayingNow={handleAddPlayingNow}
        addGameVerificationMessage={addGameVerificationMessage}
      />
    </>
  );
};

export default PlayingNow;

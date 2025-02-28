import React, { useState, useEffect, SetStateAction } from "react";
import Modal from "../modal";
import { RxCross2 } from "react-icons/rx";
import { UseDebounce } from "../../hooks/use-debounce";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toastMessage } from "@/utills/toast";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import Image from "next/image";

interface IProps {
  data: any;
}
const FavoriteGamesNew = ({ data }: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [word, setWord] = useState<string>("");
  const [gameData, setGameData] = useState<any>([]);
  const [gamesArray, setGamesArray] = useState<any>([]);
  const [
    favouriteGameVerificationMessage,
    setfavouriteGameVerificationMessage,
  ] = useState<SetStateAction<null | string>>(null);
  const [userGames, setUserGames] = useState(
    data.favorite_games ? data.favorite_games : []
  );

  const searchedWord = UseDebounce(word, 500);
  const token = getToken();

  const toggleVisible = () => {
    setGameData([]);
    setWord("");
    setGamesArray([]);
    setVisible(!visible);
  };
  useEffect(() => {
    if (visible) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup function to remove the class when the component unmounts or isModalOpen changes
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);

  const getGames = async () => {
    try {
      if (searchedWord.length == 0) {
        return setGameData([]);
      }
      if (searchedWord.length >= 2) {
        const { data: game } = await axios.get(
          `${getApi()}/games?filters[title][$containsi]=${searchedWord}&populate=image&populate=coverImage`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGameData(game.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGames = (game: any) => {
    let index = gamesArray.findIndex((g: any) => g.id === game.id);
    if (index == -1) {
      let temp = [...gamesArray, game];
      setGamesArray(temp);
      setWord("");
    } else {
      toast.error("Game already added", { toastId: "8" });
    }
  };
  4;

  const getUserData = async () => {
    console.log("inside 4");
    const { data } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserGames(data.favorite_games);
  };

  const addGames = async () => {
    let payload = {
      favorite_games: gamesArray,
    };
    try {
      if (payload.favorite_games && payload.favorite_games.length > 0) {
        setfavouriteGameVerificationMessage("");
        let { data } = await axios.post(
          `${getApi()}/users-permissions/user/favourite-games`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getUserData();
        toastMessage("success", "Game added successfully");
        toggleVisible();
      } else {
        setfavouriteGameVerificationMessage(
          "Please Enter Game For adding favourite"
        );
      }
    } catch (error) {
      console.log(error);
      toastMessage("error", "Something went wrong");
    }
  };

  const deleteGames = async (game: any, index: number) => {
    let payload = {
      favorite_games: [game],
    };
    try {
      const res = await axios.patch(
        `${getApi()}/users-permissions/user/favourite-games`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let temp = [...userGames];
      temp.splice(index, 1);
      setUserGames(temp);
      toast.success("Game deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "9",
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "10",
      });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(userGames);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUserGames(items);
  };

  useEffect(() => {
    getGames();
  }, [searchedWord]);

  return (
    <>
      <div className="flex flex-col gap-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-start font-medium text-sm">Favourite Games</h2>
          {/* <Link
            to="/profile/favourite-games"
            className="bg-cBlue-special justify-center hover:bg-cBlue-extraLight flex py-[10px] px-[18px] rounded-2xl font-semibold capitalize text-[14px] max-sm:hidden"
          >
            See all
          </Link> */}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="games" direction="horizontal">
            {(provided) => (
              <div
                className="flex flex-wrap gap-x-2.5 md:gap-3"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {userGames.length !== 0 &&
                  userGames.slice(0, 4).map((game: any, index: number) => (
                    <Draggable
                      key={game.id}
                      draggableId={game.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="relative w-[88px] md:w-[100px] 2xl:w-[120px] rounded-[13.3px] mb-4 md:mb-0 shadow-[5.01px_1.47px_15.03px_-0.73px_#000000] "
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            onClick={() => deleteGames(game, index)}
                            className="absolute grid place-content-center bg-cPurple-light border-cBlack-dark border-[4.95px] rounded-[8.66px] w-[32.69px] h-[32.69px] top-[-10px] right-[-10px]"
                          >
                            <Image
                              src="/icons/closing-x.svg"
                              alt="close icon"
                              width={17}
                              height={17}
                              className="w-[19.32px] h-[19.32px] hover:cursor-pointer"
                            />
                          </div>
                          <Link
                            href={game.slug && `/game/${game.slug}`}
                            className="block"
                          >
                            <Image
                              src={game?.image?.url}
                              alt="favorite game"
                              width={128}
                              height={184}
                              className={`w-full h-full min-h-[120px] md:min-h-[140px] max-h-[140px] 2xl:min-h-[174px] 2xl:max-h-[174px] object-cover rounded-xl hover:cursor-pointer ${
                                index === 0
                                  ? "border border-[#F5D25C]"
                                  : index === 1
                                  ? "border border-[#D0D0D0]"
                                  : index === 2
                                  ? "border border-[#CD7F32]"
                                  : "border border-cPurple-light"
                              } `}
                            />
                          </Link>
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
                  ))}
                {provided.placeholder}

                <div
                  onClick={toggleVisible}
                  className="relative bg-[#ffffff1a] shadow-[5.01px_1.47px_15.03px_-0.73px_#000000] rounded-[13.3px] flex-col gap-2 border-dashed border-[1px] border-cPurple-light hover:cursor-pointer w-[88px] md:w-[100px] 2xl:w-[120px] min-h-[120px] md:min-h-[140px] max-h-[120px] md:max-h-[140px] 2xl:min-h-[174px] 2xl:max-h-[174px] flex items-center justify-center"
                >
                  <Image
                    src="/icons/Icon-plus.svg"
                    alt="add icon"
                    width={24}
                    height={24}
                    className="place-self-center "
                  />
                  <p className="text-[12px] text-center font-medium mb-[18px]">
                    ADD HERE
                  </p>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="sm:hidden block flex justify-center">
          <Link
            href="/profile/favourite-games"
            className="bg-cBlue-special w-[60%] max-[450px]:w-[100%] justify-center hover:bg-cBlue-extraLight flex py-[10px] px-[18px] rounded-lg font-normal capitalize text-[14px]"
          >
            See all
          </Link>
        </div>
      </div>
      <Modal show={visible} setShow={setVisible}>
        <div className="bg-[#1A2947] max-w-[400px] md:min-w-[400px] w-full h-[400px] flex flex-col justify-between">
          <div className="">
            <div className="flex flex-col mx-6 mt-9">
              <p className="text-[18px] font-[600] mb-2">Add Favourite Game </p>
              <p className="text-[14px] text-[#667085] font-[400]">
                Please enter a game title to search
              </p>
              <label
                htmlFor="searchGame"
                className="mt-5 mb-2 text-[14px] font-medium "
              >
                Name of Game
              </label>
              <input
                type="text"
                value={word}
                name="searchGame"
                placeholder="e.g. God of War"
                className="bg-white rounded-lg z-10	h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWord && setWord(e.target.value)
                }
              />
              {favouriteGameVerificationMessage ? (
                <p className="mt-[4px] text-[14px] text-red-500 font-normal">
                  {`${favouriteGameVerificationMessage}`}
                </p>
              ) : (
                ""
              )}
              <div
                className={`${
                  gameData && gameData?.length !== 0 ? "block" : "hidden"
                } game-scrollbar overflow-y-scroll  absolute top-[184px] z-50 w-[85%] bg-black h-[140px] flex flex-col items-center rounded-b-xl`}
              >
                {gameData?.length !== 0 &&
                  gameData?.map((game: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleGames(game)}
                      className="w-[90%] ml-2 hover:cursor-pointer hover:bg-gray-800 mt-2 rounded-lg"
                    >
                      <div className="flex m-2 px-2">
                        <div className="h-[80px] w-[70px]">
                          <Image
                            src={
                              game?.attributes?.image?.data?.attributes
                                ?.formats !== null &&
                              game?.attributes?.image?.data?.attributes?.formats
                                .thumbnail?.url
                                ? game?.attributes?.image?.data?.attributes
                                    ?.formats.thumbnail?.url
                                : ""
                            }
                            alt="game img"
                            title="game img"
                            width={70}
                            height={80}
                            className="h-[80px] w-[70px] min-w-[70px] object-cover"
                          />
                        </div>
                        <div className="ml-5">
                          <p className="text-[14px] font-[600]">
                            {game?.attributes?.title}
                          </p>
                          <div className="flex mt-[2px] items-center">
                            <Image
                              src="/icons/play-Icon.png"
                              alt="add icon"
                              title="add icon"
                              width={10}
                              height={10}
                              className="w-4 h-4"
                            />
                            <p className="text-[14px] font-[500] text-[#596184] ml-2">
                              {`${game?.attributes?.played} Plays`}
                            </p>
                          </div>
                          <div className="flex mt-[2px] items-center">
                            <Image
                              src="/icons/Star.png"
                              alt="add icon"
                              title="add icon"
                              width={10}
                              height={10}
                              className="w-4 h-4"
                            />
                            <p className="text-[14px] font-[500] text-[#98A2B3] ml-2">
                              {game?.attributes?.rating}
                            </p>
                          </div>
                        </div>
                      </div>
                      {gameData.length - 1 !== index && (
                        <span className=" block bg-white w-[100%] mt-1 h-[1px]" />
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex flex-wrap max-h-28 overflow-auto mt-2 gap-2">
                {gamesArray?.length !== 0 &&
                  gamesArray?.map((game: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center w-fit rounded-2xl bg-[#596184] py-1 px-2"
                    >
                      <p className="mx-3 text-[8px]">
                        {game?.attributes?.title}
                      </p>
                      <RxCross2
                        onClick={() =>
                          setGamesArray((prev: any) =>
                            prev.filter((g: any) => g.id !== game.id)
                          )
                        }
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-5 mx-6">
            <button
              onClick={toggleVisible}
              className="w-[48%] h-[50px]  bg-white hover:bg-gray-100 text-[16px] font-[600] text-[#344054] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={addGames}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600]"
            >
              Add Game
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FavoriteGamesNew;

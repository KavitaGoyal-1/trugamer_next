import React, { useState, useEffect, SetStateAction } from "react";
import Modal from "../modal";
import { RxCross2 } from "react-icons/rx";
import { UseDebounce } from "../../hooks/use-debounce";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ShadowLeft from "../carousel/shadow-left";
import ShadowRight from "../carousel/shadow-right";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FavoriteGamesSlider from "./favorite-games-slider";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/slices/auth-slice";
import { toastMessage } from "@/utills/toast";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import Image from "next/image";

interface IProps {
  data: any;
}
const FavoriteGamesUpdated = ({ data }: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [word, setWord] = useState<string>("");
  const [gameData, setGameData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [gamesArray, setGamesArray] = useState<any>([]);
  const [
    favouriteGameVerificationMessage,
    setfavouriteGameVerificationMessage,
  ] = useState<SetStateAction<null | string>>(null);
  const dispatch = useDispatch();
  const [userGames, setUserGames] = useState(
    data?.favorite_games ? data?.favorite_games : []
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
    setUserGames(data?.favorite_games);
  };

  const addGames = async () => {
    let payload = {
      favorite_games: gamesArray,
    };
    try {
      if (payload?.favorite_games && payload?.favorite_games.length > 0) {
        setfavouriteGameVerificationMessage("");
        setLoading(true);
        let { data } = await axios.post(
          `${getApi()}/users-permissions/user/favourite-games`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getUserData();
        toastMessage("success", "Game added successfully");
        setLoading(false);
        toggleVisible();
      } else {
        setLoading(false);
        setfavouriteGameVerificationMessage(
          "Please Enter Game For adding favourite"
        );
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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

    // const items = Array.from(userGames);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);

    // setUserGames(items);

    const reorderedGames = [...userGames];
    const [movedGame] = reorderedGames.splice(result.source.index, 1);
    reorderedGames.splice(result.destination.index, 0, movedGame);
    setUserGames(reorderedGames);
    debouncedHandleUserUpdate(reorderedGames);
  };

  const handleGamesChange = async (userGameData: any) => {
    let payload = {
      favorite_games: userGameData,
    };
    let payload2 = {
      userData: {
        ...data,
        favorite_games: userGameData,
      },
    };
    try {
      const response = await axios.delete(
        `${getApi()}/users-permissions/user/all-favourite-games`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.err === false) {
        try {
          await axios.post(
            `${getApi()}/users-permissions/user/all-favourite-games`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          dispatch(signIn(payload2));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🛠 Debounced function call 🛠
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): T {
    let timeoutId: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    } as T;
  }
  // 🛠 Debounced function call 🛠

  // 🛠 Debounced API call 🛠
  const debouncedHandleUserUpdate = debounce(async (updatedData: any) => {
    await handleGamesChange(updatedData);
    getUserData(); // Refresh user data after update
  }, 5000);

  useEffect(() => {
    getGames();
  }, [searchedWord]);
  console.log(gameData, "bbbbbbbbbbbbbb");
  return (
    <>
      <div className="flex flex-col gap-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-start font-medium text-sm">Favourite Games</h2>

          <span
            className="text-sm font-semibold text-[#00ADFF] cursor-pointer"
            onClick={toggleVisible}
          >
            Add Game +
          </span>
        </div>

        <div>
          <FavoriteGamesSlider
            userGames={userGames}
            onDelete={deleteGames}
            onDragEnd={onDragEnd}
          />
        </div>

        <div className="sm:hidden flex justify-center">
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
                              game?.attributes?.image?.data?.attributes?.formats
                                ?.thumbnail?.url
                                ? game?.attributes?.image?.data?.attributes
                                    ?.formats?.thumbnail?.url
                                : game?.attributes?.coverImage?.data?.attributes
                                    ?.formats?.thumbnail?.url
                                ? game?.attributes?.coverImage?.data?.attributes
                                    ?.formats?.thumbnail?.url
                                : "/placeholder.png"
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={addGames}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Add Game...
                </span>
              ) : (
                "Add Game"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FavoriteGamesUpdated;

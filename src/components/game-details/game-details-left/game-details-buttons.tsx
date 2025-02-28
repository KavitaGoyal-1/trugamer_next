import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useLoaderData } from "react-router-dom";
import GameStatusPopup from "../../game-status-popup";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { toggleVisibility } from "@/store/slices/game-hours";
import { getToken } from "@/utills/cookies";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import { selectAuthState } from "@/store/slices/auth-slice";
import { useRouter } from "next/router";
import Image from "next/image";

interface IGameButtonProps {
  isUserAuth: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getPlayedAndQueuedCount?: any;
  slug?: string;
  analytics?: any;
  handlePlayedHoursUpdate?: any;
  selectedDevices?: any;
  handleDeviceClick?: any;
  progressData?: any;
  beatStatus?: any;
  setBeatStatus?: any;
  hoursPlayed?: number;
  setHoursPlayed?: number;
  handleEditClick?: any;
  gameData?: any;
  handleSubmitProgressFromGameStatus?: any;
}

const GameDetailsButtons = ({
  isUserAuth,
  getPlayedAndQueuedCount,
  slug,
  handlePlayedHoursUpdate,
  selectedDevices,
  handleDeviceClick,
  progressData,
  beatStatus,
  setBeatStatus,
  hoursPlayed,
  setHoursPlayed,
  handleEditClick,
  handleSubmitProgressFromGameStatus,
  gameData,
}: IGameButtonProps) => {
  const router = useRouter();

  const [visible, setVisible] = useState<boolean>(false);
  const [clickBeatGameStatus, setClickBeatGameStatus] =
    useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState("Not Queued");
  const [gameBeatStatus, setGameBeatStatus] = useState("Never Beat");
  // const requestedData: any = useLoaderData();
  const { userData } = useSelector(selectAuthState);
  console.log(userData, "userDatattatatat", gameData);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const pathname = usePathname();
  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);
  const token = getToken();
  const dispatch = useDispatch();

  const checkStatus = () => {
    if (userData?.id) {
      let gameFound = false;
      let gameBeat = false;

      userData?.playingNow?.forEach((now: any) => {
        if (now?.game?.id === gameData?.id) {
          setGameStatus("Playing Now");
          gameFound = true;
        }
      });

      // Check in 'Playing Next'
      if (!gameFound) {
        userData?.playingNext?.forEach((now: any) => {
          if (now?.game?.id === gameData?.id) {
            setGameStatus("Playing Next");
            gameFound = true;
          }
        });
      }

      if (!gameFound) {
        userData?.shelvedGames?.forEach((now: any) => {
          if (now?.game?.id === gameData?.id) {
            setGameStatus("Shelved");
            gameFound = true; // Game found
          }
        });
      }
      if (!gameFound) {
        userData?.gamesLibrary?.forEach((now: any) => {
          if (now?.game?.id === gameData?.id) {
            setGameStatus("In Library");
            gameFound = true; // Game found
          }
        });
      }

      if (!gameBeat) {
        userData?.beaten_games?.forEach((now: any) => {
          if (now?.game?.id === gameData?.id) {
            setGameBeatStatus("Beat");
            gameBeat = true; // Game found
          }
        });
      }
      if (!gameBeat) {
        setGameBeatStatus("Never Beat");
      }
      if (!gameFound) {
        setGameStatus("Not Queued");
      }
    }
  };

  const toggleVisible = (device: any) => {
    if (!token && slug) {
      // localStorage.setItem("Revisedslug", slug && slug);
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLoginStatus(true);
    } else {
      console.log("toggleVisible");
      setVisible(!visible);
      dispatch(toggleVisibility(true));
      setClickBeatGameStatus(false);
    }
  };

  const toggleBeatGameVisible = (beatStatus: string) => {
    setVisible(!visible);
    setClickBeatGameStatus(true);
  };

  useEffect(() => {
    if (userData) {
      checkStatus();
    }
  }, [checkStatus, userData]);

  useEffect(() => {
    if (getPlayedAndQueuedCount) {
      getPlayedAndQueuedCount();
    }
  }, [visible]);

  const handleClickLogin = () => {
    if (slug) {
      // localStorage.setItem("Revisedslug", slug && slug);
      localStorage.setItem("Revisedslug", pathname && pathname);
      router.push("/sign-in");
    }
  };
  const handleClickSignUp = () => {
    if (slug) {
      // localStorage.setItem("Revisedslug", slug && slug);
      localStorage.setItem("Revisedslug", pathname && pathname);
      router.push("/sign-up");
    }
  };
  return (
    <div className="grid grid-cols-[max-content_max-content_max-content] gap-2 ">
      {/**Playing now or log in */}
      {isUserAuth ? (
        <div
          className={`min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] py-1.5 px-[14px] sm:px-[18px] border border-[#00ADFF] text-white text-xs sm:text-base font-semibold rounded-[10px]
          flex justify-center items-center shadow-cShadow-main cursor-pointer
          ${gameStatus !== "Not Queued" ? "bg-cBlue-light " : ""}`}
        >
          {gameStatus}
        </div>
      ) : (
        <>
          <button
            onClick={handleClickLogin}
            className="min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] bg-cPurple-light py-1.5 px-[18px] text-white text-sm	font-semibold rounded-[10px] cursor-pointer"
          >
            Log In
          </button>
        </>
      )}
      {/**Beat and sign up */}
      {isUserAuth ? (
        // <div
        //   className="min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] bg-cBlue-light py-1.5 px-[14px] sm:px-[18px] cursor-pointer text-white text-xs sm:text-base	font-semibold rounded-[10px]
        // flex justify-center	items-center shadow-cShadow-main
        // "
        //   onClick={() => toggleBeatGameVisible("beat")}
        // >
        //   {gameBeatStatus}
        // </div>
        <div
          className={`min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] py-1.5 px-[14px] sm:px-[18px] border border-[#00ADFF] text-white text-xs sm:text-base font-semibold rounded-[10px]
          flex justify-center items-center shadow-cShadow-main cursor-pointer
          ${gameBeatStatus == "Beat" ? "bg-cBlue-light " : ""}`}
          onClick={() => toggleBeatGameVisible("beat")}
        >
          {gameBeatStatus}
        </div>
      ) : (
        <>
          <button
            onClick={handleClickSignUp}
            className=" min-h-[30px] sm:min-h-[36px] h-[30px] sm:h-[36px] bg-cBlue-light py-1.5 px-[18px] text-white text-sm	font-semibold  rounded-[10px]
                flex justify-center	items-center shadow-cShadow-main cursor-pointer
                "
          >
            Sign Up
          </button>
          <span
            onClick={toggleVisible}
            className="min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] cursor-pointer border border-[#00ADFF] p-1 sm:p-2 w-[28px] sm:w-[38px] rounded-[10px] flex justify-center	items-center shadow-cShadow-main"
          >
            <Image
              src="/icons/options-white.svg"
              alt="shield check icon"
              width={24}
              height={24}
            />
          </span>
        </>
      )}
      {/**Options button? */}
      {isUserAuth && (
        <span
          onClick={toggleVisible}
          className="min-h-[30px] h-[30px] sm:h-[36px] sm:min-h-[36px] cursor-pointer border border-[#00ADFF] p-1 sm:p-2 w-[28px] sm:w-[38px] rounded-[10px] flex justify-center	items-center shadow-cShadow-main"
        >
          <Image
            src="/icons/options-white.svg"
            alt="shield check icon"
            width={24}
            height={24}
          />
        </span>
      )}
      {/* <GameStatusPopup
        setSelectedGame={setSelectedGame}
        selectedGame={{
          game: gameData?.data[0] && gameData?.data[0],
          device: {
            ...gameData?.data[0]?.attributes?.devices?.data[0]?.attributes,
          },
          getPlayedAndQueuedCount: { getPlayedAndQueuedCount },
        }}
        visible={visible}
        setVisible={setVisible}
        deviceData={gameData?.data[0]?.attributes?.devices}
        clickBeatGameStatus={clickBeatGameStatus}
        handlePlayedHoursUpdate={handlePlayedHoursUpdate}
        slug={slug}
        showMoadl={visible}
        selectedDevices={selectedDevices}
        handleDeviceClick={handleDeviceClick}
        progressData={progressData}
        beatStatus={beatStatus}
        setBeatStatus={setBeatStatus}
        hoursPlayed={hoursPlayed}
        setHoursPlayed={setHoursPlayed}
        handleEditClick={handleEditClick}
        handleSubmitProgressFromGameStatus={handleSubmitProgressFromGameStatus}
      /> */}

      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </div>
  );
};

export default GameDetailsButtons;

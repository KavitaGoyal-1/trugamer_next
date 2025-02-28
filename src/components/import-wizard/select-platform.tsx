import { useEffect, useState, useRef } from "react";
import {
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaSortDown,
  FaSortUp,
  FaSpinner,
  FaSteam,
} from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import ImportUpdateTimeModal from "./import-update-time-modal";
import Link from "next/link";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoaderSpinner from "../loader-spinner";
import { getToken } from "@/utills/cookies";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import { signIn } from "@/store/slices/auth-slice";
import { setProgressState } from "@/store/slices/progress-slice";
import Image from "next/image";

interface PlatformTableProps {
  steamId?: any;
  userId?: number;
  userData?: any;
  steamData?: any;
  fetchSteamRecords?: any;
  setSteamData: any;
}

interface GameStatuses {
  [gameId: string]: string; // Key is the game ID, value is the game status (e.g., "Playing Now")
}
export default function PlatformTable({
  steamData,
  steamId,
  userId,
  userData,
  fetchSteamRecords,
  setSteamData,
}: PlatformTableProps) {
  const token = getToken();
  let steamIdFromRedux = useSelector(
    (state: any) => state?.steamIdSlice?.steamId
  );
  const user = useSelector((state: any) => state?.authState?.userData);
  const dispatch = useDispatch();
  const [isOpenWel, setIsOpenWel] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  // const [steamIdData, setSteamIdData] = useState(steamIdFromRedux);
  const [steamIdData, setSteamIdData] = useState<any>(
    steamIdFromRedux?.toString() || ""
  );
  const [allGames, setAllGames] = useState(steamData);
  const [tempAllGames, setTempAllGames] = useState(steamData);
  const [loading, setLoading] = useState(false);
  const [startloading, setStartLoading] = useState(true);
  const [gameStatuses, setGameStatuses] = useState<GameStatuses>({});
  const [toggleTime, settoggleTime] = useState<any[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<any>(false);
  const [saveAllGamesLoader, setSaveAllGamesLoader] = useState<any>(false);
  const { syncInProgress, progressPercent } = useSelector(
    (state: any) => state.progress
  );
  useEffect(() => {
    fetchSteamRecords(sortOrder);
  }, [token, userId]);

  console.log(steamData, "steamData");

  useEffect(() => {
    if (steamData?.length > 0) {
      setStartLoading(false);

      const updatedGames = steamData?.map((game: any) => ({
        ...game,
        tempTime: Math.floor(game?.trugamerTime?.hours_played || 0),
        tempStatus: game?.status,
        updateTime: true,
      }));

      setAllGames(updatedGames);
      setTempAllGames(updatedGames);
      const allSelected = updatedGames.every((game: any) => game.isChecked);
      setIsAllSelected(allSelected);
      const initialStatuses: GameStatuses = {};
      updatedGames?.forEach((game: any) => {
        const initialStatus = game?.user?.[0]?.playingNow?.some(
          (item: any) => item.game.id === game?.game?.id
        )
          ? "Playing Now"
          : game?.user?.[0]?.playingNext?.some(
              (item: any) => item.game.id === game?.game?.id
            )
          ? "Playing Next"
          : game?.user?.[0]?.shelvedGames?.some(
              (item: any) => item.game.id === game?.game?.id
            )
          ? "Shelved"
          : "Not Queued";
        initialStatuses[game?.game?.id] = initialStatus;
      });

      setGameStatuses(initialStatuses);
    }
  }, [steamData]);

  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const handleOpenWel = () => {
    setIsOpenWel(true);
  };

  const handleCloseWel = () => {
    setIsOpenWel(false);
    setSelectedValue("");
  };

  const handleUpdateTimeToggle = async (record: any, sortOrder: boolean) => {
    setAllGames((prevData: any[]) => {
      const updatedData = prevData.map((game) =>
        game.id === record.id
          ? {
              ...game,
              updateTime: !game.updateTime,
            }
          : game
      );
      setTempAllGames(updatedData);
      return updatedData;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input or empty string
    if (/^\d*$/.test(value)) {
      setSteamIdData(value); // Store as a string
    }
  };

  const handleSaveChanges = async () => {
    let payload = {
      userData: {
        // ...userData,
        steamId: steamIdData || 0,
      },
    };
    let payload1 = {
      userData: {
        ...userData,
        steamId: steamIdData || 0,
      },
    };
    try {
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(signIn(payload1));
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };

  const handleImportSteam = async () => {
    try {
      // if (!steamIdData && !steamIdFromRedux) {
      //   toastMessage("error", "Please enter a Steam Id");
      // }
      const initialState = {
        progressPercent: 0,
        openUploadProgressModal: true,
        estimatedTime: 0,
        syncInProgress: true,
      };

      dispatch(setProgressState(initialState));
      localStorage.setItem("progressState", JSON.stringify(initialState));

      const importRequest = axios.post(
        `${getApi()}/steam/create-update-games?steamId=${
          steamIdData || steamIdFromRedux
        }`,
        { userId: { id: userId } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const progressPolling = new Promise<void>((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const progressResponse = await axios.post(
              `${getApi()}/steam/sync-progress`,
              { userId: { id: userId } },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (progressResponse.status === 200) {
              const { totalGames, processedGames, progress, estimatedTime } =
                progressResponse.data;

              const currentState = {
                progressPercent: progress,
                totalUploadGames: totalGames,
                pendingUploadGames: processedGames,
                estimatedTime,
                openUploadProgressModal: true,
                syncInProgress: true,
              };

              dispatch(setProgressState(currentState));
              localStorage.setItem(
                "progressState",
                JSON.stringify(currentState)
              );

              if (progress >= 100) {
                clearInterval(interval);
                resolve();
              }
            }
          } catch (progressError) {
            clearInterval(interval);
            localStorage.removeItem("progressState");
            reject(progressError);
          }
        }, 2000);
      });

      await Promise.all([importRequest, progressPolling]);
      await handleSaveChanges();
      const completedState = {
        openUploadProgressModal: false,
        progressPercent: 0,
        pendingUploadGames: 0,
        totalUploadGames: 0,
        estimatedTime: 0,
        syncInProgress: false,
      };

      dispatch(setProgressState(completedState));
      localStorage.removeItem("progressState");
      toastMessage("success", "Games successfully synced!");
    } catch (error) {
      const errorState = {
        openUploadProgressModal: false,
        progressPercent: 0,
        pendingUploadGames: 0,
        totalUploadGames: 0,
        estimatedTime: 0,
        syncInProgress: false,
      };

      dispatch(setProgressState(errorState));
      localStorage.removeItem("progressState");
      toastMessage("error", "An unexpected error occurred.");
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  // jo uper top 10 top 20 continue update
  const handleClickContinueUpdate = async () => {
    console.log(
      "handleClickContinueUpdate === >",
      " LIMIT IS __-->",
      selectedValue,
      "TOTAL GAMES ARE = ",
      tempAllGames?.length
    );
    let updateArr = [];
    try {
      setLoading(true);

      if (selectedValue === "all") {
        updateArr = tempAllGames?.map((item: any) => {
          //item.isChecked = true;  // Set isChecked to true
          item.updateTime = true; // Set updateTime to true
          return item; // Return the id after updating the item
        });
      } else {
        const limit = parseInt(selectedValue);
        console.log(
          " limit handleClickContinueUpdate ",
          " -- Limit is =",
          limit
        );
        updateArr = tempAllGames?.slice(0, limit)?.map((item: any) => {
          //item.isChecked = true;  // Set isChecked to true
          item.updateTime = true; // Set updateTime to true
          return item; // Return the id after updating the item
        });
      }
      setAllGames(updateArr);
      handleCloseWel();
      setLoading(false);
      // const updateResponse = await axios.put(
      //   `${getApi()}/steam/update-steam-games/${userId}`,
      //   { recordArr: updateArr },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      // if (updateResponse.status == 200) {
      //   fetchSteamRecords(sortOrder);
      //   handleCloseWel();
      //   setLoading(false);
      // }
      // }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleStatusChange = (idx: number, newStatus: string, game: any) => {
    const gameId = game?.game?.id;
    setGameStatuses((prevStatuses) => ({
      ...prevStatuses,
      [gameId]: newStatus, // Update the status for the specific game
    }));
    setAllGames((prevGames: any) =>
      prevGames.map((item: any) => {
        if (item?.id === game?.id) {
          return { ...item, tempStatus: newStatus };
        }
        return item;
      })
    );
  };

  const handleSortOrder = () => {
    setSortOrder((prevState) => !prevState);
  };

  const handleClick = () => {
    handleSortOrder();
    setTimeout(() => {
      fetchSteamRecords(!sortOrder);
    }, 0);
  };

  const handleCheckboxChange = (gameId: any) => {
    setAllGames((prevGames: any) => {
      const updatedGames = prevGames.map((game: any) =>
        game.id === gameId ? { ...game, isChecked: !game.isChecked } : game
      );

      // Check if all games are selected
      const allSelected = updatedGames.every((game: any) => game.isChecked);
      setIsAllSelected(allSelected);
      setTempAllGames(updatedGames);

      return updatedGames;
    });
  };

  const saveAllGames = async () => {
    // Saveall
    try {
      setSaveAllGamesLoader(true);
      if (!allGames || allGames?.length === 0) {
        console.log("No games to save.");
        setSaveAllGamesLoader(false);
        return;
      }

      // Deep copy and transform the entire array of games
      const transformedGames = allGames
        .filter((game: any) => !game?.gameName)
        .map((game: any) => {
          const gameCopy = JSON.parse(JSON.stringify(game));
          gameCopy.userId = game?.user[0]?.id;
          gameCopy.gameId = game?.game?.id;
          delete gameCopy?.user;
          delete gameCopy?.game;
          delete gameCopy?.updatedAt;
          delete gameCopy?.steamLink;
          delete gameCopy?.createdAt;

          if (
            gameCopy?.updateTime !== undefined &&
            gameCopy?.updateTime !== null &&
            gameCopy?.updateTime !== false
          ) {
            gameCopy.steamPlayTime = Math.floor(gameCopy?.steamPlayTime / 60);
          }

          return gameCopy; // Return the transformed game
        });

      const response = await axios.post(
        `${getApi()}/steam/update-time-status-library`,
        { updateArr: transformedGames }, // Send the entire array
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaveAllGamesLoader(false);
      // Handle the API response
      if (response.status === 200) {
        console.log("All games updated successfully:", response.data);
        toastMessage("success", "Games are updated successfully");
      } else {
        toastMessage("error", "Games are not updated");
      }
    } catch (error) {
      setSaveAllGamesLoader(false);
      toastMessage("error", "Games are not updated");
      // console.error("Error updating all games:", error);
    }
  };

  const saveSingleGame = async (game: any, gameStatus: any) => {
    try {
      const gameCopy = JSON.parse(JSON.stringify(game));
      gameCopy.userId = game?.user[0]?.id;
      gameCopy.gameId = game?.game?.id;
      delete gameCopy?.user;
      delete gameCopy?.game;
      delete gameCopy?.updatedAt;
      delete gameCopy?.steamLink;
      delete gameCopy?.createdAt;

      if (
        gameCopy?.updateTime !== undefined &&
        gameCopy?.updateTime !== null &&
        gameCopy?.updateTime !== false
      ) {
        gameCopy.steamPlayTime = Math.floor(gameCopy?.steamPlayTime / 60);
      }

      const response = await axios.post(
        `${getApi()}/steam/update-time-status-library`,
        { updateArr: [gameCopy] }, // Wrap gameCopy in an object
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass the headers
        }
      );

      if (response.status === 200) {
        console.log(response, " Single is game updated  == >");
        toastMessage("success", "Updated successfully");
      }
    } catch (error) {
      toastMessage("error", "Game is not updated");
      console.log(error, "Error  in  updating game in steam");
    }
  };

  const handleSelectAll = () => {
    setAllGames((prevGames: any) =>
      prevGames.map((game: any) => ({ ...game, isChecked: !isAllSelected }))
    );
    setIsAllSelected(!isAllSelected);
    setTempAllGames(allGames);
  }; //
  console.log(allGames, "allGamesallGames");
  return (
    <>
      {startloading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="h-full rounded-lg bg-[#15182B] w-[90%] md:w-[80%] mx-auto mt-24 md:mt-32 mb-10">
          <div className="">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-0 p-4 border-b border-[#FFFFFF40]">
              <h1 className="text-2xl font-bold">Import from Steam</h1>

              <div className="flex items-center  gap-4 mt-4 mb-4 md:mb-0 md:mt-0">
                <label className="text-lg font-bold w-24 md:w-auto">
                  Steam ID
                </label>
                <div className="relative flex gap-3">
                  <input
                    className="bg-white p-2 w-full  min-w-[100%] sm:min-w-[250px]  rounded-lg text-sm text-black border border-[#D0D5DD]"
                    type="text"
                    name="steamIdData"
                    value={steamIdData} // Keep as a string
                    placeholder="Enter stream ID"
                    onChange={handleChange}
                  />

                  {loading ? (
                    <span className="absolute right-3 loading top-[6px]">
                      <LoaderSpinner />
                    </span>
                  ) : (
                    <>
                      <button
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex gap-2 items-center justify-center ${
                          !steamIdData || steamIdData === "0"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!steamIdData || steamIdData === "0"}
                        onClick={handleImportSteam}
                      >
                        <Image
                          src="/icons/steamDown.svg"
                          alt="steam icon"
                          className=" cursor-pointer brightness-200 active:scale-90 active:opacity-30 transition-transform duration-150"
                          width={32}
                          height={32}
                          // onClick={handleImportSteam}
                        />
                        <span className="text-sm"> Import</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pr-3">
              <div className="overflow-auto custom-h ">
                <table className="table-auto w-full text-sm text-left pr-3">
                  <thead className="text-sm font-bold text-white border-b border-[#FFFFFF40]">
                    <tr>
                      <th scope="col" className="px-4 py-4 min-w-32">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={isAllSelected} // This should be a state variable to track if all rows are selected
                            onChange={handleSelectAll} // This should be a handler function to toggle the selection of all rows
                          />
                          <span className="ml-2">Check All</span>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4 w-60">
                        Game Name
                      </th>
                      <th scope="col" className="px-4 py-4 min-w-36">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={handleClick}
                        >
                          Last Played{" "}
                          <span>
                            {sortOrder ? <FaSortUp /> : <FaSortDown />}
                          </span>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4 min-w-44">
                        <div className="flex gap-1 items-center relative group">
                          Trugamer Hours
                          <div className="relative flex items-center mdinfo">
                            <MdInfo
                              className="text-[#00adff] cursor-pointer"
                              size={14}
                            />
                            <div className="absolute w-52 left-1/2 transform -translate-x-1/2 top-[36px] mt-2 hidden group-hover:flex items-center justify-center px-2 py-2 text-xs text-white bg-[#344054] font-normal rounded-lg shadow-lg tooltip-content">
                              <div className="tooltip-arrow"></div>
                              Hours manually added for PC games in Trugamer.
                            </div>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4 min-w-36">
                        <div className="flex gap-1 items-center relative group">
                          Steam Hours
                          <div className="relative flex items-center">
                            <MdInfo
                              className="text-[#00adff] cursor-pointer"
                              size={14}
                            />
                            <div className="absolute w-52 left-1/2 transform -translate-x-1/2 top-[36px] mt-2 hidden group-hover:flex items-center justify-center px-2 py-2 text-xs text-white bg-[#344054] font-normal rounded-lg shadow-lg tooltip-content">
                              <div className="tooltip-arrow"></div>
                              Hours imported from Steam for PC games.
                            </div>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Link
                      </th>
                      <th scope="col" className="px-4 py-4">
                        <div className="flex gap-1 items-center relative ">
                          {/* <label
                            className="inline-flex relative items-center cursor-pointer box-none mr-1"
                            onClick={handleOpenWel}
                          >
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-8 h-4 bg-[#EEF1F8] rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-4 peer-checked:after:border-[#fff] peer-checked:after:bg-[#fff] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#39475B] after:border-[#39475B] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#00adff] focus:outline-none focus-visible:outline-none"></div>
                          </label> */}
                          <button
                            onClick={handleOpenWel}
                            className="whitespace-nowrap h-[30px] font-semibold flex items-center justify-center  bg-cBlue-light hover:bg-cBlue-main text-white text-xs py-2 px-3 rounded-lg cursor-pointer ease-in-out duration-300 capitalize shadow-cShadow-main undefined"
                          >
                            Sync Time
                          </button>
                          {/* <span>Update Time</span> */}
                          <div className="relative flex items-center group">
                            <MdInfo
                              className="text-[#00adff] cursor-pointer"
                              size={14}
                            />
                            <div className="absolute z-[999] w-52 left-1/2 transform -translate-x-1/2 top-[36px] mt-2 hidden group-hover:flex items-center justify-center px-2 py-2 text-xs text-white bg-[#344054] font-normal rounded-lg shadow-lg tooltip-content">
                              <div className="tooltip-arrow"></div>
                              Turning on the toggle will switch your Steam
                              playtime to TruGamer records.
                            </div>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Queue Status
                      </th>
                      {/* <th scope="col" className="px-4 py-4">
                Actions
              </th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {allGames
                      ?.filter(
                        (game: any) => game?.gameName || game?.game?.publishedAt
                      )
                      .map((game: any, idx: any) => {
                        // Safely handle date formatting

                        const lastPlayedDate = game.lastPlayed
                          ? new Date(game.lastPlayed)
                          : "-";
                        const formattedDate =
                          lastPlayedDate instanceof Date
                            ? `${lastPlayedDate.getMonth() + 1}/${
                                lastPlayedDate.getDate() + 1
                              }/${lastPlayedDate.getFullYear()}`
                            : "Never Played";
                        // Safely access nested properties
                        const gameId = game?.game?.id || `game-${idx}`;
                        const numericGameId = Number(gameId);
                        const gameTitle =
                          game?.game?.title ||
                          game?.gameName ||
                          "Untitled Game";
                        const coverImageUrl =
                          game?.game?.coverImage?.url || "/placeholder.png";
                        let steamPlayTime = Math.floor(game.steamPlayTime / 60); //? formatHours(game?.steamPlayTime): 0;
                        //let trugamerTime = game?.trugamerTime?.hours_played || 0 //? formatHours(game?.steamPlayTime) : 0;
                        let trugamerTime = game?.tempTime;
                        let oldStatus = "Not Queued"; // Default status

                        if (
                          game?.user?.[0]?.playingNow?.some(
                            (item: any) => item?.game?.id === gameId
                          )
                        ) {
                          oldStatus = "Playing Now";
                        } else if (
                          game?.user?.[0]?.playingNext?.some(
                            (item: any) => item?.game?.id === gameId
                          )
                        ) {
                          oldStatus = "Playing Next";
                        } else if (
                          game?.user?.[0]?.shelvedGames?.some(
                            (item: any) => item?.game?.id === gameId
                          )
                        ) {
                          oldStatus = "Shelved";
                        }

                        // const gameStatus = gameStatuses[gameId] || "Not Queued";
                        // Access `gameStatuses` using `numericGameId`**
                        const gameStatus =
                          gameStatuses[numericGameId] || "Not Queued";

                        // Debugging added**

                        return (
                          <tr
                            key={gameId}
                            className="line-botom relative hover:bg-gray-800"
                          >
                            {/* Add CheckBOX  */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              <input
                                type="checkbox"
                                className={`w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                                  game?.gameName
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 text-blue-600 cursor-pointer"
                                }`}
                                checked={game?.isChecked || false} // Reflects the current state of `game.checked`
                                disabled={!!game?.gameName} // Disable if `game?.gameName` exists
                                onChange={() => handleCheckboxChange(game?.id)} // Toggle state when checkbox is clicked
                              />
                            </td>

                            {/* add image of game */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              <div className="flex gap-2 items-center">
                                <Image
                                  src={coverImageUrl}
                                  alt={gameTitle}
                                  className="w-10 h-14 object-cover rounded-lg"
                                  width={40}
                                  height={40}
                                />
                                {gameTitle}
                              </div>
                            </td>
                            {/* This is for last palyed */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              {formattedDate}
                            </td>
                            {/* This is for trugamerTime */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              {game?.updateTime
                                ? `${Math.floor(steamPlayTime)}hrs`
                                : `${trugamerTime}hrs`}
                            </td>
                            {/* This is for time paly total played time */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              {`${Math.floor(steamPlayTime)}hrs`}
                            </td>
                            {/* this is for steam link */}
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              {game?.steamLink && (
                                <Link
                                  href={game.steamLink && game.steamLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaSteam size={20} />
                                </Link>
                              )}
                            </td>
                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              {/* This is for Update Time */}
                              {/* {!game?.gameName && ( */}
                              <label
                                className={`inline-flex relative items-center ${
                                  game?.isChecked
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                                } box-none`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={game?.updateTime || false}
                                  disabled={game?.gameName} // {(!game?.isChecked && !game?.gameName )}
                                  onChange={() => {
                                    if (game?.isChecked) {
                                      handleUpdateTimeToggle(game, sortOrder);
                                    }
                                  }}
                                />
                                <div
                                  className={`w-8 h-4 rounded-full disabled-input ${
                                    game?.isChecked
                                      ? "bg-[#EEF1F8] peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-[#00adff]"
                                      : "bg-gray-300 cursor-not-allowed  peer-checked:after:bg-[#6b5f5f] peer-checked:after:border-[#6b5f5f]"
                                  } peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-4 peer-checked:after:border-[#fff] peer-checked:after:bg-[#fff] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#39475B] after:border-[#39475B] after:border after:rounded-full after:h-3 after:w-3 after:transition-all`}
                                >
                                  {" "}
                                </div>
                              </label>
                              {/* )} */}
                            </td>

                            <td className="px-4 py-4 font-normal text-sm italic text-[#C1C9ED]">
                              <div className="flex gap-2">
                                {game?.gameName ? (
                                  "Game could not be imported at this time"
                                ) : (
                                  <>
                                    {/* this is for GAme sTaTus */}
                                    <select
                                      className="bg-white border border-[#D0D5DD] text-[#101828] rounded-md text-sm p-1 px-1 w-44 focus:outline-none cursor-pointer"
                                      value={gameStatus}
                                      disabled={!game?.isChecked}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          idx,
                                          e.target.value,
                                          game
                                        )
                                      }
                                    >
                                      <option value="Not Queued">
                                        Not Queued
                                      </option>
                                      <option value="Playing Now">
                                        Playing Now
                                      </option>
                                      <option value="Playing Next">
                                        Playing Next
                                      </option>
                                      <option value="Shelved">Shelved</option>
                                    </select>

                                    {/* this is Save button for row --- >  = = = = = > */}
                                    <button
                                      className={`${
                                        game?.isChecked
                                          ? "bg-[#00ADFF] hover:bg-[#008CDB] cursor-pointer"
                                          : "bg-[#00ADFF] opacity-60 cursor-not-allowed"
                                      } text-xs font-semibold px-3 py-1 rounded-md text-white`}
                                      disabled={!game?.isChecked}
                                      onClick={() => {
                                        saveSingleGame(game, gameStatus);
                                      }}
                                    >
                                      Save
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4 p-4 pt-0">
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
                    saveAllGamesLoader ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={saveAllGamesLoader} // Pass the actual state value
                  onClick={() => {
                    saveAllGames();
                  }} // Replace with your actual function
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <ImportUpdateTimeModal
            isOpenWel={isOpenWel}
            onClose={handleCloseWel}
            selectedValue={selectedValue}
            handleRadioChange={handleRadioChange}
            handleClickContinueUpdate={handleClickContinueUpdate}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}

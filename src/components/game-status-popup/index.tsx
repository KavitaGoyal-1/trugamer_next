import { useDispatch, useSelector } from "react-redux";
import Modal from "../modal";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import DeviceIcon from "../../../public/icons/device.svg";
import MacIcon from "../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../public/icons/androidgrey.svg";
import PCIcon from "../../../public/icons/window.svg";
import XboxIcon from "../../../public/icons/xport.svg";
import PlaystationIcon from "../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../public/icons/switch.svg";
import { format } from "date-fns";
import { toggleVisibility } from "@/store/slices/game-hours";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { selectAuthState, signIn, status } from "@/store/slices/auth-slice";
import Image from "next/image";

interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  setSelectedGameRelease?: React.Dispatch<React.SetStateAction<any>>;
  setSelectedRelatedGame?: React.Dispatch<React.SetStateAction<any>>;
  selectedRelatedGame?: any;
  nonLoggedUser?: boolean;
  visible?: boolean;
  selectedGame?: any;
  selectedGameRelease?: any;
  clickBeatGameStatus?: boolean;
  getPlayedAndQueuedCount?: any;
  handlePlayedHoursUpdate?: any;
  slug?: any;
  showMoadl?: boolean;
  deviceData?: any;
  selectedDevices?: any;
  handleDeviceClick?: any;
  progressData?: any;
  beatStatus?: any;
  setBeatStatus?: any;
  hoursPlayed?: any;
  setHoursPlayed?: number;
  handleEditClick?: any;
  handleSubmitProgressFromGameStatus?: any;
}
interface DeviceStatus {
  beatStatus: string;
  hoursPlayed: number;
}
interface DeviceStatuses {
  [deviceId: number]: DeviceStatus;
}

const GameStatusPopup = ({
  visible,
  setVisible,
  selectedGame,
  nonLoggedUser,
  selectedRelatedGame,
  clickBeatGameStatus,
  selectedGameRelease,
  deviceData,
  selectedDevices,
  handleDeviceClick,
  progressData,
  beatStatus,
  handleSubmitProgressFromGameStatus,
  hoursPlayed,
  slug,
  handlePlayedHoursUpdate,
}: IProps) => {
  const [userDataApi, setUserDataApi] = useState<any>();
  const [playingNowStatus, setPlayingNowStatus] = useState("");
  const [playingNextStatus, setPlayingNextStatus] = useState("");
  const [shelvedGameStatus, setShelvedGameStatus] = useState("");
  const [beatGameStatus, setBeatGameStatus] = useState("");
  const [gameLibraryStatus, setGameLibraryStatus] = useState("");
  const [selecteddevice1, setselecteddevice1] = useState<any>([]);
  const [playedHours, setPlayedHours] = useState(0);
  const [isPlayingNow, setIsPlayingNow] = useState<boolean>(false);
  const [isPlayingNext, setIsPlayingNext] = useState<boolean>(false);
  const [isShelved, setIsShelved] = useState<boolean>(false);
  const [isQueued, setIsQueued] = useState<boolean>(false);
  const token = getToken();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isGameDetail = pathname.includes("game");
  const isGameLibrary = pathname.includes("game-library");
  const isDashboardPage = pathname.includes("dashboard");
  const isLandingPage = pathname.includes("/");
  const isNewsDetail = pathname.includes("news");
  const { userData } = useSelector(selectAuthState);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatuses>({});
  const [initialDeviceStatuses, setInitialDeviceStatuses] = useState<any>({});
  const getUserData = async () => {
    const { data } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserDataApi(data);
    if (data?.played_hour?.length > 0) {
      const tempGame = data?.played_hour?.find(
        (playedHour: any) => playedHour?.game?.id === selectedGame?.id
      );
      if (tempGame) {
        setPlayedHours(tempGame?.hours);
      }
    }
    let payload = {
      userData: {
        playingNow: data?.playingNow,
        playingNext: data?.playingNext,
        beaten_games: data?.beaten_games,
        played_hour: data?.played_hour,
        gamesLibrary: data?.gamesLibrary,
      },
    };
    dispatch(status(payload));
    let userPayload = {
      userData: data,
      checking: false,
      hRemember: false,
    };
    dispatch(signIn(userPayload));
  };

  useEffect(() => {
    if (userDataApi) {
      if (userDataApi?.played_hour?.length > 0) {
        const tempGame = userDataApi?.played_hour?.find(
          (playedHour: any) => playedHour?.game?.id === selectedGame?.id
        );
        if (tempGame) {
          setPlayedHours(tempGame.hours);
        } else {
          setPlayedHours(0);
        }
      }
    }
  }, [selectedGame, selectedRelatedGame]);
  const checkLibrary = async () => {
    if (
      (userData.id && selectedGame) ||
      (userData.id && selectedGameRelease) ||
      (userData.id && selectedRelatedGame)
    ) {
      let foundGame = false;
      userData?.gamesLibrary?.map((library: any) => {
        if (
          library?.game?.id === selectedGame?.game?.id ||
          library?.game?.id === selectedGameRelease?.game?.id ||
          library?.game?.id === selectedGameRelease?.id ||
          library?.game?.id === selectedRelatedGame?.id
        ) {
          foundGame = true;
          setGameLibraryStatus("library");
        }
      });
    }
  };
  const addedIds = useRef(new Set<number>());

  const checkStatus = async () => {
    if (
      (userData?.id && selectedGame) ||
      (userData?.id && selectedGameRelease) ||
      (userData?.id && selectedRelatedGame)
    ) {
      userData?.playingNow?.map((now: any) => {
        if (
          isGameDetail ||
          isDashboardPage ||
          isGameLibrary ||
          isNewsDetail ||
          isLandingPage
        ) {
          if (
            now?.game?.id === selectedGame?.game?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setPlayingNowStatus("playing-now");
            setShelvedGameStatus("");
            setPlayingNextStatus("");
          } else {
            selectedGame?.game?.attributes?.releaseByPlatforms?.release?.forEach(
              (release: any) => {
                const { id, attributes } = release.device.data;
                if (!addedIds.current.has(id)) {
                  addedIds.current.add(id);
                  setselecteddevice1((prevState: any) => [
                    ...prevState,
                    release.device.data,
                  ]);
                }
              }
            );
          }
        } else {
          if (now.id === selectedGame.id) {
            setPlayingNowStatus("playing-now");
            setShelvedGameStatus("");
            setPlayingNextStatus("");
          }
        }
      });
      userData.playingNext?.map((now: any) => {
        if (
          isGameDetail ||
          isDashboardPage ||
          isGameLibrary ||
          isNewsDetail ||
          isLandingPage
        ) {
          if (
            now?.game?.id === selectedGame?.game?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setPlayingNextStatus("playing-next");
            setPlayingNowStatus("");
            setShelvedGameStatus("");
          } else {
            selectedGame?.game?.attributes?.releaseByPlatforms?.release?.forEach(
              (release: any) => {
                const { id, attributes } = release.device.data;
                if (!addedIds.current.has(id)) {
                  addedIds.current.add(id);
                  setselecteddevice1((prevState: any) => [
                    ...prevState,
                    release.device.data,
                  ]);
                }
              }
            );
          }
        } else {
          if (now?.id === selectedGame?.id) {
            setPlayingNextStatus("playing-next");
            setPlayingNowStatus("");
            setShelvedGameStatus("");
          }
        }
      });
      userData.beaten_games?.map((now: any) => {
        if (
          isGameDetail ||
          isDashboardPage ||
          isGameLibrary ||
          isNewsDetail ||
          isLandingPage
        ) {
          if (
            now?.game?.id === selectedGame?.game?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setBeatGameStatus("beat-game");
          } else {
            selectedGame?.game?.attributes?.releaseByPlatforms?.release?.forEach(
              (release: any) => {
                const { id, attributes } = release.device.data;
                if (!addedIds.current.has(id)) {
                  addedIds.current.add(id);
                  setselecteddevice1((prevState: any) => [
                    ...prevState,
                    release.device.data,
                  ]);
                }
              }
            );
          }
        } else {
          if (now?.game?.id === selectedGame?.game?.id) {
            setBeatGameStatus("beat-game");
          }
        }
      });
      userData?.shelvedGames?.map((now: any) => {
        if (
          isGameDetail ||
          isDashboardPage ||
          isGameLibrary ||
          isNewsDetail ||
          isLandingPage
        ) {
          if (
            now?.game?.id === selectedGame?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setShelvedGameStatus("shelved-game");
            setPlayingNowStatus("");
            setPlayingNextStatus("");
          } else {
            selectedGame?.game?.attributes?.releaseByPlatforms?.release?.forEach(
              (release: any) => {
                const { id, attributes } = release.device.data;
                if (!addedIds.current.has(id)) {
                  addedIds.current.add(id);
                  setselecteddevice1((prevState: any) => [
                    ...prevState,
                    release.device.data,
                  ]);
                }
              }
            );
          }
        } else {
          if (now?.id === selectedGame?.id) {
            setShelvedGameStatus("shelved-game");
            setPlayingNowStatus("");
            setPlayingNextStatus("");
          }
        }
      });
    }
  };

  const onClose = () => {
    if (setVisible) {
      setVisible(false);
      dispatch(toggleVisibility(false));
      setPlayingNowStatus("");
      setPlayingNextStatus("");
      setBeatGameStatus("");
      setGameLibraryStatus("");
      getUserData();
      setPlayedHours(0);
    }
  };

  const handlePlayingNow = async (deviceUpdate?: string) => {
    setIsPlayingNow(true);
    const selectedId =
      selectedGameRelease?.game?.id ||
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.id ||
      selectedGame?.game?.id;
    const gameId =
      selectedGameRelease?.game?.id ||
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.game?.id ||
      selectedGame?.id;
    const releases =
      (
        selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.game?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: format(item?.releaseDate, "yyyy-MM-dd"),
        device: { id: item.device?.id || item.device?.data?.id },
      })) || [];

    const payload = {
      playingNow: [{ game: { id: gameId }, releases }],
    };

    const postPlayingNow = async () => {
      try {
        const res = await axios.post(
          `${getApi()}/users-permissions/user/playing-now/test`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayingNowStatus("playing-now");
        toastMessage("success", "You're now playing this game");
        getUserData();
        onClose();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
      } finally {
        setIsPlayingNow(false);
      }
    };

    const deletePlayingNow = async () => {
      try {
        await axios.delete(
          `${getApi()}/users-permissions/user/playing-now/remove/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayingNowStatus("");
        toastMessage("success", "Game removed from playing now");
        getUserData();
        onClose();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
      } finally {
        setIsPlayingNow(false);
      }
    };

    const removeRecentlyPlayed = async (recentPlayedId: string) => {
      try {
        await axios.delete(
          `${getApi()}/users-permissions/user/recently-played/remove/${recentPlayedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error: any) {
        console.error("Error removing recently played game:", error);
      }
    };

    const checkRecentlyPlayed = () => {
      const recentPlayedId = userData.recentlyPlayed?.find((now: any) =>
        [
          selectedGame?.game?.title,
          selectedGame?.game?.attributes?.title,
          selectedGame?.title,
          selectedGame?.attributes?.title,
          selectedRelatedGame?.title,
          selectedGameRelease?.game?.title,
          selectedGameRelease?.title,
        ].includes(now?.game?.title)
      )?.id;

      if (recentPlayedId) removeRecentlyPlayed(recentPlayedId);
    };

    if (deviceUpdate) {
      if (!progressData[0]?.attributes?.is_deleted) {
        await postPlayingNow();
      }
    } else if (playingNowStatus === "playing-now") {
      await deletePlayingNow();
    } else {
      if (
        ["playing-next", "shelved-game"].includes(playingNextStatus) ||
        !playingNowStatus
      ) {
        checkRecentlyPlayed();
      }
      // Check if all devices are marked as is_deleted
      const hasEnabledDevice = progressData.some(
        (device: any) => !device.attributes.is_deleted
      );
      if (!hasEnabledDevice) {
        toastMessage(
          "error",
          "To add this game to 'Playing Now' please ensure you own it on one of your devices."
        );
        setIsPlayingNow(false);
        return; // Stop the function if all devices are deleted
      }

      await postPlayingNow();
    }
    setIsPlayingNow(false);
  };

  const handlePlayingNext = async (deviceUpdate?: string) => {
    setIsPlayingNext(true);
    let selectedId = selectedGameRelease
      ? selectedGameRelease.id || selectedGameRelease.game.id
      : selectedRelatedGame
      ? selectedRelatedGame.id
      : selectedGame?.id;
    if (isGameDetail || isGameLibrary) {
      userData.playingNext?.map((now: any) => {
        if (isGameDetail || isGameLibrary) {
          if (
            now?.game?.id === selectedGame?.game?.id ||
            now?.game?.id === selectedGame?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            selectedId = now.id;
          }
        }
      });
    }
    const releases =
      (
        selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.game?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: format(item?.releaseDate, "yyyy-MM-dd"),
        device: {
          id: item.device?.id || item.device?.data?.id,
        },
      })) || [];
    let payload1 = {
      playingNext: [
        {
          game: {
            id: selectedGameRelease
              ? selectedGameRelease?.game?.id || selectedGameRelease?.id
              : selectedRelatedGame
              ? selectedRelatedGame.id
              : selectedGame.game.id || selectedGame.id,
          },
          releases: releases,
        },
      ],
    };
    let payload2 = {
      recentlyPlayed: [
        {
          game: {
            id: selectedGameRelease
              ? selectedGameRelease?.game?.id || selectedGameRelease?.id
              : selectedRelatedGame
              ? selectedRelatedGame?.id
              : selectedGame?.game?.id || selectedGame?.id,
          },
          releases: releases,
        },
      ],
    };
    if (deviceUpdate) {
      let addToRecentPlayed = await axios.post(
        `${getApi()}/users-permissions/user/recently-played`,
        payload2,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      try {
        setIsPlayingNext(true);
        let res = await axios.post(
          `${getApi()}/users-permissions/user/playing-next/test`,
          payload1,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayingNextStatus("playing-next");
        getUserData();
        setIsPlayingNext(false);
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
        setIsPlayingNext(false);
      }
    } else {
      if (playingNextStatus == "playing-next") {
        try {
          setIsPlayingNext(true);
          let res = await axios.delete(
            `${getApi()}/users-permissions/user/playing-next/remove/${selectedId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setPlayingNextStatus("");
          toastMessage("success", "Game removed from playing next");
          getUserData();
          setIsPlayingNext(false);
          onClose();
        } catch (error: any) {
          toastMessage("error", error.response.data.error.message);
          setIsPlayingNext(false);
        }
      } else {
        if (playingNowStatus == "playing-now") {
          let addToRecentPlayed = await axios.post(
            `${getApi()}/users-permissions/user/recently-played`,
            payload2,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        try {
          setIsPlayingNext(true);

          let res = await axios.post(
            `${getApi()}/users-permissions/user/playing-next/test`,
            payload1,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setPlayingNextStatus("playing-next");
          toastMessage("success", "Successfully added to playing next");
          getUserData();
          setIsPlayingNext(false);
          onClose();
        } catch (error: any) {
          toastMessage("error", error.response.data.error.message);
          setIsPlayingNext(false);
        }
      }
    }
  };

  const handleShelvedGame = async (deviceUpdate?: string) => {
    const selectedId =
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.id ||
      selectedGameRelease?.game?.id;

    const gameId =
      selectedGameRelease?.game?.id ||
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.game?.id ||
      selectedGame?.id;

    const releases =
      (
        selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.game?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: format(item?.releaseDate, "yyyy-MM-dd"),
        device: { id: item.device?.id || item.device?.data?.id },
      })) || [];

    const payload1 = {
      shelvedGames: [{ game: { id: gameId }, releases }],
    };

    const payload2 = {
      recentlyPlayed: [{ game: { id: gameId }, releases }],
    };

    const addToRecentlyPlayed = async () => {
      try {
        await axios.post(
          `${getApi()}/users-permissions/user/recently-played`,
          payload2,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error: any) {
        console.error("Error adding to recently played:", error);
      }
    };

    if (deviceUpdate) {
      await addToRecentlyPlayed();
      if (!progressData[0]?.attributes?.is_deleted) {
        await addToShelvedGames(payload1);
      }
    } else {
      const hasEnabledDevice = progressData?.some(
        (device: any) => device?.attributes?.is_deleted === false
      );

      if (!hasEnabledDevice) {
        toastMessage(
          "error",
          "To add this game to 'Shelved' please ensure you own it on one of your devices."
        );
        setIsPlayingNow(false);
        return;
      }

      if (shelvedGameStatus === "shelved-game") {
        await removeShelvedGame();
      } else {
        if (playingNowStatus === "playing-now") {
          await addToRecentlyPlayed();
        }
        await addToShelvedGames(payload1);
      }
    }

    setIsShelved(false);
  };
  // Function to add game to Shelved Games
  const addToShelvedGames = async (payload: any) => {
    try {
      await axios.post(
        `${getApi()}/users-permissions/user/shelved-games/test`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShelvedGameStatus("shelved-game");
      toastMessage("success", "Successfully added to shelved games");
      getUserData();
      onClose();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  // Function to remove game from Shelved Games
  const removeShelvedGame = async () => {
    try {
      await axios.delete(
        `${getApi()}/users-permissions/user/shelved-games/remove/${
          selectedGame.game.id || selectedGame.id
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShelvedGameStatus("");
      toastMessage("success", "Game removed from Shelved.");
      getUserData();
      onClose();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  useEffect(() => {
    if (token !== undefined) {
      getUserData();
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (visible) {
        await checkStatus();
        await checkLibrary();
        if (progressData) {
          await handleLibraryAndBeat(progressData);
        }
      }
    };

    fetchData();
  }, [visible, progressData]);

  const handleLibraryAndBeat = async (progressData: any[]) => {
    const hasActiveProgress =
      progressData &&
      progressData.length > 0 &&
      progressData.some((item: any) => !item.attributes.is_deleted);

    const allDeleted =
      progressData &&
      progressData.length > 0 &&
      progressData.every((item: any) => item.attributes.is_deleted);

    const isInLibrary = userData?.gamesLibrary?.some((library: any) => {
      return (
        library?.game?.id === selectedGame?.game?.id ||
        library?.game?.id === selectedGame?.id ||
        library?.game?.id === selectedGameRelease?.game?.id ||
        library?.game?.id === selectedGameRelease?.id ||
        library?.game?.id === selectedRelatedGame?.id
      );
    });

    console.log(hasActiveProgress, isInLibrary, visible, "hasActiveProgress");
    if (hasActiveProgress && !isInLibrary) {
      await addGameLibrary();
    }

    if (allDeleted && isInLibrary) {
      await removeGameLibrary();
    }

    // Filter progressData to only include non-deleted entries
    const activeProgressData =
      progressData &&
      progressData.length > 0 &&
      progressData.filter((item) => !item.attributes.is_deleted);
    // Check if all beat statuses are "Never Beat" among non-deleted items
    const allNeverBeat =
      activeProgressData &&
      activeProgressData.every(
        (item) => item.attributes.beat_status === "Never Beat"
      );
    const gameInBeatenGames = userData.beaten_games?.some((now: any) => {
      return (
        now?.game?.id === selectedGame?.game?.id ||
        now?.game?.id === selectedGame?.id ||
        now?.game?.id === selectedGameRelease?.game?.id ||
        now?.game?.id === selectedGameRelease?.id ||
        now?.game?.id === selectedRelatedGame?.id
      );
    });

    // Check if at least one beat status is not "Never Beat" among non-deleted items
    const hasBeatenStatus =
      activeProgressData &&
      activeProgressData.some(
        (item) => item.attributes.beat_status !== "Never Beat"
      );
    if (hasBeatenStatus && !gameInBeatenGames) {
      await addBeatGame();
    }

    if (allNeverBeat && gameInBeatenGames) {
      await removeBeatGame();
    }
  };

  const addGameLibrary = async () => {
    let selectedId = selectedGameRelease
      ? selectedGameRelease.id || selectedGameRelease.game.id
      : selectedRelatedGame
      ? selectedRelatedGame.id
      : selectedGame?.id;

    if (isGameDetail || isGameLibrary || isDashboardPage || isLandingPage) {
      userData?.gamesLibrary?.map((library: any) => {
        if (
          library?.game?.id === selectedGame?.game?.id ||
          library?.game?.id === selectedGame?.id ||
          library?.game?.id === selectedGameRelease?.game?.id ||
          library?.game?.id === selectedGameRelease?.id ||
          library?.game?.id === selectedRelatedGame?.id
        ) {
          selectedId = library.id;
        }
      });
    }

    const releases =
      (
        selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.game?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: format(item?.releaseDate, "yyyy-MM-dd"),
        device: {
          id: item?.device?.id || item?.device?.data?.id,
        },
      })) || [];
    let payload = {
      gamelibrary: [
        {
          game: {
            id: selectedGameRelease
              ? selectedGameRelease?.game?.id || selectedGameRelease?.id
              : selectedRelatedGame
              ? selectedRelatedGame.id
              : selectedGame?.game?.id || selectedGame?.id,
          },
          releases: releases,
        },
      ],
    };

    try {
      console.log(releases, "releases::");
      window.setTimeout(async () => {
        let apiRes = await axios.post(
          `${getApi()}/users-permissions/user/library/add`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGameLibraryStatus("library");
        getUserData();
      }, 50);
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  const removeGameLibrary = async () => {
    let selectedId = selectedGameRelease
      ? selectedGameRelease.id || selectedGameRelease?.game?.id
      : selectedRelatedGame
      ? selectedRelatedGame.id
      : selectedGame?.id;

    if (isGameDetail || isGameLibrary || isDashboardPage || isLandingPage) {
      userData?.gamesLibrary?.map((library: any) => {
        if (
          library?.game?.id === selectedGame?.game?.id ||
          library?.game?.id === selectedGame?.id ||
          library?.game?.id === selectedGameRelease?.game?.id ||
          library?.game?.id === selectedGameRelease?.id ||
          library?.game?.id === selectedRelatedGame?.id
        ) {
          selectedId = library.id;
        }
      });
    }

    if (gameLibraryStatus == "library") {
      try {
        let apiRes = await axios.delete(
          `${getApi()}/users-permissions/user/library/remove/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGameLibraryStatus("");
        getUserData();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
      }
    }
  };

  const addBeatGame = async () => {
    const releases =
      (
        selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.game?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: item?.releaseDate,
        device: {
          id: item?.device?.id || item?.device?.data?.id,
        },
      })) || [];
    const payload = {
      game_id: {
        id: selectedGameRelease
          ? selectedGameRelease.game.id || selectedGameRelease.id
          : selectedRelatedGame
          ? selectedRelatedGame.id
          : selectedGame?.game?.id || selectedGame?.id,
      },
      releases: releases,
    };
    try {
      const res = await axios.post(
        `${getApi()}/users-permissions/user/beat-game`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getUserData();
      setBeatGameStatus("beat-game");
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  const removeBeatGame = async () => {
    let selectedId = selectedGameRelease
      ? selectedGameRelease.game.id || selectedGameRelease.id
      : selectedRelatedGame
      ? selectedRelatedGame.id
      : selectedGame?.game?.id || selectedGame?.id;
    try {
      let res = await axios.delete(
        `${getApi()}/users-permissions/user/beat-game/remove/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBeatGameStatus("");
      getUserData();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  const playingNow = userDataApi && userDataApi?.playingNow?.length;

  let availableDevices = selectedGameRelease
    ? selectedGameRelease?.game?.attributes?.devices?.data[0] ||
      (selectedGameRelease?.attributes?.devices?.data[0] &&
        (
          selectedGameRelease?.game?.attributes?.devices?.data ||
          selectedGameRelease?.attributes?.devices?.data
        )?.map((device: any) => ({
          id: device?.id,
          ...device?.attributes,
        })))
    : selectedRelatedGame?.attributes?.devices.length > 0
    ? selectedRelatedGame?.attributes?.devices[0] &&
      selectedRelatedGame?.attributes?.devices?.map((device: any) => ({
        id: device?.id,
        ...device?.attributes,
      }))
    : selectedRelatedGame?.attributes?.devices?.data.length > 0
    ? selectedRelatedGame?.attributes?.devices?.data[0] &&
      selectedRelatedGame?.attributes?.devices?.data?.map((device: any) => ({
        id: device?.id,
        ...device?.attributes,
      }))
    : selectedGame?.game?.devices || selectedGame?.devices
    ? selectedGame?.game?.devices
    : selectedGame?.devices;

  if (isGameDetail || isGameLibrary || isLandingPage) {
    availableDevices = selectedGame
      ? selectedGame?.game?.attributes?.devices?.data[0] ||
        (selectedGame?.attributes?.devices?.data[0] &&
          (
            selectedGame?.game?.attributes?.devices?.data ||
            selectedGame?.attributes?.devices?.data
          )?.map((device: any) => ({
            id: device?.id,
            ...device?.attributes,
          })))
      : selectedRelatedGame?.attributes?.devices.length > 0
      ? selectedRelatedGame?.attributes?.devices[0] &&
        selectedRelatedGame?.attributes?.devices?.map((device: any) => ({
          id: device?.id,
          ...device?.attributes,
        }))
      : selectedRelatedGame?.attributes?.devices?.data.length > 0
      ? selectedRelatedGame?.attributes?.devices?.data[0] &&
        selectedRelatedGame?.attributes?.devices?.data?.map((device: any) => ({
          id: device?.id,
          ...device?.attributes,
        }))
      : "";
  }

  if (isDashboardPage || isGameLibrary || isLandingPage) {
    availableDevices = selectedGameRelease
      ? selectedGameRelease?.game?.attributes?.devices?.data[0] ||
        (selectedGameRelease?.attributes?.devices?.data[0] &&
          (
            selectedGameRelease?.game?.attributes?.devices?.data ||
            selectedGameRelease?.attributes?.devices?.data
          )?.map((device: any) => ({
            id: device?.id,
            ...device?.attributes,
          })))
      : selectedRelatedGame?.attributes?.devices.length > 0
      ? selectedRelatedGame?.attributes?.devices[0] &&
        selectedRelatedGame?.attributes?.devices?.map((device: any) => ({
          id: device?.id,
          ...device?.attributes,
        }))
      : selectedRelatedGame?.attributes?.devices?.data.length > 0
      ? selectedRelatedGame?.attributes?.devices?.data[0] &&
        selectedRelatedGame?.attributes?.devices?.data?.map((device: any) => ({
          id: device?.id,
          ...device?.attributes,
        }))
      : selectedGame &&
        ((selectedGame?.game &&
          selectedGame?.game?.attributes &&
          selectedGame?.game?.attributes.devices &&
          selectedGame?.game?.attributes.devices.data) ||
          (selectedGame &&
            selectedGame?.attributes &&
            selectedGame?.attributes.devices &&
            selectedGame?.attributes.devices.data))
      ? selectedGame?.game?.attributes.devices.data ||
        selectedGame?.attributes.devices.data
      : (selectedGame?.game?.devices && selectedGame?.game?.devices[0]) ||
        (selectedGame?.devices &&
          selectedGame?.devices[0] &&
          selectedGame?.game?.devices) ||
        selectedGame?.devices;
  }
  const playingNext = userDataApi && userDataApi.playingNext?.length;
  const beatGames = userDataApi && userDataApi?.beaten_games?.length;
  const gameLibrary = userDataApi && userDataApi?.gamesLibrary?.length;
  const shelvedGame = userDataApi && userDataApi?.shelvedGames?.length;
  useEffect(() => {
    if (visible) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);

  const handleNotQueuedGame = async () => {
    console.log("handleNotQueued");
    if (playingNowStatus === "playing-now") {
      // Function to find the matching game in playingNow
      function findGameInPlayingNow(gameTitle: any, playingNow: any) {
        return playingNow.find((item: any) => item.game.title === gameTitle);
      }
      let selectedId;
      if (selectedGameRelease) {
        const matchingGame = findGameInPlayingNow(
          selectedGameRelease?.game?.title || selectedGameRelease?.title
            ? selectedGameRelease?.game?.title || selectedGameRelease?.title
            : selectedGameRelease?.game?.attributes?.title ||
              selectedGameRelease?.attributes?.title
            ? selectedGameRelease?.game?.attributes?.title ||
              selectedGameRelease?.attributes?.title
            : "",
          userData.playingNow
        );
        console.log(matchingGame, "matchingGame");
        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (!selectedId && selectedRelatedGame) {
        const matchingGame = findGameInPlayingNow(
          selectedRelatedGame.title,
          userData.playingNow
        );
        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (!selectedId && selectedGame) {
        const matchingGame = findGameInPlayingNow(
          selectedGame.game.title || selectedGame.title,
          userData.playingNow
        );

        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (isGameDetail || isGameLibrary || isLandingPage) {
        userData.playingNow?.map((now: any) => {
          if (isGameDetail || isGameLibrary || isLandingPage) {
            if (
              now?.game?.id === selectedGame?.game?.id ||
              now?.game?.id === selectedGame?.id ||
              now?.game?.id === selectedRelatedGame?.id
            ) {
              selectedId = now.id;
            }
          }
        });
      }
      try {
        setIsQueued(true);
        const releases =
          (
            selectedGame?.game?.attributes?.releaseByPlatforms?.release ||
            selectedGame?.game?.releaseByPlatforms?.release ||
            selectedGame?.attributes?.releaseByPlatforms?.release ||
            selectedGame?.releaseByPlatforms?.release ||
            selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
            selectedRelatedGame?.game?.releaseByPlatforms?.release
          )?.map((item: any) => ({
            releaseDate: item.releaseDate,
            device: {
              id: item.device?.id || item.device?.data?.id || item?.id,
            },
          })) || [];
        console.log(
          releases,
          "releasessssss",
          selectedGameRelease,
          selectedRelatedGame,
          selectedGame
        );
        let payload2 = {
          recentlyPlayed: [
            {
              game: {
                id: selectedGameRelease
                  ? selectedGameRelease?.game?.id || selectedGameRelease?.id
                  : selectedRelatedGame
                  ? selectedRelatedGame?.id
                  : selectedGame?.game?.id || selectedGame?.id,
              },
              releases: releases,
            },
          ],
        };
        console.log(payload2, "payload2");
        let addToRecentPlayed = await axios.post(
          `${getApi()}/users-permissions/user/recently-played`,
          payload2,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let res = await axios.delete(
          `${getApi()}/users-permissions/user/playing-now/remove/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayingNowStatus("");
        toastMessage("success", "Game removed from playing now");
        getUserData();
        setIsQueued(false);
        onClose();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
        setIsQueued(false);
      }
    }
    if (playingNextStatus == "playing-next") {
      // Function to find the matching game in playingNext
      function findGameInPlayingNext(gameTitle: any, playingNext: any) {
        return playingNext.find((item: any) => item.game.title === gameTitle);
      }
      let selectedId;
      if (selectedGameRelease) {
        const matchingGame = findGameInPlayingNext(
          selectedGameRelease?.game?.title || selectedGameRelease?.title,
          userData.playingNext
        );
        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (!selectedId && selectedRelatedGame) {
        const matchingGame = findGameInPlayingNext(
          selectedRelatedGame.title,
          userData.playingNext
        );
        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (!selectedId && selectedGame) {
        const matchingGame = findGameInPlayingNext(
          selectedGame.game.title || selectedGame.title,
          userData.playingNext
        );
        if (matchingGame) {
          selectedId = matchingGame.id;
        }
      }
      if (isGameDetail || isGameLibrary || isLandingPage) {
        userData.playingNext?.map((now: any) => {
          if (isGameDetail || isGameLibrary || isLandingPage) {
            if (
              now?.game?.id === selectedGame?.game?.id ||
              now?.game?.id === selectedGame?.id ||
              now?.game?.id === selectedRelatedGame?.id
            ) {
              selectedId = now.id;
            }
          }
        });
      }
      try {
        setIsQueued(true);
        let res = await axios.delete(
          `${getApi()}/users-permissions/user/playing-next/remove/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlayingNextStatus("");
        toastMessage("success", "Game removed from playing next");
        getUserData();
        setIsQueued(false);
        onClose();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
        setIsQueued(false);
      }
    }
    if (shelvedGameStatus == "shelved-game") {
      try {
        setIsQueued(true);
        function findGameInShelvedGames(gameTitle: any, shelvedGames: any) {
          return shelvedGames.find(
            (item: any) => item.game.title === gameTitle
          );
        }
        let selectedId;
        if (selectedGameRelease) {
          const matchingGame = findGameInShelvedGames(
            selectedGameRelease?.game?.title || selectedGameRelease?.title
              ? selectedGameRelease?.game?.title || selectedGameRelease?.title
              : selectedGameRelease?.game?.attributes?.title ||
                selectedGameRelease?.attributes?.title
              ? selectedGameRelease?.game?.attributes?.title ||
                selectedGameRelease?.attributes?.title
              : "",
            userData.shelvedGames
          );
          if (matchingGame) {
            selectedId = matchingGame.game.id;
          }
        }
        if (!selectedId && selectedRelatedGame) {
          const matchingGame = findGameInShelvedGames(
            selectedRelatedGame.title,
            userData.shelvedGames
          );
          if (matchingGame) {
            selectedId = matchingGame.game.id;
          }
        }
        if (!selectedId && selectedGame) {
          const matchingGame = findGameInShelvedGames(
            selectedGame.game.title || selectedGame.title,
            userData.shelvedGames
          );
          if (matchingGame) {
            selectedId = matchingGame.game.id;
          }
        }
        if (isGameDetail || isGameLibrary || isLandingPage) {
          userData.shelvedGames?.map((now: any) => {
            if (isGameDetail || isGameLibrary || isLandingPage) {
              if (
                now?.game?.id === selectedGame?.game?.id ||
                now?.game?.id === selectedGame?.id ||
                now?.game?.id === selectedRelatedGame?.id
              ) {
                selectedId = now.game.id ? now.game.id : now.id;
              }
            }
          });
        }
        let res = await axios.delete(
          `${getApi()}/users-permissions/user/shelved-games/remove/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShelvedGameStatus("");
        toastMessage("success", "Game removed from Shelved.");
        getUserData();
        setIsQueued(false);
        onClose();
      } catch (error: any) {
        toastMessage("error", error.response.data.error.message);
        setIsQueued(false);
      }
    }
  };

  const handleBeatStatusChange = (deviceId?: any, value?: any) => {
    setDeviceStatuses((prev) => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        beatStatus: value,
      },
    }));
  };

  const handleHoursChange2 = (deviceId?: any, value?: any) => {
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10000)) {
      setDeviceStatuses((prev) => ({
        ...prev,
        [deviceId]: {
          ...prev[deviceId],
          hoursPlayed: value ? value : 0,
        },
      }));
    } else {
      toastMessage("error", "Played hours should be less than equal to 10,000");
    }
  };
  // console.log(deviceStatuses, "deviceStatuses");

  const handleClickSave = async (device: any) => {
    const updateDeviceId = progressData.find(
      (progress: any) =>
        progress.attributes.device_name === device.attributes?.name
    );
    if (device?.id) {
      const { beatStatus, hoursPlayed } = deviceStatuses[device?.id];
      await handleSubmitProgressFromGameStatus(
        updateDeviceId?.id,
        beatStatus,
        hoursPlayed
      );
      setShowDetails((prev) => ({
        ...prev,
        [device.id]: false,
      }));
    } else {
      const { beatStatus, hoursPlayed } =
        deviceStatuses[device?.attributes?.id];
      await handleSubmitProgressFromGameStatus(
        updateDeviceId?.id,
        beatStatus,
        hoursPlayed
      );
      setShowDetails((prev) => ({
        ...prev,
        [device.attributes.id]: false,
      }));
    }
    await handlePlayedHoursUpdate(slug as string);
  };

  const clickEditIcon = (data: any) => {
    const updateDeviceId = progressData.find(
      (progress: any) =>
        progress?.attributes?.device_name === data?.attributes?.name
    );
    setDeviceStatuses((prev) => ({
      [data?.id || data?.attributes?.id]: {
        beatStatus: updateDeviceId?.attributes?.beat_status,
        hoursPlayed: updateDeviceId?.attributes?.hours_played || 0,
      },
    }));
  };

  const checkValidations = (
    selectedDevices: any[],
    playingNowStatus: string,
    shelvedGameStatus: string
  ) => {
    const requiresEnabledDevice = playingNowStatus || shelvedGameStatus;

    if (requiresEnabledDevice) {
      const enabledDevices = selectedDevices.filter(
        (device: any) => !device?.is_deleted
      );

      // If there’s only one enabled device and the user is trying to disable it, prevent this action
      if (enabledDevices?.length <= 1) {
        let errorMessage = playingNowStatus
          ? "You can't disown the device while it’s in your 'Playing Now' queue."
          : "You can't disown the device until it is in your shelved queue";
        toastMessage("error", errorMessage);
        return false;
      }
    }
    return true;
  };

  const handleClickSwitchWhenOff = async (device: any) => {
    const newSelectedDevices = selectedDevices.map((d: any) =>
      d.deviceId === device.deviceId ? { ...d, is_deleted: true } : d
    );

    const updateDeviceId =
      progressData &&
      progressData?.length > 0 &&
      progressData.find(
        (progress: any) =>
          progress.attributes.device_name === device.attributes?.name
      );
    setDeviceStatuses((prev) => ({
      [device?.id || device?.attributes?.id]: {
        beatStatus: updateDeviceId?.attributes?.beat_status,
        hoursPlayed: updateDeviceId?.attributes?.hours_played || 0,
      },
    }));

    await handleDeviceClick(device);

    if (playingNowStatus) {
      await handlePlayingNow("deviceupdate");
    }
    if (playingNextStatus) {
      await handlePlayingNext("deviceupdate");
    }
    if (shelvedGameStatus) {
      await handleShelvedGame("deviceupdate");
    }

    setShowDetails((prev) => ({
      ...prev,
      [device?.id || device?.attributes?.id]: true,
    }));
  };

  const handleClickSwitch = async (device: any) => {
    if (
      !checkValidations(selectedDevices, playingNowStatus, shelvedGameStatus)
    ) {
      return;
    }

    await handleDeviceClick(device);

    if (playingNowStatus) {
      await handlePlayingNow("deviceupdate");
    }
    if (playingNextStatus) {
      await handlePlayingNext("deviceupdate");
    }
    if (shelvedGameStatus) {
      await handleShelvedGame("deviceupdate");
    }
    if (device?.id) {
      setShowDetails((prev) => ({
        ...prev,
        [device?.id]: !prev[device?.id],
      }));
    } else {
      setShowDetails((prev) => ({
        ...prev,
        [device?.attributes?.id]: !prev[device?.attributes?.id],
      }));
    }
  };

  return (
    <>
      <Modal show={visible} setShow={setVisible} isOverFlow={false}>
        <button
          className="fixed top-[-10px] right-[-10px] text-white font-bold text-lg z-[9999] cursor-pointer"
          onClick={onClose}
        >
          <Image
            src="/home/close.svg"
            alt="close icon"
            width={30}
            height={40}
          />
        </button>
        <div className="max-h-[70vh] overflow-auto mt-5  bg-[#1A2947] w-[315px] sm:w-[480px] pb-6 flex flex-col justify-between items-center z-50 transform transition-all">
          <div className="w-[92%] mt-0">
            <div className="flex justify-between py-3 pb-1">
              <div>
                <p className="text-[18px] font-[600]">Change Play Status</p>
              </div>
            </div>
            {!clickBeatGameStatus && (
              <>
                {/*Plaing Now */}
                <div className="flex gap-0 sm:gap-3 flex-col sm:flex-row">
                  <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex  gap-3 w-[100%] items-center">
                        <div
                          className={`rounded-full h-[32px] w-[32px] min-w-[32px] flex justify-center items-center ${
                            playingNowStatus === "playing-now"
                              ? "bg-cBlue-light"
                              : "bg-[#59618466]"
                          }`}
                        >
                          <Image
                            alt="more"
                            src="/game-status/play.png"
                            width={20}
                            height={30}
                          />
                        </div>
                        <div className="mr-0 leading-3">
                          <p className="text-[14px] font-medium leading-5 text-white">
                            Playing Now{" "}
                          </p>
                          <span className="text-[#98A2B3D9] font-[400] text-sm">
                            {playingNow ? `${playingNow} Games` : `0 Games`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 disabledRadio justify-end pr-0 cu">
                        <input
                          checked={
                            playingNowStatus === "playing-now" ? true : false
                          }
                          type="radio"
                          className="w-4 h-4  custom-radio"
                          onChange={() => {
                            handlePlayingNow();
                          }}
                          disabled={nonLoggedUser ? true : isPlayingNow}
                        />
                        <span></span>
                      </div>
                    </div>
                  </div>

                  {/*Playing Next */}
                  <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex  gap-3 w-[100%] items-center">
                        <div
                          className={`rounded-full h-[32px] w-[32px] min-w-[32px]  flex justify-center items-center ${
                            playingNextStatus === "playing-next"
                              ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                              : "bg-[#59618466]"
                          }`}
                        >
                          <Image
                            alt="more"
                            // title="more"
                            className="w-[18px] h-auto"
                            src="/game-status/forward.png"
                            width={20}
                            height={30}
                          />
                        </div>
                        <div className="mr-0 leading-3">
                          <p className="text-sm font-medium text-white">
                            Playing Next{" "}
                          </p>
                          <span className="text-[#98A2B3D9] font-normal text-sm">
                            {playingNext ? `${playingNext} Games ` : `0 Games`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 disabledRadio justify-end pr-0">
                        <input
                          checked={
                            playingNextStatus === "playing-next" ? true : false
                          }
                          type="radio"
                          className="w-4 h-4 custom-radio"
                          onChange={() => handlePlayingNext()}
                          disabled={nonLoggedUser ? true : isPlayingNext}
                        />
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-0 sm:gap-3 flex-col sm:flex-row">
                  {/* Not Queued */}
                  <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex  gap-3 w-[100%] items-center">
                        <div
                          className={`rounded-full h-[32px] w-[32px] min-w-[32px] flex justify-center items-center ${
                            !playingNextStatus &&
                            !playingNowStatus &&
                            !shelvedGameStatus
                              ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                              : "bg-[#59618466]"
                          }`}
                        >
                          <Image
                            alt="more"
                            // title="more"
                            src="/game-status/3-layers.png"
                            width={20}
                            height={30}
                          />
                        </div>
                        <div className="mr-0 leading-3">
                          <p className="text-sm font-medium text-white">
                            Not Queued{" "}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 disabledRadio justify-end pr-0">
                        <input
                          checked={
                            !playingNextStatus &&
                            !playingNowStatus &&
                            !shelvedGameStatus
                              ? true
                              : false
                          }
                          type="radio"
                          className="w-4 h-4 custom-radio"
                          onChange={handleNotQueuedGame}
                          disabled={nonLoggedUser ? true : isQueued}
                        />
                        <span></span>
                      </div>
                    </div>
                  </div>

                  {/* Shelved */}
                  <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex  gap-3 w-[100%] items-center">
                        <div
                          className={`rounded-full h-[32px] w-[32px] min-w-[32PX] flex justify-center items-center ${
                            shelvedGameStatus === "shelved-game"
                              ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                              : "bg-[#59618466]"
                          }`}
                        >
                          <Image
                            alt="more"
                            // title="more"
                            className="w-[18px] h-auto"
                            src="/game-status/Clock.svg"
                            width={20}
                            height={30}
                          />
                        </div>
                        <div className="mr-0 leading-3">
                          <p className="text-sm font-medium text-white">
                            Shelved{" "}
                          </p>
                          <span className="text-[#98A2B3D9] font-normal text-sm">
                            {shelvedGame ? `${shelvedGame} Games ` : `0 Games`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 disabledRadio justify-end pr-0">
                        <input
                          checked={
                            shelvedGameStatus === "shelved-game" ? true : false
                          }
                          type="radio"
                          className="w-4 h-4 custom-radio"
                          onChange={() => {
                            nonLoggedUser ? "" : handleShelvedGame();
                          }}
                        />
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="mt-5 mb-2">
              <Image
                alt="more"
                // title="more"
                src="/game-status/linethin.svg"
                width={20}
                height={30}
              />
            </div>
            <div className="flex  gap-0 sm:gap-3 flex-col sm:flex-row">
              <>
                <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex  gap-3 w-[100%] items-center">
                      <div
                        className={`rounded-full h-[32px] w-[32px] min-w-[32px] flex justify-center items-center bg-[#59618466] ${
                          gameLibraryStatus === "library"
                            ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                            : "bg-[#59618466]"
                        }`}
                      >
                        <Image
                          alt="more"
                          // title="more"
                          src="/game-status/3-layers.png"
                          width={20}
                          height={30}
                        />
                      </div>
                      <div className="mr-0 leading-3">
                        <p className="text-sm font-medium text-white">
                          My Library{" "}
                        </p>
                        <span className="text-[#98A2B3D9] text-base font-normal">
                          {gameLibrary ? `${gameLibrary} Games` : `0 Games`}
                        </span>
                      </div>
                    </div>
                    <div className=" mr-[6px] md:mr-0">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            gameLibraryStatus === "library" ? true : false
                          }
                          className="sr-only peer"
                        />
                        <div
                          className="relative w-8 h-4 bg-[#848EA2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
   peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0243EC]"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
              {/*Beat */}
              <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
                <div className="flex justify-between items-center w-full">
                  <div className="flex  gap-3 w-[100%] items-center">
                    <div
                      className={`rounded-full h-[32px] w-[32px] min-w-[32px] flex justify-center items-center ${
                        beatGameStatus == "beat-game"
                          ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                          : "bg-[#59618466]"
                      }`}
                    >
                      <Image
                        alt="more"
                        // title="more"
                        src="/game-status/award.png"
                        width={20}
                        height={30}
                      />
                    </div>
                    <div className="mr-0 leading-3">
                      <p className="text-sm font-medium text-white">Beat </p>
                      <span className="text-[#98A2B3D9] text-base font-normal">
                        {beatGames ? `${beatGames} Games` : `0 Games`}
                      </span>
                    </div>
                  </div>
                  <div className=" mr-[6px] md:mr-0">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={beatGameStatus === "beat-game" ? true : false}
                        className="sr-only peer"
                      />
                      <div
                        className="relative w-8 h-4 bg-[#848EA2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
   peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0243EC]"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 mb-3">
              <Image
                alt="more"
                //  title="more"
                src="/game-status/linethin.svg"
                width={20}
                height={30}
              />
            </div>
            <div className="flex justify-between pb-1">
              <div>
                <p className="text-lg font-semibold">Ownership & Progress</p>
              </div>
            </div>

            {deviceData &&
              deviceData?.data &&
              deviceData?.data?.length > 0 &&
              deviceData?.data?.map((device: any) => {
                const matchingProgress =
                  progressData &&
                  progressData?.length > 0 &&
                  progressData?.find(
                    (progress: any) =>
                      progress?.attributes?.device_name ===
                      device?.attributes?.name
                  );
                const isSelected =
                  selectedDevices &&
                  selectedDevices.some(
                    (d: any) =>
                      d?.deviceName === device?.attributes?.name &&
                      d?.is_deleted == false
                  );
                beatStatus =
                  isSelected && matchingProgress
                    ? matchingProgress?.attributes?.beat_status
                    : "Never Beat";
                hoursPlayed =
                  isSelected && matchingProgress
                    ? matchingProgress?.attributes?.hours_played
                    : 0;

                return (
                  <div
                    key={device?.id}
                    className="p-4 pt-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]"
                  >
                    <div className="w-full flex items-center mt-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-3 w-[85%] items-center">
                          <div className="rounded-full flex justify-center items-center">
                            <Image
                              src={
                                device?.attributes?.name
                                  .toLowerCase()
                                  .includes("pc")
                                  ? PCIcon
                                  : device.attributes?.name
                                      .toLowerCase()
                                      .includes("playstation")
                                  ? PlaystationIcon
                                  : device.attributes?.name
                                      .toLowerCase()
                                      .includes("xbox")
                                  ? XboxIcon
                                  : device.attributes?.name
                                      .toLowerCase()
                                      .includes("switch")
                                  ? SwitchIcon
                                  : device.attributes?.name
                                      .toLowerCase()
                                      .includes("mac")
                                  ? MacIcon
                                  : device.attributes?.name
                                      .toLowerCase()
                                      .includes("android")
                                  ? AndroidIcon
                                  : DeviceIcon
                              }
                              alt={`${device?.attributes?.name} logo`}
                              width={20}
                              height={20}
                              className="h-[32px] w-[32px]"
                            />
                          </div>
                          <div className="mr-0 leading-5">
                            <p className="text-sm font-medium text-white">
                              {device?.attributes?.name}
                            </p>

                            {isSelected &&
                              !showDetails[
                                device?.attributes?.id || device?.id
                              ] && (
                                <div>
                                  <p className="text-[#98A2B3D9] text-sm font-normal">
                                    Beat Status:{" "}
                                    <span className="text-white">
                                      {beatStatus}
                                    </span>
                                  </p>
                                  <p className="text-[#98A2B3D9] text-sm font-normal">
                                    Hours Played:{" "}
                                    <span className="text-white">
                                      {hoursPlayed} hrs
                                    </span>
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                        {/* Checkbox and edit icon */}
                        <div className="mr-[6px] md:mr-0 flex gap-2">
                          {isSelected ? (
                            <>
                              <Image
                                src="/icons/edit.svg"
                                alt="edit icon"
                                className="cursor-pointer"
                                width={20}
                                height={30}
                                onClick={() => {
                                  setShowDetails((prev) => {
                                    const newState = {
                                      // Close all details first
                                      ...Object.keys(prev).reduce(
                                        (acc, key) => ({
                                          ...acc,
                                          [key]: false,
                                        }),
                                        {}
                                      ),
                                      // Toggle the selected device
                                      [device.attributes.id || device.id]:
                                        !prev[
                                          device.attributes.id || device.id
                                        ],
                                    };
                                    return newState;
                                  });
                                  clickEditIcon(device);
                                }}
                              />
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={true}
                                  onChange={() => {
                                    handleClickSwitch(device);
                                  }}
                                  disabled={nonLoggedUser ? true : false}
                                />
                                <div
                                  className="relative w-8 h-4 bg-[#848EA2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0243EC]"
                                ></div>
                              </label>
                            </>
                          ) : (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={false}
                                onChange={() =>
                                  handleClickSwitchWhenOff(device)
                                }
                                disabled={nonLoggedUser ? true : false}
                              />
                              <div
                                className="relative w-8 h-4 bg-[#848EA2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0243EC]"
                              ></div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    {isSelected &&
                      showDetails[device?.attributes?.id || device?.id] && (
                        <div className="mt-2 w-full">
                          <>
                            <label className="text-base font-medium">
                              Beat Status
                            </label>
                            <div className="relative">
                              <MdOutlineKeyboardArrowDown
                                size={26}
                                className="absolute text-[#848EA2] right-2 top-4 pointer-events-none"
                              />
                              <select
                                className="w-full bg-[#FFFFFF] text-[#667085] rounded-lg h-[48px] outline-0 px-4 py-3 mt-1 appearance-none"
                                value={
                                  deviceStatuses[device?.id]?.beatStatus ||
                                  deviceStatuses[device?.attributes?.id]
                                    ?.beatStatus ||
                                  "Never Beat"
                                }
                                onChange={(e) =>
                                  handleBeatStatusChange(
                                    device?.id || device?.attributes?.id,
                                    e?.target?.value
                                  )
                                }
                              >
                                <option value="Never Beat">Never Beat</option>
                                <option value="Main Story">Main Story</option>
                                <option value="Main And Expansions">
                                  Main And Expansions
                                </option>
                                <option value="Completionist">
                                  Completionist
                                </option>
                              </select>
                            </div>

                            <div className="mt-2 w-full">
                              <label className="text-base font-medium">
                                Hours Played
                              </label>
                              <input
                                type="text"
                                placeholder="Add hours"
                                value={
                                  Number(
                                    deviceStatuses[
                                      device?.id
                                        ? device?.id
                                        : device?.attributes?.id
                                    ]?.hoursPlayed
                                  ) > 0
                                    ? +deviceStatuses[
                                        device?.id
                                          ? device?.id
                                          : device?.attributes?.id
                                      ]?.hoursPlayed
                                    : 0
                                }
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  // Allow only digits (no letters or negative signs)
                                  if (/^\d*$/.test(inputValue)) {
                                    const deviceId = device?.id
                                      ? device?.id
                                      : device?.attributes?.id;
                                    handleHoursChange2(deviceId, inputValue);
                                  }
                                }}
                                className="w-full bg-[#FFFFFF] text-[#667085] rounded-lg h-[48px] outline-0 px-4 py-3 mt-1"
                              />
                            </div>

                            <div className="w-full mt-3 mb-2">
                              <button
                                className="min-h-[44px] w-full bg-cBlue-light py-1.5 px-[18px] cursor-pointer text-white text-base font-semibold rounded-[10px] flex justify-center items-center shadow-cShadow-main"
                                onClick={() => handleClickSave(device)}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GameStatusPopup;

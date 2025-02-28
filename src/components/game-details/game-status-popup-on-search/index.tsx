import { useEffect, useRef, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import { useDispatch } from "react-redux";
import DeviceIcon from "../../../../public/icons/device.svg";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
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
  visible?: boolean;
  inSearch?: boolean;
  selectedGame?: any;
  clickBeatGameStatus?: boolean;
  deviceData?: any;
  selectedGameRelease?: any;
  progressData?: any;
  beatStatus?: any;
  setBeatStatus?: any;
  selectedDevices?: any;
  hoursPlayed?: any;
  handleDeviceClick?: any;
  handleSubmitProgressFromGameStatus?: any;
  devicesOn?: any;
  setDevicesOn?: any;
  handleEditClick?: any;
}

interface DeviceStatus {
  beatStatus: string;
  hoursPlayed: number;
}
interface DeviceStatuses {
  [deviceId: number]: DeviceStatus;
}

const GameStatusPopupOnShreach = ({
  visible,
  inSearch,
  setVisible,
  selectedGame,
  selectedRelatedGame,
  setSelectedGame,
  clickBeatGameStatus,
  devicesOn,
  setDevicesOn,
  deviceData,
  progressData,
  selectedDevices,
  beatStatus,
  hoursPlayed,
  selectedGameRelease,
  handleDeviceClick,
  handleSubmitProgressFromGameStatus,
}: IProps) => {
  const [playingNowStatus, setPlayingNowStatus] = useState("playing-now");
  const [userDataApi, setUserDataApi] = useState<any>();
  const [playedHours, setPlayedHours] = useState(0);
  const [gameLibraryStatus, setGameLibraryStatus] = useState("");
  const [beatGameStatus, setBeatGameStatus] = useState("");
  const [playingNextStatus, setPlayingNextStatus] = useState("");
  const [shelvedGameStatus, setShelvedGameStatus] = useState("");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatuses>({});
  const [isPlayingNow, setIsPlayingNow] = useState<boolean>(false);
  const { userData } = useSelector(selectAuthState);
  const [checkDevice, setCheckDevice] = useState<boolean>(false);
  const [selecteddevice1, setselecteddevice1] = useState<any>([]);
  const token = getToken();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isGameDetail = pathname.includes("game");
  const isGameLibrary = pathname.includes("game-library");
  const isDashboardPage = pathname.includes("dashboard");
  const isLandingPage = pathname.includes("/");
  const isNewsDetail = pathname.includes("news");

  const getUserData = async () => {
    console.log("inside 9");
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
        playing_now: data?.playing_now,
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
          setPlayedHours(tempGame?.hours);
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
      console.log(selectedGame, "LLLL");
      let foundGame = false;
      userData?.gamesLibrary?.map((library: any) => {
        if (library?.game?.id === selectedGame?.id) {
          foundGame = true;
          setGameLibraryStatus("library");
          setCheckDevice(true);
        }
      });
    }
  };

  const addedIds = useRef(new Set<number>());

  const checkStatus = async () => {
    if (userData?.id && selectedGame) {
      userData?.playingNow?.map((now: any) => {
        console.log("inside palying now", now, selectedGame);
        if (
          isGameDetail ||
          isDashboardPage ||
          isGameLibrary ||
          isNewsDetail ||
          isLandingPage
        ) {
          console.log("inside iffiifif", now?.game?.id === selectedGame?.id);
          if (
            now?.game?.id === selectedGame?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setPlayingNowStatus("playing-now");
          } else {
            selectedGame?.attributes?.releaseByPlatforms?.release?.forEach(
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
            setPlayingNowStatus("playing-now");
          }
        }
      });
      userData?.beaten_games?.map((now: any) => {
        if (inSearch) {
          if (
            now?.game?.id === selectedGame?.id ||
            now?.game?.id === selectedGameRelease?.game?.id ||
            now?.game?.id === selectedGameRelease?.id ||
            now?.game?.id === selectedRelatedGame?.id
          ) {
            setBeatGameStatus("beat-game");
          } else {
            selectedGame?.attributes?.releaseByPlatforms?.release?.forEach(
              (release: any) => {
                const { id, attributes } = release?.device?.data;
                if (!addedIds.current.has(id)) {
                  addedIds.current.add(id);
                  setselecteddevice1((prevState: any) => [
                    ...prevState,
                    release?.device?.data,
                    // release,
                  ]);
                }
              }
            );
          }
        } else {
          if (now?.id === selectedGame?.id) {
            setBeatGameStatus("beat-game");
          }
        }
      });
    }
  };

  const onClose = () => {
    if (setVisible) {
      setVisible(false);
      setBeatGameStatus("");
      setGameLibraryStatus("");
      setPlayingNextStatus("");
      getUserData();
      setPlayedHours(0);
      const isAnyDeviceSelected = selectedDevices.some(
        (device: any) => !device.is_deleted
      );
      if (!isAnyDeviceSelected) {
        setDevicesOn(false);
      }
    }
  };

  const checkDeviceBeat = async () => {
    deviceData &&
      deviceData?.data &&
      deviceData?.data?.length > 0 &&
      deviceData?.data?.map(async (device: any) => {
        const device_name = device?.attributes?.name;

        const isSelected =
          selectedDevices &&
          selectedDevices?.some(
            (d: any) => d?.deviceName === device_name && d?.is_deleted === false
          );

        const matchingProgress =
          progressData &&
          progressData?.length > 0 &&
          progressData?.find(
            (progress: any) => progress?.attributes?.device_name === device_name
          );

        if (
          isSelected &&
          matchingProgress?.attributes?.beat_status !== "Never Beat"
        ) {
          console.log(isSelected, "Beat Status");
          // setBeatGameStatus("beat-game");
          setCheckDevice(true); // Set the state to true
          // await addBeatGame();
        } else {
          setCheckDevice(false);
          // setBeatGameStatus(""); // Optionally, handle the else case
          // await removeGameLibrary();
        }
      });
  };

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
    : selectedGame?.devices || selectedGame?.devices
    ? selectedGame?.devices
    : selectedGame?.devices;

  if (isGameDetail || isGameLibrary || isLandingPage) {
    availableDevices = selectedGame
      ? selectedGame?.attributes?.devices?.data[0] ||
        (selectedGame?.attributes?.devices?.data[0] &&
          (
            selectedGame?.attributes?.devices?.data ||
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
      ? selectedGameRelease?.attributes?.devices?.data[0] ||
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
        ((selectedGame &&
          selectedGame?.attributes &&
          selectedGame?.attributes.devices &&
          selectedGame?.attributes.devices.data) ||
          (selectedGame &&
            selectedGame?.attributes &&
            selectedGame?.attributes.devices &&
            selectedGame?.attributes.devices.data))
      ? selectedGame?.attributes.devices.data ||
        selectedGame?.attributes.devices.data
      : (selectedGame?.devices && selectedGame?.devices[0]) ||
        (selectedGame?.devices &&
          selectedGame?.devices[0] &&
          selectedGame?.devices) ||
        selectedGame?.devices;
  }

  const playingNow = userDataApi && userDataApi?.playingNow?.length;
  const beatGames = userDataApi && userDataApi?.beaten_games?.length;
  const gameLibrary = userDataApi && userDataApi?.gamesLibrary?.length;
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

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (visible) {
        await checkStatus();
        await checkLibrary();
        // await checkDeviceBeat()
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
      progressData.some((item: any) => !item?.attributes?.is_deleted);

    const allDeleted =
      progressData &&
      progressData?.length > 0 &&
      progressData?.every((item: any) => item?.attributes?.is_deleted);

    const isInLibrary = userData?.gamesLibrary?.some((library: any) => {
      return (
        library?.game?.id === selectedGame?.id ||
        library?.game?.id === selectedGame?.id ||
        library?.game?.id === selectedGameRelease?.game?.id ||
        library?.game?.id === selectedGameRelease?.id ||
        library?.game?.id === selectedRelatedGame?.id
      );
    });
    if (hasActiveProgress && !isInLibrary) {
      await addGameLibrary();
    }

    if (allDeleted && isInLibrary) {
      await removeGameLibrary();
    }

    // Filter progressData to only include non-deleted entries
    const activeProgressData =
      progressData &&
      progressData?.length > 0 &&
      progressData?.filter((item) => !item?.attributes?.is_deleted);

    // Check if all beat statuses are "Never Beat" among non-deleted items
    const allNeverBeat =
      activeProgressData &&
      activeProgressData.every(
        (item) => item?.attributes?.beat_status === "Never Beat"
      );

    const gameInBeatenGames = userData?.beaten_games?.some((now: any) => {
      return now?.game?.id === selectedGame?.id;
    });
    // checkDeviceBeat()

    // Check if at least one beat status is not "Never Beat" among non-deleted items
    const hasBeatenStatus =
      activeProgressData &&
      activeProgressData.some(
        (item) => item?.attributes?.beat_status !== "Never Beat"
      );
    console.log(hasBeatenStatus, gameInBeatenGames, "pppppppppppppppppp");
    if (hasBeatenStatus && !gameInBeatenGames) {
      console.log(hasBeatenStatus, gameInBeatenGames, "pppppppppppppppppp1");
      await addBeatGame();
    }
    if (allNeverBeat && gameInBeatenGames) {
      await removeBeatGame();
    }
  };

  const handlePlayingNow = async (deviceUpdate?: string) => {
    setIsPlayingNow(true);

    const selectedId =
      selectedGameRelease?.id ||
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.id ||
      selectedGame?.game?.id;
    const gameId =
      selectedGameRelease?.id ||
      selectedGameRelease?.id ||
      selectedRelatedGame?.id ||
      selectedGame?.id ||
      selectedGame?.id;
    const releases =
      (
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: item.releaseDate,
        device: { id: item.device?.id || item.device?.data?.id },
      })) || [];

    const payload = {
      playingNow: [{ game: { id: gameId }, releases }],
    };

    const postPlayingNow = async () => {
      try {
        // const res = await axios.post(
        //   `${getApi()}/users-permissions/user/playing-now/test`,
        //   payload,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );
        setPlayingNowStatus("playing-now");
        // toastMessage("success", "You're now playing this game");
        // getUserData();
        // onClose();
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

  const handleClickSave = (device: any) => {
    const updateDeviceId = progressData.find(
      (progress: any) =>
        progress.attributes.device_name === device?.attributes?.name
    );

    if (device?.id) {
      const deviceId = device?.id;
      const { beatStatus, hoursPlayed } = deviceStatuses[device?.id];
      handleSubmitProgressFromGameStatus(
        updateDeviceId?.id || deviceId,
        beatStatus,
        hoursPlayed
      );
      setShowDetails((prev) => ({
        ...prev,
        [device.id]: false,
      }));
    }
  };

  const addGameLibrary = async () => {
    if (selectedGame?.id || selectedGameRelease || selectedRelatedGame) {
      let selectedId = selectedGameRelease
        ? selectedGameRelease?.id || selectedGameRelease?.game?.id
        : selectedRelatedGame
        ? selectedRelatedGame?.id
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
          selectedGame?.attributes?.releaseByPlatforms?.release ||
          selectedGame?.game?.releaseByPlatforms?.release ||
          selectedGame?.releaseByPlatforms?.release ||
          selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
          selectedRelatedGame?.game?.releaseByPlatforms?.release
        )?.map((item: any) => ({
          releaseDate: item.releaseDate,
          device: {
            id: item.device?.id || item.device?.data?.id,
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
                : selectedGame?.id,
            },
            releases: releases,
          },
        ],
      };

      try {
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
          library?.game?.id === selectedGame?.id ||
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
    // debugger;
    // if(!checkDevice){
    const releases =
      (
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedGame?.attributes?.releaseByPlatforms?.release ||
        selectedGame?.releaseByPlatforms?.release ||
        selectedRelatedGame?.attributes?.releaseByPlatforms?.release ||
        selectedRelatedGame?.game?.releaseByPlatforms?.release
      )?.map(
        (item: any) => (
          console.log(selectedGame, "Ppk"),
          {
            releaseDate: item?.releaseDate,
            device: {
              id: item.device?.id || item.device?.data?.id,
            },
          }
        )
      ) || [];
    const payload = {
      game_id: {
        id: selectedGame?.id,
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
      setBeatGameStatus("beat-game");
      getUserData();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
    // }
  };

  const removeBeatGame = async () => {
    console.log(selectedGame?.id, "))00");
    let selectedId = selectedGame?.id;
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

  const clickEditIcon = (data: any) => {
    const device_name = data?.attributes?.name;
    const updateDeviceId = progressData.find(
      (progress: any) => progress?.attributes?.device_name === device_name
    );
    setDeviceStatuses((prev) => ({
      [data.id]: {
        beatStatus: updateDeviceId?.attributes?.beat_status,
        hoursPlayed: updateDeviceId?.attributes?.hours_played || 0,
      },
    }));
  };

  const handleClickSwitchWhenOff = async (device: any) => {
    const device_name = device?.attributes?.name;
    const newSelectedDevices = selectedDevices.map((d: any) =>
      d.deviceId === device.id ? { ...d, is_deleted: true } : d
    );

    const updateDeviceId =
      progressData &&
      progressData?.length > 0 &&
      progressData.find(
        (progress: any) => progress?.attributes?.device_name === device_name
      );

    // const isAnyDeviceSelected = selectedDevices.some((device: any) => !device.is_deleted);
    // if (isAnyDeviceSelected) {
    //   // toast.warning("No device selected. Please select a device.");
    //   setDevicesOn(false)
    // }

    setDeviceStatuses((prev) => ({
      [device.id]: {
        beatStatus: updateDeviceId?.attributes?.beat_status,
        hoursPlayed: updateDeviceId?.attributes?.hours_played || 0,
      },
    }));

    await handleDeviceClick(device);

    if (playingNowStatus) {
      await handlePlayingNow("deviceupdate");
    }

    setShowDetails((prev) => ({
      ...prev,
      [device.id]: true,
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
        (device: any) => !device.is_deleted
      );

      // If there’s only one enabled device and the user is trying to disable it, prevent this action
      if (enabledDevices.length <= 1) {
        let errorMessage = playingNowStatus
          ? "You can't disown the device while it’s in your 'Playing Now' queue."
          : "You can't disown the device until it is in your shelved queue";
        toastMessage("error", errorMessage);
        return false;
      }
    }
    return true;
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

    if (device?.id) {
      setShowDetails((prev) => ({
        ...prev,
        [device.id]: !prev[device?.id],
      }));
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

  return (
    <Modal show={visible} setShow={setVisible} isOverFlow={false}>
      <button
        className="fixed top-[-10px] right-[-10px] text-white font-bold text-lg z-[9999] cursor-pointer"
        onClick={onClose}
      >
        <Image src="/home/close.svg" alt="close icon" width={20} height={20} />
      </button>
      <div className="max-h-[75vh] overflow-auto mt-5  bg-[#1A2947] w-[315px] sm:w-[480px] pb-6 flex flex-col justify-between items-center z-50">
        <div className="w-[92%] mt-0">
          <div className="flex justify-between py-3 pb-1">
            <div>
              <p className="text-[18px] font-[600]">Change Play Status</p>
            </div>
          </div>

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
                        height={20}
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
                      checked={true}
                      type="radio"
                      className="w-4 h-4  custom-radio"
                      onChange={() => {
                        // handlePlayingNow();
                      }}
                      disabled={false}
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
                      className={`rounded-full h-[32px] w-[32px] min-w-[32px]  flex justify-center items-center`}
                    >
                      <Image
                        alt="more"
                        className="w-[18px] h-auto"
                        src="/game-status/forward.png"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="mr-0 leading-3">
                      <p className="text-sm font-medium text-white">
                        Playing Next{" "}
                      </p>
                      <span className="text-[#98A2B3D9] font-normal text-sm">
                        0 Games
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 disabledRadio justify-end pr-0">
                    <input
                      checked={false}
                      type="radio"
                      className="w-4 h-4"
                      disabled={true}
                    />
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </>

          <div className="flex gap-0 sm:gap-3 flex-col sm:flex-row">
            {/* Not Queued */}
            <div className="w-full sm:w-2/4 h-[60px] flex items-center px-3 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]">
              <div className="flex justify-between items-center w-full">
                <div className="flex  gap-3 w-[100%] items-center">
                  <div
                    className={`rounded-full h-[32px] w-[32px] min-w-[32px] flex justify-center items-center`}
                  >
                    <Image
                      alt="more"
                      src="/game-status/3-layers.png"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="mr-0 leading-3">
                    <p className="text-sm font-medium text-white">
                      Not Queued:{" "}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 disabledRadio justify-end pr-0">
                  <input
                    checked={false}
                    type="radio"
                    className="w-4 h-4"
                    disabled={true}
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
                    className={`rounded-full h-[32px] w-[32px] min-w-[32PX] flex justify-center items-center`}
                  >
                    <Image
                      alt="more"
                      className="w-[18px] h-auto"
                      src="/game-status/Clock.svg"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="mr-0 leading-3">
                    <p className="text-sm font-medium text-white">Shelved : </p>
                    <span className="text-[#98A2B3D9] font-normal text-sm">
                      0 Games
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 disabledRadio justify-end pr-0">
                  <input
                    checked={false}
                    type="radio"
                    className="w-4 h-4"
                    disabled={true}
                  />
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 mb-2">
            <Image
              alt="more"
              src="/game-status/linethin.svg"
              width={20}
              height={20}
            />
          </div>

          <div className="flex  gap-0 sm:gap-3 flex-col sm:flex-row">
            {/* Library */}
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
                        src="/game-status/3-layers.png"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="mr-0 leading-3">
                      <p className="text-sm font-medium text-white">
                        My Library:{" "}
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
                        checked={gameLibraryStatus === "library" ? true : false}
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
                      beatGameStatus === "beat-game"
                        ? "bg-cBlue-light border: [3px solid #00ADFF33]"
                        : "bg-[#59618466]"
                    }`}
                  >
                    <Image
                      alt="more"
                      src="/game-status/award.png"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="mr-0 leading-3">
                    <p className="text-sm font-medium text-white">Beat: </p>
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
              src="/game-status/linethin.svg"
              width={20}
              height={20}
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
              const device_name = device?.attributes?.name;

              const matchingProgress =
                progressData &&
                progressData?.length > 0 &&
                progressData?.find(
                  (progress: any) => (
                    console.log(progress, "progress"),
                    progress?.attributes?.device_name === device_name
                  )
                );
              const isSelected =
                selectedDevices &&
                selectedDevices.some(
                  (d: any) =>
                    d?.deviceName === device_name && d?.is_deleted == false
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
                  className="p-4 mt-3 bg-[#59618466] rounded-lg hover:bg-[#5961842D]"
                >
                  <div className="w-full flex items-center mt-2">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-3 w-[85%] items-center">
                        <div className="rounded-full flex justify-center items-center">
                          <Image
                            src={
                              device_name?.toLowerCase()?.includes("pc")
                                ? PCIcon
                                : device_name
                                    ?.toLowerCase()
                                    ?.includes("playstation")
                                ? PlaystationIcon
                                : device_name?.toLowerCase()?.includes("xbox")
                                ? XboxIcon
                                : device_name?.toLowerCase()?.includes("switch")
                                ? SwitchIcon
                                : device_name?.toLowerCase()?.includes("mac")
                                ? MacIcon
                                : device_name
                                    ?.toLowerCase()
                                    ?.includes("android")
                                ? AndroidIcon
                                : DeviceIcon
                            }
                            alt={`${device_name} logo`}
                            width={20}
                            height={20}
                            className="h-[32px] w-[32px]"
                          />
                        </div>
                        <div className="mr-0 leading-5">
                          <p className="text-sm font-medium text-white">
                            {device_name}
                          </p>

                          {isSelected && !showDetails[device?.id] && (
                            <div>
                              <p className="text-[#98A2B3D9] text-sm font-normal">
                                Beat Status:{" "}
                                <span className="text-white">{beatStatus}</span>
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
                              onClick={() => {
                                setShowDetails((prev) => ({
                                  ...prev,
                                  [device.id]: !prev[device?.id],
                                }));
                                clickEditIcon(device);
                                setCheckDevice(true);
                              }}
                              width={20}
                              height={20}
                            />
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={true}
                                onChange={() => {
                                  handleClickSwitch(device);
                                  setCheckDevice(true);
                                }}
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
                              onChange={() => handleClickSwitchWhenOff(device)}
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
                  {isSelected && showDetails[device?.id] && (
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
                              "Never Beat"
                            }
                            onChange={(e) =>
                              handleBeatStatusChange(
                                device?.id,
                                e?.target?.value
                              )
                            }
                          >
                            <option value="Never Beat">Never Beat</option>
                            <option value="Main Story">Main Story</option>
                            <option value="Main And Expansions">
                              Main And Expansions
                            </option>
                            <option value="Completionist">Completionist</option>
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
                              //   deviceStatuses[device.id]?.hoursPlayed>0?deviceStatuses[device.id]?.hoursPlayed:""
                              Number(deviceStatuses[device?.id]?.hoursPlayed) >
                              0
                                ? +deviceStatuses[device?.id]?.hoursPlayed
                                : 0
                            }
                            onChange={(e) => {
                              const inputValue = e?.target?.value;
                              // Allow only digits (no letters or negative signs)
                              if (/^\d*$/.test(inputValue)) {
                                const deviceId = device?.id;
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
  );
};

export default GameStatusPopupOnShreach;

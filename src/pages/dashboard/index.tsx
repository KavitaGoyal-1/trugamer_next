// import MonthlyStatistics from "../components/dashboard/MonthlyStatistics";
// import PlayingNow from "../components/dashboard/PlayingNow";
// import PlayingNext from "../components/dashboard/PlayingNext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import {
  selectAuthState,
  signIn,
  status,
  storeOutsideToggle,
} from "@/store/slices/auth-slice";
import { updateGameStatus } from "@/store/slices/game-hours";
import SeoMeta from "@/components/seo-meta";
import UpcomingGames from "@/components/landing/upcoming-games";
import { toastMessage } from "@/utills/toast";
import { getGameAnalytics } from "@/services/game";
import { UseDebounce } from "@/hooks/use-debounce";
import FooterDetailed from "@/components/layouts/footer-detailed";
import LatestGamingNews from "@/components/landing/latest-gaming-news";
import GameStatusPopup from "@/components/game-status-popup";
import NavigationPublic from "@/components/layouts/navigation-public";
import Footer from "@/components/layouts/footer";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import MonthlyStatistics from "@/components/dashboard/monthly-statistics";
import PlayingNext from "@/components/dashboard/playing-next";
import PlayingNow from "@/components/dashboard/playing-now";

interface Device {
  deviceName: string;
  deviceId: number;
}
interface ProgressDataItem {
  id: number;
  attributes: any;
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [scrollTop, setScrollTop] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [selectedGameRelease, setSelectedGameRelease] = useState<any>();
  const { userData } = useSelector(selectAuthState);
  const [word, setWord] = useState<string>("");
  const [wordPlayingNext, setWordPlayingNext] = useState<string>("");
  const token = getToken();
  const [gameData, setGameData] = useState<any>([]);
  const [gameDataPlayingNext, setGameDataPlayingNext] = useState<any>([]);
  const [gamesArray, setGamesArray] = useState<any>([]);
  const [gamesArrayPlayingNext, setGamesArrayPlayingNext] = useState<any>([]);
  const searchedWord = UseDebounce(word, 500);
  const searchedPlayingNextWord = UseDebounce(wordPlayingNext, 500);
  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);
  const [visibleAddModalPlayingNext, setVisibleAddModalPlayingNext] =
    useState<boolean>(false);
  const [addGameVerificationMessage, setAddGameVerificationMessage] = useState<
    string | null
  >(null);
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const handleShowAddModal = () => {
    setVisibleAddModal(true);
  };
  const handleShowAddModalPlayingNext = () => {
    setVisibleAddModalPlayingNext(true);
  };

  useEffect(() => {
    if (!visibleAddModal && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!visibleAddModalPlayingNext && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!visibleAddModal) {
      setGameData([]);
    }

    if (!visibleAddModalPlayingNext) {
      setGameDataPlayingNext([]);
    }
  }, [visibleAddModal, visibleAddModalPlayingNext]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    if (!visible) {
      setProgressData([]); // Reset progress data when visible is false
      return;
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const getNewReleases = async () => {
  //   try {
  //     const currentDate = new Date().toISOString().split("T")[0];
  //     let currentDateNotFormatted = new Date();
  //     let pastDate = new Date(currentDateNotFormatted);

  //     // Use setMonth to go back 3 months
  //     pastDate.setMonth(currentDateNotFormatted.getMonth() - 3);

  //     // Correct for year change
  //     if (pastDate.getMonth() > currentDateNotFormatted.getMonth()) {
  //       pastDate.setFullYear(currentDateNotFormatted.getFullYear() - 1);
  //     }
  //     const pastThreeMonthsDate = pastDate.toISOString().split("T")[0];
  //     await axios.get(
  //       `${getApi()}/new-releases?populate=game.releaseByPlatforms.release.releaseDate&populate=game.devices.icon.image&populate=game.image&sort[0]=game.rating:desc&filters[$and][0][release_date][$lte]=${currentDate}&filters[$and][1][release_date][$gte]=${pastThreeMonthsDate}`,
  //       { headers: { Authorization: token && `Bearer ${token}` } }
  //     );

  //     await axios.get(`${getApi()}/devices?populate=icon.image`, {
  //       headers: { Authorization: token && `Bearer ${token}` },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getNewReleases();
  // }, [token]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 340) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    });
  }, []);

  const bottomToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleGames = (game: any) => {
    let index = gamesArray.findIndex((g: any) => g.id === game.id);
    if (index == -1) {
      let temp = [...gamesArray, game];
      setGamesArray(temp);
      setAddGameVerificationMessage("");
      setWord("");
    } else {
      toast.error("Game already added", { toastId: "12" });
      setAddGameVerificationMessage("");
    }
  };

  const handleGamesPlayingNext = (game: any) => {
    let index = gamesArrayPlayingNext.findIndex((g: any) => g.id === game.id);
    if (index == -1) {
      let temp = [...gamesArrayPlayingNext, game];
      setGamesArrayPlayingNext(temp);
      setAddGameVerificationMessage("");
      setWordPlayingNext("");
    } else {
      toast.error("Game already added", { toastId: "13" });
      setAddGameVerificationMessage("");
    }
  };

  const getGames = async () => {
    try {
      // If modal is not visible, prevent API request
      if (!visibleAddModal) return;
      if (searchedWord.length == 0) {
        return setGameData([]);
      }
      if (searchedWord.length >= 2) {
        // Create a new AbortController
        const controller = new AbortController();
        const signal = controller.signal;

        // Store controller in ref to allow cancellation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort(); // Cancel previous request
        }
        abortControllerRef.current = controller;
        const { data: game } = await axios.get(
          `${getApi()}/games?filters[title][$containsi]=${searchedWord}&populate[releaseByPlatforms][populate][release][populate]=device.icon.image&populate[image]=true&populate[coverImage]=true&populate[devices]=true`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );

        // Check if modal is still open before updating state
        if (!visibleAddModal) return;
        const playingNowIds = new Set(
          userData?.playingNow?.map((game: any) => game.game.id)
        );
        const filteredGames = game.data.filter(
          (game: any) => !playingNowIds.has(game.id)
        );
        setGameData(filteredGames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGamesPlayingNext = async () => {
    try {
      if (!visibleAddModalPlayingNext) return;
      if (searchedPlayingNextWord.length == 0) {
        return setGameDataPlayingNext([]);
      }
      if (searchedPlayingNextWord.length >= 2) {
        // Create a new AbortController
        const controller = new AbortController();
        const signal = controller.signal;
        // Store controller in ref to allow cancellation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort(); // Cancel previous request
        }
        abortControllerRef.current = controller;
        const { data: game } = await axios.get(
          `${getApi()}/games?filters[title][$containsi]=${searchedPlayingNextWord}&populate[releaseByPlatforms][populate][release][populate]=device.icon.image&populate[image]=true&populate[coverImage]=true`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );

        if (!visibleAddModalPlayingNext) return;

        const playingNowIds = new Set(
          userData?.playingNext?.map((game: any) => game.game.id)
        );
        const filteredGames = game?.data?.filter(
          (game: any) => !playingNowIds.has(game.id)
        );
        setGameDataPlayingNext(filteredGames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGames();
  }, [searchedWord]);

  useEffect(() => {
    getGamesPlayingNext();
  }, [searchedPlayingNextWord]);

  const handleHideAddModal = () => {
    setVisibleAddModal(false);
    setVisibleAddModalPlayingNext(false);
    setGamesArray([]);
    setWord("");
    setGamesArrayPlayingNext([]);
    setWordPlayingNext("");
    setAddGameVerificationMessage("");
  };

  const getUserData = async () => {
    console.log("inside 3");
    const { data } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

  const throttle = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleUserUpdate = async (dataArr: any) => {
    // return console.log(dataArr, "dataArr");
    try {
      // Loop through dataArr to delete each item
      for (const item of dataArr) {
        await axios.delete(
          `${getApi()}/users-permissions/user/playing-now/remove/${item?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      // Loop through dataArr to post each item one by one
      for (const item of dataArr) {
        const releases =
          item?.game?.releaseByPlatforms?.release?.map((itemData: any) => ({
            releaseDate: itemData.releaseDate,
            device: { id: itemData?.device?.id || itemData?.device?.data?.id },
          })) || [];

        const payload = {
          playingNow: [{ game: { id: item?.game?.id }, releases }],
        };
        await axios.post(
          `${getApi()}/users-permissions/user/playing-now/test`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await throttle(300); // Throttle for 300ms between calls
      }
      toastMessage("success", "Sequence updated successfully");
    } catch (error) {
      toastMessage("error", "Please wait will processing");
    }
  };

  // const handleUserUpdate = async (dataArr: any) => {
  //   console.log(dataArr, "tokekekekke");
  //   try {
  //     if (!dataArr?.length) return;

  //     const idsToRemove = dataArr.map((item: any) => item?.id);

  //     // Step 1: Delete existing playingNow data
  //     const removeResponse = await axios.post(
  //       // ✅ Added response logging
  //       `${getApi()}/users-permissions/playing-now/remove/array`,
  //       { ids: idsToRemove },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     console.log(removeResponse, "removeResponse");

  //     if (removeResponse?.status === 200) {
  //       // Step 2: Ensure data is correctly structured for adding
  //       const playingNow = dataArr.map((item: any) => ({
  //         game: { id: item?.game?.id },
  //         releases:
  //           item?.game?.releaseByPlatforms?.release?.map((itemData: any) => ({
  //             releaseDate: itemData.releaseDate,
  //             device: {
  //               id: itemData?.device?.id || itemData?.device?.data?.id,
  //             },
  //           })) || [],
  //       }));

  //       console.log(playingNow, "Updated PlayingNow Order"); // ✅ Added log to verify new order

  //       // Step 3: Send the reordered list
  //       const addResponse = await axios.post(
  //         // ✅ Added response logging
  //         `${getApi()}/users-permissions/user/playing-now/array`,
  //         { playingNow },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       toastMessage("success", "Sequence updated successfully");
  //     }

  //     // for (const item of dataArr) {
  //     //   const releases =
  //     //     item?.game?.releaseByPlatforms?.release?.map((itemData: any) => ({
  //     //       releaseDate: itemData.releaseDate,
  //     //       device: { id: itemData?.device?.id || itemData?.device?.data?.id },
  //     //     })) || [];

  //     //   const payload = {
  //     //     playingNow: [{ game: { id: item?.game?.id }, releases }],
  //     //   };
  //     //   await axios.post(
  //     //     `${getApi()}/users-permissions/user/playing-now/test`,
  //     //     payload,
  //     //     {
  //     //       headers: { Authorization: `Bearer ${token}` },
  //     //     }
  //     //   );
  //     //   await throttle(300); // Throttle for 300ms between calls
  //     // }

  //     // console.log(addResponse.data, "Add API Response"); // ✅ Added log for addition response

  //     toastMessage("success", "Sequence updated successfully");
  //   } catch (error) {
  //     console.error(error, "Error in handleUserUpdate"); // ✅ Added detailed error logging
  //     toastMessage("error", "Please wait while processing");
  //   }
  // };

  const debouncedHandleUserUpdate = debounce(async (updatedPlayingNow: any) => {
    console.log(updatedPlayingNow, "updatedPlayingnow");
    await handleUserUpdate(updatedPlayingNow);
    getUserData();
  }, 3000);

  const deviceData = {
    data: selectedGame?.game?.devices?.map((device: any) => ({
      id: device.id,
      attributes: device,
    })),
  };
  const debouncedHandleUserUpdateForPlayingNextAndShelved = debounce(
    async (updatedPlayingNextAndShelved: any, heading: string) => {
      await handleUserUpdateForPlayingNextAndShelved(
        updatedPlayingNextAndShelved,
        heading
      );
      getUserData();
    },
    5000
  );

  const handleUserUpdateForPlayingNextAndShelved = async (
    dataArr: any,
    heading: string
  ) => {
    try {
      if (heading == "Shelved") {
        //For shelved
        for (const item of dataArr) {
          await axios.delete(
            `${getApi()}/users-permissions/user/shelved-games/remove/${
              item?.game?.id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        // Loop through dataArr to post each item one by one
        for (const item of dataArr) {
          const releases =
            item?.game?.releaseByPlatforms?.release?.map((itemData: any) => ({
              releaseDate: itemData.releaseDate,
              device: { id: itemData.device?.id || itemData.device?.data?.id },
            })) || [];
          let payload = {
            shelvedGames: [
              {
                game: { id: item?.game?.id },
                releases,
              },
            ],
          };
          let res = await axios.post(
            `${getApi()}/users-permissions/user/shelved-games/test`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        toastMessage("success", "Sequence updated successfully");
      } else {
        // Loop through dataArr to delete each item
        for (const item of dataArr) {
          await axios.delete(
            `${getApi()}/users-permissions/user/playing-next/remove/${
              item?.id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        // Loop through dataArr to post each item one by one
        for (const item of dataArr) {
          const releases =
            item?.game?.releaseByPlatforms?.release?.map((itemData: any) => ({
              releaseDate: itemData.releaseDate,
              device: { id: itemData.device?.id || itemData.device?.data?.id },
            })) || [];
          let payload = {
            playingNext: [
              {
                game: { id: item?.game?.id },
                releases,
              },
            ],
          };

          let res = await axios.post(
            `${getApi()}/users-permissions/user/playing-next/test`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        toastMessage("success", "Sequence updated successfully");
      }
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };
  const handleAddPlayingNow = async () => {
    const currentDate = new Date();
    let anySuccess = false;
    // Check if gamesArray is empty
    if (!gamesArray || gamesArray.length === 0) {
      setAddGameVerificationMessage("No game available to add.");
      return;
    }
    try {
      setIsLoading(true);
      for (let game of gamesArray) {
        const { id: gameId, attributes } = game;
        const { title, releaseByPlatforms } = attributes;
        const releaseDate = new Date(releaseByPlatforms.release[0].releaseDate);

        if (releaseDate > currentDate) {
          toastMessage("error", `${title} has not yet been released.`);
          setAddGameVerificationMessage("");
          continue;
        }

        const selecteddevice = releaseByPlatforms.release[0].device?.data;
        const selectedGame = { game: { id: gameId } };
        const releasesFormatted =
          (game?.attributes?.releaseByPlatforms?.release?.length > 0 &&
            game?.attributes?.releaseByPlatforms?.release?.map((item: any) => ({
              releaseDate: item.releaseDate,
              device: { id: item.device?.data?.id },
            }))) ||
          [];
        let payload1 = {
          playingNow: [
            {
              game: {
                id: selectedGame?.game?.id,
              },
              releases: releasesFormatted,
            },
          ],
        };

        let res = await axios.post(
          `${getApi()}/users-permissions/user/playing-now/test`,
          payload1,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddGameVerificationMessage("");
        getUserData();
        anySuccess = true; // Mark as success if at least one game was added
      }

      if (anySuccess) {
        setIsLoading(false);
        toastMessage("success", "You're now playing these games");
      }
      handleHideAddModal();
    } catch (error: any) {
      setIsLoading(false);
      toastMessage(
        "error",
        error.response?.data?.error?.message || "An error occurred"
      );
    }
  };

  const handleAddPlayingNext = async () => {
    let anySuccess = false;
    if (!gamesArrayPlayingNext || gamesArrayPlayingNext.length === 0) {
      setAddGameVerificationMessage("No game available to add.");
      return;
    }
    try {
      for (let game of gamesArrayPlayingNext) {
        const { id: gameId, attributes } = game;
        const { releaseByPlatforms } = attributes;
        const formattedReleases =
          game?.attributes?.releaseByPlatforms?.release.length > 0 &&
          game?.attributes?.releaseByPlatforms?.release?.map((item: any) => ({
            releaseDate: item.releaseDate,
            device: {
              id: item.device?.data?.id,
            },
          }));
        const selectedGame = { game: { id: gameId } };

        let payload1 = {
          playingNext: [
            {
              game: {
                id: selectedGame.game.id,
              },
              releases: formattedReleases,
            },
          ],
        };
        let res = await axios.post(
          `${getApi()}/users-permissions/user/playing-next/test`,
          payload1,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddGameVerificationMessage("");
        getUserData();

        anySuccess = true; // Mark as success if at least one game was added
      }

      if (anySuccess) {
        toastMessage("success", "Successfully added to playing next");
      }
      handleHideAddModal();
    } catch (error: any) {
      toastMessage(
        "error",
        error.response?.data?.error?.message || "An error occurred"
      );
    }
  };
  const handlePlayedHoursUpdate = (data: string) => {
    if (data) {
      getGameAnalytics(data);
    }
  };
  useEffect(() => {
    if (selectedGame) {
      fetchSelectedDevices();
    }
  }, [selectedGame]);

  const fetchSelectedDevices = async () => {
    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${
          userData?.id
        }&filters[game][id][$eq]=${selectedGame?.game?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const progressSectionData = response?.data.data;
      setProgressData(progressSectionData);
      const selectedDevicesFromApi = response?.data?.data?.map(
        (status: any) => ({
          deviceName: status.attributes.device_name,
          deviceId: status.id,
          is_deleted: status.attributes.is_deleted,
        })
      );
      await setSelectedDevices(selectedDevicesFromApi);
    } catch (error) {
      console.log(error);
    }
  };

  const createOrUpdateDevice = async (
    deviceName: string,
    isSelected: boolean,
    deviceId: number,
    deviceIdNew: any
  ) => {
    const payload = {
      data: {
        hours_played: 0,
        beat_status: "Never Beat",
        user: { id: userData?.id },
        device: { id: deviceId },
        game: { id: selectedGame?.game?.id },
        device_name: deviceName,
      },
    };

    try {
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${userData?.id}/${
          selectedGame?.game?.id
        }/${deviceName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let updateDeviceId = response?.data?.data?.id; // Get the existing status ID

      if (updateDeviceId) {
        if (!isSelected) {
          // When isSelected is false, mark the device as deleted (is_deleted = true)
          const deletePayload = {
            data: {
              is_deleted: true,
            },
          };

          await axios.put(
            `${getApi()}/game-statuses/${updateDeviceId}`,
            deletePayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // When isSelected is true, restore the device (is_deleted = false)
          const updatePayload = {
            data: {
              is_deleted: false,
            },
          };

          await axios.put(
            `${getApi()}/game-statuses/${updateDeviceId}`,
            updatePayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } else {
        // Create a new device entry if it doesn't exist
        const response = await axios.post(
          `${getApi()}/game-statuses/create`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(updateGameStatus(response?.data));
      }

      fetchSelectedDevices();
    } catch (error) {
      console.error("Error creating/updating device:", error);
    }
  };

  const handleDeviceClick = async (device: any, deviceReleaseDate: any) => {
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);

    // Check if the game is released
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }

    if (token) {
      const deviceName = device.attributes?.name;
      const deviceId = device.id || device?.attributes.id;

      // Check if the device is already selected
      const isSelected = selectedDevices.some(
        (d: any) => d.deviceName === deviceName && d.is_deleted === false
      );

      const filteredValue: any = selectedDevices.find(
        (element: any) => element.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;

      // Toggle the selection of the device
      const updatedDevices = isSelected
        ? selectedDevices.filter((d: any) => d.deviceName !== deviceName)
        : [...selectedDevices, { deviceName, deviceId, is_deleted: false }];

      setSelectedDevices(updatedDevices);

      // Create or update the device in the backend
      await createOrUpdateDevice(
        deviceName,
        !isSelected,
        deviceId,
        deviceIdNew
      );
      // setGlobalLoading(false);
    } else {
      // Redirect to login if the user is not authenticated
      router.push("/auth/sign-in");
      localStorage.setItem("Revisedslug", selectedGame?.game?.slug);
    }
  };

  const handleEditClick = (item: ProgressDataItem) => {
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played);
  };
  const handleSubmitProgressFromGameStatus = async (
    updateDeviceId: any,
    beatStatus: any,
    hoursPlayed: any
  ) => {
    try {
      const payload = {
        data: {
          beat_status: beatStatus,
          hours_played: hoursPlayed,
        },
      };
      const response = await axios.put(
        `${getApi()}/custom-game-statuses-hours/${updateDeviceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateGameStatus(response?.data));
      fetchSelectedDevices();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);
  const seoTitle = "Trugamer | Dashboard";
  return (
    <>
      {/* <SeoMeta
    title={seoTitle}
    description=""
    canonicalUrl=""
    keywords=""
    ogType=""
    ogImage={null}
    bestRating={null}
    worstRating={null}
    ratingCount={null}
    reviewCount={null}
    videoTitle={null}
    descriptionFull={null}
    datePublished={null}
    dateModified={null}
    videoUrl={null}
    genre={null}
    gamePlatform={null}
    publisher={""}
  /> */}
      <section className="relative min-h-screen bg-cBlack-dark">
        <NavigationPublic text={"Dashboard"} token={token} />
        <div className="max-md:hidden">
          {token && <NewVerticalNavigation token={token} />}
        </div>

        <div
          className={
            isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
          }
          ref={navRef}
        >
          <NewVerticalNavigation token={token} />
        </div>
        <span className="pt-6 md:pt-16 pb-14 block"></span>

        {/**Playing Now Carousel */}
        <PlayingNow
          visible={visible}
          setVisible={setVisible}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
          playingNow={userData && userData?.playingNow}
          setWord={setWord}
          word={word}
          gameData={gameData}
          gamesArray={gamesArray}
          setGamesArray={setGamesArray}
          handleGames={handleGames}
          handleAddPlayingNow={handleAddPlayingNow}
          isLoading={isLoading}
          handleHideAddModal={handleHideAddModal}
          handleShowAddModal={handleShowAddModal}
          visibleAddModal={visibleAddModal}
          setVisibleAddModal={setVisibleAddModal}
          token={token}
          addGameVerificationMessage={addGameVerificationMessage}
          debouncedHandleUserUpdate={debouncedHandleUserUpdate}
        />

        {/**Playing Next Carousel*/}
        <PlayingNext
          visible={visible}
          setVisible={setVisible}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
          playingNext={userData && userData.playingNext}
          setWord={setWordPlayingNext}
          word={wordPlayingNext}
          gameData={gameDataPlayingNext}
          gamesArray={gamesArrayPlayingNext}
          setGamesArray={setGamesArrayPlayingNext}
          handleGames={handleGamesPlayingNext}
          handleAddPlayingNext={handleAddPlayingNext}
          handleHideAddModal={handleHideAddModal}
          handleShowAddModal={handleShowAddModalPlayingNext}
          visibleAddModal={visibleAddModalPlayingNext}
          setVisibleAddModal={setVisibleAddModalPlayingNext}
          token={token}
          addGameVerificationMessage={addGameVerificationMessage}
          handleUserUpdateForPlayingNextAndShelved={
            handleUserUpdateForPlayingNextAndShelved
          }
          debouncedHandleUserUpdateForPlayingNextAndShelved={
            debouncedHandleUserUpdateForPlayingNextAndShelved
          }
        />

        {/** Shelved Games Carousel*/}
        <PlayingNext
          visible={visible}
          setVisible={setVisible}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
          playingNext={userData && userData.shelvedGames}
          heading="Shelved"
          setWord={setWordPlayingNext}
          word={wordPlayingNext}
          gameData={gameDataPlayingNext}
          gamesArray={gamesArrayPlayingNext}
          setGamesArray={setGamesArrayPlayingNext}
          handleGames={handleGamesPlayingNext}
          handleAddPlayingNext={handleAddPlayingNext}
          handleHideAddModal={handleHideAddModal}
          handleShowAddModal={handleShowAddModalPlayingNext}
          visibleAddModal={visibleAddModalPlayingNext}
          setVisibleAddModal={setVisibleAddModalPlayingNext}
          token={token}
          addGameVerificationMessage={addGameVerificationMessage}
          handleUserUpdateForPlayingNextAndShelved={
            handleUserUpdateForPlayingNextAndShelved
          }
          debouncedHandleUserUpdateForPlayingNextAndShelved={
            debouncedHandleUserUpdateForPlayingNextAndShelved
          }
        />

        {/*Latest Gaming News*/}
        <LatestGamingNews />

        {/**Upcoming Relases Carousel */}
        <UpcomingGames />

        {/**Monthly Stats */}
        <MonthlyStatistics />
      </section>
      <div className="max-md:hidden">{/* <Footer /> */}</div>
      <div className="md:hidden block">{/* <FooterDetailed /> */}</div>
      {scrollTop && (
        <button onClick={bottomToTop} className="backToTop">
          &#8593;
        </button>
      )}
      {/* <GameStatusPopup
    setSelectedGame={setSelectedGame}
    setSelectedGameRelease={setSelectedGameRelease}
    selectedGameRelease={selectedGameRelease}
    selectedGame={selectedGame}
    visible={visible}
    setVisible={setVisible}
    deviceData={deviceData}
    handlePlayedHoursUpdate={handlePlayedHoursUpdate}
    slug={selectedGame?.game?.slug}
    selectedDevices={selectedDevices}
    handleDeviceClick={handleDeviceClick}
    progressData={progressData}
    beatStatus={beatStatus}
    setBeatStatus={setBeatStatus}
    hoursPlayed={hoursPlayed}
    handleEditClick={handleEditClick}
    handleSubmitProgressFromGameStatus={handleSubmitProgressFromGameStatus}
  /> */}
    </>
  );
};

export default Dashboard;

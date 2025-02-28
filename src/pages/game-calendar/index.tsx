import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LiaAngleRightSolid } from "react-icons/lia";
import { updateGameStatus } from "@/store/slices/game-hours";
import {
  getNextDate,
  getPreviousDate,
  updateGameCalendarApiCall,
} from "@/utills/game-calendar-new";
import {
  gameCalendarNewInitialState,
  setGameCalendarNewApiResponse,
} from "@/store/slices/game-calendar-new-reducer";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import { getApi } from "@/utills/get-api";
import { selectAuthState } from "@/store/slices/auth-slice";
import LoaderSpinner from "@/components/loader-spinner";
import { toastMessage } from "@/utills/toast";
import { getToken } from "@/utills/cookies";
import NavigationPublic from "@/components/layouts/navigation-public";
import FooterDetailed from "@/components/layouts/footer-detailed";
import Footer from "@/components/layouts/footer";
import { getCalendarGames } from "@/api/games-api";
import SeoMeta from "@/components/seo-meta";
import ResultsRight from "@/components/game-directory/results-right";
import GameStatusPopup from "@/components/game-status-popup";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import {
  clearCalendarFilter,
  setcalendarFilter,
  clearFilters,
} from "@/store/slices/calendar-filter-slice";
import Results from "@/components/game-directory/results";
import ResultsFilters from "@/components/game-directory/results-filters";
import ResultsFiltersMoreCalenders from "@/components/game-directory/results-filters-more-calenders";
import AuthenticatedNavigation from "@/components/layouts/authanticated-navigation";

interface Device {
  deviceName: string;
  deviceId: number;
}
interface ProgressDataItem {
  id: number;
  attributes: any;
}

const GamesDirectory = ({ notscroll, isLandingPage }: any) => {
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [selectedGameRelease, setSelectedGameRelease] = useState<any>();
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const { userData } = useSelector(selectAuthState);
  const router = useRouter();
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const token = getToken();
  const [gameCalendar, setGameCalendar] = useState<any>([]);
  const [selectedCardOrList, setSelectedCardOrList] = useState<string>("Card");
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const calendarFilters = useSelector((state: any) => state.calendarFilters);
  const isFilter = useSelector((state: any) => state.calendarFilters);
  const callInfinteScroll = useRef(false);
  // const lastScrollPosition = useRef(0); // Use a ref to store the last scroll position
  const [upLaoding, setUpLoading] = useState(false);
  const [downLaoding, setDownLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  // const [scrollposition, setScrollPosition] = useState<number>(0);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [noDataAddedInShowMore, setNoDataAddedInShowMore] = useState(false);
  const [showMoreGameCalendarData, setshowMoreGameCalendarData] =
    useState(null);
  const [directionForShowButton, setDirectionForShowButton] = useState<
    "up" | "down"
  >("down");
  const pathname = usePathname();
  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);
  const gameCalendarResponse = useSelector(
    (state: any) => state.gameCalendarNew.apiResponse
  );

  const apiResponseLoading = useSelector(
    (state: any) => state.gameCalendarNew?.apiResponseLoading
  );

  console.log(apiResponseLoading, "gameCalendarResponse1");

  const updatedFilters = useSelector((state: any) => {
    const { apiResponse, ...rest } = state.gameCalendarNew || {};
    return rest;
  });

  useEffect(() => {
    if (!visible) {
      setProgressData([]); // Reset progress data when visible is false
      return;
    }
  }, [visible]);

  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  // Toggle the filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleChangeListOrCardView = (item: any) => {
    setSelectedCardOrList(item);
  };

  const toggleVisible = (device: any) => {
    if (!token) {
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLoginStatus(true);
    } else {
      const updatedDevice = {
        ...device,
        releaseDate: device.releaseDate
          ? device.releaseDate.split("-").reverse().join("-")
          : device.releaseDate,
      };

      setSelectedGame(updatedDevice);
      setSelectedGameRelease(updatedDevice);
      setBeatStatus(
        updatedDevice?.gameStatus?.length > 0
          ? updatedDevice?.gameStatus[0]?.beat_status
          : "Never Beat"
      );
      setHoursPlayed(
        updatedDevice?.gameStatus?.length > 0
          ? updatedDevice?.gameStatus[0]?.hours_played
          : 0
      );
      setVisible(!visible);
    }
  };

  // const toggleVisible = (device: any) => {
  //   console.log(device, "deviceeeee");
  //   if (!token) {
  //     localStorage.setItem(
  //       "Revisedslug",
  //       location.pathname && location.pathname
  //     );
  //     setIsOpenLoginStatus(true);
  //   } else {
  //     setSelectedGame(device);
  //     setSelectedGameRelease(device);
  //     setBeatStatus(
  //       device?.gameStatus?.length > 0
  //         ? device?.gameStatus[0]?.beat_status
  //         : "Never Beat"
  //     );
  //     setHoursPlayed(
  //       device?.gameStatus?.length > 0 ? device?.gameStatus[0]?.hours_played : 0
  //     );
  //     setVisible(!visible);
  //   }
  // };
  const [callInProgress, setCallInProgress] = useState(false);

  function debounce(callback: any, delay: any) {
    let timer: any;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, delay);
    };
  }

  const fetchCalendarGames = async (direction: any) => {
    if (direction == "up") {
      setUpLoading(true);
    } else {
      setDownLoading(true);
    }
    if (callInProgress && isFilter.isFilter == false) {
      setUpLoading(false);
      setDownLoading(false);
      return; // If a fetch call is in progress, don't trigger another one
    }

    setCallInProgress(true);
    try {
      await updateGameCalendarApiCall(dispatch, gameCalendarNewInitialState);

      setTimeout(() => {
        const headerElement = document.getElementById("date-height");
        if (headerElement) {
          const headerHeight = headerElement.offsetHeight;
          window.scrollTo({
            top: headerHeight,
            behavior: "smooth",
          });
        }
      }, 0);
      // if (response?.status === 200) {
      //   const newGames = Object.entries(response?.data?.realdata).map(
      //     ([week, games]) => ({
      //       week,
      //       games,
      //     })
      //   );

      //   if (isFilter.isFilter == true) {
      //     // Directly set the new games, ignoring previous data
      //     setGameCalendar(() => {
      //       // Sort the new games by week before setting them
      //       return newGames.sort((a, b) => {
      //         const [yearA, monthA, dayA] = a.week.split("-");
      //         const [yearB, monthB, dayB] = b.week.split("-");

      //         if (yearA !== yearB) {
      //           return Number(yearA) - Number(yearB);
      //         }
      //         if (monthA !== monthB) {
      //           return Number(monthA) - Number(monthB);
      //         }
      //         return Number(dayA) - Number(dayB);
      //       });
      //     });
      //   } else {
      //     // Update game calendar
      //     setGameCalendar((prevData: any) => {
      //       // Use a Map to eliminate duplicates based on `week`
      //       const dataMap = new Map();

      //       // Function to parse week into a comparable date object
      //       const parseWeekToDate = (week: string) => {
      //         // Handle different formats of `week`
      //         if (week.includes("-")) {
      //           // Format: "YYYY-MM-DD"
      //           return new Date(week);
      //         } else if (week.includes("Week")) {
      //           // Format: "Week 49 2024" (Assume the week starts on Monday)
      //           const [weekNum, year] = week.match(/Week (\d+) (\d+)/) || [];
      //           const jan1 = new Date(Number(year), 0, 1);
      //           return new Date(
      //             jan1.getTime() +
      //               (Number(weekNum) - 1) * 7 * 24 * 60 * 60 * 1000
      //           );
      //         } else if (week.includes("Month")) {
      //           // Format: "Month 12 2024"
      //           const [, month, year] = week.match(/Month (\d+) (\d+)/) || [];
      //           return new Date(Number(year), Number(month) - 1, 1);
      //         }
      //         return new Date(); // Default to current date for safety
      //       };

      //       // Add previous data to the Map
      //       (prevData || []).forEach((item: any) => {
      //         dataMap.set(item.week, item);
      //       });

      //       // Add new games to the Map
      //       newGames.forEach((item: any) => {
      //         dataMap.set(item.week, item);
      //       });

      //       // Convert Map values to an array and sort by date
      //       return Array.from(dataMap.values()).sort((a, b) => {
      //         const dateA = parseWeekToDate(a.week);
      //         const dateB = parseWeekToDate(b.week);
      //         return dateA.getTime() - dateB.getTime(); // Ascending order
      //       });
      //     });
      //   }

      //   // Update filters
      //   let updatedFilter: any;
      //   if (direction === "down") {
      //     updatedFilter = {
      //       ...calendarFilters.filter,
      //       timeframe: {
      //         frame: response?.data?.timeframe.frame,
      //         range: response?.data?.timeframe.range,
      //         year: response?.data?.timeframe.year,
      //       },
      //       downframe: {
      //         frame: response?.data?.timeframe.frame,
      //         range: response?.data?.timeframe.range,
      //         year: response?.data?.timeframe.year,
      //       },
      //       istimechanged: response?.data?.istimechanged,
      //     };
      //   } else {
      //     updatedFilter = {
      //       ...calendarFilters.filter,
      //       timeframe: {
      //         frame: response?.data?.timeframe.frame,
      //         range: response?.data?.timeframe.range,
      //         year: response?.data?.timeframe.year,
      //       },
      //       uppertimeframe: {
      //         frame: response?.data?.timeframe.frame,
      //         range: response?.data?.timeframe.range,
      //         year: response?.data?.timeframe.year,
      //       },
      //       istimechanged: response?.data?.istimechanged,
      //     };
      //   }

      //   // Dispatch actions
      //   dispatch(setcalendarFilter(updatedFilter));
      // } else {
      //   console.error(
      //     "Failed to fetch calendar games. Status:",
      //     response?.status
      //   );
      // }
    } catch (error) {
      console.error("An error occurred while fetching calendar games:", error);
    } finally {
      callInfinteScroll.current = false;
      if (direction == "up") {
        setUpLoading(false);
      } else {
        setDownLoading(false);
      }
      setCallInProgress(false); // Reset the flag when the fetch call finishes

      if (isFilter.isFilter == false) {
        if (direction == "up") {
          setTimeout(() => {
            window.scrollBy(0, 45);
          }, 500);
        } else if (direction == "down") {
          const targetDiv = document.getElementById(
            calendarFilters?.timeframe?.range
          );
          targetDiv?.scrollIntoView();
        } else {
          window.scrollBy(0, 45);
        }
      }
      dispatch(clearCalendarFilter());
      setFirstLoading(false);
    }
  }; //First time this function work

  const updateTimeFrame = async (direction: string) => {
    callInfinteScroll.current = true;
    let currentTimeframe =
      direction === "down"
        ? calendarFilters?.filter.downframe
        : calendarFilters.filter.uppertimeframe;

    let updatedRange = Number(currentTimeframe.range);
    let updatedYear = Number(currentTimeframe.year);

    if (currentTimeframe.frame === "weekly") {
      updatedRange = direction === "down" ? updatedRange + 1 : updatedRange - 1;
      if (updatedRange > 52) {
        updatedRange = 1;
        updatedYear += 1;
      } else if (updatedRange < 1) {
        updatedRange = 52;
        updatedYear -= 1;
      }
    } else if (currentTimeframe.frame === "monthly") {
      updatedRange = direction === "down" ? updatedRange + 1 : updatedRange - 1;
      if (updatedRange > 12) {
        updatedRange = 1;
        updatedYear += 1;
      } else if (updatedRange < 1) {
        updatedRange = 12;
        updatedYear -= 1;
      }
    } else if (currentTimeframe.frame === "daily") {
      const currentDate = new Date(currentTimeframe.range);
      const updatedDate = new Date(currentDate);
      updatedDate.setDate(
        updatedDate.getDate() + (direction === "down" ? +1 : -1)
      );
      let range = updatedDate.toISOString().split("T")[0];
      updatedYear = updatedDate.getFullYear();
      const updatedFilter = {
        ...calendarFilters.filter,
        timeframe: {
          ...currentTimeframe,
          range: String(range),
          year: String(updatedYear),
        },
        ...(direction === "down"
          ? {
              downframe: {
                ...currentTimeframe,
                range: String(range),
                year: String(updatedYear),
              },
            }
          : {
              uppertimeframe: {
                ...currentTimeframe,
                range: String(range),
                year: String(updatedYear),
              },
            }),
        scroll: direction,
      };
      await dispatch(setcalendarFilter(updatedFilter));
      if (callInfinteScroll.current == true && callInProgress) {
        setCallInProgress(false);
        if (direction == "up") {
          window.scrollTo({
            top: 100,
          });
        } else if (direction == "down") {
          const targetDiv = document.getElementById(
            calendarFilters.timeframe.range
          );
          targetDiv?.scrollIntoView();
        } else {
          window.scrollBy(0, 45);
        }
      }
      if (callInfinteScroll.current == true && !callInProgress) {
        debounce(fetchCalendarGames(direction), 500);
      }
      return;
    }

    const updatedFilter = {
      ...calendarFilters.filter,
      timeframe: {
        ...currentTimeframe,
        range: String(updatedRange),
        year: String(updatedYear),
      },
      ...(direction === "down"
        ? {
            downframe: {
              ...currentTimeframe,
              range: String(updatedRange),
              year: String(updatedYear),
            },
          }
        : {
            uppertimeframe: {
              ...currentTimeframe,
              range: String(updatedRange),
              year: String(updatedYear),
            },
          }),
      scroll: direction,
    };
    await dispatch(setcalendarFilter(updatedFilter));

    if (callInfinteScroll.current == true) {
      debounce(fetchCalendarGames(direction), 500);
    }
  };
  useEffect(() => {
    clearFilters();
    const initializeCalendar = async () => {
      setFirstLoading(true);
      setGameCalendar([]);

      await dispatch(clearCalendarFilter());
      if (!callInProgress) {
        debounce(fetchCalendarGames("down"), 500);
        window.scrollBy(0, 45);
      }
    };
    initializeCalendar();
    dispatch(clearFilters());
  }, []);

  const fetchPageData = async (date: string, direction: "up" | "down") => {
    try {
      const filters = {
        ...updatedFilters,
        timeframe: {
          ...updatedFilters.timeframe,
          range: date,
          direction,
        },
        limit: 10,
      };
      const { data } = await getCalendarGames(filters);
      return data;
    } catch (error) {
      console.error(`Error fetching data for date ${date}:`, error);
      return { date, response: [] };
    }
  };

  const fetchData = async (date: string, direction: "up" | "down") => {
    if (direction === "up") setUpLoading(true);
    if (direction === "down") setDownLoading(true);

    try {
      const newData = await fetchPageData(date, direction);
      const filteredGameCalendarResponse = gameCalendarResponse.filter(
        (item: any) => item.timeframe === updatedFilters.timeframe.frame
      );

      if (direction === "up") {
        dispatch(
          setGameCalendarNewApiResponse([
            newData,
            ...filteredGameCalendarResponse,
          ])
        );
        setNoDataAddedInShowMore(true);
      } else {
        dispatch(
          setGameCalendarNewApiResponse([
            ...filteredGameCalendarResponse,
            newData,
          ])
        );
        setNoDataAddedInShowMore(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    if (direction === "up") setUpLoading(false);
    if (direction === "down") setDownLoading(false);
  };

  const fetchMoreGames = async (
    date: string,
    direction: "up" | "down",
    currentLength: number,
    games: any
  ) => {
    try {
      const filters = {
        ...updatedFilters,
        timeframe: { ...updatedFilters.timeframe, range: date, direction },
        limit: 10,
        offset: currentLength,
        alreadyFetchedIds: games.map((game: any) => game.id),
      };
      setShowMoreLoading(true);
      const { data } = await getCalendarGames(filters);

      const updatedData = gameCalendarResponse.map((week: any) => {
        if (week.date === date) {
          setNoDataAddedInShowMore(false);
          return {
            ...week,
            response: [...week.response, ...data.response],
          };
        }
        return week;
      });

      setshowMoreGameCalendarData(updatedData);
      setDirectionForShowButton(direction);
      setShowMoreLoading(false);
      // return data;
    } catch (error) {
      console.error(`Error fetching data for date ${date}:`, error);
      return { date, response: [] };
    }
  };

  const addCalendarNewApiResponseData = async (direction: "up" | "down") => {
    try {
      const newData: any = showMoreGameCalendarData;
      let gameCalendarShowResponse: any = [...gameCalendarResponse];

      // gameCalendarShowResponse = gameCalendarResponse.map(
      //   (data: any, index: number) => {
      //     if (newData.date === data.date) {
      //       // Return a new object with the merged response array.
      //       return {
      //         ...data,
      //         response: [
      //           ...data.response, // Existing responses.
      //           ...newData.response, // New responses to be added.
      //         ],
      //       };
      //     }
      //     return data; // Return unchanged object if date doesn't match.
      //   }
      // );
      dispatch(setGameCalendarNewApiResponse([...newData]));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    async function fetchShowMoreData() {
      await addCalendarNewApiResponseData(directionForShowButton);
      // console.log(typeof directionForShowButton, "directionForShowButton");
    }
    if (showMoreGameCalendarData) {
      fetchShowMoreData();
    }
  }, [showMoreGameCalendarData]);

  const handleScroll = async () => {
    // Prevent multiple requests during loading
    if (upLaoding || downLaoding) return;

    const scrollTop = window.scrollY; // Current vertical scroll position
    const scrollHeight = document.documentElement.scrollHeight; // Total height of the page
    const clientHeight = window.innerHeight; // Height of the viewport

    const frame = updatedFilters.timeframe.frame;

    // if (scrollTop === 0) {
    //   // User scrolled to the top of the page
    //   const previousScrollHeight = document.documentElement.scrollHeight;
    //   const newDate = getNextDate(gameCalendarResponse[0].date, frame);

    //   await fetchData(newDate, "up");

    //   const newScrollHeight = document.documentElement.scrollHeight;
    //   const heightDifference = newScrollHeight - previousScrollHeight;

    //   window.scrollBy(0, heightDifference);
    // } else if (scrollTop + clientHeight >= scrollHeight) {
    //   const newDate = getPreviousDate(
    //     gameCalendarResponse[gameCalendarResponse?.length - 1].date,
    //     frame
    //   );
    //   fetchData(newDate, "down");
    // }

    if (!apiResponseLoading) {
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // Scrolling Down
        const nextDate = getNextDate(
          gameCalendarResponse[gameCalendarResponse?.length - 1].date,
          frame
        );
        await fetchData(nextDate, "down");
      } else if (scrollTop === 0) {
        // Scrolling Up
        const previousScrollHeight = document.documentElement.scrollHeight;
        const previousDate = getPreviousDate(
          gameCalendarResponse[0].date,
          frame
        );
        await fetchData(previousDate, "up");

        const newScrollHeight = document.documentElement.scrollHeight;
        const heightDifference = newScrollHeight - previousScrollHeight;
        window.scrollBy(0, heightDifference);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updatedFilters]);

  useEffect(() => {
    if (isFilter.isFilter == true) {
      debounce(fetchCalendarGames("down"), 500);
      // Call the API only if it's not the first render
    }
  }, [isFilter]);

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
      dispatch(updateGameStatus(response.data));
      fetchSelectedDevices();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const fetchSelectedDevices = async () => {
    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${
          userData?.id
        }&filters[game][id][$eq]=${selectedGame?.id}`,
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
      setSelectedDevices(selectedDevicesFromApi);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
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
      // setGlobalLoading(true);
      const deviceName = device.attributes?.name;
      const deviceId = device?.attributes?.id;

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
      localStorage.setItem("Revisedslug", selectedGame?.slug);
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
        game: { id: selectedGame?.id },
        device_name: deviceName,
      },
    };

    try {
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${userData?.id}/${
          selectedGame?.id
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
    } finally {
      // setGlobalLoading(false);
    }
  };

  const deviceData = {
    data: selectedGame?.devices?.map((device: any) => ({
      attributes: device,
    })),
  };

  useEffect(() => {
    if (selectedGame && visible) {
      fetchSelectedDevices();
    }
  }, [selectedGame, visible]);

  const [selectedOption, setSelectedOption] = useState("card");
  const [scrollPosition, setScrollPositions] = useState(0);

  useEffect(() => {
    if (notscroll) {
      return;
    } else {
      const handleScroll = () => {
        const position = window.scrollY;
        setScrollPositions(position);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const getBackgroundColor = () => {
    const opacity = Math.min(scrollPosition / 100, 1);
    return `rgba(16, 24, 40, ${opacity})`;
  };

  useEffect(() => {
    if (notscroll) {
      return;
    } else {
      const handleScroll = () => {
        const position = window.scrollY;
        setScrollPositions(position);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  console.log(selectedGame, "selectedGameselectedGame");

  return (
    <>
      {firstLoading ? (
        <h2 className="flex items-center justify-center h-screen">
          <LoaderSpinner />
        </h2>
      ) : (
        <>
          {/* <SeoMeta
            title="Video Game Release Calendar"
            description="Track upcoming video game release dates and plan your gaming using queues. Get the latest updates on release dates of video games."
            canonicalUrl={`${process.env.NEXT_SITE_URL}/game-calendar`}
            keywords="video game release dates, upcoming video games, latest game release dates, games release calendar, anticipated game releases"
            ogImage="https://trugamer.com/logo.svg"
            ogType="Article"
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

          <section
            id="div1"
            className="min-h-screen bg-cBlack-dark py-[100px] lg:py-28 grid grid-cols-1 xl:px-[10%] md:px-[10%] md:pr-[5%] xl:pr-[10%] !pt-[10%] 2xl:!pt-[7%] custom_width !pb-0"
          >
            <div
              className={
                isToggle
                  ? "menucomon mobile-menus top-6"
                  : "menucomon mobile-right !top-0   fixed z-[99999]"
              }
            >
              <NewVerticalNavigation token={token} />
            </div>

            <div className="max-lg:hidden remove-li fixed">
              <AuthenticatedNavigation text={""} token={token} />
            </div>

            <div className="lg:hidden block">
              <NavigationPublic token={token} />
            </div>

            <NavigationPublic
              text={["Game Calendar"]}
              token={token}
              // notscroll={true}
            />

            <div className="  items-center mt-0 sm:mt-0 mb-6 ">
              <div
                className="flex justify-between items-center w-full px-4 md:px-0  mb-0 sm:mb-0 mobile-res"
                style={{
                  background:
                    isLandingPage && window.innerWidth <= 640
                      ? "linear-gradient(90deg, rgb(8 19 36) 0%, rgb(8 24 41) 28.19%, rgb(9 17 31) 52.74%, rgb(8 23 41) 78.09%, rgb(9 18 33) 100%)"
                      : getBackgroundColor(),
                }}
              >
                <h1 className="font-bold text-2xl md:text-[34px] 2xl:text-[44px] text-start mb-0 sm:mb-0 mt-0">
                  Game Calendar
                </h1>

                <div className=" lg:hidden">
                  <span
                    className={`flex gap-2 font-semibold text-lg cursor-pointer items-center ${
                      isFilterOpen ? "text-[#00ADFF]" : "text-white"
                    }`}
                    onClick={toggleFilter}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={` ${isFilterOpen ? "color-change" : "white"}`}
                    >
                      <path
                        d="M21.3572 6.25875L21.3497 6.26719L15 13.0472V18.2494C15.0003 18.4968 14.9395 18.7405 14.8229 18.9587C14.7062 19.1769 14.5375 19.3628 14.3315 19.5L11.3315 21.5006C11.1055 21.6512 10.8427 21.7376 10.5714 21.7505C10.3001 21.7635 10.0303 21.7025 9.79095 21.5741C9.55157 21.4457 9.35155 21.2547 9.21225 21.0215C9.07294 20.7883 8.99957 20.5216 8.99998 20.25V13.0472L2.65029 6.26719L2.64279 6.25875C2.44755 6.04389 2.31886 5.77699 2.27232 5.49043C2.22579 5.20387 2.26341 4.90996 2.38063 4.64436C2.49785 4.37876 2.68962 4.15288 2.93269 3.99413C3.17575 3.83538 3.45966 3.75057 3.74997 3.75H20.25C20.5405 3.75003 20.8248 3.83444 21.0683 3.99298C21.3118 4.15152 21.504 4.37737 21.6216 4.64308C21.7391 4.90878 21.777 5.20292 21.7305 5.48973C21.6841 5.77655 21.5554 6.04371 21.36 6.25875H21.3572Z"
                        fill="white"
                      />
                    </svg>
                    Filters <LiaAngleRightSolid size={20} />
                  </span>
                </div>
              </div>

              <div className="flex gap-6 md:gap-4 xl:gap-6 flex-col lg:flex-row mt-10 sm:mt-0">
                <div
                  className={`left-side libary-left pading-right lg:block ${
                    isFilterOpen ? "hidden" : "block"
                  }`}
                >
                  {/* {updatedFilters?.apiResponseLoading ? (
                    <h2 className="text-white flex item-center justify-center w-[100%] mt-10  mb-10">
                       <LoaderSpinner /> 
                    </h2>
                  ) : (
                    <Results
                      toggleVisible={toggleVisible}
                      selectedCardOrList={selectedCardOrList}
                      gameCalendar={gameCalendarResponse} // Updated calendar data
                      upLaoding={upLaoding}
                      downLaoding={downLaoding}
                      selectedOption={selectedOption}
                      showMoreLoading={showMoreLoading}
                      fetchMoreGames={fetchMoreGames}
                      noDataAddedInShowMore={noDataAddedInShowMore}
                    />
                  )} */}

                  {updatedFilters?.apiResponseLoading ? (
                    <h2 className="text-white flex items-center justify-center w-full mt-10 mb-10">
                      {/* <LoaderSpinner /> */}
                    </h2>
                  ) : Array.isArray(gameCalendarResponse) &&
                    gameCalendarResponse.length > 0 &&
                    gameCalendarResponse.some(
                      (obj) => obj.totalGamesCount > 0
                    ) ? (
                    <Results
                      toggleVisible={toggleVisible}
                      selectedCardOrList={selectedCardOrList}
                      gameCalendar={gameCalendarResponse} // Updated calendar data
                      upLaoding={upLaoding}
                      downLaoding={downLaoding}
                      selectedOption={selectedOption}
                      showMoreLoading={showMoreLoading}
                      fetchMoreGames={fetchMoreGames}
                      noDataAddedInShowMore={noDataAddedInShowMore}
                    />
                  ) : (
                    <h2
                      className="text-white flex items-center justify-center w-full mt-10 mb-10 
                    bg-gray-700 border-2 border-gray-500 rounded-lg shadow-lg p-6 text-xl font-bold 
                    text-center"
                    >
                      No game Found.
                    </h2>
                  )}

                  {downLaoding && !upLaoding && (
                    <h2 className="text-white flex item-center justify-center w-[100%] mt-20 mb-10">
                      <LoaderSpinner />
                    </h2>
                  )}
                </div>

                <div
                  className={`right-side lg:block pading-right  ${
                    isFilterOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="w-full sm:sticky sm:top-[150px] pading-rights scroll-hide sm:overflow-auto sm:h-[calc(100vh-155px)]">
                    <ResultsFilters
                      handleChangeListOrCardView={handleChangeListOrCardView}
                      selectedOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                    />
                    <ResultsRight />
                    <ResultsFiltersMoreCalenders
                      handleChangeListOrCardView={handleChangeListOrCardView}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-md:hidden">
            <Footer />
          </div>
          <div className="md:hidden block">
            <FooterDetailed />
          </div>
          <GameStatusPopup
            setSelectedGame={setSelectedGame}
            selectedGame={selectedGame}
            visible={visible}
            clickBeatGameStatus={false}
            handleDeviceClick={handleDeviceClick}
            selectedGameRelease={selectedGameRelease}
            setSelectedGameRelease={setSelectedGameRelease}
            deviceData={deviceData}
            setVisible={setVisible}
            selectedDevices={selectedDevices}
            progressData={progressData}
            beatStatus={beatStatus}
            setBeatStatus={setBeatStatus}
            handleSubmitProgressFromGameStatus={
              handleSubmitProgressFromGameStatus
            }
            hoursPlayed={hoursPlayed}
          />
        </>
      )}
      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </>
  );
};

export default GamesDirectory;

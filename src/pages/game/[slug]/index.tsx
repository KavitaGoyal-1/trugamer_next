import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { GetServerSideProps } from "next";
import {
  getGameBySlug,
  getGameBySlugForRating,
} from "@/utills/games/get-game-by-slug";
import { getUserReview } from "@/utills/games/get-user-reviews";
import { getGameAnalytics, getGameStatsCount } from "@/services/game";
import { setNewGameRating } from "@/store/slices/game-data-slice";
import LoginModal from "@/components/login-modal/login-modal";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import { updateGameStatus } from "@/store/slices/game-hours";
import { toastMessage } from "@/utills/toast";
import { getUsersActivity } from "@/utills/games/get-activity-feed";
import VideoPost from "@/components/game-details/game-details-left/video-post";
import MediaImages from "@/components/game-details/game-details-left/media-images";
import Season from "@/components/game-details/game-details-left/season";
import GameDetailNavbarSection from "@/components/game-details/game-detail-navbar-section";
import GameDetailsSections from "@/components/game-details/game-details-left/game-details-sections";
import ActivityFeed from "@/components/game-details/game-details-left/activity-feed";
import VideoCard from "@/components/game-details/game-details-left/video-card";
import NewGameDetailsRight from "@/components/game-details/game-details-right/new-game-details-right";
import { getApi } from "@/utills/get-api";
import {
  selectAuthState,
  status,
  storeOutsideToggle,
} from "@/store/slices/auth-slice";
import NavigationPublic from "@/components/layouts/navigation-public";
import GameStatusPopup from "@/components/game-status-popup";
import Footer from "@/components/layouts/footer";
import { IGame, IReview } from "@/types/game";
import { getToken } from "@/utills/cookies";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import RelatedGames from "@/components/game-details/related-games/related-games";
import GameDetailsLeft from "@/components/game-details/game-details-left";
import FooterDetailed from "@/components/layouts/footer-detailed";
import GameDetailsPopUp from "@/components/game-details/game-details-popup";
import { usePathname } from "next/navigation";

interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}
const NewGameDetailsPage = ({
  game_data,
  review_data,
  analytics_data,
  slug,
  queryParams,
}: GameDetailsProps) => {
  console.log(review_data, "11111111111111111111111111");
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const [relatedVisible, setRelatedVisible] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<any>();
  const { id } = userData;
  //   const requestedData: any = useLoaderData();
  const [selectedSection, setSelectedSection] = useState("Overview");
  //   const { review: userReviewData } = useLoaderData() as LoaderData;
  const [reviews, setReviews] = useState(review_data);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("Popular");
  const [activeTab, setActiveTab] = useState("details");
  const [showMoadl, setLoadModal] = useState(true);
  const [activityFeedData, setActivityFeedData] = useState([]);
  const game: IGame = game_data?.data[0];
  const [selectedGame, setSelectedGame] = useState<any>(game);
  const review: IReview[] | null = review_data;
  const { coverImage, related_games, image } = game?.attributes || {};
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [loadingOnProgress, setLoadingOnProgress] = useState(false);
  const [selectedDevicesRelatedGames, setSelectedDevicesRelatedGames] =
    useState<Device[]>([]);
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [progressDataRelatedGames, setProgressDataRelatedGames] = useState<
    ProgressDataItem[]
  >([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadFromDetails, setLoadFromDetails] = useState<boolean>(false);
  const [updateDeviceId, setUpdateDeviceId] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<ProgressDataItem | null>(null);
  const [reviewId, setReviewId] = useState("");
  const [showDataInPopup, setshowDataInPopup] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const gameHours = useSelector((state: any) => state?.gameHourSlice?.data);
  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);
  const dispatch = useDispatch();
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  const visibleData = useSelector(
    (state: any) => state?.gameHourSlice?.visible
  );
  const handleCloseLogin = () => setIsOpenLogin(false);

  const userId = !!id;
  const token = getToken();

  useEffect(() => {
    if (!relatedVisible) {
      setProgressDataRelatedGames([]); // Reset progress data when visible is false
      return;
    }
  }, [relatedVisible]);

  useEffect(() => {
    if (userId === true && token !== undefined) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }
  }, []);
  useEffect(() => {
    if (slug) {
      fetchLikeCountsAndReports();
    }
  }, [id, selectedReviewFilter]);

  //   useEffect(() => {
  //     if (location.state?.fromLatestReviewCard) {
  //       setLoadModal(false); // Set the modal to false only when coming from LatestReviewCard
  //       const reviewId = location.state?.reviewId; // Access reviewId from state
  //       if (reviewId) {
  //         setReviewId(reviewId); // Set the reviewId state (assuming you have a setReviewId function)
  //       }
  //     }
  //   }, [location.state, setLoadModal, setReviewId]);

  const fetchLikeCountsAndReports = async () => {
    console.log("rating 2");
    try {
      const { data } = await axios.get(`${getApi()}/game-rating/${slug}`);
      console.log("outside 3", data);
      const updatedReviews = await Promise.all(
        data?.map(async (review: any) => {
          const likeResponse = await axios.get(`${getApi()}/rating-likes`, {
            params: {
              "filters[rating][id]": review.id,
              "filters[isDeleted][$eq]": false,
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          const likeCount = likeResponse.data.data.length;
          const userLikeResponse = await axios.get(`${getApi()}/rating-likes`, {
            params: {
              "filters[user][id]": id,
              "filters[rating][id]": review.id,
              "filters[isDeleted][$eq]": false,
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          const likedByCurrentUser = userLikeResponse?.data?.data?.length > 0;

          const reportResponse = await axios.get(
            `${getApi()}/game-ratings?populate=reported_by`,
            {
              params: {
                "filters[id][$eq]": review.id,
                "filters[reported_by][id][$eq]": id,
              },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const reportedByCurrentUser = reportResponse?.data?.data?.length > 0;

          return {
            ...review,
            likeCount,
            likedByCurrentUser,
            reportedByCurrentUser,
          };
        })
      );
      let sortedReviews = [...updatedReviews];
      if (selectedReviewFilter === "Popular") {
        sortedReviews = updatedReviews.sort(
          (a, b) => b.likeCount - a.likeCount
        );
      } else if (selectedReviewFilter === "Recent") {
        sortedReviews = updatedReviews.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      setReviews(sortedReviews);
    } catch (error) {
      console.error("Error fetching like counts and reports:", error);
    }
  };

  useEffect(() => {
    if (review_data && review_data.length) {
      let i = review_data.findIndex((rev: IReview) => rev?.user!?.id == id);
    }
  }, [review_data]);

  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getPlayedAndQueuedCount = async () => {
    try {
      const gameId = game.id;
      if (gameId) {
        await getGameStatsCount(gameId as number);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getPlayedAndQueuedCount();
  }, []);

  const getGameAnalytics = async (slug: string) => {
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const data = (
        await axios.get(`${getApi()}/game/getAnalytics/${slug}`, config)
      ).data;
      if (data) {
        setAnalytics(data);
      } else null;
    } catch (error) {
      GameDetailNavbarSection;
      return error;
    }
  };
  const handlePlayedHoursUpdate = (data: string) => {
    console.log("inside handle played hours update");
    if (data) {
      getGameAnalytics(data);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchActivityData = async (id: number) => {
    if (id) {
      try {
        const data = await getUsersActivity(id);
        console.log(data, "::data::");
        setActivityFeedData(data);
      } catch (error) {
        console.error("Error fetching user activity:", error);
      }
    }
  };

  const getGameNewReview = async () => {
    try {
      const getRating = await getGameBySlugForRating(game?.attributes?.slug);
      const rating = getRating?.data[0]?.attributes?.averageRating;
      dispatch(setNewGameRating(rating));
      //  setNewGameRating
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGameNewReview();
    fetchActivityData(game?.id);
  }, [game?.id, relatedVisible, visibleData, reviews]);

  const releaseDetails = game?.attributes?.releaseByPlatforms?.release?.map(
    (release: any) => {
      return {
        releaseDate: release?.releaseDate,
        releaseTimePeriod: release?.releaseTimePeriod,
        deviceName: release?.device?.data?.attributes?.name,
      };
    }
  );

  let latestRelease: string | undefined;
  let exactDate: string | undefined;

  // Function to check if a date is in the format "MMM DD, YYYY"
  const isValidTimePeriod = (dateStr: string): boolean => {
    return /^[A-Za-z]{3} \d{2}, \d{4}$/.test(dateStr);
  };

  // Function to format a date to "MM/DD/YYYY"
  const formatToMMDDYYYY = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (releaseDetails && releaseDetails.length > 0) {
    const allValidTimePeriods = releaseDetails.every((release: any) =>
      isValidTimePeriod(release.releaseTimePeriod)
    );

    if (allValidTimePeriods) {
      // Sort by releaseTimePeriod (earliest first) and take the earliest
      const earliestTimePeriod = releaseDetails.sort(
        (a: any, b: any) =>
          new Date(a.releaseTimePeriod).getTime() -
          new Date(b.releaseTimePeriod).getTime()
      )[0].releaseTimePeriod;

      latestRelease = formatToMMDDYYYY(earliestTimePeriod);
    } else {
      // Sort by releaseDate (earliest first) and take the earliest
      const earliestRelease = releaseDetails.sort(
        (a: any, b: any) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      )[0];

      exactDate =
        earliestRelease.releaseTimePeriod || earliestRelease.releaseDate;
    }
  }

  let releaseDate: any;
  let currentDate: any;
  let isGreater: any;

  if (latestRelease) {
    releaseDate = new Date(latestRelease); // This will parse MM/DD/YYYY correctly
    currentDate = new Date(); // Already a Date object
    isGreater = currentDate.getTime() < releaseDate.getTime(); // Use getTime() for accurate comparison
  }
  const handleClickTabs = (urlData: any) => {
    setSelectedSection(urlData);
  };
  const handleNavigation = async () => {
    const storedSlug = localStorage.getItem("firstSlug");
    const storedSelectionTab = localStorage.getItem("firstselectedTab");
    // setProgressData([]);
    if (slug == storedSlug && storedSelectionTab) {
      setSelectedSection(storedSelectionTab && storedSelectionTab);
      localStorage.removeItem("firstSlug");
      localStorage.removeItem("firstselectedTab");
    } else {
      setSelectedSection("Overview");
    }
  };

  useEffect(() => {
    getGameAnalytics(slug);
    getPlayedAndQueuedCount();
    handleNavigation();
  }, [slug, gameHours, reviews]);

  const handleClickSeasonOrExpansion = (gameSlug: any) => {
    localStorage.setItem("firstSlug", slug);
    localStorage.setItem("firstselectedTab", selectedSection);
    // navigate(`/game/${gameSlug}`);
    window.open(`/game/${gameSlug}`, "_blank");
  };

  useEffect(() => {
    if (id) {
      if (relatedVisible || visibleData) {
        fetchSelectedDevices();
      }
    }
  }, [id, game?.id, relatedVisible, visibleData]);

  const fetchSelectedDevices = async () => {
    const gameId = relatedVisible ? selectedGame?.id : game?.id;
    if (relatedVisible) {
      try {
        const response = await axios.get(
          `${getApi()}/game-statuses?filters[user][id][$eq]=${id}&filters[game][id][$eq]=${gameId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressSectionData = response?.data?.data;
        if (progressSectionData?.length > 0) {
          setshowDataInPopup(true);
          setProgressDataRelatedGames(progressSectionData);
        }
        const selectedDevicesFromApi = response?.data?.data?.map(
          (status: any) => ({
            deviceName: status?.attributes?.device_name,
            deviceId: status.id,
            is_deleted: status?.attributes?.is_deleted,
          })
        );
        setSelectedDevicesRelatedGames(selectedDevicesFromApi);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.get(
          `${getApi()}/game-statuses?filters[user][id][$eq]=${id}&filters[game][id][$eq]=${gameId}&populate=device`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressSectionData = response?.data?.data;
        console.log(response, "progressSectionData");
        if (progressSectionData?.length > 0) {
          setshowDataInPopup(true);
          setProgressData(progressSectionData);
        }
        const selectedDevicesFromApi = response?.data?.data?.map(
          (status: any) => ({
            deviceName: status?.attributes?.device_name,
            deviceId: status.id,
            is_deleted: status?.attributes?.is_deleted,
          })
        );
        setSelectedDevices(selectedDevicesFromApi);
        return progressSectionData;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createOrUpdateDevice = async (
    deviceName: string,
    isSelected: boolean,
    deviceId: number,
    deviceIdNew: any
  ) => {
    const gameId = relatedVisible ? selectedGame.id : game?.id;

    const payload = {
      data: {
        hours_played: 0,
        beat_status: "Never Beat",
        user: { id: id },
        device: { id: deviceId },
        game: { id: gameId },
        device_name: deviceName,
      },
    };

    try {
      setGlobalLoading(true);
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${id}/${gameId}/${deviceName}`,
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

      await fetchSelectedDevices();
    } catch (error) {
      console.error("Error creating/updating device:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  // useEffect(() => {
  //   if (visibleData) {
  //     fetchSelectedDevicesOnOwnership();
  //     console.log(visibleData, "visibleData ll");
  //   }
  //   console.log(visibleData, "visibleData hh");
  // }, [id, game?.id, visibleData]);

  const fetchSelectedDevicesOnOwnership = async () => {
    const gameId = relatedVisible ? selectedGame?.id : game?.id;
    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${id}&filters[game][id][$eq]=${gameId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const progressSectionData = response?.data?.data;
      // console.log(progressSectionData, "progressSectionData::");
      if (progressSectionData?.length > 0) {
        setshowDataInPopup(true);
        setProgressData(progressSectionData);
      }
      const selectedDevicesFromApi = response?.data?.data?.map(
        (status: any) => ({
          deviceName: status?.attributes?.device_name,
          deviceId: status.id,
          is_deleted: status?.attributes?.is_deleted,
        })
      );
      setSelectedDevices(selectedDevicesFromApi);
      return progressSectionData;
    } catch (error) {
      console.log(error);
    }
  };

  // remove Game Library
  const removeGameLibrary = async (deviceName: any, deviceId: any) => {
    let gameId = selectedGame?.id ?? game?.id;
    userData?.gamesLibrary?.forEach((library: any) => {
      if (
        library?.game?.id === selectedGame?.game?.id ||
        library?.game?.id === selectedGame?.id
      ) {
        gameId = library.id;
      }
    });
    try {
      await axios.delete(
        `${getApi()}/users-permissions/user/library/remove/${gameId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await callUserApi();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  // remove Beat Game
  const removeBeatGame = async () => {
    selectedDevices.forEach((device: any) => {
      if (device.is_deleted === false) {
        const progressDevice = progressData.find(
          (progress) =>
            progress.attributes.device_name === device.deviceName &&
            progress.attributes.is_deleted === false
        );

        if (
          progressDevice &&
          progressDevice.attributes.beat_status !== "Never Beat"
        ) {
          // Proceed to call the API since conditions are met
          removeDeviceFromBeatGame(device.deviceId);
        }
      }
    });
  };

  const removeDeviceFromBeatGame = async (deviceId: any) => {
    try {
      const gameId = selectedGame?.id ?? game?.id;
      await axios.delete(
        `${getApi()}/users-permissions/user/beat-game/remove/${gameId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await callUserApi();
    } catch (error: any) {
      toastMessage("error", error.response.data.error.message);
    }
  };

  const addGameLibrary = async () => {
    let selectedId = selectedGame?.id ?? game?.id;

    const releases =
      (
        game?.attributes?.releaseByPlatforms?.release ||
        game?.attributes?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: item.releaseDate, // Extract release date
        device: {
          id: item?.device?.data?.id, // Access device ID from the nested data field
        },
      })) || [];
    // console.log(releases, "releases");
    const payload = {
      gamelibrary: [
        {
          game: {
            id: selectedId,
          },
          releases: releases,
        },
      ],
    };

    try {
      // Delay the request slightly before sending it
      await axios.post(
        `${getApi()}/users-permissions/user/library/add`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle successful library addition
      fetchActivityData(game?.id);
      await callUserApi();
    } catch (error: any) {
      // Handle error during API call
      toastMessage("error", error.response.data.error.message);
    }
  };

  const addDeviceFromBeatGame = async () => {
    let selectedId = selectedGame?.id ?? game?.id;

    const releases =
      (
        game?.attributes?.releaseByPlatforms?.release ||
        game?.attributes?.releaseByPlatforms?.release
      )?.map((item: any) => ({
        releaseDate: item.releaseDate, // Extract release date
        device: {
          id: item?.device?.data?.id, // Access device ID from the nested data field
        },
      })) || [];

    const payload = {
      game_id: {
        id: selectedId,
      },
      releases: releases,
    };

    try {
      // Delay the request slightly before sending it
      await axios.post(
        `${getApi()}/users-permissions/user/beat-game`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle successful library addition
      await callUserApi();
    } catch (error: any) {
      // Handle error during API call
      toastMessage("error", error.response.data.error.message);
    }
  };

  const addBeatGame = async () => {
    selectedDevices.forEach((device: any) => {
      if (device.is_deleted === false) {
        const progressDevice = progressData.find(
          (progress) =>
            progress.attributes.device_name === device.deviceName &&
            progress.attributes.is_deleted === false
        );

        if (
          progressDevice &&
          progressDevice.attributes.beat_status !== "Never Beat"
        ) {
          // Proceed to call the API since conditions are met
          addDeviceFromBeatGame();
        }
      }
    });
  };

  // For Ownership
  const createOrUpdateDeviceOwnership = async (
    deviceName: string,
    isSelected: boolean,
    deviceId: number,
    deviceIdNew: any
  ) => {
    const gameId = relatedVisible ? selectedGame.id : game?.id;

    const payload = {
      data: {
        hours_played: 0,
        beat_status: "Never Beat",
        user: { id: id },
        device: { id: deviceId },
        game: { id: gameId },
        device_name: deviceName,
      },
    };

    try {
      setGlobalLoading(true);
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${id}/${gameId}/${deviceName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let updateDeviceId = response?.data?.data?.id; // Get the existing status ID

      if (updateDeviceId) {
        console.log("console");
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
          const progress = await fetchSelectedDevicesOnOwnership();

          const hasActiveProgress =
            progress &&
            progress?.length > 0 &&
            progress?.every(
              (item: any) => item?.attributes?.is_deleted === true
            );

          const isInLibrary = userData?.gamesLibrary?.some((library: any) => {
            return library?.game?.id == selectedGame?.id;
          });

          if (hasActiveProgress && isInLibrary) {
            await removeGameLibrary(deviceName, deviceId);
          }

          const activeProgressData =
            progress &&
            progress?.length > 0 &&
            progress?.filter(
              (item: any) => item.attributes.is_deleted === false
            );
          // Check if all beat statuses are "Never Beat" among non-deleted items
          const allNeverBeat =
            activeProgressData &&
            activeProgressData?.every(
              (item: any) => item.attributes.beat_status === "Never Beat"
            );

          const gameInBeatenGames = userData.beaten_games?.some((now: any) => {
            return now?.game?.id == selectedGame?.id;
          });

          if (allNeverBeat && gameInBeatenGames) {
            await removeBeatGame();
          }
          // else{
          //   await axios.put(
          //     `${getApi()}/game-statuses/${updateDeviceId}`,
          //     deletePayload,
          //     {
          //       headers: {
          //         Authorization: `Bearer ${token}`,
          //       },
          //     }
          //   );
          // }
          // removeGameLibrary(deviceName, deviceId);
          // removeBeatGame();
        } else {
          // When isSelected is true, restore the device (is_deleted = false)
          const updatePayload = {
            data: {
              is_deleted: false,
            },
          };
          const hasActiveProgress =
            progressData &&
            progressData.length > 0 &&
            progressData.some(
              (item: any) => item.attributes.is_deleted === false
            );
          // console.log(!hasActiveProgress, ":: progressData");

          const isInLibrary = userData?.gamesLibrary?.some((library: any) => {
            return library?.game?.id == selectedGame?.id;
          });
          // console.log(!isInLibrary, ":: progressData");

          if (!hasActiveProgress && !isInLibrary) {
            await axios.put(
              `${getApi()}/game-statuses/${updateDeviceId}`,
              updatePayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            addGameLibrary();
          } else {
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
          const progress = await fetchSelectedDevicesOnOwnership();
          const activeProgressData =
            progress &&
            progress?.length > 0 &&
            progress?.filter(
              (item: any) => item?.attributes?.is_deleted === false
            );

          const gameInBeatenGames = userData?.beaten_games?.some((now: any) => {
            return now?.game?.id == selectedGame?.id;
          });

          // Check if at least one beat status is not "Never Beat" among non-deleted items
          const hasBeatenStatus =
            activeProgressData &&
            activeProgressData?.some(
              (item: any) => item?.attributes?.beat_status !== "Never Beat"
            );
          // console.log(
          //   activeProgressData,
          //   hasBeatenStatus,
          //   !gameInBeatenGames,
          //   "allNeverBeat"
          // );
          if (hasBeatenStatus && !gameInBeatenGames) {
            addBeatGame();
          }
          // addGameLibrary();
          // addBeatGame();
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

      await fetchSelectedDevicesOnOwnership();
    } catch (error) {
      console.error("Error creating/updating device:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  // For Ownership
  const callUserApi = async () => {
    const { data } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(data?.gamesLibrary, data?.beaten_games, "gamesLibrary");
    let payload = {
      userData: {
        playingNow: data?.playingNow,
        // playing_now: data?.playing_now,
        playingNext: data?.playingNext,
        beaten_games: data?.beaten_games,
        played_hour: data?.played_hour,
        gamesLibrary: data?.gamesLibrary,
      },
    };
    dispatch(status(payload));
  };

  const handleDeviceClick = async (device: any, deviceReleaseDate: any) => {
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }
    if (token) {
      // setGlobalLoading(true);
      const deviceName = device?.attributes?.name;
      const deviceId = device?.id;

      const isSelected = selectedDevices.some(
        (d: any) => d?.deviceName === deviceName && d?.is_deleted === false
      );

      const filteredValue: any = selectedDevices.find(
        (element: any) => element?.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;
      const updatedDevices = isSelected
        ? selectedDevices.filter((d: any) => d?.deviceName !== deviceName)
        : [...selectedDevices, { deviceName, deviceId, is_deleted: false }];

      setSelectedDevices(updatedDevices);
      await createOrUpdateDevice(
        deviceName,
        !isSelected,
        deviceId,
        deviceIdNew
      );
    } else {
      // Redirect to login if the user is not authenticated
      // navigate("/auth/sign-in");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
  };

  // For Ownership
  const handleOwnershipDeviceClick = async (
    device: any,
    deviceReleaseDate: any
  ) => {
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }
    if (token) {
      // setGlobalLoading(true);
      const deviceName = device?.attributes?.name;
      const deviceId = device?.id;

      const isSelected = selectedDevices.some(
        (d: any) => d?.deviceName === deviceName && d?.is_deleted === false
      );

      const filteredValue: any = selectedDevices.find(
        (element: any) => element?.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;
      const updatedDevices = isSelected
        ? selectedDevices.filter((d: any) => d?.deviceName !== deviceName)
        : [...selectedDevices, { deviceName, deviceId, is_deleted: false }];

      setSelectedDevices(updatedDevices);
      await createOrUpdateDeviceOwnership(
        deviceName,
        !isSelected,
        deviceId,
        deviceIdNew
      );
      // console.log(game?.id, "game?.id");
    } else {
      // Redirect to login if the user is not authenticated
      // navigate("/auth/sign-in");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
  };

  const handleDeviceClickOnRelatedGames = async (
    device: any,
    deviceReleaseDate: any
  ) => {
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }
    if (token) {
      // setGlobalLoading(true);
      const deviceName = device?.attributes?.name;
      const deviceId = device?.id;

      const isSelected = selectedDevicesRelatedGames.some(
        (d: any) => d?.deviceName === deviceName && d?.is_deleted === false
      );

      const filteredValue: any = selectedDevicesRelatedGames.find(
        (element: any) => element?.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;
      const updatedDevices = isSelected
        ? selectedDevicesRelatedGames.filter(
            (d: any) => d?.deviceName !== deviceName
          )
        : [
            ...selectedDevicesRelatedGames,
            { deviceName, deviceId, is_deleted: false },
          ];

      setSelectedDevicesRelatedGames(updatedDevices);
      await createOrUpdateDevice(
        deviceName,
        !isSelected,
        deviceId,
        deviceIdNew
      );
    } else {
      // Redirect to login if the user is not authenticated
      // navigate("/auth/sign-in");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
  };

  const handleSubmitProgress = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        data: {
          beat_status: beatStatus,
          hours_played: hoursPlayed,
        },
      };
      setLoadingOnProgress(true);
      const response = await axios.put(
        `${getApi()}/custom-game-statuses-hours/${updateDeviceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadingOnProgress(false);
      dispatch(updateGameStatus(response?.data));
      const progress: any = await fetchSelectedDevices();

      const activeProgressData =
        progress &&
        progress?.length > 0 &&
        progress?.filter((item: any) => item?.attributes?.is_deleted === false);

      const gameInBeatenGames = userData?.beaten_games?.some((now: any) => {
        return now?.game?.id == selectedGame?.id;
      });

      const allNeverBeat =
        activeProgressData &&
        activeProgressData?.every(
          (item: any) => item?.attributes?.beat_status === "Never Beat"
        );

      // Check if at least one beat status is not "Never Beat" among non-deleted items
      const hasBeatenStatus =
        activeProgressData &&
        activeProgressData?.some(
          (item: any) => item?.attributes?.beat_status !== "Never Beat"
        );

      if (hasBeatenStatus && !gameInBeatenGames) {
        addBeatGame();
      }

      if (allNeverBeat && gameInBeatenGames) {
        await removeBeatGame();
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
    setShowModal(false);
    setLoadingOnProgress(false);
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
      await fetchSelectedDevices();
    } catch (error) {
      console.error("Error during API call:", error);
    }
    setShowModal(false);
    setLoadingOnProgress(false);
  };

  const handleHoursChange = (e: any) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10000)) {
      setHoursPlayed(value);
    } else {
      toastMessage("error", "Played hours should be less than equal to 10,000");
    }
  };
  const handleEditClick = (item: ProgressDataItem) => {
    setUpdateDeviceId(item.id);
    setCurrentItem(item);
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played.toString());
    setShowModal(true);
  };

  const navRef = useRef<HTMLDivElement | null>(null);
  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
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

  return (
    <>
      <section className="min-h-screen d-flex items-center h-full bg-[#020612]">
        <div className="header-Bg">
          <NavigationPublic text={[""]} token={token} />
        </div>

        {isModalOpen && (
          <GameDetailsPopUp
            setIsModalOpen={setIsModalOpen}
            game_data={game_data}
          />
        )}
        <div
          className={
            isToggle
              ? "menucomon mobile-menus top-0"
              : "menucomon mobile-right top-0"
          }
          ref={navRef}
        >
          <NewVerticalNavigation token={token} />
        </div>
        {image?.data !== null && (
          <div
            style={{
              backgroundImage: `linear-gradient(0deg, #020612 0%, rgba(10,11,24,0.7988445378151261) 58%, rgba(9,10,22,0.20220588235294112) 100%), url(${image?.data?.attributes?.url})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              height: "100vh",
              opacity: "1",
              top: 0,
              left: 0,
              right: 0,
            }}
            className="bg-image bg-details"
          />
        )}

        <div className="max-w-[2550px]  w-full  pr-[4%] pl-[4%] sm:pl-[5%] md:px-[10%] mx-auto sm:mt-[80px] md:pt-[45px] mt-[70px] flex max-lg:flex-col 2xl:gap-x-[33px] gap-x-[20px] gap-y-[0px] sm:gap-y-[14px] pb-5 md:pb-8 relative">
          <div className="xl:w-[70%] lg:w-[65%] w-[100%] pt-12 md:pt-[0px]">
            <GameDetailsLeft
              isUserAuth={userAuthenticated}
              game={game?.attributes}
              setIsModalOpen={setIsModalOpen}
              reviews={review}
              analytics={analytics}
              getPlayedAndQueuedCount={getPlayedAndQueuedCount}
              slug={slug}
              handlePlayedHoursUpdate={handlePlayedHoursUpdate}
              // showMoadl={showMoadl}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              queryParams={queryParams ? queryParams : ""}
              setRelatedVisible={setRelatedVisible}
              selectedDevices={selectedDevices}
              handleDeviceClick={handleDeviceClick}
              progressData={progressData}
              beatStatus={beatStatus}
              setBeatStatus={setBeatStatus}
              hoursPlayed={hoursPlayed}
              setHoursPlayed={setHoursPlayed}
              handleEditClick={handleEditClick}
              handleSubmitProgressFromGameStatus={
                handleSubmitProgressFromGameStatus
              }
              coverImage={coverImage}
            />
            {activeTab == "details" && (
              <>
                <GameDetailNavbarSection
                  gameData={game?.attributes}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  showMoadl={showMoadl}
                  handleClickTabs={handleClickTabs}
                />
                <div className="block mt-5">
                  {selectedSection === "Overview" && (
                    <>
                      {/* {showMoadl && ( */}
                      <div className="relative w-full flex">
                        <div className="w-full md:pt-0">
                          <GameDetailsSections
                            reviewId={reviewId}
                            showMoadl={showMoadl}
                            setLoadModal={setLoadModal}
                            gameData={game?.attributes}
                            userId={id}
                            review={review}
                            fetchLikeCountsAndReports={
                              fetchLikeCountsAndReports
                            }
                            reviews={reviews}
                            setReviews={setReviews}
                            token={token}
                            gameSlug={slug}
                            isGreater={isGreater}
                            setLoadFromDetails={setLoadFromDetails}
                          />
                          <div className="flex gap-3 max-xl:flex-col">
                            {!isGreater && activityFeedData?.length > 0 && (
                              <div
                                className={`${
                                  game?.attributes?.videos &&
                                  game?.attributes?.videos?.length > 0
                                    ? "xl:w-[40%]"
                                    : "w-full"
                                } bg-[#15182B] mt-2.5 md:p-5 rounded-14px px-3 py-5`}
                              >
                                <ActivityFeed
                                  isVideo={
                                    Object.keys(game?.attributes)?.length < 0
                                  }
                                  activityFeedData={activityFeedData}
                                  activityMode={
                                    related_games?.data &&
                                    related_games?.data?.length > 0 &&
                                    related_games?.data
                                  }
                                  game_data={game_data}
                                />
                              </div>
                            )}
                            {game?.attributes?.videos &&
                              game?.attributes?.videos?.length > 0 && (
                                <div
                                  className={`${
                                    !isGreater && activityFeedData?.length > 0
                                      ? "xl:w-[59%]"
                                      : "w-full"
                                  }`}
                                >
                                  <VideoCard
                                    itemView={2}
                                    gameData={game?.attributes}
                                  />
                                </div>
                              )}
                          </div>

                          {related_games && related_games?.data?.length > 0 && (
                            <RelatedGames
                              token={token}
                              games={related_games?.data}
                              visible={relatedVisible}
                              setIsOpenLoginStatus={setIsOpenLoginStatus}
                              setVisible={setRelatedVisible}
                              setSelectedGame={setSelectedGame}
                              selectedGame={selectedGame}
                              setUpdatedAnalytics={setAnalytics}
                              showMoadl={showMoadl}
                            />
                          )}
                        </div>
                      </div>
                      {/* )} */}
                    </>
                  )}

                  {selectedSection === "Game Hub" && (
                    <div className="relative w-full flex">
                      <div className="w-full gap-5 flex flex-col bg-none md:bg-cBlue-secondary rounded-3xl md:py-5 md:px-7 py-0 px-0">
                        <VideoPost />
                        <div className="gradient-divider relative"></div>
                        <VideoPost />
                      </div>
                    </div>
                  )}

                  {selectedSection === "Media" && (
                    <div className="relative w-full flex">
                      <div className="w-full  md:pt-0 gap-3 flex flex-col">
                        <MediaImages gameData={game?.attributes} />
                        <VideoCard
                          itemView={3}
                          selectedSection={selectedSection}
                          gameData={game?.attributes}
                        />
                      </div>
                    </div>
                  )}

                  {selectedSection === "Seasons & Expansions" && (
                    <div className="relative w-full flex">
                      <div className="w-full  md:pt-0 gap-3 flex flex-col">
                        <Season
                          title="Seasons"
                          gameData={game?.attributes}
                          type="Seasons"
                          handleClickSeasonOrExpansion={
                            handleClickSeasonOrExpansion
                          }
                        />
                        <Season
                          title="Expansions"
                          gameData={game?.attributes}
                          type="Expansions"
                          handleClickSeasonOrExpansion={
                            handleClickSeasonOrExpansion
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {/* {showMoadl && ( */}
          <>
            {activeTab == "stats" && isMobile && (
              <div className="xl:w-[30%] lg:w-[35%] md:w-[95%] w-[100%] mt-0 sm:mt-0">
                <NewGameDetailsRight
                  userId={id}
                  analyticsHours={analytics}
                  gameData={game?.attributes}
                  analytics_data={analytics_data}
                  gameSlug={slug}
                  fetchLikeCountsAndReports={fetchLikeCountsAndReports}
                  analytics={analytics}
                  isGreater={isGreater}
                  latestRelease={latestRelease}
                  exactDate={exactDate}
                  selectedDevices={selectedDevices}
                  setSelectedDevices={setSelectedDevices}
                  setProgressData={setProgressData}
                  progressData={progressData}
                  createOrUpdateDevice={createOrUpdateDevice}
                  // handleDeviceClick={handleDeviceClick}
                  loadingOnProgress={loadingOnProgress}
                  handleOwnershipDeviceClick={handleOwnershipDeviceClick}
                  setGlobalLoading={setGlobalLoading}
                  globalLoading={globalLoading}
                  setBeatStatus={setBeatStatus}
                  beatStatus={beatStatus}
                  setHoursPlayed={setHoursPlayed}
                  hoursPlayed={hoursPlayed}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  setUpdateDeviceId={setUpdateDeviceId}
                  updateDeviceId={updateDeviceId}
                  handleSubmitProgress={handleSubmitProgress}
                  handleHoursChange={handleHoursChange}
                  currentItem={currentItem}
                  setCurrentItem={setCurrentItem}
                  handleEditClick={handleEditClick}
                />
              </div>
            )}
            {!isMobile && (
              <div className="xl:w-[30%] lg:w-[35%] md:w-[90%] w-full mt-8 lg:mt-[236px] relative">
                <NewGameDetailsRight
                  userId={id}
                  gameData={game?.attributes}
                  analytics_data={analytics_data}
                  analyticsHours={analytics}
                  gameSlug={slug}
                  fetchLikeCountsAndReports={fetchLikeCountsAndReports}
                  analytics={analytics}
                  isGreater={isGreater}
                  latestRelease={latestRelease}
                  exactDate={exactDate}
                  selectedDevices={selectedDevices}
                  setSelectedDevices={setSelectedDevices}
                  setProgressData={setProgressData}
                  progressData={progressData}
                  createOrUpdateDevice={createOrUpdateDevice}
                  // handleDeviceClick={handleDeviceClick}
                  loadingOnProgress={loadingOnProgress}
                  handleOwnershipDeviceClick={handleOwnershipDeviceClick}
                  setGlobalLoading={setGlobalLoading}
                  globalLoading={globalLoading}
                  setBeatStatus={setBeatStatus}
                  beatStatus={beatStatus}
                  setHoursPlayed={setHoursPlayed}
                  hoursPlayed={hoursPlayed}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  setUpdateDeviceId={setUpdateDeviceId}
                  updateDeviceId={updateDeviceId}
                  handleSubmitProgress={handleSubmitProgress}
                  handleHoursChange={handleHoursChange}
                  currentItem={currentItem}
                  setCurrentItem={setCurrentItem}
                  handleEditClick={handleEditClick}
                />
              </div>
            )}
          </>
          {/* )}  */}
        </div>
      </section>

      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block ">
        <FooterDetailed />
      </div>
      <GameStatusPopup
        visible={relatedVisible}
        setVisible={setRelatedVisible}
        selectedRelatedGame={selectedGame}
        setSelectedRelatedGame={setSelectedGame}
        clickBeatGameStatus={false}
        deviceData={selectedGame?.attributes?.devices}
        selectedDevices={selectedDevicesRelatedGames}
        slug={slug}
        getPlayedAndQueuedCount={getPlayedAndQueuedCount}
        handleDeviceClick={handleDeviceClickOnRelatedGames}
        progressData={progressDataRelatedGames}
        beatStatus={beatStatus}
        setBeatStatus={setBeatStatus}
        hoursPlayed={hoursPlayed}
        handleSubmitProgressFromGameStatus={handleSubmitProgressFromGameStatus}
        handlePlayedHoursUpdate={handlePlayedHoursUpdate}
      />
      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />

      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </>
  );
};

export default NewGameDetailsPage;

// export const getServerSideProps: GetServerSideProps = async ({
//   params,
//   req,
// }) => {
//   const slug = params?.slug as string;

//   try {
//     const game_data = await getGameBySlug(slug);
//     const review_data = await getUserReview(slug);
//     const analyticsData = await getGameAnalytics(slug);
//     if (!game_data) {
//       return {
//         notFound: true, // Show 404 page if game is not found
//       };
//     }

//     return {
//       props: {
//         game_data: game_data,
//         review_data: review_data,
//         analytics_data: analyticsData,
//         slug,
//         queryParams: req.url?.split("?")[1] || "",
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         game: null,
//         review: null,
//         analytics: null,
//         slug: "",
//         queryParams: "",
//       },
//     };
//   }
// };

interface GameDetailsProps {
  game_data: any;
  review_data: any;
  analytics_data: any;
  slug: string;
  queryParams: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const slug = params?.slug as string;
  try {
    const game_data = await getGameBySlug(slug);
    const review_data = await getUserReview(slug);
    const analyticsData = await getGameAnalytics(slug);
    if (!game_data) {
      return { notFound: true };
    }
    return {
      props: {
        game_data,
        review_data,
        analytics_data: analyticsData,
        slug,
        queryParams: req.url?.split("?")[1] || "",
      },
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    return {
      props: {
        game_data: null,
        review_data: null,
        analytics_data: null,
        slug: "",
        queryParams: "",
      },
    };
  }
};

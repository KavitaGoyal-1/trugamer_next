import { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
// import { useLoaderData, useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiClock, FiStar } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { getGameBySlug } from "@/utills/games/get-game-by-slug";
import { getUserReview } from "@/utills/games/get-user-reviews";
import { getGameAnalytics, getGameStatsCount } from "@/services/game";
import {
  selectAuthState,
  status,
  storeOutsideToggle,
} from "@/store/slices/auth-slice";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import Footer from "@/components/layouts/footer";
import NavigationPublic from "@/components/layouts/navigation-public";
import GameDetailsLeft from "@/components/game-details/game-details-left";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import FooterDetailed from "@/components/layouts/footer-detailed";
// import GameDetailsPopUp from "../components/gameDetails/GameDetailsPopUp";
import { IReview, IGame } from "@/types/game";
import GameDetailNavbarSection from "@/components/game-details/game-detail-navbar-section";
import { getUsersActivity } from "@/utills/games/get-activity-feed";
import ReviewsSection from "@/components/game-details/game-details-left/reviews-section";
import { toastMessage } from "@/utills/toast";
import LoginModal from "@/components/login-modal/login-modal";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import { updateGameStatus } from "@/store/slices/game-hours";
import Dropdown from "@/components/game-details/game-details-left/dropdown";
interface LoaderData {
  review: Record<string, any>[];
}
interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}
const GameDetailsReviewPage = ({
  game_data,
  review_data,
  //   analytics,
  slug,
  queryParams,
  error,
}: any) => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("Popular");
  const [selectedReviewFilterIcon, setSelectedReviewFilterIcon] = useState();
  const [activeTab, setActiveTab] = useState("details");
  const [activityFeedData, setActivityFeedData] = useState([]);
  //   const game: IGame = requestedData?.game?.data[0];
  const [selectedGame, setSelectedGame] = useState<any>(game_data);
  //   const review: IReview[] | null = requestedData?.review;
  const { coverImage, image } = game_data?.attributes || {};
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [showAll, setShowAll] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [selectedDevicesRelatedGames, setSelectedDevicesRelatedGames] =
    useState<Device[]>([]);
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [progressDataRelatedGames, setProgressDataRelatedGames] = useState<
    ProgressDataItem[]
  >([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<string>("");
  // const [showModal, setShowModal] = useState<boolean>(false);
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
  // const location = useLocation();
  const pathname = usePathname();
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const handleSelectReviewFilter = (name: any, icon: any) => {
    setSelectedReviewFilter(name);
    setSelectedReviewFilterIcon(icon);
    setIsOpen(false);
  };

  const visibleData = useSelector(
    (state: any) => state?.gameHourSlice?.visible
  );
  const handleCloseLogin = () => setIsOpenLogin(false);

  const reviewOptions = [
    { name: "Popular", icon: <FiStar /> },
    { name: "Recent", icon: <FiClock /> },
  ];
  const userId = !!id;
  const token = getToken();

  useEffect(() => {
    if (userId === true && token !== undefined) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }
  }, []);
  useEffect(() => {
    fetchLikeCountsAndReports();
  }, [id, selectedReviewFilter]);

  //   useEffect(() => {
  //     if (location.state?.fromLatestReviewCard) {
  //       const reviewId = location.state?.reviewId; // Access reviewId from state
  //       if (reviewId) {
  //         setReviewId(reviewId); // Set the reviewId state (assuming you have a setReviewId function)
  //       }
  //     }
  //   }, [location.state, setReviewId]);
  const fetchLikeCountsAndReports = async () => {
    console.log("rating 3");
    try {
      console.log("outside 2");
      const { data } = await axios.get(`${getApi()}/game-rating/${slug}`);
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

  //   const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getPlayedAndQueuedCount = async () => {
    try {
      const gameId = game_data.id;
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
      const data = (await axios.get(`${getApi()}/game/getAnalytics/${slug}`))
        .data;
      if (data) {
        setAnalytics(data);
      } else null;
    } catch (error) {
      GameDetailNavbarSection;
      return error;
    }
  };
  const handlePlayedHoursUpdate = (data: string) => {
    if (data) {
      getGameAnalytics(data);
    }
  };

  const fetchActivityData = async (id: number) => {
    if (id) {
      try {
        const data = await getUsersActivity(id);
        setActivityFeedData(data?.data);
      } catch (error) {
        console.error("Error fetching user activity:", error);
      }
    }
  };
  useEffect(() => {
    fetchActivityData(game_data?.id);
  }, [game_data?.id]);

  const releaseDetails =
    game_data?.attributes?.releaseByPlatforms?.release?.map((release: any) => {
      return {
        releaseDate: release?.releaseDate,
        releaseTimePeriod: release?.releaseTimePeriod,
        deviceName: release?.device?.data?.attributes?.name,
      };
    });

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
  }, [slug, gameHours]);

  useEffect(() => {
    if (relatedVisible || visibleData) {
      fetchSelectedDevices();
    }
  }, [id, game_data?.id, relatedVisible, visibleData]);

  const fetchSelectedDevices = async () => {
    const gameId = relatedVisible ? selectedGame?.id : game_data?.id;
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
          `${getApi()}/game-statuses?filters[user][id][$eq]=${id}&filters[game][id][$eq]=${gameId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressSectionData = response?.data?.data;
        // console.log(progressSectionData, "progressSectionData");
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
    const gameId = relatedVisible ? selectedGame.id : game_data?.id;

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
      localStorage.setItem(
        "Revisedslug",
        location.pathname && location.pathname
      );
      setIsOpenLogin(true);
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
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
    // setShowModal(false);
  };

  const handleEditClick = (item: ProgressDataItem) => {
    setUpdateDeviceId(item.id);
    setCurrentItem(item);
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played.toString());
    // setShowModal(true);
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
  console.log(game_data, "gameDatattatatattatat");
  return (
    <>
      <section className="min-h-screen d-flex items-center h-full bg-[#020612]">
        <div className="header-Bg">
          <NavigationPublic text={[""]} token={token} />
        </div>

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
              game={game_data}
              setIsModalOpen={setIsModalOpen}
              reviews={review_data}
              analytics={analytics}
              getPlayedAndQueuedCount={getPlayedAndQueuedCount}
              slug={slug}
              handlePlayedHoursUpdate={handlePlayedHoursUpdate}
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
          </div>
        </div>

        <div className="md:ml-[10%] md:mr-[10%] ml-4 mr-4 flex flex-col ">
          <div className="flex flex-col mb-20">
            <div className="flex justify-between items-center pb-6">
              <h3 className="text-xl font-bold text-white relative z-50">
                Player Reviews
              </h3>
              <Dropdown
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleSelectReviewFilter={handleSelectReviewFilter}
                selectedReviewFilter={selectedReviewFilter}
                selectedReviewFilterIcon={selectedReviewFilterIcon}
                setSelectedReviewFilter={setSelectedReviewFilter}
                toggleDropdown={toggleDropdown}
                reviewOptions={reviewOptions}
              />
            </div>

            <div className="grid grid-cols-1 xmd:grid-cols-1 gap-x-6 gap-y-3 relative z-50">
              <ReviewsSection
                reviewId={reviewId}
                userId={id}
                reviews={showAll ? reviews : reviews.slice(0, 10)}
                setReviews={setReviews}
                gameSlug={slug}
                fetchLikeCountsAndReports={fetchLikeCountsAndReports}
                loadFromDetails={loadFromDetails}
                game_data={game_data}
              />
            </div>
            {review_data && review_data?.length > 10 && (
              <div className="flex items-center justify-center">
                <button
                  className="bg-cBlue-light px-5 py-2 text-base font-semibold m-4 rounded-lg"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "Show Less" : "View More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block ">
        <FooterDetailed />
      </div>
      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />

      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </>
  );
};

export default GameDetailsReviewPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  try {
    const slug = params?.slug as string;
    const url = req.url || "";

    const [queryParams] = url.split("?");
    const game_data = await getGameBySlug(slug);
    console.log(game_data, "ppppppppppppppppppppppppp");
    const review_data = await getUserReview(slug);
    const analyticsData = await getGameAnalytics(slug);

    return {
      props: {
        game_data: game_data,
        review_data: review_data,
        analytics: analyticsData,
        slug,
        queryParams: queryParams || "",
      },
    };
  } catch (error) {
    return {
      props: { error: true },
    };
  }
};

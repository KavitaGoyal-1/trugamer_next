import { useEffect, useRef, useState } from "react";
// import { useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LiaAngleRightSolid } from "react-icons/lia";
import axios from "axios";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { filter, sortBy } from "lodash";
import SeoMeta from "@/components/seo-meta";
import { useRouter } from "next/navigation";
import { toastMessage } from "@/utills/toast";
import {
  clearFilters,
  fetchGamesLibraryDataSuccess,
  toggleHoursSlider,
} from "@/store/slices/game-library";
import { getApi } from "@/utills/get-api";
import { updateGameStatus } from "@/store/slices/game-hours";
import LoaderSpinner from "@/components/loader-spinner";
import ReviewModal from "@/components/game-details/game-details-left/review-modal";
import LibraryResults from "@/components/game-directory/library-results ";
import ResultsRightLib from "@/components/game-directory/results-right-lib";
import FixedHeader from "@/components/layouts/fixed-header";
import { selectAuthState, logOut } from "@/store/slices/auth-slice";
import GameStatusPopup from "@/components/game-status-popup";
import { UseDebounce } from "@/hooks/use-debounce";
import { getToken } from "@/utills/cookies";
import Footer from "@/components/layouts/footer";
import FooterDetailed from "@/components/layouts/footer-detailed";
import NavigationPublic from "@/components/layouts/navigation-public";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import AuthenticatedNavigation from "@/components/layouts/authanticated-navigation";

interface Device {
  deviceName: string;
  deviceId: number;
}
interface ProgressDataItem {
  id: number;
  attributes: any;
}

const GameLibrary = ({}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { searchValue, filters, gamesLibraryData } = useSelector(
    (state: any) => state.gameLibrary
  );
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");

  // Toggle the filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const token = getToken();
  const { userData } = useSelector(selectAuthState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  let libraryData = useRef<any>([]);

  const [word, setWord] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false);
  const [selectedCardOrList, setSelectedCardOrList] = useState<string>("Card");
  const router = useRouter();
  const dispatch = useDispatch();

  const searchedWord = UseDebounce(word, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const requestedData: any = useLoaderData();
  const gameData = useRef("");
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const openModal = (game: any) => {
    if (token) {
      gameData.current = game;
      setIsModalOpen(true);
    } else {
      router.push("/auth/sign-in");
      //   localStorage.setItem("Revisedslug", requestedData?.gameSlug);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logOut());
    return router.push("/auth/sign-in");
  };

  const text = "Game Library";
  const handleChangeListOrCardView = (item: any) => {
    setSelectedCardOrList(item);
  };

  useEffect(() => {
    if (!visible) {
      setRefetchTrigger((prev) => !prev);
    }
  }, [visible]);
  const [selectedGameRelease, setSelectedGameRelease] = useState<any>();

  const toggleVisible = (device: any) => {
    setSelectedGameRelease(device);
    setSelectedGame(device);

    setBeatStatus(
      device?.gameStatus?.length > 0
        ? device?.gameStatus[0]?.beat_status
        : "Never Beat"
    );
    setHoursPlayed(
      device?.gameStatus?.length > 0 ? device?.gameStatus[0]?.hours_played : 0
    );
    setVisible(!visible);
  };

  const handleGameLibrary = async (page: number) => {
    try {
      setIsLoading(true);
      dispatch(toggleHoursSlider(true));
      const perPage = 30;

      const response = await axios.post(
        `${getApi()}/users-permissions/user/getlibrarygames`,
        {
          id: userData?.id,
          page,
          perPage,
          search: searchValue,
          sort: filters?.sort,
          game_modes: filters?.game_modes,
          devices: filters?.devices,
          playStatus: filters?.playStatus,
          gameProgress: filters?.gameProgress,
          selectedHours: filters?.selectedHours,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status == 200) {
        const combinedData = [
          ...libraryData.current,
          ...response?.data?.gamesLibrary,
        ];
        const uniqueData = Array.from(
          new Map(combinedData?.map((item) => [item.id, item])).values()
        );
        const getuniqueGames = uniqueData?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.game?.id === item?.game?.id)
        );
        libraryData.current = getuniqueGames;
        dispatch(fetchGamesLibraryDataSuccess(libraryData.current));
        setTotalPages(response?.data?.pagination?.totalPages);
        dispatch(toggleHoursSlider(false));
        setHasMore(page < totalPages);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(toggleHoursSlider(false));
      console.error("Error fetching game library:", error);
    }
  };

  useEffect(() => {
    handleGameLibrary(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (
      searchValue != "" ||
      //   filters?.sortBy != "" ||
      filters?.game_modes ||
      filters?.playStatus ||
      filters?.devices ||
      filters?.gameProgress
    ) {
      setCurrentPage(1);
      libraryData.current = "";

      handleGameLibrary(1);
      // window.scrollTo({
      //   top: 0,
      //   behavior: "smooth", // Optional: for smooth scrolling
      // });
    }
  }, [
    searchValue,
    filters?.sort,
    filters?.game_modes,
    filters?.playStatus,
    filters?.devices,
    filters?.gameProgress,
    filters?.selectedHours,
  ]);
  const loadMoreGames = () => {
    if (!isLoading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1); // Increment page number
    }
  };

  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  useEffect(() => {
    if (selectedGame && visible) {
      fetchSelectedDevices();
    }
  }, [selectedGame, visible]);

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
      const progressSectionData = response?.data?.data;
      setProgressData(progressSectionData);
      const selectedDevicesFromApi = response?.data?.data?.map(
        (status: any) => ({
          deviceName: status?.attributes?.device_name,
          deviceId: status?.id,
          is_deleted: status?.attributes?.is_deleted,
        })
      );
      await setSelectedDevices(selectedDevicesFromApi);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
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
      fetchSelectedDevices();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const deviceData = {
    data: selectedGame?.devices?.map((device: any) => ({
      id: device?.id,
      attributes: device,
    })),
  };

  const handleDeviceClick = async (device: any, deviceReleaseDate: any) => {
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);

    console.log(device, "device");

    // Check if the game is released
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }

    if (token) {
      // setGlobalLoading(true);
      const deviceName = device?.attributes?.name;
      const deviceId = device?.id;
      const is_deleted = device?.is_deleted;

      // Check if the device is already selected
      const isSelected = selectedDevices.some(
        (d: any) => d?.deviceName === deviceName && d?.is_deleted === false
      );

      const filteredValue: any = selectedDevices.find(
        (element: any) => element?.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;

      // Toggle the selection of the device
      const updatedDevices = isSelected
        ? selectedDevices.filter((d: any) => d?.deviceName !== deviceName)
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

  const gameList = gamesLibraryData
    ?.filter((item: any) => item !== null && item.game)
    ?.map((item: any) => item.game);

  useEffect(() => {
    dispatch(clearFilters());
    if (!token) {
      handleLogout();
    }
    // Scroll to top when the pathname changes
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: for smooth scrolling
    });
  }, []);
  const seoTitle = "Trugamer | Library";
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
      <div className="relative">
        <section className="min-h-screen bg-cBlack-dark max-w-[2550px] mx-auto pb-[40px] py-[50px] md:py-[100px] lg:py-28 lg:pt-24 grid grid-cols-1 xl:px-[10%] lg:px-[6%] md:px-[10%] sm:px-[17%] max-[500px]:px-[5%] px-[10%] ps-18 remove-lines custom_width">
          <>
            <div
              className={
                isToggle
                  ? "menucomon mobile-menus top-0"
                  : "menucomon mobile-right top-0  fixed z-[99999]"
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

            <NavigationPublic text={["Game Library"]} token={token} />
          </>

          <div className="  items-center mt-0 mb-6 ">
            <div className="mt-[15px] sm:mt-[0px] mb-4 !md:mb-8 flex justify-between items-center mobile-res mobile-res-lib left-0">
              <div className="game-title-new">
                <h1 className="font-bold text-[24px] md:text-[34px]  2xl:text-[44px] text-start">
                  Game Library
                </h1>
              </div>
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

            <div className="flex gap-6 xl:gap-8 flex-col lg:flex-row pt-0 md:pt-14 2xl:pt-16 ">
              <div
                className={`left-side libary-left new-game-lib lg:block ${
                  isFilterOpen ? "hidden" : "block"
                }`}
              >
                {gameList?.length == 0 && !isLoading ? (
                  <div
                    className="loader flex items-center justify-center text-[22px] text-center h-[60vh] lg:h-full"
                    key={0}
                  >
                    No data found
                  </div>
                ) : (
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMoreGames} // Trigger the load more function when scrolled to the bottom
                    hasMore={hasMore} // Enable infinite scroll if there's more data
                    // loader={
                    //   <div
                    //     className="loader flex items-center justify-center text-[22px] text-center h-[60px] lg:h-[60px]"
                    //     key={0}
                    //   >
                    //     {isLoading && (
                    //       <>
                    //         <span className="flex items-center justify-center">
                    //           <LoaderSpinner />
                    //         </span>{" "}
                    //       </>
                    //     )}
                    //   </div>
                    // }
                    threshold={50} // Trigger the scroll load when user is 50px from the bottom
                  >
                    <LibraryResults
                      selectedCardOrList={selectedCardOrList}
                      toggleVisible={toggleVisible}
                      openModal={openModal}
                      handleGameLibrary={handleGameLibrary}
                    />
                    {isLoading && (
                      <div
                        className="loader flex items-center justify-center text-[22px] text-center h-[60px] lg:h-[60px]"
                        key={0}
                      >
                        <>
                          <span className="flex items-center justify-center">
                            <LoaderSpinner />
                          </span>{" "}
                        </>
                      </div>
                    )}
                  </InfiniteScroll>
                )}
              </div>

              <div
                className={`right-side lg:block ${
                  isFilterOpen ? "block" : "hidden"
                }`}
              >
                <div className="w-full sm:sticky sm:top-[150px] pading-rights scroll-hide sm:overflow-auto sm:h-[calc(100vh-160px)]">
                  <ResultsRightLib
                    gameLibrary={true}
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

        {/* <FixedHeader token={token} /> */}
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
        handleSubmitProgressFromGameStatus={handleSubmitProgressFromGameStatus}
        hoursPlayed={hoursPlayed}
      />

      {isModalOpen && (
        <ReviewModal
          onClose={closeModal}
          fetchLikeCountsAndReports={handleGameLibrary}
          gameData={gameData}
        />
      )}
    </>
  );
};

export default GameLibrary;

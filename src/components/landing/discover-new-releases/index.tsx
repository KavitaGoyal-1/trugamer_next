import React, { useEffect, useState } from "react";
// import { useLoaderData } from "react-router-dom";
import { useRouter } from "next/navigation";
import LightBlueBtn from "../../buttons/light-blue-btn";
import HomeSubtitle from "../home-subtitle";
import { Swiper, SwiperSlide } from "swiper/react";
import ShadowLeft from "../../carousel/shadow-left";
import ShadowRight from "../../carousel/shadow-right";
import axios from "axios";
import DiscoverNewReleasesGameCard from "./discover-new-releases-game-card";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Navigation } from "swiper/modules";
import { useDispatch } from "react-redux";
import { updateGameStatus } from "@/store/slices/game-hours";
import { toastMessage } from "@/utills/toast";
import { selectAuthState } from "@/store/slices/auth-slice";
import LoaderBar from "@/components/loader-bar";
import { getApi } from "@/utills/get-api";
import { INewRelease } from "@/types/new-release";
import Link from "next/link";
import GameStatusPopup from "@/components/game-status-popup";

interface DiscoverNewReleasesProps {
  token?: string;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
  newReleasedGames?: INewRelease[];
}

interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}

const DiscoverNewReleases = ({
  token,
  setIsOpenLoginStatus,
  newReleasedGames,
}: DiscoverNewReleasesProps) => {
  const router = useRouter();
  const { userData } = useSelector(selectAuthState);
  const userId = userData.id;
  // const requestedData: any = useLoaderData();
  // const [newReleasedGames, setNewReleasedGames] = useState<
  //   INewRelease[] | null
  // >([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [updateDeviceId, setUpdateDeviceId] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<ProgressDataItem | null>(null);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<string>("");
  const dispatch = useDispatch();
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);

  useEffect(() => {
    adjustSlideWidth();
    window.addEventListener("resize", adjustSlideWidth);
    return () => {
      window.removeEventListener("resize", adjustSlideWidth);
    };
  }, []);

  const adjustSlideWidth = () => {
    const slides = document.querySelectorAll(
      ".newRelease-slide .swiper-slide"
    ) as NodeListOf<HTMLElement>;
    slides?.forEach((slide) => {
      slide.style.width = "236px";
    });
  };

  useEffect(() => {
    if (!visible) {
      setProgressData([]);
      return;
    }
  }, [visible]);

  useEffect(() => {
    if (userId && selectedGame?.id) {
      fetchSelectedDevices();
    }
  }, [userId, selectedGame?.id]);
  const fetchSelectedDevices = async () => {
    const gameId = selectedGame?.id;
    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${userId}&filters[game][id][$eq]=${gameId}`,
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
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   // setLoading(false); // End loading
    // }
  };

  const createOrUpdateDevice = async (
    deviceName: string,
    isSelected: boolean,
    deviceId: number,
    deviceIdNew: any
  ) => {
    const gameId = selectedGame?.id;

    const payload = {
      data: {
        hours_played: 0,
        beat_status: "Never Beat",
        user: { id: userId },
        device: { id: deviceId },
        game: { id: gameId },
        device_name: deviceName,
      },
    };
    try {
      setGlobalLoading(true);
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${userId}/${gameId}/${deviceName}`,
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
      const deviceName = device.attributes?.name;
      const deviceId = device.id;

      const isSelected = selectedDevices.some(
        (d: any) => d.deviceName === deviceName && d.is_deleted === false
      );
      const filteredValue: any = selectedDevices.find(
        (element: any) => element.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;
      const updatedDevices = isSelected
        ? selectedDevices.filter((d: any) => d.deviceName !== deviceName)
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
      router.push("/sign-in");
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
  };
  const handleEditClick = (item: ProgressDataItem) => {
    setUpdateDeviceId(item.id);
    setCurrentItem(item);
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played.toString());
    setShowModal(true);
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
  };

  useEffect(() => {
    // Ensure navigation buttons are correctly attached
    const nextButton = document.querySelector(".swiper-button-next-neew");
    const prevButton = document.querySelector(".swiper-button-prev-neew");
    if (nextButton && prevButton) {
      nextButton.classList.add("swiper-navigation-active");
      prevButton.classList.add("swiper-navigation-active");
    }
  }, []);

  return (
    <React.Fragment>
      <section className="flex flex-col gap-[10px] mb-8 md:mb-0 md:gap-[10px] mx-0 md:mx-auto w-full">
        <div className="mt-8 md:mt-0 flex items-center justify-start md:justify-between w-[90%] md:w-[81%] mx-auto details-gradient relative pb-3">
          <>
            <div className="max-md:hidden ">
              <HomeSubtitle text="new releases " />
            </div>
            <div className="md:hidden block flex justify-center">
              <HomeSubtitle text="New Releases" />
            </div>
          </>
          <div className="row-start-4 md:row-start-1 row-end-5 md:row-end-2 col-start-1 md:col-start-2 col-end-2 col-end-3 max-md:hidden">
            <LightBlueBtn hrefString="/game-calendar" text={"See All"} />
          </div>
        </div>
        {/* {loading ? (
          <div className="md:pl-[10%] 2xl:pl-[9.5%]">
            <LoaderBar />
          </div>
        ) : ( */}
        <>
          <div className="relative w-full sm:pb-12 pb-0 z-[9] px-5 md:px-0 md:pl-[10%] 2xl:pl-[9.5%]">
            {/**This divs are for the shadows left and right */}
            <ShadowLeft tag="newRelease" />
            <ShadowRight tag="newRelease" />

            <div className="relative">
              <div className="absolute top-[130px] md:top-[169px] xl:top-[193px] left-[-25px] md:left-[-30px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-prev-neew">
                  {" "}
                  <FaChevronLeft
                    className=" w-4 h-4 sm:w-5 sm:h-5"
                    size={22}
                  />{" "}
                </span>
              </div>

              {/* Right Arrow */}
              <div className="absolute top-[130px] md:top-[169px] xl:top-[193px] right-[-22px] md:right-[0px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
                <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-next-neew">
                  {" "}
                  <FaChevronRight
                    className=" w-4 h-4 sm:w-5 sm:h-5"
                    size={22}
                  />{" "}
                </span>
              </div>
              <Swiper
                spaceBetween={30}
                className="w-full sm:w-11/12 md:w-full pt-6 pl-0 px-4 2xl:pl-[0rem] newRelease-slide newRelaes_game"
                navigation={{
                  nextEl: ".swiper-button-next-neew",
                  prevEl: ".swiper-button-prev-neew",
                }}
                modules={[Navigation]}
                onInit={(swiper) => {
                  const slides = swiper.slides;
                  slides?.forEach((slide) => {
                    slide.style.width = "236px";
                  });
                }}
                onSlideChange={(swiper) => {
                  const slides = swiper.slides;
                  slides?.forEach((slide) => {
                    slide.style.width = "236px";
                  });
                }}
                loop={false}
                slidesPerView={"auto"}
              >
                {newReleasedGames && newReleasedGames?.length > 0 ? (
                  newReleasedGames?.map((game, index) => (
                    <Link
                      href={
                        game?.attributes?.slug &&
                        `/game/${game?.attributes?.slug}`
                      }
                    >
                      <SwiperSlide key={index}>
                        <div className="w-[146px] md:w-[236px] sm:w-full h-full rounded-2xl px-0 mx-auto">
                          {/* <GameCard
                            game={game}
                            key={index}
                            onClick={() =>
                              router.push(`/game/${game?.attributes?.slug}`)
                            }
                          />{" "} */}

                          <DiscoverNewReleasesGameCard
                            game={game}
                            onClick={() =>
                              router.push(`/game/${game?.attributes?.slug}`)
                            }
                            setIsOpenLoginStatus={setIsOpenLoginStatus}
                            key={index}
                            visible={visible}
                            setVisible={setVisible}
                            setSelectedGame={setSelectedGame}
                            selectedGame={selectedGame}
                            token={token}
                          />
                        </div>
                      </SwiperSlide>
                    </Link>
                  ))
                ) : (
                  <div className="flex mx-2 justify-center mt-5">
                    <p className="text-[22px] text-center">
                      You don't have any games yet
                    </p>
                  </div>
                )}
              </Swiper>
            </div>
          </div>
          <div className="block md:hidden w-[90%] md:w-[80%] mx-auto">
            <LightBlueBtn hrefString="/game-calendar" text={"Show more"} />
          </div>
        </>
        {/*)} */}
      </section>
      <GameStatusPopup
        setSelectedGame={setSelectedGame}
        selectedGame={{
          game: {
            ...(selectedGame?.attributes || {}),
            id: selectedGame?.id,
          },
        }}
        visible={visible}
        setVisible={setVisible}
        deviceData={selectedGame?.attributes?.devices}
        slug={selectedGame?.attributes?.slug}
        selectedDevices={selectedDevices}
        handleDeviceClick={handleDeviceClick}
        progressData={progressData}
        beatStatus={beatStatus}
        setBeatStatus={setBeatStatus}
        hoursPlayed={hoursPlayed}
        handleEditClick={handleEditClick}
        handleSubmitProgressFromGameStatus={handleSubmitProgressFromGameStatus}
      />
    </React.Fragment>
  );
};

export default DiscoverNewReleases;

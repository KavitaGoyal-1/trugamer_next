import MacIcon from "../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../public/icons/androidgrey.svg";
import PCIcon from "../../../public/icons/window.svg";
import XboxIcon from "../../../public/icons/xport.svg";
import DeviceIcon from "../../../public/icons/device.svg";
import PlaystationIcon from "../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../public/icons/switch.svg";
import axios from "axios";
import { useEffect, useState } from "react";
// import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import GameCard from "../landing/trending-games/game-card-for-new";
import GameStatusPopup from "../game-status-popup";
import { useDispatch } from "react-redux";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import { getToken } from "@/utills/cookies";
import { selectAuthState } from "@/store/slices/auth-slice";
import { getGameBySlug } from "@/utills/games/get-game-by-slug";
import { updateGameStatus } from "@/store/slices/game-hours";
import { useRouter } from "next/router";

interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}

const NewGamePopup = ({ game, setIsOpenLoginStatus }: any) => {
  const token = getToken();
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [updateDeviceId, setUpdateDeviceId] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<ProgressDataItem | null>(null);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  // const requestedData: any = useLoaderData();
  const { userData } = useSelector(selectAuthState);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [trendingGames, setTrendingGames] = useState<any>([]);
  const [nonLoggedUser, setNonLoggedUser] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const userId = userData.id;
  const router = useRouter();
  const dispatch = useDispatch();

  const getTrendingGames = async () => {
    const data = await getGameBySlug(game?.slug);
    if (data) setTrendingGames(data);
  };

  useEffect(() => {
    getTrendingGames();
  }, []);

  useEffect(() => {
    if (userId && selectedGame?.id) {
      fetchSelectedDevices();
    }
  }, [userId, selectedGame?.id]);

  console.log(selectedGame, "selectedGame");

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
      const selectedDevicesFromApi = response?.data?.data.map(
        (status: any) => ({
          deviceName: status.attributes.device_name,
          deviceId: status.id,
          is_deleted: status.attributes.is_deleted,
        })
      );
      setSelectedDevices(selectedDevicesFromApi);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading
    }
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

      // await fetchSelectedDevices();
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
      router.push("/auth/sign-in");
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

  const getUniqueDeviceDetails = (game: any) => {
    const releases = Array.isArray(game?.attributes?.devices?.data)
      ? game?.attributes?.devices?.data
      : [];
    const deviceDetails = new Map<string, string>(); // Map to store deviceName => iconURL
    releases?.forEach((release: any) => {
      const deviceName = release.attributes?.name;
      const iconURL = release?.attributes?.icon?.image?.data?.attributes?.url;

      if (deviceName && !deviceDetails.has(deviceName)) {
        deviceDetails.set(
          deviceName,
          iconURL ||
            (deviceName.toLowerCase().includes("pc")
              ? PCIcon
              : deviceName.toLowerCase().includes("playstation")
              ? PlaystationIcon
              : deviceName.toLowerCase().includes("xbox")
              ? XboxIcon
              : deviceName.toLowerCase().includes("switch")
              ? SwitchIcon
              : deviceName.toLowerCase().includes("mac")
              ? MacIcon
              : deviceName.toLowerCase().includes("android")
              ? AndroidIcon
              : DeviceIcon) // Default icon based on name
        );
      }
    });

    return Array.from(deviceDetails, ([name, icon]) => ({ name, icon }));
  };

  return (
    <>
      <div>
        {trendingGames &&
          trendingGames?.data?.map((game: any, index: any) => {
            const uniqueDevices = getUniqueDeviceDetails(game);
            return (
              // <SwiperSlide key={index} className="w-[142px] md:w-[255px]">
              <GameCard
                game={game}
                onClick={() => router.push(`/game/${game.attributes.slug}`)}
                devices={uniqueDevices} // Pass the device prop here
                index={index}
                visible={visible}
                setVisible={setVisible}
                setIsOpenLoginStatus={setIsOpenLoginStatus}
                setNonLoggedUser={setNonLoggedUser}
                nonLoggedUser={nonLoggedUser}
                setSelectedGame={setSelectedGame}
                selectedGame={selectedGame}
                token={token}
              />
              // </SwiperSlide>
            );
          })}
      </div>
      <GameStatusPopup
        setSelectedGame={setSelectedGame}
        selectedGame={{
          game: {
            ...(selectedGame?.attributes ?? {}),
            id: selectedGame?.id,
          },
        }}
        visible={visible}
        setVisible={setVisible}
        nonLoggedUser={nonLoggedUser}
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
    </>
  );
};

export default NewGamePopup;

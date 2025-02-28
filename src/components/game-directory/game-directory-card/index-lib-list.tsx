// import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiGameControllerFill, PiUsersThreeFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import DeviceIcon from "../../../../public/icons/device.svg";
import axios from "axios";
import React, { useRef, useState } from "react";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import Biheadset from "../../../../public/icons/biheadset.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import Edit from "../../../../public/icons/edit.svg";
import { useDispatch } from "react-redux";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { selectAuthState } from "@/store/slices/auth-slice";
import { toastMessage } from "@/utills/toast";
import { updateGameStatus } from "@/store/slices/game-hours";
import CustomModal from "@/components/game-details/game-details-right/custom-modal";
import Image from "next/image";

interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}

const GameDirectoryListLibrary = ({
  toggleVisible,
  openModal,
  handleGameLibrary,
}: any) => {
  const check = {
    mac: MacIcon,
    xsx: XboxIcon,
    switch: SwitchIcon,
    ps5: PlaystationIcon,
    biheadset: Biheadset,
    pc: PCIcon,
  };
  const { gamesLibraryData } = useSelector((state: any) => state.gameLibrary);

  const gameList = gamesLibraryData
    .filter((item: any) => item !== null && item.game) // This filters out null values and ensures item.game is not undefined
    .map((item: any) => ({
      ...item.game,
      steamLastPlayed: item.steamLastPlayed,
      isImportFromSteam: item?.isImportFromSteam,
    }));

  const router = useRouter();
  const token = getToken();
  // const requestedData: any = useLoaderData();
  const [showModal, setShowModal] = useState<boolean>(false);
  const selectedDevices: any = useRef([]);
  const { userData } = useSelector(selectAuthState);
  const { id } = userData;
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<string>("");
  const progressData = useRef([]);
  const deviceTopid = useRef("");
  const [currentItem, setCurrentItem] = useState<ProgressDataItem | null>(null);
  const dispatch = useDispatch();

  const fetchSelectedDevices = async () => {
    const gameId = deviceTopid.current;

    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${id}&filters[game][id][$eq]=${gameId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      progressData.current = response?.data.data;
      const selectedDevicesFromApi = response?.data?.data?.map(
        (status: any) => ({
          deviceName: status.attributes.device_name,
          deviceId: status.id,
          is_deleted: status.attributes.is_deleted,
        })
      );
      selectedDevices.current = selectedDevicesFromApi;
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
        user: { id: id },
        device: { id: deviceId },
        game: { id: deviceTopid.current },
        device_name: deviceName,
      },
    };

    try {
      // Check if the device status exists
      const response = await axios.get(
        `${getApi()}/game-status/check/${id}/${
          deviceTopid.current
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

      await fetchSelectedDevices();
      handleGameLibrary(1);
    } catch (error) {
      console.error("Error creating/updating device:", error);
    }
  };

  const handleDeviceClick = async (
    device: any,
    deviceReleaseDate: any,
    id: any
  ) => {
    deviceTopid.current = id;
    await fetchSelectedDevices();
    const currentDate = new Date();
    const releaseDate = new Date(deviceReleaseDate);
    if (releaseDate > currentDate) {
      toastMessage("error", "This game is not released yet");
      return;
    }
    if (token) {
      // setGlobalLoading(true);
      const deviceName = device?.name;
      const deviceId = device.id;
      const isSelected = selectedDevices.current.some(
        (d: any) => d.deviceName === deviceName && d.is_deleted === false
      );
      const filteredValue: any = selectedDevices.current.find(
        (element: any) => element.deviceName === deviceName
      );
      const deviceIdNew = filteredValue?.deviceId;
      const updatedDevices = isSelected
        ? selectedDevices.current.filter(
            (d: any) => d.deviceName !== deviceName
          )
        : [
            ...selectedDevices.current,
            { deviceName, deviceId, is_deleted: false },
          ];

      selectedDevices.current = updatedDevices;
      await createOrUpdateDevice(
        deviceName,
        !isSelected,
        deviceId,
        deviceIdNew
      );
      const filteredItem = progressData.current.find(
        (item: any) =>
          item.attributes.device_name === deviceName &&
          item.attributes.is_deleted === false
      );

      if (filteredItem) {
        // Trigger the edit modal automatically
        handleEditClick(filteredItem);
      }
    } else {
      // Redirect to login if the user is not authenticated
      router.push("/auth/sign-in");
      // localStorage.setItem("Revisedslug", requestedData?.slug);
    }
  };

  const [updateDeviceId, setUpdateDeviceId] = useState<number | null>(null);

  const handleEditClick = (item: ProgressDataItem) => {
    setUpdateDeviceId(item.id);
    setCurrentItem(item);
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played.toString());
    setShowModal(true);
  };

  const handleHoursChange = (e: any) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10000)) {
      setHoursPlayed(value);
    } else {
      toastMessage("error", "Played hours should be less than equal to 10,000");
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

  return (
    <>
      {Array?.isArray(gameList) &&
        gameList &&
        gameList
          ?.filter((data: any) => data?.gameStatus?.length > 0)
          ?.map((data: any, index: any) => (
            <div
              key={index}
              className="bgC-img  mb-5 w-[100%] border p-4 pr-4 sm:pr-6 rounded-xl border-gray-800"
              style={{
                backgroundImage: `url(${
                  data?.coverImage ? data?.coverImage?.url : data?.image?.url
                })`,
              }}
            >
              <Image
                src="/games/plus-iconWhite.svg"
                className="absolute right-[-12px] top-[-12px] w-8 h-8 cursor-pointer"
                alt="played game"
                width={32}
                height={32}
                onClick={() => toggleVisible(data)}
              />
              <div
                className="block" // Ensure the link takes full space
              >
                <div className="flex gap-3">
                  <Link
                    target="_blank"
                    className="rounded-lg gap-3 flex items-center"
                    href={`/game/${data.slug}`}
                  >
                    <Image
                      src={data?.coverImage?.url || "/placeholder.png"}
                      className="w-[95px] min-w-[95px] sm:w-[115px] sm:min-w-[115px] h-[150px] object-cover"
                      alt={data?.title}
                      width={95}
                      height={95}
                      // title={data?.title}
                    />
                  </Link>

                  <div className="flex justify-start lg:justify-center xl:justify-between w-full flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-0 overflow-x-auto scroll-hide">
                    <div className="flex flex-col justify-center">
                      <Link
                        target="_blank"
                        href={`/game/${data?.slug}`}
                        className="block"
                      >
                        <h2 className="text-base sm:text-lg md:text-lg 2xl:text-2xl font-semibold hover:text-[#adbaf5] line-clamp-2 w-full lg:w-80">
                          {data?.title}
                        </h2>
                      </Link>

                      {data?.isImportFromSteam &&
                        (new Date(data?.steamLastPlayed) >
                        new Date("1980-01-01") ? (
                          <span className="text-base font-semibold text-left mb-1">
                            Last Played: {data?.steamLastPlayed}
                            {/* {game.lastplayeddate} */}
                          </span>
                        ) : (
                          <span className="text-base font-semibold text-left mb-1">
                            Never Played
                          </span>
                        ))}
                      <div className="w-full text-right mt-1 flex items-center gap-2">
                        {data?.currentRating?.length > 0 ? (
                          <button
                            // className="bg-[#39475B] bg-[#00ADFF] text-sm rounded-md px-2 h-8 flex items-center justify-center gap-1"
                            className={`text-sm  px-2 h-8 flex items-center justify-center gap-1 ${
                              // game.buttontext === "Add Review"
                              //   ? "bg-[#00ADFF] rounded-2xl"
                              // :
                              "bg-[#39475B] rounded-md"
                            }`}
                            type="button"
                          >
                            <Image
                              src="/icons/rating.svg"
                              className="w-5 h-5"
                              alt="calendar icon"
                              width={20}
                              height={20}
                              // title="calendar icon"
                            />{" "}
                            {data?.currentRating[0].rating}{" "}
                          </button>
                        ) : (
                          <button
                            // className="bg-[#39475B] bg-[#00ADFF] text-sm rounded-md px-2 h-8 flex items-center justify-center gap-1"
                            className={`text-sm  px-2 h-[22px] flex items-center justify-center gap-0.5  rounded-2xl ${
                              // game.buttontext === "Add Review"
                              //   ? "bg-[#00ADFF] rounded-2xl"
                              // :
                              "bg-[#00ADFF] "
                            }`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent link from being followed
                              e.stopPropagation(); // Prevent the click from propagating to the parent link
                              openModal(data); // Open the modal as intended
                            }}
                          >
                            <Image
                              src="/icons/rating.svg"
                              className="w-4 h-4"
                              alt="calendar icon"
                              width={16}
                              height={16}
                              // title="calendar icon"
                            />{" "}
                            Add review{" "}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className=" items-start xl:items-end flex-col gap-3 justify-center hidden md:flex overflow-auto">
                      <div className="flex items-center gap-3 font-bold overflow-x-auto scroll-hide">
                        <div className="flex gap-2 flex-shrink-0 flex-wrap ">
                          {data?.devices &&
                            data?.devices.map((dev: any, idx: number) => {
                              const gameStatusForDevice = data.gameStatus?.find(
                                (status: any) => status.device_name === dev.name
                              );
                              const isHighlighted =
                                gameStatusForDevice?.is_deleted === false;

                              return (
                                <div
                                  key={dev.attributes?.name}
                                  onClick={() =>
                                    handleDeviceClick(dev, "", data?.id)
                                  }
                                  className={`p-0 rounded-lg cursor-pointer flex items-center ${
                                    isHighlighted
                                      ? "bg-cBlue-light hover-class-new" // Highlight the device when matched
                                      : selectedDevices.current.some(
                                          (d: any) =>
                                            d.deviceName === dev?.name &&
                                            d.is_deleted === false &&
                                            deviceTopid.current == data?.id
                                        )
                                      ? " text-white font-bold hover-cls" // For selected devices
                                      : "  text-cPurple-light" // Default state for devices
                                  }`}
                                  title={dev?.name}
                                >
                                  <Image
                                    key={idx}
                                    src={
                                      check[dev.slug as keyof typeof check] ||
                                      DeviceIcon
                                    }
                                    className="w-5 h-5 border border-[#596184] rounded-md p-0.5"
                                    width={20}
                                    height={20}
                                    alt={`${dev.slug} icon`}
                                    // title={`${dev} icon`}
                                  />
                                </div>
                              );
                            })}
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                            <Image
                              src="/icons/calendar.svg"
                              className="w-5 h-5"
                              alt="calendar icon"
                              width={20}
                              height={20}
                              // title="calendar icon"
                            />
                            {(() => {
                              const earliestReleaseDate =
                                data?.releaseByPlatforms?.release?.reduce(
                                  (earliest: any, current: any) => {
                                    const currentReleaseDate = new Date(
                                      current.releaseDate
                                    );
                                    const earliestReleaseDate = new Date(
                                      earliest
                                    );

                                    // Update the comparison to get the earliest date
                                    return currentReleaseDate <
                                      earliestReleaseDate
                                      ? current.releaseDate
                                      : earliest;
                                  },
                                  data?.releaseByPlatforms?.release[0]
                                    ?.releaseDate || null
                                );

                              if (!earliestReleaseDate) return "N/A";

                              // Format the date manually as MM/DD/YYYY
                              const date = new Date(earliestReleaseDate);
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0"); // Months are 0-indexed
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const year = date.getFullYear();

                              return `${month}/${day}/${year}`;
                            })()}
                          </span>
                          <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                            <Image
                              src="/icons/clock.svg"
                              className="w-5 h-5"
                              alt="calendar icon"
                              width={20}
                              height={20}
                              // title="calendar icon"
                            />
                            {data?.gameStatus?.reduce(
                              (total: any, gameSt: any) => {
                                return total + gameSt.hours_played;
                              },
                              0
                            )}{" "}
                            <span className="flex 2xl:hidden">h</span>{" "}
                            <span className="hidden 2xl:flex">Hours</span>
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${
                          data?.gameStatus?.length < 2
                            ? "justify-end"
                            : "justify-start"
                        } flex gap-4 overflow-x-auto scroll-hide w-full `}
                      >
                        {data?.gameStatus?.length > 0 &&
                          data?.gameStatus
                            .filter(
                              (gameStat: any) => gameStat?.is_deleted === false
                            ) // Filter out items where is_deleted is false
                            .map((gameStat: any) => {
                              const matchingDevice =
                                data?.releaseByPlatforms?.release.find(
                                  (release: any) =>
                                    release?.device?.name ===
                                    gameStat?.device_name
                                );
                              if (!matchingDevice) return null;
                              return (
                                <div
                                  key={gameStat.device_name}
                                  className="flex flex-shrink-0 gap-2"
                                >
                                  <div className="flex-shrink-0 flex gap-2 items-center">
                                    <Image
                                      src={
                                        gameStat?.device_name
                                          ?.toLowerCase()
                                          .includes("pc")
                                          ? PCIcon
                                          : gameStat?.device_name
                                              ?.toLowerCase()
                                              .includes("playstation")
                                          ? PlaystationIcon
                                          : gameStat?.device_name
                                              ?.toLowerCase()
                                              .includes("xbox")
                                          ? XboxIcon
                                          : gameStat?.device_name
                                              ?.toLowerCase()
                                              .includes("switch")
                                          ? SwitchIcon
                                          : gameStat?.device_name
                                              ?.toLowerCase()
                                              .includes("mac")
                                          ? MacIcon
                                          : gameStat?.device_name
                                              ?.toLowerCase()
                                              .includes("android")
                                          ? AndroidIcon
                                          : DeviceIcon
                                      }
                                      className="w-5 h-5"
                                      alt="calendar icon"
                                      width={20}
                                      height={20}
                                      // title="calendar icon"
                                    />{" "}
                                    <span className="font-medium text-sm">
                                      {gameStat?.device_name}:{" "}
                                    </span>{" "}
                                    <span className="text-[#00ADFF] font-medium text-sm">
                                      {gameStat?.beat_status}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                      </div>

                      <div className="flex gap-2 flex-col md:flex-row items-start">
                        <span className="text-sm text-left mb-1 flex items-center gap-2 border border-[#00ADFF] rounded-md px-2 py-1">
                          {" "}
                          <PiUsersThreeFill />
                          All Users Playing :{" "}
                          <span className="text-[#00ADFF]">
                            {data?.gameCounts}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:hidden items-start xl:items-end flex-col gap-3 justify-center">
                  <div className="flex items-center gap-3 font-bold overflow-x-auto scroll-hide mt-3">
                    <div className="flex gap-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                        <Image
                          src="/icons/calendar.svg"
                          className="w-5 h-5"
                          alt="calendar icon"
                          width={20}
                          height={20}
                          // title="calendar icon"
                        />
                        {data?.releaseByPlatforms?.release?.reduce(
                          (earliest: any, current: any) => {
                            const currentReleaseDate = new Date(
                              current.releaseDate
                            );
                            const earliestReleaseDate = new Date(earliest);

                            // Update the comparison to get the earliest date
                            return currentReleaseDate < earliestReleaseDate
                              ? current.releaseDate
                              : earliest;
                          },
                          data?.releaseByPlatforms?.release[0]?.releaseDate ||
                            null
                        )}
                      </span>
                      <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                        <Image
                          src="/icons/clock.svg"
                          className="w-5 h-5"
                          alt="calendar icon"
                          width={20}
                          height={20}
                          // title="calendar icon"
                        />
                        {/* {game.fire} */}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start overflow-x-auto scroll-hide">
                    <span className="flex-shrink-0 text-sm text-left mb-1 flex items-center gap-2 border border-[#00ADFF] rounded-md px-2 py-1">
                      {" "}
                      <PiGameControllerFill />
                      Queued Count:{" "}
                      <span className="text-[#00ADFF]">{data.gameCounts}</span>
                    </span>
                    <span className="flex-shrink-0 text-sm text-left mb-1 flex items-center gap-2 border border-[#00ADFF] rounded-md px-2 py-1">
                      {" "}
                      <PiGameControllerFill />
                      Queued Count:{" "}
                      <span className="text-[#00ADFF]">{data.gameCounts}</span>
                    </span>
                  </div>
                </div>
                {/* {deviceTopid.current == data?.id && (
              <div className="w-full bg-cBlue-secondary  rounded-xl">
                <div className="flex flex-col gap-[18px]">
                  {filteredData.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className="flex flex-col p-5 pb-0">
                        <div className="flex justify-between pb-1">
                          <div className="inline-flex gap-2">
                            <img
                              src={
                                item?.attributes?.device_name
                                  .toLowerCase()
                                  .includes("pc")
                                  ? PCIcon
                                  : item?.attributes?.device_name
                                      .toLowerCase()
                                      .includes("playstation")
                                  ? PlaystationIcon
                                  : item?.attributes?.device_name
                                      .toLowerCase()
                                      .includes("xbox")
                                  ? XboxIcon
                                  : item?.attributes?.device_name
                                      .toLowerCase()
                                      .includes("switch")
                                  ? SwitchIcon
                                  : item?.attributes?.device_name
                                      .toLowerCase()
                                      .includes("mac")
                                  ? MacIcon
                                  : item?.attributes?.device_name
                                      .toLowerCase()
                                      .includes("android")
                                  ? AndroidIcon
                                  : DeviceIcon
                              }
                              alt={`${item?.attributes?.device_name} logo`}
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            <span className="text-base font-medium">
                              {item.attributes.device_name}
                            </span>
                          </div>
                          <img
                            src={Edit}
                            alt="edit icon"
                            width={24}
                            height={24}
                            onClick={() => handleEditClick(item)}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium leading-[24px] mb-1">
                            Beat Status:{" "}
                            <span className="text-cPurple-light">
                              {item.attributes.beat_status || "—"}
                            </span>
                          </span>
                          <span className="text-sm font-medium leading-[24px]">
                            Hours Played:{" "}
                            <span className="text-cPurple-light">
                              {item.attributes.hours_played || "0"}
                            </span>
                          </span>
                        </div>
                      </div>

                      {index < filteredData.length - 1 && (
                        <div className="gradient-divider relative"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )} */}

                <CustomModal
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  isNotClosed={true}
                >
                  <div className="flex items-center gap-2 mb-9">
                    <Image
                      src={
                        currentItem?.attributes?.device_name
                          .toLowerCase()
                          .includes("pc")
                          ? PCIcon
                          : currentItem?.attributes?.device_name
                              .toLowerCase()
                              .includes("playstation")
                          ? PlaystationIcon
                          : currentItem?.attributes?.device_name
                              .toLowerCase()
                              .includes("xbox")
                          ? XboxIcon
                          : currentItem?.attributes?.device_name
                              .toLowerCase()
                              .includes("switch")
                          ? SwitchIcon
                          : currentItem?.attributes?.device_name
                              .toLowerCase()
                              .includes("mac")
                          ? MacIcon
                          : currentItem?.attributes?.device_name
                              .toLowerCase()
                              .includes("android")
                          ? AndroidIcon
                          : DeviceIcon
                      }
                      alt={`${currentItem?.attributes?.device_name} logo`}
                      width={26}
                      height={26}
                    />
                    <span className="text-white text-2xl font-medium">
                      {currentItem?.attributes.device_name}
                    </span>
                  </div>
                  <form onSubmit={handleSubmitProgress} className="space-y-6">
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="flex text-white text-base mb-1.5">
                          Beat Status
                        </label>
                        <div className="relative w-full">
                          <select
                            value={beatStatus}
                            onChange={(e) => setBeatStatus(e.target.value)}
                            className="w-full bg-[#FFFFFF] text-[#667085] rounded-lg h-[48px] outline-0 px-4 py-3 appearance-none"
                          >
                            <option value="Never Beat">Never Beat</option>
                            <option value="Main Story">Main Story</option>
                            <option value="Main And Expansions">
                              Main And Expansions
                            </option>
                            <option value="Completionist">Completionist</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                            <svg
                              className="w-4 h-4 text-[#667085]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="flex text-white text-base mb-1.5">
                          Hours Played
                        </label>
                        <input
                          type="number"
                          placeholder="Add hours"
                          value={hoursPlayed}
                          onChange={handleHoursChange}
                          className="w-full px-4 py-3 bg-[#FFFFFF] text-[#667085] rounded-lg h-[48px] outline-0"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-cBlue-light text-base font-primary text-white py-3 px-5 rounded-lg font-medium"
                    >
                      Submit
                    </button>
                  </form>
                </CustomModal>
              </div>
            </div>
          ))}
    </>
  );
};

export default GameDirectoryListLibrary;

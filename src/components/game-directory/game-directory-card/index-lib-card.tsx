import { useSelector } from "react-redux";
import DeviceIcon from "../../../../public/icons/device.svg";
import React, { useEffect, useRef, useState } from "react";
// import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import Biheadset from "../../../../public/icons/biheadset.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import Edit from "../../../../public/icons/edit.svg";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateGameStatus } from "@/store/slices/game-hours";
import CustomModal from "@/components/game-details/game-details-right/custom-modal";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { selectAuthState } from "@/store/slices/auth-slice";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Device {
  deviceName: string;
  deviceId: number;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}

const GameDirectoryCardLibrary = ({
  toggleVisible,
  openModal,
  handleGameLibrary,
}: any) => {
  const { gamesLibraryData } = useSelector((state: any) => state.gameLibrary);
  const check = {
    mac: MacIcon,
    xsx: XboxIcon,
    switch: SwitchIcon,
    ps5: PlaystationIcon,
    biheadset: Biheadset,
    pc: PCIcon,
  };

  const gameList = gamesLibraryData
    // .filter((item: any) => item !== null && item.game) // This filters out null values and ensures item.game is not undefined
    .map((item: any) => ({
      ...item?.game,
      steamLastPlayed: item?.steamLastPlayed,
      isImportFromSteam: item?.isImportFromSteam,
    }));
  // .image?.url
  const selectedDevices: any = useRef([]);
  // const navigate = useNavigate();
  const router = useRouter();
  const token = getToken();
  // const requestedData: any = useLoaderData();
  const [showModal, setShowModal] = useState<boolean>(false);
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

          const response = await axios.put(
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

          const response = await axios.put(
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
  // const game: any = requestedData?.game?.data[0];

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
      const deviceName = device?.name;
      const deviceId = device.id;

      const isSelected = selectedDevices.current.some(
        (d: any) => d.deviceName == deviceName && d.is_deleted == false
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

      // Automatically filter progress data for the selected device
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
      toast.success("Ownership added successfully.");
    } catch (error) {
      console.error("Error during API call:", error);
    }
    setShowModal(false);
  };

  return (
    <>
      {Array?.isArray(gameList) &&
        gameList?.map((data: any, index: any) => {
          if (data?.gameStatus?.length === 0) return null;

          return (
            <>
              <div
                key={index}
                className="bgC-img  mb-5 w-[100%] xl:w-[48%] border p-2 sm:p-4 rounded-xl border-gray-800"
                style={{
                  backgroundImage: `url(${
                    data?.image ? data?.image?.url : data?.image?.url
                  })`,
                }}
              >
                {/* <Link
            to={`/game/${data.slug}`}
            className="w-full"
          > */}
                <Image
                  src="/games/plus-iconWhite.svg"
                  className="absolute right-[-12px] top-[-12px] w-8 h-8 cursor-pointer"
                  alt="played game"
                  onClick={() => toggleVisible(data)}
                  width={32}
                  height={32}
                />
                <div
                  className="block cursor-default" // Ensure the link takes full space
                >
                  <div className="flex gap-3">
                    <Link
                      target="_blank"
                      className="rounded-lg gap-3 flex items-center"
                      href={`/game/${data.slug}`}
                    >
                      <Image
                        src={data?.coverImage?.url || "/placeholder.png"}
                        className="w-[95px] min-w-[95px] sm:w-[115px] sm:min-w-[115px] h-[150px] rounded-lg object-cover"
                        alt={data?.title}
                        width={95}
                        height={95}
                      />
                    </Link>
                    <div className="flex flex-col w-full overflow-x-auto scroll-hide">
                      <Link
                        target="_blank"
                        href={`/game/${data.slug}`}
                        className="block"
                      >
                        <h2 className="text-base sm:text-lg md:text-lg 2xl:text-2xl font-semibold line-clamp-2 hover:text-[#adbaf5] cursor-pointer">
                          {data?.title}
                        </h2>
                      </Link>
                      <div className="flex gap-2 mt-2 mb-2">
                        <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                          <Image
                            src="/icons/calendar.svg"
                            className="w-5 h-5"
                            alt="calendar icon"
                            width={20}
                            height={20}
                          />

                          {(() => {
                            const earliestReleaseDate =
                              Array?.isArray(
                                data?.releaseByPlatforms?.release
                              ) &&
                              data?.releaseByPlatforms?.release?.reduce(
                                (earliest: any, current: any) => {
                                  console.log(earliest, "earliest");
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
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            ); // Months are 0-indexed
                            const day = String(date.getDate()).padStart(2, "0");
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
                      {/* {data?.steamLastPlayed &&
                        new Date(data?.steamLastPlayed) >
                          new Date("2012-01-01") && (
                          <span className="text-base font-semibold text-left mb-1">
                            Last Played:{" "}
                            {new Date(data?.steamLastPlayed).toLocaleDateString(
                              "en-US",
                              {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )} */}
                      {
                        data?.isImportFromSteam &&
                          (new Date(data?.steamLastPlayed) >
                          new Date("1980-01-01") ? (
                            <span className="text-base font-semibold text-left mb-1">
                              Last Played:{" "}
                              {new Date(
                                data?.steamLastPlayed
                              ).toLocaleDateString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-base font-semibold text-left mb-1">
                              Never Played
                            </span>
                          ))
                        // ) : (
                        //   <span className="text-base font-semibold text-left mb-1">
                        //     Never Played
                        //   </span>
                      }
                      <div className="w-full text-right mt-1 flex items-center gap-2 flex-wrap">
                        {data?.currentRating?.length > 0 ? (
                          <button
                            className={`text-sm  px-2 h-8 flex items-center justify-center gap-1 ${"bg-[#39475B] rounded-md"}`}
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
                            className={`text-sm  px-2 h-[22px] flex items-center justify-center gap-0.5  ${"bg-[#00ADFF] rounded-2xl"}`}
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
                            />
                            <span className=" font-medium text-xs">
                              Add Review
                            </span>
                          </button>
                        )}

                        <div className="flex gap-1 overflow-auto scroll-hide items-center ">
                          {data?.devices && (
                            <>
                              {data?.devices
                                .slice(0, 4)
                                .map((dev: any, idx: number) => {
                                  // Check if the current device in gameStatus array is deleted
                                  const gameStatusForDevice =
                                    data.gameStatus?.find(
                                      (status: any) =>
                                        status?.device_name === dev?.name
                                    );

                                  // Find matching release info from releaseByPlatforms
                                  const releaseInfo =
                                    data?.releaseByPlatforms.release.find(
                                      (release: any) =>
                                        release?.device?.name === dev?.name &&
                                        release?.device?.id === dev?.id
                                    );
                                  const isHighlighted =
                                    gameStatusForDevice?.is_deleted === false;

                                  return (
                                    <div
                                      key={dev.attributes?.name}
                                      onClick={() =>
                                        handleDeviceClick(dev, "", data?.id)
                                      }
                                      className={`gap-0 rounded-lg cursor-pointer flex items-center p-0 shrink-0 h-5 ${
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
                                      title={releaseInfo ? dev?.name : ""}
                                    >
                                      <Image
                                        key={idx}
                                        src={
                                          check[
                                            dev.slug as keyof typeof check
                                          ] || DeviceIcon
                                        }
                                        alt="cursor pointer"
                                        className={`w-5 h-5 min-w-[20px] border border-[#596184] rounded-md p-0.5 cursor-pointer`}
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  );
                                })}

                              {data.devices.length > 4 && (
                                <div className="pl-0 p-1 w-10 text-sm rounded-lg cursor-pointer flex items-center justify-start  text-white font-bold">
                                  +{data.devices.length - 4}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      data?.gameStatus?.length > 0
                        ? "divider-gradiant relative pt-4 mt-5 pb-0"
                        : ""
                    }`}
                  >
                    <div className={`flex overflow-x-auto scroll-hide  gap-0 `}>
                      {data?.gameStatus?.length > 0 &&
                        data?.gameStatus
                          .filter((gameSt: any) => gameSt?.is_deleted == false) // Filter out items where is_deleted is false
                          .map((gameSt: any) => {
                            // Find a matching device in releaseByPlatforms.release
                            const matchingDevice =
                              data?.releaseByPlatforms?.release.find(
                                (release: any) =>
                                  release?.device?.name === gameSt?.device_name
                              );
                            if (!matchingDevice) return null;

                            console.log(
                              gameSt,
                              data?.releaseByPlatforms?.release,
                              "gameSt"
                            );

                            // if (!matchingDevice) return null; // Skip if no matching device found

                            return (
                              <div
                                key={gameSt?.device_name}
                                className="flex-shrink-0 flex gap-2 items-center divider-right relative"
                              >
                                {/* This is different images for different devices */}
                                <Image
                                  src={
                                    gameSt?.device_name
                                      ?.toLowerCase()
                                      .includes("pc")
                                      ? PCIcon
                                      : gameSt?.device_name
                                          ?.toLowerCase()
                                          .includes("playstation")
                                      ? PlaystationIcon
                                      : gameSt?.device_name
                                          ?.toLowerCase()
                                          .includes("xbox")
                                      ? XboxIcon
                                      : gameSt?.device_name
                                          ?.toLowerCase()
                                          .includes("switch")
                                      ? SwitchIcon
                                      : gameSt?.device_name
                                          ?.toLowerCase()
                                          .includes("mac")
                                      ? MacIcon
                                      : gameSt?.device_name
                                          ?.toLowerCase()
                                          .includes("android")
                                      ? AndroidIcon
                                      : DeviceIcon
                                  }
                                  className="w-5 h-5"
                                  alt="calendar icon"
                                  width={20}
                                  height={20}
                                />
                                {/* This is different images for different devices */}
                                <span className="font-medium text-sm">
                                  {gameSt?.device_name}:{" "}
                                </span>
                                <span className="text-[#00ADFF] font-medium text-sm">
                                  {gameSt?.beat_status}
                                </span>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
                {/* </Link> */}
              </div>
            </>
          );
        })}

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        isNotClosed={true}
      >
        <div className="flex items-center gap-2 mb-9">
          <Image
            src={
              currentItem?.attributes?.device_name?.toLowerCase().includes("pc")
                ? PCIcon
                : currentItem?.attributes?.device_name
                    ?.toLowerCase()
                    .includes("playstation")
                ? PlaystationIcon
                : currentItem?.attributes?.device_name
                    ?.toLowerCase()
                    .includes("xbox")
                ? XboxIcon
                : currentItem?.attributes?.device_name
                    ?.toLowerCase()
                    .includes("switch")
                ? SwitchIcon
                : currentItem?.attributes?.device_name
                    ?.toLowerCase()
                    .includes("mac")
                ? MacIcon
                : currentItem?.attributes?.device_name
                    ?.toLowerCase()
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
    </>
  );
};

export default GameDirectoryCardLibrary;

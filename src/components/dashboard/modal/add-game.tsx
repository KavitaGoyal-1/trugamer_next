import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { updateGameStatus } from "@/store/slices/game-hours";
import { selectAuthState } from "@/store/slices/auth-slice";
import { toastMessage } from "@/utills/toast";
import { IGame } from "@/types/game";
import Modal from "@/components/modal";
import GameStatusPopupOnShreach from "@/components/game-details/game-status-popup-on-search";
import Image from "next/image";

interface AddGameHereProps {
  show?: boolean;
  isLoading?: boolean;
  word: string;
  closeAddModal: () => void;
  handleAddPlayingNow: () => void;
  setShow?: (active: boolean) => void;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  gameData: any[];
  setGamesArray: React.Dispatch<React.SetStateAction<IGame[]>>;
  gamesArray: any[];
  handleGames: (newGame: IGame) => void;
  addGameVerificationMessage?: string | null;
  onSreachInPlayingNow?: boolean;
}

interface ProgressDataItem {
  id: number;
  attributes: any;
}

interface Device {
  deviceName: string;
  deviceId: number;
}

const AddGameHere: React.FC<AddGameHereProps> = ({
  show,
  setShow,
  onSreachInPlayingNow,
  isLoading,
  closeAddModal,
  handleAddPlayingNow,
  word,
  setWord,
  gameData,
  gamesArray,
  setGamesArray,
  handleGames,
  addGameVerificationMessage,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [devices, setDevices] = useState<any>();
  const { userData } = useSelector(selectAuthState);
  const [progressData, setProgressData] = useState<ProgressDataItem[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [devicesOn, setDevicesOn] = useState(true);
  const [beatStatus, setBeatStatus] = useState<string>("Never Beat");
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);
  const [selectedGameRelease, setSelectedGameRelease] = useState<any>();
  const token = getToken();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEditClick = (item: ProgressDataItem) => {
    setBeatStatus(item.attributes.beat_status);
    setHoursPlayed(item.attributes.hours_played);
  };

  useEffect(() => {
    if (!visible) {
      setProgressData([]); // Reset progress data when visible is false
      return;
    }
  }, [visible]);

  const fetchSelectedDevices = async (gameId: any) => {
    try {
      const response = await axios.get(
        `${getApi()}/game-statuses?filters[user][id][$eq]=${
          userData?.id
        }&filters[game][id][$eq]=${gameId?.id}`,
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleForGameStatusPopup = (gameData: any) => {
    const devices_id = gameData?.attributes?.devices;
    const devices_length = gameData?.attributes?.devices?.data?.length;
    const deviceData = gameData?.attributes?.devices;

    // Check if the game is already in the playingNow list
    const isGameAlreadyPlaying = userData?.playingNow?.some(
      (game: any) => game?.id === gameData?.id
    );

    if (isGameAlreadyPlaying) {
      toastMessage("info", "You are already playing this game.");
      setVisible(false);
    } else {
      if (devices_id && devices_length > 0) {
        setVisible(true);
        setDevices(deviceData);
        setSelectedGame(gameData);
        fetchSelectedDevices(gameData);
      } else {
        toastMessage("error", "In this game no devices are available");
        setGamesArray((prev: any) =>
          prev.filter((g: any) => g.id !== gameData.id)
        );
      }
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

      fetchSelectedDevices(selectedGame);
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
      const deviceName = device?.attributes?.name;
      const deviceId = device?.id || device?.attributes?.id;

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
    } else {
      // Redirect to login if the user is not authenticated
      router.push("/auth/sign-in");
      localStorage.setItem("Revisedslug", selectedGame?.slug);
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
      fetchSelectedDevices(selectedGame);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const checkdevices = () => {
    if (!devicesOn) {
      toastMessage("error", "No device selected. Please select a device.");
      setGamesArray((prev: any) =>
        prev.filter((g: any) => g.id !== selectedGame.id)
      );
      setDevicesOn(true);
    }
  };

  useEffect(() => {
    if (selectedGame) {
      fetchSelectedDevices(selectedGame);
    }
  }, [selectedGame]);

  useEffect(() => {
    checkdevices();
  }, [devicesOn]);

  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  return (
    <>
      <Modal show={show} setShow={setShow}>
        <div className="bg-[#1A2947] max-w-[450px] md:min-w-[450px] w-full h-[400px] flex flex-col justify-between">
          <div className="">
            <div className="flex flex-col mx-6 mt-9">
              <p className="text-[18px] font-[600] mb-2">Add Game to Queue</p>
              <p className="text-[14px] text-[#667085] font-[400]">
                Please enter a game title to search
              </p>
              <label
                htmlFor="searchGame"
                className="mt-5 mb-2 text-[14px] font-medium "
              >
                Name of Game
              </label>
              <input
                type="text"
                name="searchGame"
                placeholder="e.g. God of War"
                value={word}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setWord && setWord(e.target.value);
                }}
                className="bg-white rounded-lg z-10	h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
              />
              {addGameVerificationMessage ? (
                <p className="mt-[4px] text-[14px] text-red-500 font-normal">
                  {`${addGameVerificationMessage}`}
                </p>
              ) : (
                ""
              )}
              <div
                className={`${
                  gameData && gameData?.length !== 0 ? "block" : "hidden"
                } [@media(max-width:340px)]:w-[83%] [@media(min-width:341px) and (max-width:370px)]:w-[85%]  overflow-y-scroll absolute top-[184px] z-50 w-[85%] md:w-[90%] bg-black h-[140px] flex flex-col items-center rounded-b-xl`}
              >
                {gameData?.length !== 0 &&
                  gameData?.map((game: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleGames(game),
                          onSreachInPlayingNow
                            ? handleToggleForGameStatusPopup(game)
                            : null;
                      }}
                      className="w-[90%] ml-2 hover:cursor-pointer hover:bg-gray-800 mt-2 rounded-lg"
                    >
                      <div className="flex m-2 px-2">
                        <div className="h-[80px] w-[70px]">
                          <Image
                            src={
                              game?.attributes?.image?.data?.attributes?.formats
                                ? game?.attributes?.image?.data?.attributes
                                    ?.formats?.thumbnail?.url ||
                                  game?.attributes?.coverImage?.data?.attributes
                                    ?.url
                                : game?.attributes?.coverImage?.data?.attributes
                                    ?.url ||
                                  game?.attributes?.image?.data?.attributes
                                    ?.formats
                            }
                            alt="game add"
                            title="game add"
                            width={70}
                            height={80}
                            className="h-[80px] min-w-[70px] object-cover w-[70px]"
                          />
                        </div>
                        <div className="ml-5 pr-2">
                          <p className="text-[17px] font-[600]">
                            {game?.attributes?.title}
                          </p>
                          <div className="flex mt-[2px] items-center">
                            <Image
                              src="/icons/play-Icon.png"
                              alt="add icon"
                              width={10}
                              height={10}
                              className="w-4 h-4 "
                            />
                            <p className="text-[14px] font-[500] text-[#596184] ml-2">
                              {`${game?.attributes?.played} Plays`}
                            </p>
                          </div>
                          <div className="flex mt-[2px] items-center">
                            <Image
                              src="/icons/Star.png"
                              alt="add icon"
                              width={10}
                              height={10}
                              className="w-4 h-4 "
                            />
                            <p className="text-[14px] font-[500] text-[#98A2B3] ml-2">
                              {game?.attributes?.rating}
                            </p>
                          </div>
                        </div>
                      </div>
                      {gameData?.length - 1 !== index && (
                        <span className=" block bg-white w-[100%] mt-1 h-[1px]" />
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex flex-wrap max-h-28 overflow-auto mt-2 gap-2">
                {gamesArray &&
                  gamesArray?.length !== 0 &&
                  gamesArray?.map((game: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center w-fit rounded-2xl bg-[#596184] py-1 px-2"
                    >
                      <p className="mx-3 text-[8px]">
                        {game?.attributes?.title}
                      </p>
                      <RxCross2
                        onClick={() => {
                          !isLoading &&
                            setGamesArray((prev: any) =>
                              prev.filter((g: any) => g.id !== game.id)
                            );
                        }}
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-5 mx-6">
            <button
              onClick={closeAddModal}
              className="w-[48%] h-[50px] bg-white hover:bg-gray-100 text-[16px] font-[600] text-[#344054] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPlayingNow}
              disabled={isLoading}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600]"
            >
              {isLoading ? "Add Game..." : "Add Game"}
            </button>
          </div>
        </div>
      </Modal>
      {visible && (
        <GameStatusPopupOnShreach
          visible={visible}
          inSearch={true}
          setVisible={setVisible}
          selectedGame={selectedGame}
          devicesOn={devicesOn}
          deviceData={devices}
          setDevicesOn={setDevicesOn}
          selectedGameRelease={selectedGameRelease}
          setSelectedGameRelease={setSelectedGameRelease}
          selectedDevices={selectedDevices}
          progressData={progressData}
          handleDeviceClick={handleDeviceClick}
          beatStatus={beatStatus}
          handleEditClick={handleEditClick}
          handleSubmitProgressFromGameStatus={
            handleSubmitProgressFromGameStatus
          }
        />
      )}
    </>
  );
};
export default AddGameHere;

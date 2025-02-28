import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck, FaRegEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import LoaderSpinner from "../../loader-spinner";
import DeviceIcon from "../../../../public/icons/biheadset.svg";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import { toastMessage } from "@/utills/toast";
import { setAllUserDevices } from "@/store/slices/user-saved-slice";
import { logOut } from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import Image from "next/image";

const popularDevices = [
  { name: "Xbox Series X", icon: XboxIcon },
  { name: "PlayStation 5", icon: PlaystationIcon },
  { name: "Switch", icon: SwitchIcon },
  { name: "PC", icon: PCIcon },
];
interface Device {
  name: string;
  slug: string;
  id: number;
  icon?: string; // Optional, since it may be added later
}

const MyDevicesContent = () => {
  const [userData, setUserData] = useState<any>();
  const token = getToken();
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState(popularDevices);
  const [allDevices, setAllDevices] = useState([]);
  const [usersDevices, setUserDevices] = useState([]);
  const [mostPopular, setMostPopular] = useState<Device[]>([]);
  const [otherdevices, setOtherdevices] = useState<Device[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(20);
  const [allDevicesShown, setAllDevicesShown] = useState(
    Array.isArray(otherdevices) ? otherdevices.length : 0
  );
  const [showLess, setShowLess] = useState(false);

  useEffect(() => {
    setAllDevicesShown(Array.isArray(otherdevices) ? otherdevices.length : 0);
  }, [otherdevices]);
  async function getAllDevices() {
    setFirstLoading(true);
    try {
      const response = await axios.get(`${getApi()}/devices/all`, {
        headers: { Authorization: token && `Bearer ${token}` },
      });
      const res = await axios.get(
        `${getApi()}/users-permissions/user-saved-devices`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status == 200) {
        const devices =
          Array.isArray(res?.data?.active_devices) &&
          res?.data?.active_devices?.length > 0
            ? res?.data?.active_devices?.map((platform: any) => platform.name)
            : [];

        setUserDevices(devices);
      }
      if (response.status == 200) {
        setAllDevices(response?.data);
      }
      setFirstLoading(false);
    } catch (error: any) {
      setFirstLoading(false);
    }
  }

  useEffect(() => {
    setSelectedDevices(usersDevices);
  }, [usersDevices]);

  useEffect(() => {
    try {
      let MostPopular: any[] = [];
      let Otherdevices: any[] = [];
      allDevices?.forEach((device: any) => {
        if (!device?.name) {
          return;
        }
        const found = favoriteGenres?.find(
          (popular: any) => popular.name === device.name
        );
        if (found) {
          MostPopular.push({
            ...device,
            icon: found.icon,
          });
        } else {
          Otherdevices.push({
            ...device,
            icon: "DeviceIcon",
          });
        }
      });
      setMostPopular(MostPopular);
      setOtherdevices(Otherdevices);
    } catch (error: any) {
      console.log(error.message);
    }
  }, [allDevices, usersDevices]);

  useEffect(() => {
    getAllDevices();
  }, []);

  const toggleGenre = async (genre: string) => {
    setSelectedDevices((prev) => {
      const updated = prev.includes(genre)
        ? prev.filter((item) => item !== genre) // Deselect if already selected
        : [genre, ...prev]; // Select and add to the front
      setFavoriteGenres((current) => {
        const withoutSelected = current?.filter((item) => item.name !== genre);
        const selected = current?.find((item) => item.name === genre);
        return selected ? [selected, ...withoutSelected] : current;
      });
      return updated;
    });
  };

  const handleLogout = () => {
    dispatch(logOut());
    return router.push("/sign-in");
  };

  const getUserData = async () => {
    const { data: user } = await axios.get(
      `${getApi()}/users/me?populate=picture&populate=favorite_games.image&populate=active_devices.logo.image,inactive_devices.logo.images&populate=playing_now.image,playing_next.image,beaten_games.game.image,playing_now.devices.icon.image,playing_now.devices.logo.image,playing_next.devices.icon.image,playing_next.devices.logo.image,playing_now.releaseByPlatforms.release,playing_next.releaseByPlatforms.release&populate=games_library.image,games_library.devices.icon.image`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserData(user);
  };

  useEffect(() => {
    getUserData();
    if (!token) {
      handleLogout();
    }
  }, []);

  const handleViewMore = () => {
    setItemsToShow((prevItems) => prevItems + 20);
  };

  const handleViewLess = () => {
    setItemsToShow(20);
    setShowLess(false);
  };

  useEffect(() => {
    setOtherdevices((currentDevices) => {
      const selected = currentDevices?.filter((device) =>
        selectedDevices.includes(device.name)
      );
      const unselected = currentDevices?.filter(
        (device) => !selectedDevices.includes(device.name)
      );
      return [...selected, ...unselected]; // Selected devices on top
    });
    setMostPopular((currentDevices) => {
      const selected = currentDevices.filter((device) =>
        selectedDevices.includes(device.name)
      );
      const unselected = currentDevices.filter(
        (device) => !selectedDevices.includes(device.name)
      );
      return [...selected, ...unselected]; // Selected devices on top
    });
  }, [selectedDevices]);

  useEffect(() => {
    if (
      allDevicesShown != 0 &&
      !isNaN(Number(allDevicesShown)) &&
      Number(allDevicesShown) <= itemsToShow
    ) {
      setShowLess(true);
    }
  }, [itemsToShow, allDevicesShown]);

  const handleUpdateDevices = async () => {
    setUpdateLoading(true);
    setItemsToShow(20);
    try {
      const matchedDevices = allDevices.filter((device: any) =>
        selectedDevices.includes(device.name)
      );
      const response = await axios.post(
        `${getApi()}/users-permissions/update-user-devices`,
        {
          matchedDevices,
        },
        {
          headers: { Authorization: token && `Bearer ${token}` },
        }
      );
      if (response.status == 200) {
        const devices =
          Array.isArray(
            response?.data?.userWithUpdatedDevices?.active_devices
          ) &&
          response?.data?.userWithUpdatedDevices?.active_devices?.length > 0
            ? response?.data?.userWithUpdatedDevices?.active_devices?.map(
                (platform: any) => platform?.name
              )
            : [];
        setUserDevices(devices);

        dispatch(setAllUserDevices(devices)); //  dispatch(setGames(allgames));
        toastMessage("success", "Devices are updated.");
      }
      setUpdateLoading(false);
    } catch (error) {
      toastMessage("error", "Devices are not updated");
      setUpdateLoading(false);
    }
  };

  return firstLoading ? (
    <>
      <div className="relative">
        <div className="absolute top-[250px] left-1/2 transform -translate-x-1/2">
          <LoaderSpinner />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="w-full py-4 pt-0 md:pt-2 bg-[#0F111F] rounded-lg pb-0 overflow-auto h-full md:h-[75vh] lg:h-[500px] 2xl:h-[540px] xxl:h-[60vh] relative overflow-x-hidden">
        <div className="w-full max-w-[100%] pb-4 rounded-[14px] px-4 hidden md:flex">
          <h3 className="text-2xl font-bold my-0 ">My Device</h3>
        </div>

        {/* Popular Genres */}
        <div className="w-full px-4 mb-6">
          <div className=" relative mb-2">
            <h2 className="text-lg font-semibold">
              <span className="bg-[#0f111f] relative z-10 pr-3 ">
                Most Popular
              </span>
              <span className="line-right"></span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Array.isArray(mostPopular) &&
              mostPopular?.map(({ name, icon }) => (
                <div
                  key={name}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-[10px] md:text-sm cursor-pointer ${
                    selectedDevices.includes(name)
                      ? "bg-[#00ADFF66] text-white border-[#00ADFF]"
                      : "bg-[#272935] text-[#999DB0] border-[#272935]"
                  }`}
                  onClick={() => toggleGenre(name)}
                >
                  <Image
                    className={`${
                      selectedDevices?.includes(name) ? "brightness-[300]" : ""
                    } `}
                    src={icon ? icon : ""}
                    alt="title"
                    width={20}
                    height={20}
                  />
                  {name}
                  {selectedDevices?.includes(name) && (
                    <span className="ml-2">
                      <FaCheck />
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Game Modes */}
        <div className="w-full px-4 mb-6">
          <div className=" relative mb-2">
            <h2 className="text-lg font-semibold">
              <span className="bg-[#0f111f] relative z-10 pr-3 ">Others</span>
              <span className="line-right"></span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Array.isArray(otherdevices) &&
              otherdevices
                ?.filter((device) => device?.name)
                .slice(0, itemsToShow)
                .map(({ name, icon }) => (
                  <div
                    key={name}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-[10px] md:text-sm cursor-pointer ${
                      selectedDevices?.includes(name)
                        ? "bg-[#00ADFF66] text-white border-[#00ADFF]"
                        : "bg-[#272935] text-[#999DB0] border-[#272935]"
                    }`}
                    onClick={() => toggleGenre(name)}
                  >
                    {selectedDevices?.includes(name) ? (
                      <Image
                        className={` w-3 h-3 sm:w-5 sm:h-5 2xl:w-8 2xl:h-8 ${
                          selectedDevices?.includes(name)
                            ? "brightness-[300]"
                            : ""
                        }`}
                        src="/gameCalender/GameController.svg"
                        alt=""
                        width={12}
                        height={12}
                      />
                    ) : (
                      <Image
                        src="/gameCalender/GameController.svg"
                        className="w-3 h-3 sm:w-5 sm:h-5 2xl:w-8 2xl:h-8"
                        alt=""
                        title=""
                        width={12}
                        height={12}
                      />
                      // </span>
                    )}

                    {name}
                    {selectedDevices?.includes(name) && (
                      <span className="ml-2">
                        <FaCheck />
                      </span>
                    )}
                  </div>
                ))}

            {Array.isArray(otherdevices) &&
              otherdevices.length > 20 &&
              (showLess ? (
                <span
                  onClick={handleViewLess}
                  className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer"
                >
                  View Less <FaAngleUp className="ml-1" />
                </span>
              ) : (
                <span
                  onClick={handleViewMore}
                  className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer"
                >
                  View More <FaAngleDown className="ml-1" />
                </span>
              ))}

            {/* )} */}
          </div>
        </div>

        {/* Save Button */}
        <div className="save-btm mt-6 flex items-start justify-start px-4">
          <button
            className={`bg-cBlue-light py-3 md:py-2 px-3 cursor-pointer text-white text-xs md:text-base font-semibold rounded-[10px] ${
              updateLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpdateDevices}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MyDevicesContent;

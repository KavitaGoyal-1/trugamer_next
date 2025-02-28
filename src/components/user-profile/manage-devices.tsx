import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../modal";
import { RxCross2 } from "react-icons/rx";
import { UseDebounce } from "../../hooks/use-debounce";
import { toast } from "react-toastify";
import DeviceIcon from "../../../public/icons/device.svg";
import MacIcon from "../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../public/icons/androidgrey.svg";
import PCIcon from "../../../public/icons/window.svg";
import XboxIcon from "../../../public/icons/xport.svg";
import PlaystationIcon from "../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../public/icons/switch.svg";
import Image from "next/image";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";

interface IProps {
  data: any;
  getUserData: any;
  inactiveDevices?: any[];
  activeDevices?: any[];
}

const ManageDevices = ({
  data,
  activeDevices,
  inactiveDevices,
  getUserData,
}: IProps) => {
  const [deviceData, setDeviceData] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [openDeleteDeviceModal, setOpenDeleteDeviceModal] =
    useState<boolean>(false);
  const [deleteDeviceData, setDeleteDeviceData] = useState<any>({});
  const [deleteDeviceIndex, setDeteleDeviceIndex] = useState<number>(-1);
  const [word, setWord] = useState<string>("");
  const [devicesArray, setDevicesArray] = useState<any>([]);
  const [devicesStatusArray, setDevicesStatusArray] = useState<any[]>([]);
  const token = getToken();
  const searchedWord = UseDebounce(word, 500);

  useEffect(() => {
    deviceStatus();
  }, [activeDevices]);

  const deviceStatus = () => {
    let activeStatus: any =
      activeDevices?.map((active) => {
        active.status = true;
        return active;
      }) || [];
    let inactiveStatus: any =
      inactiveDevices?.map((inactive) => {
        inactive.status = false;
        return inactive;
      }) || [];
    setDevicesStatusArray([...activeStatus, ...inactiveStatus]);
  };

  const handleDeviceStatus = async (obj: any, index: number) => {
    if (obj.status === false) {
      let payload = {
        active_devices: [obj],
      };
      try {
        let res = await axios.post(
          `${getApi()}/users-permissions/user/active-devices`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          let temp = [...devicesStatusArray];
          temp[index].status = !temp[index].status;
          setDevicesStatusArray(temp);
        }
        toastMessage("success", "Device is active now");
      } catch (error) {
        console.log(error);
      }
    } else {
      let payload = {
        inactive_devices: [obj],
      };
      try {
        let res = await axios.post(
          `${getApi()}/users-permissions/user/inactive-devices`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          let temp = [...devicesStatusArray];
          temp[index].status = !temp[index].status;
          setDevicesStatusArray(temp);
        }
        toastMessage("success", "Device is inactive now");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleVisible = () => {
    setDeviceData([]);
    setWord("");
    setVisible(!visible);
    setDevicesArray([]);
  };

  const getDevices = async () => {
    if (searchedWord.length == 0) {
      return setDeviceData([]);
    }
    try {
      const { data } = await axios.get(
        `${getApi()}/devices?populate=logo.image&filters[name][$containsi]=${searchedWord}`,
        {
          headers: { Authorization: token && `Bearer ${token}` },
        }
      );
      setDeviceData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDevices = (device: any) => {
    // Check if the device is already in the array
    if (!devicesArray.some((d: any) => d.id === device.id)) {
      setDevicesArray([...devicesArray, device]);
    } else {
      toast.error("This device is already added", { toastId: "11" });
    }
    setWord("");
  };

  const addDevices = async () => {
    const existingDeviceIds = activeDevices
      ? new Set(activeDevices.map((device) => device.id))
      : new Set();
    const errorMessages = [];
    const newDevices = [];
    for (const device of devicesArray) {
      if (existingDeviceIds.has(device.id)) {
        errorMessages.push(`Device ${device.attributes.name} already exists`);
      } else {
        newDevices.push(device);
      }
    }
    if (errorMessages.length > 0) {
      toastMessage("error", errorMessages.join(", "));
    }
    if (newDevices.length === 0) {
      toggleVisible();
      return;
    }
    let payload = {
      active_devices: newDevices,
    };
    try {
      let res = await axios.post(
        `${getApi()}/users-permissions/user/active-devices`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getUserData();
      toastMessage("success", "Device added successfully");
      toggleVisible();
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };

  const deleteDevices = async () => {
    let payload = {
      devices: [deleteDeviceData],
    };
    try {
      const res = await axios.patch(
        `${getApi()}/users-permissions/user/remove-devices`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let temp = [...devicesStatusArray];
      temp.splice(deleteDeviceIndex, 1);
      setDevicesStatusArray(temp);
      getUserData();
      deleteDevicesCloseModal();
      toastMessage("success", "Device deleted successfully");
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };
  const deleteDevicesOpenModal = (device: any, index: number) => {
    setOpenDeleteDeviceModal(true);
    setDeleteDeviceData(device);
    setDeteleDeviceIndex(index);
  };

  const deleteDevicesCloseModal = () => {
    setOpenDeleteDeviceModal(false);
    setDeleteDeviceData({});
    setDeteleDeviceIndex(-1);
  };

  useEffect(() => {
    getDevices();
  }, [searchedWord]);

  useEffect(() => {
    if (openDeleteDeviceModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [openDeleteDeviceModal]);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);
  return (
    <div className="w-full grid grid-cols-1 gap-y-4 md:gap-y-8 items-center place-content-start lg:mt-[35px] mt-[0px] md:mt-[70px]">
      <div className="flex justify-between items-center">
        <h2 className="text-start font-bold text-[24px]">Manage devices</h2>
        <button
          className="bg-cBlue-special justify-center hover:bg-cBlue-extraLight flex py-[10px] px-[18px] rounded-2xl font-semibold capitalize text-[14px] max-sm:hidden"
          onClick={toggleVisible}
        >
          Add Device
        </button>
      </div>
      <div className="grid grid-cols-1 gap-y-4">
        {devicesStatusArray?.length === 0 ? (
          <div>You don't have any devices yet</div>
        ) : (
          <div>
            <div className="overflow-y-auto max-h-[620px] overflow-x-hidden pr-2 md:pr-5 pt-4 scroll-to-wide">
              {devicesStatusArray &&
                devicesStatusArray.map((device, index) => (
                  <div
                    key={device.id}
                    className="bg-[#1A2947] p-4 rounded-lg grid grid-cols-[max-content_max-content_max-content] max-sm:grid-cols-2 justify-between	mb-4 relative"
                  >
                    <div
                      onClick={() => deleteDevicesOpenModal(device, index)}
                      className="absolute grid place-content-center bg-cPurple-light border-cBlack-dark border-[4.95px] rounded-[8.66px] w-[28px] h-[28px] top-[-10px] right-[-10px]"
                    >
                      <Image
                        src="/icons/closing-x.svg"
                        alt="close icon"
                        width={17}
                        height={17}
                        className="w-[19.32px] h-[19.32px] hover:cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-[max-content_120px] gap-x-4	">
                      <Image
                        src={
                          device?.name.toLowerCase().includes("pc")
                            ? PCIcon
                            : device?.name.toLowerCase().includes("playstation")
                            ? PlaystationIcon
                            : device?.name.toLowerCase().includes("xbox")
                            ? XboxIcon
                            : device?.name.toLowerCase().includes("switch")
                            ? SwitchIcon
                            : device?.name.toLowerCase().includes("mac")
                            ? MacIcon
                            : device?.name.toLowerCase().includes("android")
                            ? AndroidIcon
                            : DeviceIcon
                        }
                        alt={device?.logo?.alt}
                        // title={device?.logo?.alt}
                        width={41}
                        height={41}
                        className="w-[41.92px] h-[41.92px] rounded-[5.78px]"
                      />
                      <div>
                        <h3 className="text-base font-semibold text-start">
                          {device.name}
                        </h3>
                        <p className="text-cGray-500 text-sm font-normal text-start">{`20 games played`}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 justify-items-start gap-0 max-sm:hidden">
                      <span className="text-sm font-semibold">Activity</span>
                      <p className="text-cGray-500 text-sm font-normal">{`10 days ago`}</p>
                    </div>

                    <div className="grid grid-cols-1 max-sm:justify-items-end justify-items-start gap-1.5">
                      <span className="text-sm font-semibold">Status</span>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={() => handleDeviceStatus(device, index)}
                            checked={device?.status}
                            className="sr-only peer focus:outline-0"
                          />
                          <div className="w-[36px] h-[20px] bg-[#ffffff1a] rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cBlue-light "></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 col-span-2 mt-2 block sm:hidden">
                      <span className="text-sm font-semibold">Activity</span>
                      <p className="text-cGray-500 text-sm font-normal">{`10 days ago`}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="flex justify-center sm:hidden block ">
          <button
            className="bg-cBlue-special justify-center hover:bg-cBlue-extraLight flex py-[10px] px-[18px] rounded-lg font-normal capitalize text-[14px] w-[60%] max-[450px]:w-[100%]"
            onClick={toggleVisible}
          >
            Add Device
          </button>
        </div>
      </div>

      <Modal show={visible} setShow={setVisible}>
        <div className="bg-[#1A2947] max-w-[400px] md:min-w-[400px] w-full h-[400px] flex flex-col justify-between">
          <div className="">
            <div className="flex flex-col mx-6 mt-9">
              <p className="text-[18px] font-[600] mb-2">Add Your Device</p>
              <p className="text-[14px] text-[#667085] font-[400]">
                Please enter a device title to search
              </p>
              <label
                htmlFor="searchDevice"
                className="mt-5 mb-2 text-[14px] font-medium"
              >
                Name of Device
              </label>
              <input
                type="text"
                value={word}
                name="searchDevice"
                placeholder="e.g. PS 5"
                className="bg-white rounded-lg h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWord && setWord(e.target.value)
                }
              />
              <div
                className={`${
                  deviceData && deviceData.length !== 0 ? "block" : "hidden"
                } overflow-y-scroll bg-black h-[110px] flex flex-col items-center rounded-b-xl`}
              >
                {deviceData.length !== 0 &&
                  deviceData.map((device: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleDevices(device)}
                      className="w-[90%] ml-2 hover:cursor-pointer hover:bg-gray-800 mt-2"
                    >
                      <div className="flex m-2">
                        <div className="h-[50px] w-[50px]">
                          <Image
                            src={
                              device?.attributes?.name
                                ?.toLowerCase()
                                .includes("pc")
                                ? PCIcon
                                : device?.attributes?.name
                                    .toLowerCase()
                                    .includes("playstation")
                                ? PlaystationIcon
                                : device?.attributes?.name
                                    .toLowerCase()
                                    .includes("xbox")
                                ? XboxIcon
                                : device?.attributes?.name
                                    .toLowerCase()
                                    .includes("switch")
                                ? SwitchIcon
                                : device?.attributes?.name
                                    .toLowerCase()
                                    .includes("mac")
                                ? MacIcon
                                : device?.attributes?.name
                                    .toLowerCase()
                                    .includes("android")
                                ? AndroidIcon
                                : DeviceIcon
                            }
                            alt="device logo"
                            title="device logo"
                            width={70}
                            height={80}
                            className="h-[40px] w-[40px]"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-[17px] font-[600]">
                            {device.attributes.name}
                          </p>
                        </div>
                      </div>
                      {deviceData.length - 1 !== index && (
                        <span className="block bg-white w-[100%] mt-1 h-[1px]" />
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex mt-2 mb-3 gap-2 flex-wrap">
                {devicesArray.length !== 0 &&
                  devicesArray.map((device: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center w-fit rounded-2xl bg-[#596184] py-1 px-2"
                    >
                      <p className="mx-3">{device.attributes.name}</p>
                      <RxCross2
                        onClick={() =>
                          setDevicesArray((prev: any) =>
                            prev.filter((d: any) => d.id !== device.id)
                          )
                        }
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-5 mx-6 pb-5">
            <button
              onClick={() => setVisible(false)}
              className="w-[48%] h-[50px] bg-white hover:bg-gray-100 text-[16px] font-[600] text-[#344054] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={addDevices}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600]"
            >
              Add Device
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={openDeleteDeviceModal} setShow={setOpenDeleteDeviceModal}>
        <div className="bg-[#1A2947] h-[200px] flex flex-col justify-between">
          <div className="flex flex-col mx-6 mt-9">
            <p className="text-[18px] font-[600] mb-2 text-center">
              Are you sure you want to delete this device?
            </p>
          </div>
          <div className="flex justify-between mb-5 mx-6">
            <button
              onClick={deleteDevicesCloseModal}
              className="w-[48%] h-[50px] bg-white hover:bg-gray-100 text-[16px] font-[600] text-[#344054] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={deleteDevices}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600]"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageDevices;

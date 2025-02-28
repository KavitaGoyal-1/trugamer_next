import React from "react";
import Edit from "../../../../public/icons/edit.svg";
import CustomModal from "./custom-modal";
import DeviceIcon from "../../../../public/icons/device.svg";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import LoaderSpinner from "@/components/loader-spinner";
import Image from "next/image";
// import LoaderSpinner from "src/components/LoaderSpinner";
// Assuming progressData contains id and attributes with updated key names.
interface ProgressAttributes {
  hours_played: number;
  beat_status: string;
  device_name: string;
}

interface ProgressDataItem {
  id: number;
  attributes: ProgressAttributes;
}

const ProgessSection: React.FC<{
  selectedDevices: any;
  progressData: ProgressDataItem[];
  beatStatus: any;
  setBeatStatus: any;
  hoursPlayed: any;
  setHoursPlayed: any;
  updateDeviceId: any;
  setUpdateDeviceId: any;
  showModal: any;
  setShowModal: any;
  handleSubmitProgress: any;
  deviceData: any;
  handleHoursChange?: any;
  currentItem?: any;
  setCurrentItem?: any;
  handleEditClick?: any;
  loadingOnProgress: any;
}> = ({
  selectedDevices,
  progressData,
  beatStatus,
  setBeatStatus,
  hoursPlayed,
  showModal,
  setShowModal,
  handleSubmitProgress,
  handleHoursChange,
  currentItem,
  handleEditClick,
  loadingOnProgress,
}) => {
  // if (Array.isArray(progressData) && progressData?.length < 0) {
  //   return null;
  // }

  const filteredData = progressData?.filter((item) =>
    selectedDevices.some(
      (device: any) =>
        device?.deviceName === item?.attributes?.device_name &&
        device?.is_deleted === false
    )
  );

  console.log(progressData, "filteredData dd");

  return (
    <>
      {filteredData?.length > 0 && (
        <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
          <h3 className="section-card-heading">Progress</h3>
          <div className="w-full bg-cBlue-secondary p-5 rounded-xl">
            <div className="flex flex-col gap-[18px]">
              {filteredData?.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex flex-col">
                    <div className="flex justify-between pb-1">
                      <div className="inline-flex gap-2">
                        <Image
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
                        <span className="text-base font-medium text-left">
                          {item.attributes.device_name}
                        </span>
                      </div>
                      <Image
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

          <CustomModal
            show={showModal}
            onClose={() => setShowModal(false)}
            isNotClosed={false}
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
                {loadingOnProgress ? <LoaderSpinner /> : "Submit"}
              </button>
            </form>
          </CustomModal>
        </div>
      )}
    </>
  );
};

export default ProgessSection;

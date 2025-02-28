import React from "react";
import DeviceIcon from "../../../../public/icons/device.svg";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import Image from "next/image";

interface ProgressDataItem {
  id: number;
  attributes: any;
}

interface OwnerShipSectionProps {
  selectedDevices?: any;
  setSelectedDevices?: any;
  deviceData: any;
  setProgressData?: React.Dispatch<React.SetStateAction<ProgressDataItem[]>>;
  fetchSelectedDevices: any;
  setLoading?: any;
  game: any;
  loading?: boolean;
  globalLoading?: boolean;
  setGlobalLoading?: any;
  createOrUpdateDevice: any;
  handleOwnershipDeviceClick: any;
}

const OwnerShipSection: React.FC<OwnerShipSectionProps> = ({
  selectedDevices,
  deviceData,

  globalLoading,
  handleOwnershipDeviceClick,
}) => {
  return (
    <div className="block mb-5 relative pr-0 sm:pr-0">
      <h3 className="section-card-heading">Ownership</h3>
      <div className="w-full bg-cBlue-secondary p-5 rounded-xl max-w-[350px]">
        <div className="flex gap-4 flex-wrap">
          {deviceData?.data?.map((device: any) => (
            <div
              key={device?.attributes?.name}
              onClick={() =>
                !globalLoading && handleOwnershipDeviceClick(device)
              }
              className={`relative own-icons inline-flex items-center gap-1 p-2 rounded-lg cursor-pointer ${
                selectedDevices?.some(
                  (d: any) =>
                    d?.deviceName === device?.attributes?.name &&
                    d?.is_deleted === false
                )
                  ? "bg-cBlue-light active-icons text-white font-bold img-filter"
                  : "border border-cPurple-light text-cPurple-light"
              }`}
            >
              <Image
                src={
                  device.attributes?.name.toLowerCase().includes("pc")
                    ? PCIcon
                    : device.attributes?.name
                        .toLowerCase()
                        .includes("playstation")
                    ? PlaystationIcon
                    : device.attributes?.name.toLowerCase().includes("xbox")
                    ? XboxIcon
                    : device.attributes?.name.toLowerCase().includes("switch")
                    ? SwitchIcon
                    : device.attributes?.name.toLowerCase().includes("mac")
                    ? MacIcon
                    : device.attributes?.name.toLowerCase().includes("android")
                    ? AndroidIcon
                    : DeviceIcon
                }
                alt={`${device.attributes?.name} logo`}
                width={20}
                height={20}
                className="mr-0"
              />
              <span className="text-sm font-medium text-left">
                {device.attributes?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerShipSection;

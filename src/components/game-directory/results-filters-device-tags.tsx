import { useState, useCallback } from "react";
import { LuTags } from "react-icons/lu";
import { useDispatch } from "react-redux";
import filterdata from "./devices-for-filters.json";
import MacIcon from "../../../public/icons/AppleLogo.svg";
import PCIcon from "../../../public/icons/window.svg";
import XboxIcon from "../../../public/icons/xport.svg";
import PlaystationIcon from "../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../public/icons/switch.svg";
import AndroidIcon from "../../../public/icons/androidgrey.svg";
import DeviceIcon from "../../../public/icons/device.svg";
import RangeSlider from "react-range-slider-input";
import { debounce } from "lodash";
import "react-range-slider-input/dist/style.css";
import { useSelector } from "react-redux";
import {
  fetchGamesLibraryDataSuccess,
  clearFilters,
  addFilter,
} from "@/store/slices/game-library";
import Image from "next/image";

const filterConfig = [
  {
    label: "Single player",
    key: "Single player",
  },
  {
    label: "Multiplayer",
    key: "Multiplayer",
  },
  {
    label: "Co-operative",
    key: "Co-operative",
  },
  {
    label: "Split screen",
    key: "Split screen",
  },
  {
    label: "Massively Multiplayer Online (MMO)",
    key: "Massively Multiplayer Online (MMO)",
  },
  {
    label: "Battle Royale",
    key: "Battle Royale",
  },
];

const ResultsFiltersDeviceTags = () => {
  const devicesArray = filterdata.devicesData;
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false); // State to manage "Show More" and "Show Less"
  const [showAllTags1, setShowAllTags1] = useState(false); // State to manage "Show More" and "Show Less"
  const [visibleDeviceCount, setVisibleDeviceCount] = useState(10);
  const [hoursPlayed, setHoursPlayed] = useState<[number, number]>([0, 600]); // Initial range values
  const isDisabled = useSelector(
    (state: any) => state.gameLibrary?.hoursSlider
  );

  console.log(isDisabled, "data::");

  // Toggle functions
  const toggleDevices = () => setIsDeviceExpanded(!isDeviceExpanded);
  const toggleTags = () => setIsTagsExpanded(!isTagsExpanded);

  const dispatch = useDispatch();

  // Add these two state variables
  const [selectedDevices, setSelectedDevices] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleHoursChange = useCallback(
    debounce((hours) => {
      if (hours[0] == null || hours[1] == null) {
        return;
      }

      const selectedHours = {
        min: hours[0] != null ? hours[0] : null,
        max: hours[1] != null ? hours[1] : null,
      };
      console.log(" debounce is working ");
      // Dispatch the debounced API call
      dispatch(
        addFilter({
          data: { filterType: "selectedHours", filterKey: selectedHours },
        })
      );

      console.log("Debounced Selected Range:", hours);
    }, 500), // Adjust the debounce delay as needed (300ms in this example)
    []
  );

  const clearHours = () => {
    const selectedHours = {
      min: 0,
      max: 0,
    };
    dispatch(
      addFilter({
        data: { filterType: "selectedHours", filterKey: selectedHours },
      })
    );
    dispatch(fetchGamesLibraryDataSuccess([]));
    setHoursPlayed([0, 0]);
  };

  const onHoursChange = (hours: any) => {
    setHoursPlayed(hours);
    handleHoursChange(hours);
    dispatch(fetchGamesLibraryDataSuccess([]));
  };

  const handleCheckboxChangeTag = (key: string, type: string) => {
    if (type === "devices") {
      // Handle device selection
      setSelectedDevices((prevSelected) => {
        const updatedDevices = prevSelected.includes(key)
          ? prevSelected.filter((item) => item !== key) // Remove if already selected
          : [...prevSelected, key]; // Add if not selected
        let data = { filterType: "devices", filterKey: updatedDevices };
        // Dispatch after the state update
        dispatch(
          addFilter({
            data,
          })
        );

        return updatedDevices;
      });
    } else if (type === "game_modes") {
      // Handle tag selection
      setSelectedTags((prevSelected) => {
        const updatedTags = prevSelected.includes(key)
          ? prevSelected.filter((item) => item !== key) // Remove if already selected
          : [...prevSelected, key]; // Add if not selected
        let data = { filterType: "game_modes", filterKey: updatedTags };
        // Dispatch after the state update
        dispatch(
          addFilter({
            data,
          })
        );

        return updatedTags;
      });
    }
  };

  const handleShowMoreDevices = () => {
    setVisibleDeviceCount((prevCount) =>
      Math.min(prevCount + 10, devicesArray?.length)
    );
  };

  const handleShowLessDevices = () => {
    setVisibleDeviceCount(10); // Reset to the initial count
  };

  const devicesTags = devicesArray.slice(0, visibleDeviceCount);

  const visibleTags = showAllTags1 ? filterConfig : filterConfig.slice(0, 10);

  // const devicesTags = showAllTags ? devicesArray : devicesArray.slice(0, 5);

  return (
    <div className="flex gap-1 flex-col">
      {/* Devices Options */}

      <div className="mb-2">
        <button
          onClick={toggleDevices}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <Image
              src="/icons/Devices.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className="w-5 h-5"
            />
            Devices{" "}
            {selectedDevices?.length ? `(${selectedDevices?.length})` : ""}
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${isDeviceExpanded ? "active-expands" : ""}`}
          />
        </button>
        {isDeviceExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {devicesTags.map(({ label, key }: any) => (
              <div className="checkbox" key={key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    selectedDevices.includes(label) ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDevices?.includes(label)}
                    onChange={() => handleCheckboxChangeTag(label, "devices")}
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  <Image
                    src={
                      label.toLowerCase().includes("pc")
                        ? PCIcon
                        : label.toLowerCase().includes("playstation")
                        ? PlaystationIcon
                        : label.toLowerCase().includes("xbox")
                        ? XboxIcon
                        : label.toLowerCase().includes("switch")
                        ? SwitchIcon
                        : label.toLowerCase().includes("mac")
                        ? MacIcon
                        : label.toLowerCase().includes("android")
                        ? AndroidIcon
                        : DeviceIcon
                    }
                    className="w-5 h-5"
                    alt={label}
                    title={label}
                    width={20}
                    height={20}
                  />
                  {label}
                </label>
              </div>
            ))}

            {devicesArray?.length > visibleDeviceCount ? (
              <button
                className="text-sm font-bold text-[#00ADFF] flex"
                onClick={handleShowMoreDevices}
              >
                Show More +
              </button>
            ) : (
              visibleDeviceCount > 10 && (
                <button
                  className="text-sm font-bold text-[#00ADFF] flex"
                  onClick={handleShowLessDevices}
                >
                  Show Less -
                </button>
              )
            )}
          </div>
        )}
      </div>
      {/* Tags Options */}
      <div className="mb-2">
        <button
          onClick={toggleTags}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <LuTags size={22} />
            Game Modes {selectedTags?.length ? `(${selectedTags.length})` : ""}
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${isTagsExpanded ? "active-expands" : ""}`}
          />
        </button>
        {isTagsExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {visibleTags.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    selectedTags.includes(filter.key) ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(filter.key)}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "game_modes")
                    }
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.label}
                </label>
              </div>
            ))}

            {filterConfig.length > 10 && (
              <button
                className="text-sm font-bold text-[#00ADFF] flex"
                onClick={() => setShowAllTags1(!showAllTags1)}
              >
                {showAllTags1 ? "Show Less -" : "Show More +"}
              </button>
            )}
          </div>
        )}
      </div>
      <>
        <div className="mt-4">
          <RangeSlider
            id="range-slider-ab"
            className="margin-lg mb-2"
            min={0}
            max={600}
            step={1}
            value={hoursPlayed}
            onInput={isDisabled ? undefined : onHoursChange}
          />
          <div className="mb-3">
            {/* Selected Hours: {hoursPlayed[0]} - {hoursPlayed[1]} hours */}
            Selected Hours: {hoursPlayed[0]} -{" "}
            {hoursPlayed[1] === 600 ? "600+" : hoursPlayed[1]} hours
          </div>
          <div>
            <button
              className="flex gap-2 text-sm items-center bg-[#1E293B] py-2 px-4 text-white rounded-lg h-[40px]"
              onClick={() => clearHours()}
            >
              Clear
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default ResultsFiltersDeviceTags;

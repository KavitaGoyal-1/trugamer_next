import React, { useEffect, useState } from "react";
import { LuTags } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { PiShieldStar } from "react-icons/pi";
import axios from "axios";
import filterdata from "@/utills/game-calendar-filters/game-calendar-filters";
import {
  setDevices,
  setGamemode,
  setGameType,
  setGenres,
  setonlyAnticipated,
  setPlayerPerspectives,
  setThemes,
  setUsersOwnDevices,
} from "@/store/slices/game-calendar-new-reducer";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { updateGameCalendarApiCall } from "@/utills/game-calendar-new";
import Image from "next/image";

const ResultsFiltersMoreCalenders = ({ handleChangeListOrCardView }: any) => {
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isGenersExpanded, setIsGenersExpanded] = useState(false);
  const [isGameModeExpanded, setIsGameModeExpanded] = useState(false);
  const [isPerspectivesExpanded, setIsPerspectivesExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false); // State to manage "Show More" and "Show Less"
  const [showAllTags1, setShowAllTags1] = useState(false); // State to manage "Show More" and "Show Less"

  const [showGeners, setShowGeners] = useState(false);

  // Toggle functions
  const toggleDevices = () => setIsDeviceExpanded(!isDeviceExpanded);
  const toggleTags = () => setIsTagsExpanded(!isTagsExpanded);
  const toggleGeners = () => setIsGenersExpanded(!isGenersExpanded);
  const toggleGameMode = () => setIsGameModeExpanded(!isGameModeExpanded);

  const [selectedDevices, setSelectedDevices] = useState<[]>([]);
  const [selectedGeners, setSelectedGeners] = useState<[]>([]);
  const [selectedGameMode, setSelectedGameMode] = useState<[]>([]);
  const [selectedPerspectives, setSelectedPerspectives] = useState<[]>([]);
  const [selectedThems, setSelectedThems] = useState<[]>([]);
  const [usersDevices, setUsersDevices] = useState<[]>([]);
  const [isonlyAnticipated, setIsOnlyAnticipated] = useState(false);

  const [visibleCount, setVisibleCount] = useState(10); // Initially show 5 items
  const [isExpanded, setIsExpanded] = useState(false); // To toggle Show More/Less

  const token = getToken();
  const togglePerspectives = () =>
    setIsPerspectivesExpanded(!isPerspectivesExpanded);
  const calendarFilters = useSelector((state: any) => {
    const { apiResponse, ...rest } = state.gameCalendarNew || {};
    return rest;
  });
  const userReduxDevices = useSelector((state: any) => state.userDevices);

  useEffect(() => {
    setUsersDevices(userReduxDevices);
  }, [userReduxDevices]);

  const dispatch = useDispatch();
  // const initialFilterState = Object.fromEntries(
  //   [...filterdata?.genre, ...filterdata?.devices, ...filterdata?.gametype].map(
  //     (filter) => [filter.key, false]
  //   )
  // );
  const initialFilterState = Object.fromEntries(
    [...filterdata?.genre, ...filterdata?.devices, ...filterdata?.gametype].map(
      (filter) => [filter.key, filter.key === "BaseGame"]
    )
  );
  const [filterState, setFilterState] = useState(initialFilterState);

  // useEffect(() => {
  //   setSelectedDevices(calendarFilters?.devices);
  //   setSelectedGeners(calendarFilters?.genres);
  //   setSelectedGameMode(calendarFilters?.gamemode);
  //   setSelectedPerspectives(calendarFilters?.playerperspectives);
  //   setSelectedThems(calendarFilters?.themes);
  // }, [calendarFilters]);

  const handleCheckboxChangeTag = async (key: string, type: string) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    if (key == "My Devices") {
      const isChecked = filterState[key];

      !isChecked
        ? updateDevicesInFilterState()
        : removeDevicesFromFilterState();
      console.log(
        key,
        " <-----  This is key ",
        isChecked,
        " --- --- isChecked -----"
      );
      return;
    }
    const updateFilters = async (
      filterKey: string,
      filterSetter: (filters: string[]) => void,
      filters: string[]
    ) => {
      const filterSet = new Set(filters);

      if (filterSet.has(key)) {
        filterSet.delete(key);
      } else {
        filterSet.add(key);
      }

      const updatedFilters = Array.from(filterSet);
      console.log(updatedFilters, "updatedFilters");
      dispatch(filterSetter(updatedFilters));
      await updateGameCalendarApiCall(dispatch, {
        ...calendarFilters,
        [filterKey]: updatedFilters,
      });
    };

    switch (type) {
      case "playerperspectives":
        await updateFilters(
          "playerperspectives",
          setPlayerPerspectives,
          calendarFilters.playerperspectives
        );
        break;

      case "genre":
        await updateFilters("genres", setGenres, calendarFilters.genres);
        break;

      case "gamemodes":
        await updateFilters("gamemode", setGamemode, calendarFilters.gamemode);
        break;

      case "devices":
        await updateFilters("devices", setDevices, calendarFilters.devices);
        break;

      case "themes":
        await updateFilters("themes", setThemes, calendarFilters.themes);
        break;

      default:
        break;
    }
  };

  const visibleTags = showAllTags
    ? filterdata?.devices
    : filterdata?.devices.slice(0, 10);
  const visibleTags1 = showAllTags1
    ? filterdata?.themes
    : filterdata?.themes.slice(0, 10);

  const visibleGeners = showGeners
    ? filterdata?.genre
    : filterdata?.genre.slice(0, 10);

  const [isBaseGameExpanded, setIsBaseGameExpanded] = useState(false);

  const toggleBaseGame = () => setIsBaseGameExpanded(!isBaseGameExpanded);

  const [isAnticipatedExpanded, setIsAnticipatedExpanded] = useState(false);

  const toggleAnticipated = () =>
    setIsAnticipatedExpanded(!isAnticipatedExpanded);

  const handleCheckboxChange = async (key: string, type: string) => {
    console.log(key, type);
    setFilterState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));

    if (type === "gametype") {
      switch (key) {
        case "BaseGame":
          dispatch(
            setGameType({
              ...calendarFilters.gametype,
              base: !calendarFilters.gametype.base,
            })
          );
          await updateGameCalendarApiCall(dispatch, {
            ...calendarFilters,
            gametype: {
              ...calendarFilters.gametype,
              base: !calendarFilters.gametype.base,
            },
          });
          break;

        case "Expansions":
          dispatch(
            setGameType({
              ...calendarFilters.gametype,
              expansion: !calendarFilters.gametype.expansion,
            })
          );
          await updateGameCalendarApiCall(dispatch, {
            ...calendarFilters,
            gametype: {
              ...calendarFilters.gametype,
              expansion: !calendarFilters.gametype.expansion,
            },
          });
          break;

        case "Seasons":
          dispatch(
            setGameType({
              ...calendarFilters.gametype,
              season: !calendarFilters.gametype.season,
            })
          );
          await updateGameCalendarApiCall(dispatch, {
            ...calendarFilters,
            gametype: {
              ...calendarFilters.gametype,
              expansion: !calendarFilters.gametype.season,
            },
          });
          break;
      }
    }
  };

  const updateDevicesInFilterState = async () => {
    setFilterState((prevState) => {
      const updatedFilterState = { ...prevState };

      // Iterate over usersDevices and set corresponding device keys to true in filterState
      usersDevices.forEach((device) => {
        if (updatedFilterState.hasOwnProperty(device)) {
          updatedFilterState[device] = true; // Set device key to true
        }
      });
      return updatedFilterState;
    });
    const updatedDevices = [
      ...new Set([...calendarFilters?.devices, ...usersDevices]),
    ];
    console.log(
      updatedDevices,
      " this is   updated devices -- -  setUsersDevices "
    );
    await updateGameCalendarApiCall(dispatch, {
      ...calendarFilters,
      devices: updatedDevices,
    });
    dispatch(setDevices(updatedDevices));
    dispatch(setUsersOwnDevices(true));
  };

  const removeDevicesFromFilterState = async () => {
    const currentDevices: string[] = calendarFilters?.devices || [];
    const devicesToRemove: string[] = usersDevices || [];

    // Filter out the devices that should be removed
    const updatedDevices = currentDevices.filter(
      (device) => !devicesToRemove.includes(device)
    );

    // Now dispatch the updated devices to Redux (without the removed ones)
    dispatch(setDevices(updatedDevices));

    await updateGameCalendarApiCall(dispatch, {
      ...calendarFilters,
      devices: updatedDevices,
    });

    setFilterState((prevState) => {
      const updatedFilterState = { ...prevState };
      usersDevices.forEach((device) => {
        if (updatedFilterState.hasOwnProperty(device)) {
          updatedFilterState[device] = false;
        }
      });

      return updatedFilterState;
    });
    dispatch(setUsersOwnDevices(false));
  };

  const handleCheckboxAnticipated = async (key: any, checked: any) => {
    setIsOnlyAnticipated(true);

    const res = await updateGameCalendarApiCall(dispatch, {
      ...calendarFilters,
      onlyAnticipated: !checked,
    });

    console.log(res, "res ff");

    setIsOnlyAnticipated(false);

    dispatch(setonlyAnticipated(!checked));

    setFilterState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  async function getUsers() {
    try {
      const res = await axios.get(
        `${getApi()}/users-permissions/user-saved-devices`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        //user?.active_devices

        const devices =
          Array.isArray(res?.data?.active_devices) &&
          res?.data?.active_devices?.length > 0
            ? res?.data?.active_devices?.map((platform: any) => platform.name)
            : [];

        setUsersDevices(devices);
      }
    } catch (error) {
      console.error(" This is error in user data api ");
    }
  }
  useEffect(() => {
    getUsers();
  }, []);
  const handleToggle = () => {
    if (isExpanded) {
      setVisibleCount(10); // Reset to initial count
    } else {
      setVisibleCount(filterdata?.genre.length || 0); // Show all items
    }
    setIsExpanded(!isExpanded); // Toggle state
  };

  return (
    <div className="flex gap-1 flex-col">
      <div className="mb-2">
        <button
          onClick={toggleAnticipated}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-2.5 font-bold">
            {/* <Image
              src="/icons/gametype.svg"
              alt="search icon"
              title="search icon"
              width={25}
              height={14}
              className="w-4 h-4"
            /> */}
            <PiShieldStar size={18} />
            Anticipated Games
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${
              isAnticipatedExpanded ? "active-expands" : ""
            }`}
          />
        </button>

        {isAnticipatedExpanded && !isonlyAnticipated && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {filterdata?.onlyanticipated?.map(
              ({ label, key }) => (
                console.log(filterState, "filterState[key]"),
                (
                  <div className="checkbox" key={label}>
                    <label
                      className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                        calendarFilters?.onlyAnticipated ? "checked" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={calendarFilters?.onlyAnticipated}
                        onChange={() =>
                          handleCheckboxAnticipated(key, filterState[key])
                        }
                        className="checkbox-input w-6 h-6 relative opacity-0"
                      />
                      <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                      {label}
                    </label>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      <div className="mb-2">
        <button
          onClick={toggleBaseGame}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <Image
              src="/icons/gametype.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className="w-4 h-4"
            />
            Game Type
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${isBaseGameExpanded ? "active-expands" : ""}`}
          />
        </button>

        {isBaseGameExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {filterdata?.gametype?.map(({ label, key }) => (
              <div className="checkbox" key={label}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    filterState[key] ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[key]}
                    onChange={() => handleCheckboxChange(key, "gametype")}
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
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
            Devices
            {Object.keys(filterState).filter(
              (key) =>
                filterState[key] &&
                key !== "My Devices" && // Exclude "My Devices"
                filterdata?.devices?.some((device) => device.key === key)
            ).length > 0
              ? ` (${
                  Object.keys(filterState).filter(
                    (key) =>
                      filterState[key] &&
                      key !== "My Devices" && // Exclude "My Devices"
                      filterdata?.devices?.some((device) => device.key === key)
                  ).length
                })`
              : ""}
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
            {visibleTags?.map(({ key, name }) => (
              <div className="checkbox" key={key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer 
                    ${filterState[key] ? "checked" : ""}
                    `}
                >
                  <input
                    type="checkbox"
                    checked={filterState[key]}
                    onChange={() => handleCheckboxChangeTag(name, "devices")} // Use key directly here
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />

                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {name}
                </label>
              </div>
            ))}
            {filterdata?.devices?.length > 10 && (
              <button
                className="text-sm font-bold text-[#00ADFF] flex"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "Show Less -" : "Show More +"}
              </button>
            )}
          </div>
        )}
      </div>
      {/* Themes Options */}
      <div className="mb-2">
        <button
          onClick={toggleTags}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <LuTags size={22} />
            Themes
            {Object.keys(filterState).filter(
              (key) =>
                filterState[key] &&
                filterdata?.themes?.some((theme) => theme.key === key)
            ).length > 0
              ? ` (${
                  Object.keys(filterState).filter(
                    (key) =>
                      filterState[key] &&
                      filterdata?.themes?.some((theme) => theme.key === key)
                  ).length
                })`
              : ""}
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
            {visibleTags1?.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    filterState[filter.key] ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[filter.key]}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "themes")
                    } // Use key directly here}
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.name}
                </label>
              </div>
            ))}

            {filterdata?.themes?.length > 10 && (
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

      {/* Geners Options */}
      <div className="mb-2">
        <button
          onClick={toggleGeners}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <LuTags size={22} />
            Genres{" "}
            {Object.keys(filterState).filter(
              (key) =>
                filterState[key] &&
                filterdata?.genre?.some((genre) => genre.key === key)
            ).length > 0
              ? ` (${
                  Object.keys(filterState).filter(
                    (key) =>
                      filterState[key] &&
                      filterdata?.genre?.some((genre) => genre.key === key)
                  )?.length
                })`
              : ""}
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${isGenersExpanded ? "active-expands" : ""}`}
          />
        </button>
        {isGenersExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {/* { filterdata?.genre.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${filterState[filter.key] ? "checked" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[filter.key]}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "genre")
                    }
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.name}
                </label>
              </div>
            ))} */}
            {/* {visibleGeners?.length > 10 && (
              <button
                className="text-sm font-bold text-[#00ADFF] flex"
                onClick={() => setShowGeners(!showGeners)}
              >
                {showGeners ? "Show Less -" : "Show More +"}
              </button>
            )} */}

            {filterdata?.genre.slice(0, visibleCount)?.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    filterState[filter.key] ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[filter.key]}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "genre")
                    }
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.name}
                </label>
              </div>
            ))}

            {/* Show More/Less Button */}
            {filterdata?.genre.length > 5 && (
              <button
                onClick={handleToggle}
                className="text-sm font-bold text-[#00ADFF] flex"
              >
                {isExpanded ? "Show Less -" : "Show More +"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Game Mode Options */}
      <div className="mb-2">
        <button
          onClick={toggleGameMode}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <Image
              src="/icons/gamemode.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className="w-5 h-5"
            />
            Game Modes{" "}
            {selectedGameMode?.length > 0
              ? ` (${selectedGameMode?.length})`
              : ""}
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${isGameModeExpanded ? "active-expands" : ""}`}
          />
        </button>
        {isGameModeExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {filterdata?.gamemodes?.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    filterState[filter.key] ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[filter.key]}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "gamemodes")
                    }
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Pers Options */}
      <div className="mb-2">
        <button
          onClick={togglePerspectives}
          className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
        >
          <div className="flex items-center gap-3 font-bold">
            <Image
              src="/icons/eye-scan.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className="w-5 h-5"
            />
            Player Perspectives{" "}
            {selectedPerspectives?.length > 0
              ? ` (${selectedPerspectives?.length})`
              : ""}
          </div>
          <Image
            src="/arrow-down.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={14}
            className={`w-5 h-5 ${
              isPerspectivesExpanded ? "active-expands" : ""
            }`}
          />
        </button>
        {isPerspectivesExpanded && (
          <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
            {filterdata?.playerperspectives?.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <label
                  className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                    filterState[filter.key] ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filterState[filter.key]}
                    onChange={() =>
                      handleCheckboxChangeTag(filter.key, "playerperspectives")
                    }
                    className="checkbox-input w-6 h-6 relative opacity-0"
                  />
                  <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                  {filter.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsFiltersMoreCalenders;

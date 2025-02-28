import { useState } from "react";
import ResultsFiltersDeviceTags from "./results-filters-device-tags";
import ResultsFiltersSortSearch from "./results-filters-sort-search";
import { TbDeviceGamepad2 } from "react-icons/tb";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { addFilter } from "@/store/slices/game-library";

const filterConfig = [
  { label: "Main Story", key: "Main Story" },
  { label: "Main & Expansions", key: "Main & Expansions" },
  { label: "Completionist", key: "Completionist" },
  { label: "Never Beat", key: "Never Beat" },
];

const filterConfigGame = [
  {
    label: "Playing Now",
    key: "playingNow",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 4.34458C1.5 3.91268 1.96658 3.64191 2.34158 3.85619L5.89532 5.88691C6.27322 6.10285 6.27322 6.64774 5.89532 6.86368L2.34158 8.89439C1.96658 9.10867 1.5 8.83791 1.5 8.406V4.34458Z"
          stroke="#C1C9ED"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6.375 4.34458C6.375 3.91268 6.84158 3.64191 7.21658 3.85619L10.7703 5.88691C11.1482 6.10285 11.1482 6.64774 10.7703 6.86368L7.21658 8.89439C6.84158 9.10867 6.375 8.83791 6.375 8.406V4.34458Z"
          stroke="#C1C9ED"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Playing Next",
    key: "playingNext",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 7.23967C2.5 6.51983 3.27764 6.06855 3.90263 6.42569L9.82554 9.81021C10.4554 10.1701 10.4554 11.0783 9.82554 11.4382L3.90263 14.8227C3.27764 15.1798 2.5 14.7285 2.5 14.0087V7.23967Z"
          stroke="#596184"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.625 7.23967C10.625 6.51983 11.4026 6.06855 12.0276 6.42569L17.9505 9.81021C18.5804 10.1701 18.5804 11.0783 17.9505 11.4382L12.0276 14.8227C11.4026 15.1798 10.625 14.7285 10.625 14.0087V7.23967Z"
          stroke="#596184"
          stroke-width="1.33"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Shelved",
    key: "shelvedGames",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.00037 17L12.0004 22L22.0004 17M2.00037 12L12.0004 17L22.0004 12M12.0004 2L2.00037 7L12.0004 12L22.0004 7L12.0004 2Z"
          stroke="white"
          stroke-opacity="0.8"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
];

const displayConfig = [
  {
    label: "List",
    key: "list",
    icon: (
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 13.1133V16.8633C19 17.2611 18.842 17.6426 18.5607 17.9239C18.2794 18.2052 17.8978 18.3633 17.5 18.3633H2.5C2.10218 18.3633 1.72064 18.2052 1.43934 17.9239C1.15804 17.6426 1 17.2611 1 16.8633V13.1133C1 12.7155 1.15804 12.3339 1.43934 12.0526C1.72064 11.7713 2.10218 11.6133 2.5 11.6133H17.5C17.8978 11.6133 18.2794 11.7713 18.5607 12.0526C18.842 12.3339 19 12.7155 19 13.1133ZM17.5 3.36328H2.5C2.10218 3.36328 1.72064 3.52132 1.43934 3.80262C1.15804 4.08393 1 4.46546 1 4.86328V8.61328C1 9.01111 1.15804 9.39264 1.43934 9.67394C1.72064 9.95525 2.10218 10.1133 2.5 10.1133H17.5C17.8978 10.1133 18.2794 9.95525 18.5607 9.67394C18.842 9.39264 19 9.01111 19 8.61328V4.86328C19 4.46546 18.842 4.08393 18.5607 3.80262C18.2794 3.52132 17.8978 3.36328 17.5 3.36328Z"
          fill="#596184"
        />
      </svg>
    ),
  },
  {
    label: "Card",
    key: "card",
    icon: (
      <svg
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10.1133V13.8633C7 14.2611 6.86172 14.6426 6.61558 14.9239C6.36944 15.2052 6.0356 15.3633 5.6875 15.3633H1.3125C0.964403 15.3633 0.630564 15.2052 0.384422 14.9239C0.138281 14.6426 0 14.2611 0 13.8633V10.1133C0 9.71546 0.138281 9.33393 0.384422 9.05262C0.630564 8.77132 0.964403 8.61328 1.3125 8.61328H5.6875C6.0356 8.61328 6.36944 8.77132 6.61558 9.05262C6.86172 9.33393 7 9.71546 7 10.1133ZM5.6875 0.363281H1.3125C0.964403 0.363281 0.630564 0.521316 0.384422 0.802621C0.138281 1.08393 0 1.46546 0 1.86328V5.61328C0 6.01111 0.138281 6.39264 0.384422 6.67394C0.630564 6.95525 0.964403 7.11328 1.3125 7.11328H5.6875C6.0356 7.11328 6.36944 6.95525 6.61558 6.67394C6.86172 6.39264 7 6.01111 7 5.61328V1.86328C7 1.46546 6.86172 1.08393 6.61558 0.802621C6.36944 0.521316 6.0356 0.363281 5.6875 0.363281Z"
          fill="white"
        />
        <path
          d="M15 10.1133V13.8633C15 14.2611 14.8617 14.6426 14.6156 14.9239C14.3694 15.2052 14.0356 15.3633 13.6875 15.3633H9.3125C8.9644 15.3633 8.63056 15.2052 8.38442 14.9239C8.13828 14.6426 8 14.2611 8 13.8633V10.1133C8 9.71546 8.13828 9.33393 8.38442 9.05262C8.63056 8.77132 8.9644 8.61328 9.3125 8.61328H13.6875C14.0356 8.61328 14.3694 8.77132 14.6156 9.05262C14.8617 9.33393 15 9.71546 15 10.1133ZM13.6875 0.363281H9.3125C8.9644 0.363281 8.63056 0.521316 8.38442 0.802621C8.13828 1.08393 8 1.46546 8 1.86328V5.61328C8 6.01111 8.13828 6.39264 8.38442 6.67394C8.63056 6.95525 8.9644 7.11328 9.3125 7.11328H13.6875C14.0356 7.11328 14.3694 6.95525 14.6156 6.67394C14.8617 6.39264 15 6.01111 15 5.61328V1.86328C15 1.46546 14.8617 1.08393 14.6156 0.802621C14.3694 0.521316 14.0356 0.363281 13.6875 0.363281Z"
          fill="white"
        />
      </svg>
    ),
  },
];

const ResultsFiltersLib = ({
  handleChangeListOrCardView,
  gameLibrary,
}: any) => {
  const [selectedOption, setSelectedOption] = useState("card"); // Default selected option
  const [isViewByExpanded, setIsViewByExpanded] = useState(false);
  const [isPlayStatusExpanded, setIsPlayStatusExpanded] = useState(false);
  const [isGameProgressExpanded, setIsGameProgressExpanded] = useState(false);

  // Toggle functions
  const toggleViewBy = () => setIsViewByExpanded(!isViewByExpanded);
  const togglePlayStatus = () => setIsPlayStatusExpanded(!isPlayStatusExpanded);
  const toggleGameProgress = () =>
    setIsGameProgressExpanded(!isGameProgressExpanded);
  const dispatch = useDispatch();
  const handleRadioChange = (key: any, label: any) => {
    setSelectedOption(key);
    handleChangeListOrCardView(label);
    let data = {
      filterType: "viewBy",
      filterKey: label,
    };
    dispatch(addFilter({ data }));
  };

  const [selectedFilters, setSelectedFilters] = useState({
    playStatus: [] as string[],
    gameProgress: [] as string[],
  });

  const handleCheckboxChange = (key: string, label: string, type: string) => {
    setSelectedFilters((prevState) => {
      const filterType = type === "playStatus" ? "playStatus" : "gameProgress";

      // Toggle the key in the selected filters
      const updatedFilters = prevState[filterType].includes(key)
        ? prevState[filterType].filter((item) => item !== key) // Remove if exists
        : [...prevState[filterType], key]; // Add if not exists

      // Prepare the new state
      const newSelectedFilters = {
        ...prevState,
        [filterType]: updatedFilters,
      };

      // Dispatch updated filter state
      dispatch(
        addFilter({
          data: {
            filterType,
            filterKey: updatedFilters,
          },
        })
      );

      return newSelectedFilters;
    });
  };

  return (
    <>
      <div className="flex gap-1 flex-col">
        <ResultsFiltersSortSearch gameLibrary={gameLibrary} />

        <div className="mb-2">
          <button
            onClick={toggleViewBy}
            className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
          >
            <div className="flex items-center gap-3 font-bold">
              <Image
                src="/gameCalender/drop.svg"
                alt="search icon"
                width={25}
                height={14}
                className="w-4 h-4"
              />
              View By
            </div>
            <Image
              src="/arrow-down.svg"
              alt="search icon"
              width={25}
              height={14}
              className={`w-5 h-5 ${isViewByExpanded ? "active-expands" : ""}`}
            />
          </button>
          {isViewByExpanded && (
            <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
              {displayConfig.map(({ label, key, icon }) => (
                <div className="checkbox" key={key}>
                  <label
                    className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                      selectedOption === key ? "checked" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedOption === key}
                      onChange={() => handleRadioChange(key, label)}
                      className="checkbox-input w-6 h-6 relative opacity-0"
                    />
                    <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                    {icon}
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex gap-3 items-center justify-center mb-3 mt-1 lg:mb-3 w-full">
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full "
            alt="played game"
            width={25}
            height={14}
            // title="played game"
          />
          <span className="flex gap-3 font-semibold text-lg">
            {" "}
            <Image
              src="/icons/filters.svg"
              className=" w-6 h-6"
              alt="played game"
              width={25}
              height={14}
              // title="played game"
            />
            Filters
          </span>
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full ml-6 rotate-180"
            alt="played game"
            width={25}
            height={14}
            // title="played game"
          />
        </div>

        <div className="mb-2">
          <button
            onClick={togglePlayStatus}
            className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
          >
            <div className="flex gap-3 items-center font-bold">
              <TbDeviceGamepad2 size={20} />
              Play Status ({filterConfigGame.length})
            </div>
            <Image
              src="/arrow-down.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className={`w-5 h-5 ${
                isPlayStatusExpanded ? "active-expands" : ""
              }`}
            />
          </button>

          {isPlayStatusExpanded && (
            <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
              {filterConfigGame.map(({ label, key, icon }) => (
                <div className="checkbox" key={key}>
                  <label
                    className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                      selectedFilters.playStatus.includes(key) ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.playStatus.includes(key)}
                      onChange={() =>
                        handleCheckboxChange(key, label, "playStatus")
                      }
                      className="checkbox-input w-6 h-6 relative opacity-0"
                    />
                    <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                    {icon}
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-2">
          <button
            onClick={toggleGameProgress}
            className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
          >
            <div className="flex items-center gap-3 font-bold">
              <Image
                src="/icons/progress-check.svg"
                alt="search icon"
                width={25}
                height={14}
                className="w-5 h-5"
              />
              Game Progress ({filterConfig.length})
            </div>
            <Image
              src="/arrow-down.svg"
              alt="search icon"
              width={25}
              height={14}
              className={`w-5 h-5 ${
                isGameProgressExpanded ? "active-expands" : ""
              }`}
            />
          </button>

          {isGameProgressExpanded && (
            <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
              {filterConfig.map(({ label, key }) => (
                <div className="checkbox" key={key}>
                  <label
                    className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer ${
                      selectedFilters.gameProgress.includes(key)
                        ? "checked"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.gameProgress.includes(key)}
                      onChange={() =>
                        handleCheckboxChange(key, label, "gameProgress")
                      }
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
        <ResultsFiltersDeviceTags />
      </div>
    </>
  );
};

export default ResultsFiltersLib;

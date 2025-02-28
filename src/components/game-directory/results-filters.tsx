import { useState, useEffect } from "react";
import ResultsFiltersSortSearch from "./results-filters-sort-search";
import { useDispatch, useSelector } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { updateGameCalendarApiCall } from "@/utills/game-calendar-new";
import {
  setonlyAnticipated,
  setSort,
  setTimeframe,
} from "@/store/slices/game-calendar-new-reducer";
import filterdata from "@/utills/game-calendar-filters/game-calendar-filters";
import Image from "next/image";

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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon-size w-[22px] h-[23px]"
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

const ResultsFilters = ({
  handleChangeListOrCardView,
  selectedOption,
  setSelectedOption,
  gameLibrary,
}: any) => {
  const dispatch = useDispatch();

  const [isViewByExpanded, setIsViewByExpanded] = useState(false);
  const [isDailyExpanded, setIsDailyExpanded] = useState(false);
  const [isSortingApplied, setIsSortingApplied] = useState(false);
  // Toggle functions
  const toggleViewBy = () => setIsViewByExpanded(!isViewByExpanded);
  const toggleDaily = () => setIsDailyExpanded(!isDailyExpanded);
  const [isOpen, setIsOpen] = useState(false);
  const filterState = useSelector((state: any) => {
    const { apiResponse, ...rest } = state.gameCalendarNew || {};
    return rest;
  });

  const [newUpdatedFilters, setNewUpdatedFilters] = useState(filterdata);

  const [selectedOptionDate, setSelectedOptionDate] = useState({
    by: " Sort By",
    order: "DESC",
  });

  const [isTimeFrameLoading, setTimeFrameLoading] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const updatedFilters = useSelector((state: any) => {
    const { apiResponse, ...rest } = state.gameCalendarNew || {};
    return rest;
  });

  useEffect(() => {
    if (updatedFilters.onlyAnticipated)
      setNewUpdatedFilters((prevFilters) => ({
        ...prevFilters, // Spread the existing filters to retain the full structure
        sortby: prevFilters.sortby.filter((item) => item.by !== "Anticipated"), // Update the sortby property
      }));
    else {
      setNewUpdatedFilters(filterdata);
    }
  }, [updatedFilters.onlyAnticipated]);

  const handleRadioChange = (key: any, label: any) => {
    setSelectedOption(key);

    handleChangeListOrCardView(label);
  };

  const handleRadioButtons = async (key: any, type: any) => {
    handleChangeListOrCardView(type);

    setTimeFrameLoading(true);

    dispatch(
      setTimeframe({
        frame: key,
        range: new Date().toLocaleDateString("sv-SE"),
        direction: "up",
      })
    );

    await updateGameCalendarApiCall(dispatch, {
      ...updatedFilters,
      timeframe: {
        frame: key,
        range: new Date().toLocaleDateString("sv-SE"),
        direction: "up",
      },
    });

    setTimeFrameLoading(false);
  };

  const toggleSortOrder = (currentOrder: string) =>
    currentOrder === "DESC" ? "ASC" : "DESC";

  // const handleOptionClick = async (option: any) => {
  //   const newOrder = toggleSortOrder(option.order);
  //   const sort = {
  //     by: "",
  //     order: newOrder,
  //   };

  //   switch (option.by) {
  //     case "Title":
  //       sort.by = "title";
  //       dispatch(setSort(sort));
  //       setSelectedOptionDate({
  //         ...sort,
  //         by: "Title",
  //       });
  //       await updateGameCalendarApiCall(dispatch, {
  //         ...filterState,
  //         sort,
  //       });
  //       break;
  //     case "Hot":
  //       sort.by = "TotalHotScore";
  //       dispatch(setSort(sort));
  //       setSelectedOptionDate({
  //         ...sort,
  //         by: "Hot",
  //       });
  //       await updateGameCalendarApiCall(dispatch, {
  //         ...filterState,
  //         sort,
  //       });
  //       break;
  //     case "Date":
  //       sort.by = "releaseDate";
  //       dispatch(setSort(sort));
  //       setSelectedOptionDate({
  //         ...sort,
  //         by: "Date",
  //       });
  //       await updateGameCalendarApiCall(dispatch, {
  //         ...filterState,
  //         sort,
  //       });
  //       break;
  //   }

  //   filterdata.sortby = filterdata.sortby.map((item) =>
  //     item.by === option.by ? { ...item, order: newOrder } : item
  //   );
  // };

  const handleOptionClick = async (option: any) => {
    const newOrder = toggleSortOrder(option.order);
    const sort = {
      by: "",
      order: newOrder,
    };

    switch (option.by) {
      case "Title":
        sort.by = "title";
        dispatch(setSort(sort));
        setSelectedOptionDate({
          ...sort,
          by: "Title",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort,
        });
        setIsSortingApplied(false);

        break;
      case "Hot":
        sort.by = "TotalHotScore";
        dispatch(setSort(sort));
        setSelectedOptionDate({
          ...sort,
          by: "Hot",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort, //onlyAnticipated:false
        });
        setIsSortingApplied(false);
        //  dispatch(setonlyAnticipated(false));
        break;
      case "Date":
        sort.by = "releaseDate";
        dispatch(setSort(sort));
        setSelectedOptionDate({
          ...sort,
          by: "Date",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort, //onlyAnticipated:false
        });

        setIsSortingApplied(false);
        break;
      // ADD there
      case "Anticipated":
        dispatch(setSort({ by: "anticipated", order: "asc" }));
        setSelectedOptionDate({
          ...sort,
          by: "Anticipated",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort: {
            by: "anticipated",
            order: "asc",
          },
          onlyAnticipated: false,
        });
        dispatch(setonlyAnticipated(false));
        setIsSortingApplied(false);
        break;
    }

    setNewUpdatedFilters((prevFilters: any) => ({
      ...prevFilters, // Keep all existing properties of the state
      sortby: prevFilters.sortby.map((item: any) =>
        item.by === option.by ? { ...item, order: newOrder } : item
      ), // Update only the sortby array
    }));
  };

  return (
    <>
      <div className="flex gap-1 flex-col calder-search">
        <ResultsFiltersSortSearch />

        <div className="mb-2">
          <button
            onClick={toggleViewBy}
            className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px] "
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
              // title="search icon"
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
        <div className="mb-2">
          <button
            onClick={toggleDaily}
            className="dropdown-button flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl h-[48px]"
          >
            <div className="flex items-center gap-3 font-bold">
              <Image
                src="/icons/calendar.svg"
                alt="search icon"
                // title="search icon"
                width={25}
                height={14}
                className="w-5 h-5"
              />
              Time Frame
            </div>
            <Image
              src="/arrow-down.svg"
              alt="search icon"
              // title="search icon"
              width={25}
              height={14}
              className={`w-5 h-5 ${isDailyExpanded ? "active-expands" : ""}`}
            />
          </button>

          {isDailyExpanded && !isTimeFrameLoading && (
            <div className="bg-[#15182B] p-4 rounded-2xl flex flex-col gap-4 mt-1">
              {newUpdatedFilters?.timeframe?.map(({ label, key }) => (
                <div className="checkbox" key={key}>
                  <label
                    className={`custom-checkbox flex gap-2 font-bold text-sm text-[#596184] relative items-center cursor-pointer  ${
                      updatedFilters.timeframe.frame == key ? "checked" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeframe"
                      checked={
                        updatedFilters.timeframe.frame == key ? true : false
                      }
                      onChange={() => handleRadioButtons(key, "time")}
                      className="checkbox-input w-6 h-6 relative opacity-0"
                    />
                    <span className="checkbox-icon w-5 h-5 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span>
                    {/* <span className="radio-icon w-6 h-6 absolute left-0 border-[#596184] border-2 transition-all duration-200"></span> */}
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Dropdown - Accordion Style */}
        <div className="sort mb-4">
          <div className="w-full ">
            <button
              onClick={toggleDropdown}
              className="flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl"
            >
              <div className="flex items-center gap-3 font-bold">
                <Image
                  src="/gameCalender/drop.svg"
                  alt="dropdown icon"
                  // title="dropdown icon"
                  width={25}
                  height={14}
                  className="w-4 h-4"
                />
                {selectedOptionDate.by}
              </div>
              <Image
                src="/arrow-down.svg"
                alt="arrow icon"
                // title="arrow icon"
                width={25}
                height={14}
                className={`w-5 h-5 transform ${
                  isOpen ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>

            {/* Dropdown Options as Accordion */}
            {isOpen && !isSortingApplied && (
              <ul className="mt-1 bg-[#15182B] text-left rounded-2xl w-full overflow-hidden transition-all duration-300">
                {newUpdatedFilters?.sortby
                  ?.filter(
                    (option) =>
                      !(
                        gameLibrary &&
                        option.by === "Hot" &&
                        option.order === "DESC"
                      )
                  )
                  .map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`
                      cursor-pointer p-4 py-2 flex justify-between items-center mb-0
                      ${index === 0 && "hover:rounded-t-2xl"} 
                      ${index === 1 && "hover:rounded-b-none"} 
                      hover:bg-[#344054] 
                      ${
                        selectedOptionDate.by === option.by
                          ? "hover:rounded-b-none bg-[#344054]"
                          : ""
                      }
                    `}
                    >
                      {option.by}
                      {selectedOptionDate.by === option.by &&
                      selectedOptionDate.by !== "Anticipated" &&
                      selectedOptionDate.order === "DESC" ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* <ResultsFiltersMoreCalenders /> */}
      </div>
    </>
  );
};

export default ResultsFilters;

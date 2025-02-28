import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import {
  setcalendarboolean,
  setcalendarFilter,
} from "@/store/slices/calendar-filter-slice";
import filterdata from "@/utills/game-calendar-filters/game-calendar-filters";
import { searchGamesLibrary, addFilter } from "@/store/slices/game-library";
import { setSearch, setSort } from "@/store/slices/game-calendar-new-reducer";
import {
  debounceForGameCalendar,
  updateGameCalendarApiCall,
} from "@/utills/game-calendar-new";
import Image from "next/image";

const ResultsFiltersSortSearch = ({ gameLibrary }: any) => {
  const calendarFilters = useSelector((state: any) => state.calendarFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [isSortingApplied, setIsSortingApplied] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    by: "Title",
    order: "DESC",
  });
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const filterState = useSelector((state: any) => {
    const { apiResponse, ...rest } = state.gameCalendarNew || {};
    return rest;
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useDispatch();

  const toggleSortOrder = (currentOrder: string) =>
    currentOrder === "DESC" ? "ASC" : "DESC";

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
        setSelectedOption({
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
        setSelectedOption({
          ...sort,
          by: "Hot",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort,
        });
        setIsSortingApplied(false);
        break;
      case "Date":
        sort.by = "releaseDate";
        dispatch(setSort(sort));
        setSelectedOption({
          ...sort,
          by: "Date",
        });
        setIsSortingApplied(true);
        await updateGameCalendarApiCall(dispatch, {
          ...filterState,
          sort,
        });
        setIsSortingApplied(false);
        break;
    }

    filterdata.sortby = filterdata.sortby.map((item) =>
      item.by === option.by ? { ...item, order: newOrder } : item
    );
  };

  const debouncedApiCall = useRef(
    debounceForGameCalendar(async (searchValue: string) => {
      await updateGameCalendarApiCall(dispatch, {
        ...filterState,
        search: searchValue,
      });
    }, 500)
  ).current;

  // const handleInputChange = async (event: any) => {
  //   if (gameLibrary) {
  //     dispatch(searchGamesLibrary({ search: event.target.value }));
  //     setSearchValue(event.target.value);

  //     dispatch(
  //       setcalendarFilter({
  //         ...calendarFilters.filter,
  //         search: event.target.value,
  //       })
  //     );
  //     dispatch(setcalendarboolean());
  //   } else {
  //     setSearchValue(event.target.value);
  //     dispatch(setSearch(event.target.value));
  //     debouncedApiCall(event.target.value);
  //   }
  // };

  const debouncedDispatch = useMemo(
    () =>
      debounce((value: string) => {
        if (gameLibrary) {
          dispatch(searchGamesLibrary({ search: value }));
          dispatch(
            setcalendarFilter({
              ...calendarFilters.filter,
              search: value,
            })
          );
          dispatch(setcalendarboolean());
        } else {
          dispatch(setSearch(value));
        }
      }, 1200), // 2-second delay
    [dispatch, gameLibrary, calendarFilters.filter]
  );

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSearchValue(value); // Update the state immediately
    debouncedDispatch(value); // Call the debounced function
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the dropdown if click is outside
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex gap-1 flex-col mb-2">
        <div className="w-full relative h-[48px] backdrop-blur-lg shadow-cShadow-main mb-2 search-cal-none">
          <Image
            src="/icons/search.svg"
            alt="search icon"
            // title="search icon"
            width={25}
            height={25}
            className="absolute top-[11px] left-3"
          />
          <input
            type="text"
            placeholder="Search game title"
            value={searchValue}
            onChange={handleInputChange}
            className="bg-[#15182B] py-3 pl-12 pr-6 text-white text-[17px] w-full rounded-2xl h-full focus:outline-0"
          />
        </div>

        <div className="hidden lg:flex gap-2 2xl:gap-4 items-center justify-center mb-3 mt-1 lg:mb-3 w-full overflow-hidden">
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full "
            alt="played game"
            width={25}
            height={14}
            // title="played game"
          />
          <span className="flex gap-1 2xl:gap-3 font-semibold text-base 2xl:text-lg">
            {" "}
            <Image
              src="/icons/SortAscending.svg"
              className=" w-6 h-6"
              alt="played game"
              width={24}
              height={24}
              // title="played game"
            />
            Sorting
          </span>
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full ml-6 rotate-180"
            alt="played game"
            width={24}
            height={24}
            // title="played game"
          />
        </div>
        <>
          {/* Sort By Dropdown - Accordion Style */}
          {/* <div className="sort">
          <div className="w-full ">
            <button
              onClick={toggleDropdown}
              className="flex gap-4 text-sm items-center w-full justify-between bg-[#15182B] py-3 pl-4 pr-4 text-white rounded-2xl"
            >
              <div className="flex items-center gap-3 font-bold">
                <Image
                  src="/gameCalender/drop.svg"
                  alt="dropdown icon"
                  title="dropdown icon"
                  width={25}
                  height={14}
                  className="w-4 h-4"
                />
                {selectedOption.by}
              </div>
              <Image
                src="/arrow-down.svg"
                alt="arrow icon"
                title="arrow icon"
                width={25}
                height={14}
                className={`w-5 h-5 transform ${
                  isOpen ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>

           
            {isOpen && !isSortingApplied && (
              <ul className="mt-1 bg-[#15182B] text-left rounded-2xl w-full overflow-hidden transition-all duration-300">
                {filterdata?.sortby
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
                      cursor-pointer p-4 flex justify-between items-center mb-0
                      ${index === 0 && "hover:rounded-t-2xl"} 
                      ${index === 1 && "hover:rounded-b-none"} 
                      hover:bg-[#344054] 
                      ${
                        selectedOption.by === option.by
                          ? "hover:rounded-b-none bg-[#344054]"
                          : ""
                      }
                    `}
                    >
                      {option.by}
                      {selectedOption.by === option.by &&
                      selectedOption.order === "DESC" ? (
                        <FaLongArrowAltDown />
                      ) : (
                        <FaLongArrowAltUp />
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div> */}
        </>
      </div>
    </>
  );
};

export default ResultsFiltersSortSearch;

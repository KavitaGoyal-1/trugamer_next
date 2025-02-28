import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { VscGame } from "react-icons/vsc";
import { TbNews } from "react-icons/tb";
import { useSelector } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import LoaderSpinner from "../loader-spinner";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { setGames, setNews, setQuery } from "@/store/slices/search-game-slice";
import Image from "next/image";

type Game = {
  id: string;
  // Add other properties of your game object
};
type News = {
  id: string;
  // Add other properties of your news object
};
export default function SearchHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false); // this is to
  const [recentSearches, setRecentSearches] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [gamesResults, setGamesResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [allgames, setAllGames] = useState<Game[]>([]);
  const [allnews, setAllNews] = useState<News[]>([]);
  const [newgames, setNewGames] = useState([]); // setNewGames setNewNews
  const [newnews, setNewNews] = useState([]);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown
  const token = getToken();
  const user = useSelector((state: any) => state?.authState?.userData);
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const fetchSearchResults = async (query: string, key: string) => {
    try {
      if (!query) {
        setGamesResults([]);
        setNewsResults([]);
        return;
      }

      setLoading(true);
      //  const response = await axios.get(`${getApi()}/search?search=${query}`);

      const response = await axios.get(`${getApi()}/search`, {
        params: {
          search: query,
          limit: 10,
          offset: 0,
        },
      });

      if (response.status == 200) {
        if (pathname != "/search-games") {
          dispatch(setGames(response?.data?.searchedgames)); //
          dispatch(setNews(response?.data?.news)); //
        }

        const getUniqueArray = <T extends { id: string }>(array: T[]) => {
          return Array.from(
            new Map(array.map((item) => [item.id, item])).values()
          );
        };

        setAllGames(getUniqueArray(response?.data?.searchedgames));
        setAllNews(getUniqueArray(response?.data?.news));

        setNewGames(getUniqueArray(response?.data?.searchedgames));
        setNewNews(getUniqueArray(response?.data?.news));
        response?.data?.searchedgames?.length > 10
          ? setGamesResults(response?.data?.searchedgames.slice(0, 10))
          : setGamesResults(response?.data?.searchedgames);
        response?.data?.searchedgames?.length > 10
          ? setNewsResults(response?.data?.news.slice(0, 10))
          : setNewsResults(response?.data?.news);

        setShowHistoryDropdown(true);
        setLoading(false);
      }
      setShowHistoryDropdown(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);

      setLoading(false);
    }
  };

  const clickSearchResult = async (query: string) => {
    try {
      if (!query) {
        //  setGamesResults([]);
        // setNewsResults([]);
        return;
      }

      setLoading(true);
      //const response = await axios.get(`${getApi()}/search?search=${query}`);
      const response = await axios.get(`${getApi()}/search`, {
        params: {
          search: query,
          limit: 10,
          offset: 0,
        },
      });

      if (response?.status == 200) {
        dispatch(setGames(response?.data?.searchedgames)); //
        dispatch(setNews(response?.data?.news)); //

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  // Debounced function to handle search
  const debouncedFetchSearchResults = useCallback(
    _.debounce((query, key) => {
      fetchSearchResults(query, key);
    }, 1000),
    []
  );

  const handleGameClick = async (game: any) => {
    try {
      if (user.id) {
        const response = await axios.post(
          `${getApi()}/addsearchhistory`, // API endpoint
          {
            userid: user?.id, // Payload to send as body
            searchTerm: game,
          }
        );
      }
    } catch (error) {
      console.error("Error adding search history:", error);
    }
  };

  const handleSearchChange = (e: any) => {
    const value = e;
    console.log(value, "value");
    if (!value) {
      setShowHistoryDropdown(false);
    }

    setSearchTerm(value.trimStart());
    setLoading(true);
    dispatch(setQuery(value.trimStart()));
    debouncedFetchSearchResults(value, "other"); // Debounced API call
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e?.key === "Enter") {
        if (pathname == "/search-games") {
          console.log("Enter pressed in search-games");
          dispatch(setGames(allgames)); //
          dispatch(setNews(allnews)); //
          setShowHistoryDropdown(false);
        }

        if (gamesResults?.length > 0 || newsResults?.length > 0) {
          router.push("/search-games");
        }
      }
    } catch (error) {
      console.log(error, "Error in handleKeyDown in search header");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowHistoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateTimeAgo = (publishedAt: string | Date) => {
    try {
      // Convert to Date object if it's a string
      const publishedDate = new Date(publishedAt);
      const now = new Date();

      // If the publishedDate is invalid, return an empty string
      if (isNaN(publishedDate.getTime())) {
        return "";
      }

      const diffInMilliseconds = now.getTime() - publishedDate.getTime();

      const seconds = Math.floor(diffInMilliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);

      if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
      } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
      }
    } catch (error) {
      console.log("error in search");
    }
  };

  const removeSearch = async (index: any, game: any, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setRecentSearches((prevSearches) =>
        prevSearches.filter((_, i) => i !== index)
      );
      await axios.delete(`${getApi()}/removesearchhistory`, {
        params: {
          userid: user.id,
          gameid: game.id,
        },
      });
    } catch (error) {
      console.log(error, "Error in remove search");
    }
  };
  const handleFocus = async () => {
    try {
      if (user?.id) {
        const response = await axios.get(`${getApi()}/getsearchhistory`, {
          params: {
            userid: user?.id,
          },
        });

        if (response?.status == 200) {
          setRecentSearches(response?.data?.history);

          setShowHistoryDropdown(true);
        }
      }
    } catch (error) {
      console.log("Error in search history");
    }

    // Sets showHistoryDropdown to true when focus occurs
  };

  const redirect = (game: any) => {
    router.push(`/game/${game?.slug}`);
    setShowHistoryDropdown(true);
  };

  const handleNavigateToGames = () => {
    if (pathname == "/search-games") {
      console.log("Enter pressed in search-games");
      dispatch(setQuery(searchTerm));
      clickSearchResult(searchTerm);
      return;
    }
    if (gamesResults?.length > 0 || newsResults?.length > 0) {
      router.push("/search-games");
      return;
    }
  };

  useEffect(() => {
    // Disable scrolling when the dropdown is shown
    if (showHistoryDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling when dropdown is closed
    }

    // Cleanup on component unmount or when dropdown state changes
    return () => {
      document.body.style.overflow = "auto"; // Ensure scrolling is always enabled when component is unmounted
    };
  }, [showHistoryDropdown]);
  return (
    <div
      className={` relative  justify-start items-centern w-full ${
        showHistoryDropdown
          ? "bg-[#22232E] md:bg-transparent p-5 md:p-0 rounded-xl md:rounded-none"
          : ""
      }`}
    >
      <input
        type="text"
        placeholder="Search for games, news articles and more"
        className="h-[42px] md:h-12 p-4 pr-10 appearance-none hover:appearance-none outline-none rounded-xl md:rounded-2xl shadow-[0px_1.07px_2.14px_0px_#1018280D] backdrop-blur-[32px] max-w-[100%] min-w-[100%] sm:max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] sm:min-w-[200px] lg:min-w-[300px] xl:min-w-[400px] 2xl:max-w-[700px]  2xl:min-w-[700px] border-none md:border border-[#FFFFFF33] bg-[#FFFFFF1A] md:bg-[#222330] placeholder:text-[#fff] md:placeholder:text-[#9CA7C8CC] text-sm lg:text-base"
        value={searchTerm && searchTerm}
        onChange={(e: any) => handleSearchChange(e?.target?.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => handleFocus()}
        autoComplete="off"
      />

      <div
        className={`z-10 absolute right-4 md:right-4 top-[10px] md:top-3 ${
          showHistoryDropdown ? "top-[30px] right-8" : ""
        }`}
        onClick={() => handleNavigateToGames()}
      >
        <IoSearch
          size={22}
          className=" text-[#9CA7C8] hover:text-[#fff] cursor-pointer"
        />
      </div>
      {showHistoryDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-16 md:top-[52px] left-0 w-full max-w-[500px] 2xl:max-w-[700px] bg-[#22232E] rounded-b-xl rounded-none md:rounded-2xl shadow-[0px_50px_45px_-2.19px_#00000066;] z-10 py-3 "
        >
          <div className="overflow-auto custom-scroll h-auto max-h-96">
            {searchTerm ? (
              loading ? (
                <div className="h-20 flex items-center justify-center">
                  {" "}
                  <LoaderSpinner />{" "}
                </div>
              ) : (
                <>
                  {gamesResults?.length > 0 ? (
                    <>
                      <div className=" border-b-2 border-b-[#2F313B] p-4">
                        <h3 className="text-base font-semibold mb-2 pl-2 flex gap-2 items-center">
                          <VscGame size={20} />
                          Games
                        </h3>
                        {gamesResults?.map((game: any, index) => (
                          <a
                            key={index}
                            className="flex items-center justify-between py-2 px-2 hover:bg-[#33333D] rounded-lg cursor-pointer"
                            href={`/game/${game?.slug}`}
                          >
                            <div className="flex items-center">
                              <Image
                                src={
                                  game?.coverImage?.formats?.thumbnail?.url ||
                                  game?.coverImage?.formats?.large?.url ||
                                  game?.image?.formats?.large?.url ||
                                  game?.image?.formats?.thumbnail?.url ||
                                  game?.coverImage?.url ||
                                  game?.image?.url ||
                                  "/placeholder.png"
                                }
                                alt={game?.name}
                                className="w-8 h-8 mr-3 rounded-lg"
                                width={32}
                                height={32}
                              />
                              <span
                                className="text-[#DDDDDD] text-base text-left"
                                onClick={() => handleGameClick(game)}
                              >
                                {game?.title}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" border border-[#9DACEC] p-3 m-4 rounded-md">
                        No game found
                      </div>
                    </>
                  )}
                  {/* News Section */}

                  {newsResults?.length > 0 ? (
                    <>
                      <div className="p-4 overflow-hidden">
                        <h3 className="text-base font-semibold mb-2 pl-2 flex gap-2 items-center">
                          <TbNews size={20} />
                          News
                        </h3>
                        {newsResults &&
                          newsResults?.map((news: any, index) => (
                            <a
                              key={index}
                              className="flex items-center justify-between py-2 px-2 hover:bg-[#33333D] rounded-lg cursor-pointer"
                              href={`/news/${news?.slug}`}
                            >
                              <div
                                key={index}
                                className="flex items-start justify-between py-2 px-2 hover:bg-[#33333D] cursor-pointer border-b border-[#2F313B] pb-4 pt-4 last:border-b-0"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="">
                                    <Image
                                      src={
                                        news?.coverImage?.formats?.thumbnail
                                          ?.url ||
                                        news?.coverImage?.formats?.large?.url ||
                                        news?.image?.formats?.large?.url ||
                                        news?.coverImage?.url ||
                                        news?.image?.url ||
                                        "/placeholder.png"
                                      }
                                      alt="cover image"
                                      className="w-48 h-20 min-w-48 max-w-48 mr-3 rounded-lg object-cover"
                                      width={192}
                                      height={80}
                                    />
                                  </div>
                                  <div className="w-full">
                                    <p className="text-[#DDDDDD] text-sm md:text-base line-clamp-2">
                                      {news?.title}
                                    </p>
                                    <div className="flex items-center text-gray-400 text-xs mt-1">
                                      {/* <span className="text-xs text-[#9DACEC]">
                          {news?.publishedAt
                            ? calculateTimeAgo(news?.publishedAt)
                            : null}
                        </span>{" "}
                        <span className="mx-2 text-xs text-[#9DACEC]">
                          |
                        </span> */}
                                      <span className="text-xs text-[#9DACEC] flex gap-1 items-center">
                                        <Image
                                          src="/icons/clock.svg"
                                          alt="clock icon"
                                          className="w-4 h-4"
                                          width={16}
                                          height={16}
                                        />{" "}
                                        {news?.publishedAt
                                          ? calculateTimeAgo(news?.publishedAt)
                                          : null}
                                        {/* {news?.hoursAgo} */}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div className=" border border-[#9DACEC] p-3 m-4 rounded-md">
                      No news found
                    </div>
                  )}
                </>
              )
            ) : (
              <>
                {/* <h3 className="text-sm text-gray-400 mb-2">Recent Searches</h3> */}
                {recentSearches?.length > 0 &&
                  recentSearches?.map((game: any, index: any) => (
                    <div className="p-4  pt-0 pb-0 mt-2 mb-2">
                      <a
                        key={index}
                        className="flex items-center justify-between py-2 px-2 hover:bg-[#33333D] rounded-lg cursor-pointer"
                        href={`/game/${game?.slug}`}
                      >
                        {/* <a href="/search-games" className="flex items-center justify-between w-full"> */}
                        <div className="flex gap-2 items-center">
                          <Image
                            src={`${
                              index === 2
                                ? "/dashboard/search.png"
                                : "/icons/timers.svg"
                            }`}
                            alt="timers"
                            className={`relative top-[2px] object-cover rounded-lg ${
                              index === 2 ? "w-8 h-8" : ""
                            }`}
                            width={32}
                            height={32}
                          />
                          <span className="text-white text-base text-left">
                            {game?.title}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSearch(index, game, event)}
                          className="text-white hover:text-white"
                        >
                          <LiaTimesSolid size={18} />
                        </button>
                      </a>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

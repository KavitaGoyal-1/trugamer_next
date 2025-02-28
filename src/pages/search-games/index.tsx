import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { throttle } from "lodash";
import LoaderSpinner from "@/components/loader-spinner";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import NavigationPublic from "@/components/layouts/navigation-public";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import Image from "next/image";
const SearchGames = () => {
  const gamesData = useSelector((state: any) => state?.searchGameSlice?.games);
  const newsData = useSelector((state: any) => state?.searchGameSlice?.news);
  const searchQuery = useSelector(
    (state: any) => state?.searchGameSlice?.searchQuery
  );
  const [games, setGames] = useState<any>(gamesData || []);
  const [news, setNews] = useState<any>(newsData);
  const [callApi, setCallApi] = useState(true);
  const [totalDbGames, setTotalDbGames] = useState(10);
  const [loading, setLoading] = useState(false);

  // const [games, setGames] = useState<any>( []);
  // const [news, setNews] = useState<any>([]);

  const [limit, setLimit] = useState(10);
  const [offset, setOffSet] = useState(0);

  useEffect(() => {
    setOffSet(0);
  }, [searchQuery]);

  async function getGamesNews(query: string) {
    if (!callApi && offset > totalDbGames) return;
    if (!query) return;
    try {
      setCallApi(false);
      setLoading(true);
      const response = await axios.get(`${getApi()}/search`, {
        params: {
          search: query,
          limit: limit,
          offset: offset,
        },
      });
      setLoading(false);
      if (response?.status == 200) {
        setGames((prevGames: any) => {
          const newGames = response?.data?.searchedgames || [];
          const allGames = [...prevGames, ...newGames];

          // Separate games into two categories
          const nonExpansionGames = allGames?.filter(
            (game) => game?.isExpansion !== "true" && game?.isSeason !== "true"
          );
          const expansionGames = allGames?.filter(
            (game) => game?.isExpansion === "true" || game?.isSeason === "true"
          );

          // Remove duplicates while maintaining order
          const uniqueNonExpansionGames = Array.from(
            new Map(nonExpansionGames?.map((game) => [game?.id, game])).values()
          );

          const uniqueExpansionGames = Array.from(
            new Map(expansionGames?.map((game) => [game?.id, game])).values()
          );

          // Merge non-expansion first, then expansion games at the end
          return [...uniqueNonExpansionGames, ...uniqueExpansionGames];
        });
        setNews((prevNews: any) => {
          const newNews = response?.data?.news || [];
          const allNews = [...prevNews, ...newNews];
          const uniqueNews = Array.from(
            new Map(allNews.map((news) => [news?.id, news])).values()
          );
          return uniqueNews;
        });
        setTotalDbGames(response?.data?.totalgmaes);
        console.log("offset inside", offset);
        setOffSet((prevOffset) => prevOffset + 30);
      }
      setCallApi(true);
      setLoading(false);
    } catch (error) {
      setCallApi(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery) getGamesNews(searchQuery);

    console.log(searchQuery, "  This is search qqq ");
  }, []);

  useEffect(() => {
    if (gamesData?.length > 0 || newsData?.length > 0) {
      setGames(gamesData);
      setNews(newsData);
    }
  }, [gamesData, newsData]);
  const router = useRouter();
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  const token = getToken();
  const [activeTab, setActiveTab] = useState("Games");

  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
          // Dispatch action to close sidebar (if managed via Redux)
          console.log("Clicked outside");
          // Alternatively, use local state to manage `isToggle` and update here
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);

  const handleScroll = useCallback(
    throttle(async () => {
      const scrollableHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const currentScroll = window.scrollY;

      if (scrollableHeight - currentScroll < 100) {
        // Close to the bottom, trigger API call
        await getGamesNews(searchQuery);
      }
    }, 2000), // 2 seconds throttle delay
    [offset]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <>
        <span className="pt-4 md:pt-16 pb-14 block"></span>
        <div className="max-w-[1100px] 2xl:max-w-[75%] w-full pt-8 py-16 pb-0 px-[5%] md:px-[10%]">
          <div className="header-Bg">
            <NavigationPublic
              text={["Game Calendar", "Video Game News"]}
              token={token}
              isLandingPage={true}
            />
          </div>

          <div
            className={
              isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
            }
            ref={navRef}
          >
            <NewVerticalNavigation token={token} />
          </div>

          <div className="flex flex-col gap-[20px] lg:gap-[10px]">
            {/* Tabs */}
            <div className="flex space-x-4 mb-2 md:mb-4">
              <button
                className={`px-4 py-1 h-8  text-sm ${
                  activeTab === "Games"
                    ? "bg-[#39475B] rounded-xl text-white font-semibold"
                    : "text-[#C1C9EDCC] font-normal"
                }`}
                onClick={() => setActiveTab("Games")}
              >
                Games
              </button>
              <button
                className={`px-4 py-1 h-8 font-semibold text-sm ${
                  activeTab === "News"
                    ? "bg-[#39475B] rounded-xl text-white font-semibold"
                    : "text-[#C1C9EDCC] font-normal"
                }`}
                onClick={() => setActiveTab("News")}
              >
                News
              </button>
            </div>
            <div className=" bg-[#0F111F] pb-10 mb-3 rounded-3xl rounded-b-none min-h-screen text-white">
              <div className="min-h-screen mx-auto p-3 pt-2 md:p-4 md:pt-5">
                {/* Tab Content */}
                {activeTab === "Games" && (
                  <>
                    <div>
                      {typeof gamesData != "function" &&
                      Array.isArray(games) &&
                      games?.length > 0 ? (
                        games?.map((game: any, index: any) => (
                          <Link href={`/game/${game?.slug}`}>
                            <div
                              key={index}
                              style={{
                                backgroundImage: `linear-gradient(rgb(21 24 43 / 100%), rgb(21 24 43 / 100%)), url(${
                                  game?.image?.url || "/dashboard/serach-bg.png"
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                              }} //
                              className="bg-search bg-[#15182b] bg-center cover no-repeat relative p-4 py-6  mb-4 rounded-xl flex items-center gap-4 cursor-pointer backdrop-blur-sm"
                              onClick={() => router.push(`/game/${game.slug}`)}
                            >
                              <div className=" w-28">
                                <Image
                                  src={
                                    game?.coverImage?.formats?.thumbnail?.url ||
                                    game?.coverImage?.formats?.large?.url ||
                                    game?.image?.formats?.large?.url ||
                                    game?.image?.formats?.thumbnail?.url ||
                                    game?.coverImage?.url ||
                                    game?.image?.url
                                  }
                                  alt="image search"
                                  className="  w-28 h-28 md:h-32  mr-3 rounded-lg object-cover"
                                  width={112}
                                  height={128}
                                />
                              </div>
                              <div className="w-full">
                                <h3 className="text-base line-clamp-2 2xl:text-2xl font-semibold">
                                  {game?.title}
                                </h3>
                                <div className="flex gap-4 items-center my-2">
                                  <p className="text-white text-[10px] md:text-sm 2xl:text-sm bg-[#39475B] p-2 py-1 rounded-lg leading-3 flex items-center gap-1">
                                    {" "}
                                    <Image
                                      src="/icons/calendar.svg"
                                      alt="calendar icon"
                                      className="w-4 h-4 md:w-6 md:h-6"
                                      width={16}
                                      height={16}
                                    />{" "}
                                    {
                                      game?.releaseByPlatforms?.release[0]
                                        ?.releaseDate
                                    }
                                  </p>
                                  <p className="text-white text-[10px] md:text-sm 2xl:text-sm bg-[#39475B] p-2 py-1 rounded-lg leading-3 flex items-center gap-1">
                                    {" "}
                                    <Image
                                      src="/icons/award.svg"
                                      alt="award icon"
                                      className="w-4 h-4 md:w-6 md:h-6"
                                      width={16}
                                      height={16}
                                    />
                                    {!game?.averageRating
                                      ? 0
                                      : game?.averageRating}
                                  </p>
                                </div>

                                <p className="text-white font-semibold text-xs md:text-sm 2xl:text-sm flex items-center gap-2">
                                  <Image
                                    src="/icons/Platform.svg"
                                    alt="platform icon"
                                    className="inline"
                                    width={30}
                                    height={30}
                                  />
                                  <span className="font-normal">
                                    {" "}
                                    Platforms:
                                  </span>
                                  <div className="flex flex-wrap gap-2 items-baseline">
                                    {game?.devices?.map(
                                      (platform: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2 whitespace-nowrap"
                                        >
                                          <span>{platform?.name}</span>
                                          {index <
                                            game?.devices?.length - 1 && (
                                            <span style={{ color: "gray" }}>
                                              {" "}
                                              |{" "}
                                            </span>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </p>
                              </div>
                              {
                                <>
                                  {game?.isSeason || game?.isExpansion ? (
                                    <button className="hidden md:flex mt-0 text-white bg-[#00ADFF33] p-1 px-2 leading-3 rounded-xl border text-xs border-[#00ADFF] absolute bottom-3 right-3">
                                      {game?.isSeason ? "Season" : "Expansion"}
                                    </button>
                                  ) : null}
                                </>
                              }
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-white font-semibold text-xl mt-4 flex items-center justify-center h-[100vh]">
                          No records found
                        </p>
                      )}
                    </div>
                    {loading && (
                      <>
                        {" "}
                        <LoaderSpinner />{" "}
                      </>
                    )}{" "}
                  </>
                )}

                {activeTab === "News" && (
                  <>
                    <div>
                      {typeof news != "function" &&
                      Array.isArray(news) &&
                      news?.some((item) => item?.length !== 0) &&
                      news?.length > 0 ? (
                        news?.map((news: any, index: any) => (
                          <Link href={`/news/${news?.slug}`}>
                            <div
                              key={index}
                              className="bg-[#15182B] border border-[#FFFFFF33] relative p-4 mb-4 rounded-xl flex items-center gap-4 cursor-pointer"
                              onClick={() => router.push(`/news/${news?.slug}`)}
                            >
                              <div className=" w-12">
                                <Image
                                  src={
                                    news?.coverImage?.formats?.thumbnail?.url ||
                                    news?.coverImage?.formats?.large?.url ||
                                    news?.image?.formats?.large?.url ||
                                    news?.coverImage?.url ||
                                    news?.image?.url
                                  }
                                  alt="cover image"
                                  className="w-12 max-w-12 min-w-12  h-24 md:h-20 mr-2 md:mr-1 rounded-lg object-cover"
                                  width={236}
                                  height={340}
                                />
                              </div>

                              <div className="w-[calc(100%-6rem)] ">
                                <h3 className="text-xs font-normal line-clamp-2 flex items-center gap-2 ">
                                  <Image
                                    src="/icons/Profile.svg"
                                    alt="profile icon"
                                    className="w-6 h-6 object-cover rounded-fill"
                                    width={24}
                                    height={24}
                                  />
                                  <span className=" ">
                                    {" "}
                                    {news?.author?.name}
                                  </span>
                                  {/* news.author.} */}
                                </h3>

                                <h3 className="text-xl font-semibold  flex items-center gap-2 my-2">
                                  <span className="truncate w-full">
                                    {" "}
                                    {news?.title}
                                  </span>
                                </h3>
                                {/* <div className="flex gap-4 items-center my-2">
                            <p className="text-[#00ADFF] text-xs 2xl:text-sm flex items-center gap-1">
                              {news?.publishedAt
                                ? new Date(
                                    news.publishedAt
                                  ).toLocaleDateString()
                                : "No date available"}
                            </p>
                          </div> */}
                                <div className="flex gap-4 items-center">
                                  <p className="text-[#00ADFF] text-xs 2xl:text-sm flex items-center gap-1">
                                    <Image
                                      src="/icons/ClockBlues.svg"
                                      alt="clock icon"
                                      width={16}
                                      height={16}
                                    />

                                    {news?.createdAt
                                      ? `${
                                          Math.floor(
                                            (Date.now() -
                                              new Date(
                                                news.createdAt
                                              ).getTime()) /
                                              (1000 * 60 * 60 * 24)
                                          ) >= 1
                                            ? `${Math.floor(
                                                (Date.now() -
                                                  new Date(
                                                    news.createdAt
                                                  ).getTime()) /
                                                  (1000 * 60 * 60 * 24)
                                              )} day${
                                                Math.floor(
                                                  (Date.now() -
                                                    new Date(
                                                      news.createdAt
                                                    ).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                                ) > 1
                                                  ? "s"
                                                  : ""
                                              }`
                                            : `${Math.floor(
                                                (Date.now() -
                                                  new Date(
                                                    news.createdAt
                                                  ).getTime()) /
                                                  (1000 * 60 * 60)
                                              )} hour${
                                                Math.floor(
                                                  (Date.now() -
                                                    new Date(
                                                      news.createdAt
                                                    ).getTime()) /
                                                    (1000 * 60 * 60)
                                                ) > 1
                                                  ? "s"
                                                  : ""
                                              }`
                                        }
  `
                                      : "No time available"}
                                  </p>
                                  <p className="text-[#00ADFF] text-xs 2xl:text-sm flex items-center gap-1">
                                    <Image
                                      src="/icons/ChatBlues.svg"
                                      alt="chat icon"
                                      width={16}
                                      height={16}
                                    />
                                    {news?.comment_count}
                                  </p>
                                  <>{/* {JSON.stringify( news )} */}</>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-white font-semibold text-xl mt-4 flex items-center justify-center h-[100vh]">
                          No records found
                        </p>
                      )}
                    </div>
                    {loading && (
                      <>
                        {" "}
                        <LoaderSpinner />
                      </>
                    )}{" "}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="max-md:hidden">
            <NewVerticalNavigation token={token} />
          </div>
        </div>
      </>
    </>
  );
};

export default SearchGames;

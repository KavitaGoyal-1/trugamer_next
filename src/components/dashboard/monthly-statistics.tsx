import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import LightBlueBtn from "../buttons/light-blue-btn";
import { getAnalytics } from "@/services/user";
import Image from "next/image";

const analyticsKeys = [
  {
    title: "Total Hour(s) Played",
    key: "total_hours",
    number: 74,
    percentage: 40,
    positive: true,
    imgAn: "/dashboard/blue1.svg",
  },
  {
    title: "Total Beaten Games",
    key: "total_beaten_games",
    number: 74,
    percentage: 40,
    positive: true,
    imgAn: "/dashboard/blue2.svg",
  },
  {
    title: "Games Queued",
    key: "total_playing_next",
    number: 10,
    percentage: 40,
    positive: false,
    imgAn: "/dashboard/blue3.svg",
  },
  {
    title: "Games Playing Now",
    key: "total_playing_now",
    number: 10,
    percentage: 40,
    positive: false,
    imgAn: "/dashboard/blue4.svg",
  },
  {
    title: "Total Game Rated",
    key: "total_game_rated",
    number: 16,
    percentage: 20,
    positive: true,
    imgAn: "/dashboard/blue5.svg",
  },
  {
    title: "Avg. Rating",
    key: "avg_rating",
    number: 16,
    percentage: 20,
    positive: true,
    imgAn: "/dashboard/blue5.svg",
  },
];
const MonthlyStatistics = () => {
  const [analytics, setanalytics] = useState<any>(null);
  const user = useSelector((state: any) => state.authState.userData);
  const gameHours = useSelector((state: any) => state?.gameHourSlice?.data);
  const gameData = useSelector((state: any) => state?.authState?.userData);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [gameHours, gameData]);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setanalytics(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="max-w-[2550px] w-full  mx-auto pt-8 py-16  grid grid-cols-1  px-[5%] md:px-[10%]">
        <div className="details-gradient relative pb-3">
          <h2 className="font-bold text-3xl md:text-4xl capitalize text-start ">
            <span className="max-sm:hidden">Your </span>Analytics
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 my-12">
          {analyticsKeys?.map((stat: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-3 gap-3 2xl:px-5 2xl:py-5 2xl:gap-5  rounded-2xl bg-[url('/dashboard/Total_Games.png')] bg-cover bg-no-repeat bg-center	"
              //
            >
              <div className="justify-items-start	flex flex-col gap-4">
                <Image
                  src={stat.imgAn}
                  alt="Statistic image"
                  width={96}
                  height={48}
                  className="w-12 h-12 2xl:w-20 2xl:h-20"
                />
                <div className="">
                  <span className="font-semibold text-base 2xl:text-[30px]">
                    <h3 className="text-lg 2xl:text-[30px] font-medium">
                      {stat.title}{" "}
                    </h3>
                  </span>
                </div>
              </div>

              <div className="">
                <div className="text-[32px] 2xl:text-[65px] font-semibold">
                  {analytics && analytics[stat.key] ? analytics[stat.key] : 0}
                </div>
              </div>
            </div>
          ))}
        </div>

        {analytics?.top_10_games && analytics["top_10_games"]?.length ? (
          <div className="mt-10">
            <div className="details-gradient relative pb-3">
              <h2 className="text-3xl font-bold">Most Played Games</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 lg:gap-3 justify-between">
              {analytics["top_10_games"]?.map((game: any, index: number) => {
                return (
                  <Link
                    target="_blank"
                    key={index}
                    className="flex items-center justify-between  mb-0 gap-3 w-full lg:w-[49%] bg-[#15182B] p-3 2xl:p-4 pr-6 !md:!pr-8 2xl:!pr-8  rounded-lg cursor-pointer"
                    href={`/game/${game?.game?.slug}`}
                  >
                    <div className=" rounded-lg gap-3 flex items-center">
                      <Image
                        src={
                          game?.game?.coverImage
                            ? game?.game?.coverImage?.url
                            : "/placeholder.png"
                        }
                        className="w-[75px] min-w-[75px] h-[120px] md:w-[75px] md:min-w-[75px] md:h-[100px] 2xl:w-[75px] 2xl:min-w-[75px] 2xl:h-[100px] object-cover rounded-md"
                        alt="played game"
                        width={75}
                        height={120}
                        // title="played game"
                      />
                      <h2 className="text-base md:text-lg font-bold truncate w-44 2xl:w-80">
                        {game?.game?.title}
                        <div className="flex md:hidden flex-col flex-nowrap text-center items-start mt-2">
                          <p className="text-sm">{game?.game?.desc}</p>
                          <span className="text-base text-center text-[#3DC0FF] font-medium mb-1">
                            Hours Played
                          </span>
                          <div className="flex gap-2">
                            <Image
                              src="/dashboard/blue8.svg"
                              alt="blues"
                              className="w-8 h-8 2xl:w-10 2xl:h-10"
                              width={32}
                              height={32}
                            />

                            <span className="text-xl md:text-3xl font-medium text-center">
                              {game?.hours}hrs
                            </span>
                          </div>
                        </div>
                      </h2>
                    </div>
                    <div className="hidden md:flex flex-col flex-nowrap text-center items-center">
                      <p className="text-sm">{game?.game?.desc}</p>
                      <Image
                        src="/dashboard/blue8.svg"
                        alt="blues"
                        className="w-8 h-8 2xl:w-10 2xl:h-10"
                        width={32}
                        height={32}
                      />
                      <span className="text-sm 2xl:text-base text-center text-[#3DC0FF] font-medium">
                        Hours Played
                      </span>
                      <span className="text-xl 2xl:text-3xl font-medium text-center">
                        {game?.hours} hrs
                      </span>
                    </div>
                  </Link>
                );
              })}
              {analytics["top_10_games"]?.length > 10 && (
                <div className="flex w-full">
                  <LightBlueBtn
                    href="/game-calendar"
                    text={"Show More"}
                    classNames="mx-auto mt-4"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default MonthlyStatistics;

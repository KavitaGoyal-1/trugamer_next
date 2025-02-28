import { useEffect } from "react";
import HomeSubtitle from "../home-subtitle";
import axios from "axios";
import Image from "next/image";
import { getNewReleases } from "@/services/game";
import { getApi } from "@/utills/get-api";
import { useRouter } from "next/router";

const Heading = ({
  title,
  description,
  icon,
  displayIconInSmallScreen,
}: {
  title: string;
  description: string;
  icon?: string;
  displayIconInSmallScreen?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-6 sm:gap-2 xxl:gap-4">
      <div className="flex items-center gap-2 xxl:gap-4">
        {icon && (
          <Image
            src={icon}
            className={`w-8 sm:w-7 lg:w-12 h-8 sm:h-7 lg:h-12 ${
              displayIconInSmallScreen && "sm:hidden"
            }`}
            alt={"game screen"}
            title={"game screen"}
            width={32}
            height={32}
          />
        )}
        <h2 className="text-[20px] sm:text-md lg:text-3xl xxl:text-4xl font-bold">
          {title}
        </h2>
      </div>
      <p className="text-gray-500 text-lg sm:text-base md:text-xs lg:text-lg xxl:text-2xl">
        {description}
      </p>
    </div>
  );
};

interface WhatIsTruGamerProps {
  token?: string;
}

const WhatIsTrugamer = ({ token }: WhatIsTruGamerProps) => {
  const router = useRouter();

  const getNewReleasesGames = async (filter = "") => {
    const currentDate = new Date().toISOString().split("T")[0];
    let currentDateNotFormatted = new Date();
    let pastDate = new Date(currentDateNotFormatted);
    // Use setMonth to go back 3 months
    pastDate.setMonth(currentDateNotFormatted.getMonth() - 3);
    // Correct for year change
    if (pastDate.getMonth() > currentDateNotFormatted.getMonth()) {
      pastDate.setFullYear(currentDateNotFormatted.getFullYear() - 1);
    }
    const pastThreeMonthsDate = pastDate.toISOString().split("T")[0];
    const query = `?populate=game.releaseByPlatforms.release.releaseDate&pagination[pageSize]=10&populate=game.devices.icon.image&populate=game.image&sort[0]=release_date:asc${filter}&filters[$and][0][release_date][$gte]=${currentDate}&filters[$and][1][release_date][$gte]=${pastThreeMonthsDate}`;
    await getNewReleases(query);
  };

  const getLibraryGames = async (filter = "") => {
    const query = `users-permissions/user/library?pagination[pageSize]=2&title=&populate[]=image&populate[]=devices.icon.image&sort=desc&sortBy=createdAt`;
    await axios.get(`${getApi()}/${query}`, {
      headers: { Authorization: token && `Bearer ${token}` },
    });
  };

  useEffect(() => {
    getNewReleasesGames();
    // getLibraryGames();
  }, []);

  const handleClickTrackPlaying = () => {
    router.push("/dashboard");
  };
  const handleClickGameLibrary = () => {
    router.push("/game-library");
  };
  const handleClickGameCalender = () => {
    router.push("/game-calendar");
  };
  const handleClickNews = () => {
    router.push("/news");
  };
  const handleClickDiscord = () => {
    window.open("https://discord.com/invite/77XY6sAaFJ", "_blank");
  };
  return (
    <section className="flex flex-col gap-[48px] mx-auto w-full h-full">
      <div className="flex items-center justify-center md:justify-between w-[80%] mx-auto">
        <HomeSubtitle text="What Is Trugamer ?" />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 w-[80%] h-full mx-auto">
        {/* Track what your playing */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 justify-between bg-cBlue-extraLight rounded-3xl">
          {/* Small Screen */}
          <div className="sm:hidden flex flex-col gap-6 px-8 sm:px-4 xl:px-10 py-[36px] sm:py-12">
            <Heading
              icon="/home/icon1.svg"
              title={"Game Queue"}
              description={"Track what your playing now and plan to play next"}
              displayIconInSmallScreen
            />
          </div>
          {/* Large Screen */}
          <div
            className="hidden sm:flex flex-col gap-6 px-8 sm:px-6 xl:px-10 py-[36px] sm:py-12"
            onClick={handleClickTrackPlaying}
          >
            <Image
              src="/home/icon1.svg"
              alt={"truegamer icon"}
              title={"truegamer icon"}
              className="w-8 lg:w-12 h-8 lg:h-12"
              width={32}
              height={32}
            />
            <Heading
              icon="/home/icon1.svg"
              title={"Track What your playing"}
              description={"Track what your playing now and plan to play next"}
              displayIconInSmallScreen
            />
          </div>
          <div
            className="hidden w-full h-full sm:block"
            onClick={handleClickGameLibrary}
          >
            <Image
              src="/home/card_2.png"
              alt="track your playing"
              title="track your playing"
              className="w-full h-full rounded-b-3xl"
              width={32}
              height={32}
            />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-2/3 h-full gap-6">
          {/* Release Calendar */}
          <div
            className="h-1/2 bg-cBlue-extraLight rounded-3xl flex flex-col md:flex-row"
            onClick={handleClickGameCalender}
          >
            <div className="flex flex-col md:w-[50%] shrink-0 py-10 px-8 sm:px-4 xl:px-10 gap-5 xl:gap-16">
              <Image
                src="/home/icon2.svg"
                className="w-8 lg:w-12 h-8 lg:h-12 hidden sm:block"
                alt={"home icon"}
                title={"home icon"}
                width={32}
                height={32}
              />
              <Heading
                icon="/home/icon2.svg"
                title={"Release Calendar "}
                description={
                  "Track upcoming releases personalized for your platform preference."
                }
                displayIconInSmallScreen
              />
            </div>
            <div className="hidden w-full sm:flex justify-end">
              <Image
                src="/home/card_1.png"
                alt="release calendar"
                title="release calendar"
                className="w-full h-full"
                width={32}
                height={32}
              />
            </div>
          </div>
          <div className="h-1/2 flex flex-col md:flex-row gap-6">
            {/* News Aggregator */}
            <div
              className="w-full md:w-3/6 bg-cBlue-extraLight md:min-h-[372px] rounded-3xl flex flex-col justify-between"
              onClick={handleClickNews}
            >
              <div
                className={`bg-[url("/home/card3.png")] hidden sm:block -mb-6 mt-4 w-full h-[120px] bg-center bg-contain bg-no-repeat`}
              />
              <div className="py-10 px-8 sm:px-4 xl:px-10">
                <Heading
                  title={"News Aggregator"}
                  icon="/home/icon3.svg"
                  description={
                    "Get the latest gaming news curated and aggregated from the best gaming news sites."
                  }
                />
              </div>
            </div>
            {/* Community */}
            <div
              className="w-full md:w-3/6 bg-cBlue-extraLight rounded-3xl flex flex-col justify-between"
              onClick={handleClickDiscord}
            >
              <div
                className={`bg-[url("/home/card4.png")] hidden sm:block w-full h-[120px] md:h-3/6 bg-center bg-contain bg-no-repeat`}
              />
              <div className="py-10 px-8 sm:px-4 xl:px-10">
                <Heading
                  title="Community"
                  icon={"/home/icon4.svg"}
                  description="Join our growing community of hardcore gamers."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsTrugamer;

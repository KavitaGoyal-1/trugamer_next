import React from "react";
import LightBlueBtn from "../buttons/light-blue-btn";
import { CiPlay1 } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";
import { INewRelease } from "@/types/new-release";
import { useRouter } from "next/router";

interface IProps {
  newGames: INewRelease[] | null;
  visible?: boolean;
  selectedGame?: boolean;
  selectedGameRelease?: any;
  token?: string;
  popularHeading?: string;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  setSelectedGameRelease?: React.Dispatch<React.SetStateAction<any>>;
  setPopularHeading?: React.Dispatch<React.SetStateAction<any>>;
  popularReleaseHeading?: string;
}

const PopularNewReleases = ({
  newGames,
  visible,
  token,
  setVisible,
  setSelectedGameRelease,
  setSelectedGame,
}: IProps) => {
  return (
    <section className="max-w-[2550px] mx-auto py-10 md:py-10 grid grid-cols-1 md:grid-cols-[1fr_max-content] px-[5%] md:px-[10%]">
      <h2 className="font-bold text-3xl	md:text-4xl	lg:text-[44px] capitalize">
        Popular new releases
      </h2>
      <div className="row-start-1 row-end-4 md:row-end-2 col-start-1 md:col-start-2 col-end-2 col-end-3 max-md:hidden">
        <LightBlueBtn href="/" text={"Discover More"} />
      </div>

      <div
        className="
                    col-start-1 col-end-2 md:col-end-3
                    grid lg:gap-4 md:gap-6 gap-8  grid-cols-1 
                    my-12 md:my-20 lg:my-28
                    relative
                "
      >
        {newGames &&
          newGames
            .slice(0, 5)
            ?.map((game, index) => (
              <RealeseRow
                token={token}
                key={game.id}
                game={game}
                index={index}
                visible={visible}
                setVisible={setVisible}
                setSelectedGame={setSelectedGame}
                setSelectedGameRelease={setSelectedGameRelease}
              />
            ))}
      </div>
    </section>
  );
};

const RealeseRow = ({
  game,
  index,
  token,
  visible,
  setVisible = () => {},
  setSelectedGameRelease,
}: any) => {
  const router = useRouter();
  const handleAddQueue = () => {
    setSelectedGameRelease({ game: game?.attributes?.game?.data });
    setVisible(true);
    if (setVisible) {
      setVisible(!visible);
    }
  };

  const handleWithoutTokenAddQueue = () => {
    router.push("/auth/sign-in");
  };
  return (
    <React.Fragment>
      <div className="bg-cBlack-main p-3 rounded-14px grid xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2 justify-between items-center">
        <Link
          href={`/game/${game?.attributes?.game?.data?.attributes?.slug}`}
          className="grid sm:col-span-2 col-span-1 gap-3 hover:cursor-pointer"
        >
          <div className="flex gap-2">
            <Image
              height={80}
              width={66}
              src={
                game?.attributes?.game?.data?.attributes?.image?.data
                  ?.attributes?.url
                  ? game?.attributes?.game?.data?.attributes?.image?.data
                      ?.attributes?.url
                  : "/placeholder.png"
              }
              alt="popular Release"
              title="popular Release"
            />
            <div className="grid place-items-start place-content-center gap-0">
              <h3 className="text-start font-bold text-[18px]">{`${
                index + 1
              }# ${game?.attributes?.game?.data?.attributes?.title}`}</h3>
              <div className="flex items-center ">
                <Image
                  height={15}
                  width={15}
                  src={
                    game?.attributes?.game?.data?.attributes?.devices?.data[0]
                      ?.attributes?.icon?.image?.data?.attributes?.url
                  }
                  alt={"relases img"}
                  title={"relases img"}
                  className="bg-gray-600 mr-2"
                />
                <span className="mr-2 text-cPurple-light font-medium text-start ">
                  {
                    game?.attributes?.game?.data?.attributes?.devices?.data[0]
                      ?.attributes?.name
                  }
                </span>
              </div>
              <div className="flex md:hidden mt-2">
                {game?.attributes?.game?.data?.attributes?.rating > 0 ? (
                  <>
                    <span className="font-medium py-0.5 px-2 bg-cBlue-light text-white rounded-2xl">
                      {game?.attributes?.game?.data?.attributes?.rating}/10
                    </span>
                  </>
                ) : (
                  <span className="font-medium py-0.5 px-2 bg-cBlue-light text-white rounded-2xl">
                    0
                  </span>
                )}

                {game?.attributes?.game?.data?.attributes?.played > 0 ? (
                  <>
                    <span className="font-normal py-0.5 px-2 text-white rounded-2xl flex items-center gap-2 justify-center">
                      {" "}
                      <CiPlay1 />
                      {game?.attributes?.game?.data?.attributes?.played}
                    </span>
                  </>
                ) : (
                  <span className="ml-2 font-medium py-0.5 px-2 bg-[#00adff40] text-cBlue-light rounded-2xl">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </Link>
        {/* Description Section */}
        <div className="grid col-span-2 truncate place-items-start gap-2 max-lg:hidden">
          <span className="font-semibold text-[14px]">Game Description</span>
          <p className="text-cPurple-light font-normal text-start over truncate w-full">
            {game?.attributes?.game?.data?.attributes?.description}
          </p>
        </div>

        {/* Rating Section */}
        <div className="flex lg:justify-end justify-start col-span-1 max-md:hidden">
          <div className="flex flex-col items-start w-fit gap-2">
            <span className="block w-full font-semibold text-[14px] text-center">
              Rating
            </span>

            {game?.attributes?.game?.data?.attributes?.rating > 0 ? (
              <>
                <span className="font-medium py-0.5 px-2 bg-[#00adff] text-white rounded-2xl">
                  {game?.attributes?.game?.data?.attributes?.rating}/10
                </span>
              </>
            ) : (
              <span className="font-medium py-0.5 px-2 bg-[#00adff] text-white rounded-2xl">
                0
              </span>
            )}
          </div>
        </div>

        {/* Status Section */}
        <div className="flex justify-end col-span-1 max-sm:hidden">
          {game?.attributes?.game?.data?.attributes?.played > 0 ? (
            <div>
              <p> Users Playing </p>

              <span className="font-normal py-0.5 px-2 text-white rounded-2xl flex items-center gap-2 justify-center">
                {" "}
                <CiPlay1 />
                {game?.attributes?.game?.data?.attributes?.played}
              </span>
            </div>
          ) : (
            <span className="font-medium py-0.5 px-2 bg-[#00adff40] text-cBlue-light rounded-2xl">
              Active
            </span>
          )}
        </div>
        {/* Description Section for mobile */}
        <div className="grid col-span-4 place-items-start gap-2 lg:hidden inline-block h-fit">
          <p className="text-cPurple-light font-normal text-start max-h-[120px] text-ellipsis overflow-hidden">
            {game?.attributes?.game?.data?.attributes?.description}
          </p>
        </div>

        {/* Button Section */}
        <div className="flex xl:justify-end justify-center col-span-4 lg:col-span-6 xl:col-span-1 mt-3">
          <button
            className="py-2 px-3 bg-cPurple-light text-white font-semibold text-base rounded-14px max-[500px]:w-full"
            onClick={token ? handleAddQueue : handleWithoutTokenAddQueue}
          >
            Add Queue
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PopularNewReleases;

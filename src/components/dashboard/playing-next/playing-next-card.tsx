import React from "react";
import CardDate from "../../card/card-date";
import CardPlus from "../../card/card-plus";
import Link from "next/link";
import { getToken } from "@/utills/cookies";
import Image from "next/image";

interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  game?: any;
  index: number;
  heading?: string;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}

const PlayingNextCard = ({
  game: Game,
  heading,
  index,
  setIsOpenLoginStatus,
  setVisible,
  setSelectedGame,
  visible,
  selectedGame,
}: IProps) => {
  const token = getToken();
  let game = Game?.game;
  const today = new Date().toISOString().split("T")[0];
  const futureReleases =
    game?.releaseByPlatforms?.release?.filter(
      (r: any) => r.releaseDate > today
    ) || [];
  const latestFutureReleaseDate = futureReleases.length
    ? futureReleases
        ?.map((r: any) => new Date(r.releaseDate))
        ?.sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]
        .toISOString()
        .split("T")[0]
    : null;

  const filteredReleases = Game.releases?.reduce((acc: any[], release: any) => {
    const existingOwned = acc.find(
      (r) => r.device.name === release.device.name && r.isOwned
    );

    if (release.isOwned && existingOwned) {
      return acc; // Skip adding if there's already an owned entry for the same device
    }

    return [...acc, release];
  }, []);

  return (
    <>
      <div
        key={game?.id}
        className="h-[273px] md:h-[340px] w-[216px] md:w-[236px] relative grid justify-items-center content-center m-auto sm:mr-auto"
      >
        <div className="flex w-full">
          {/* {game?.releaseByPlatforms && latestFutureReleaseDate && (
            <CardDate
              date={latestFutureReleaseDate}
              top="-10"
              left="0"
              classValue={`dt-right-auto`}
            />
          )} */}
          <CardPlus
            game={Game}
            setVisible={setVisible}
            token={token}
            visible={visible}
            setIsOpenLoginStatus={setIsOpenLoginStatus}
            setSelectedGame={setSelectedGame}
            selectedGame={selectedGame}
          />
        </div>
        <Link target="_blank" href={`/game/${game?.slug}`} className="block">
          <Image
            src={
              game?.coverImage?.url ? game?.coverImage?.url : "/placeholder.png"
            }
            alt="Playing Card Image"
            width={216}
            height={273}
            className="z-0 min-w-[216px] h-[273px] md:min-w-[236px] md:h-[340px] w-full cursor-pointer object-cover rounded-lg"
          />
        </Link>
        <span
          className={`absolute text-[110px] font-bold text-cPurple-light bottom-[0px] left-[-15px] text-transparent stroke-text leading-[82px]`}
        >
          {index + 1}
        </span>
      </div>
      <div className="w-[216px] mt-3 ml-auto mr-auto pb-5">
        <Link target="_blank" href={`/game/${game?.slug}`} className="">
          {" "}
          <p className="text-lg font-semibold flex-wrap text-left">
            {game?.title}
          </p>
        </Link>

        <div className="w-full flex flex-col text-xl md:text-xl text-cWhite-light font-regular capitalize items-start gap-2 mt-3">
          {filteredReleases &&
            filteredReleases?.length > 0 &&
            filteredReleases.map((release: any) => {
              let formattedDate = "";

              if (heading !== "Shelved") {
                const [year, month, day] = release.releaseDate.split("-");
                formattedDate = `${month}/${day}/${year}`;
              }
              return (
                <div key={release.id} className="flex items-center mr-4 mb-2">
                  <Image
                    src="/icons/window.svg"
                    alt="window"
                    title="window"
                    className="object-cover mr-1 w-3 h-3"
                    width={12}
                    height={12}
                  />
                  <p className="text-xs font-medium flex gap-1 items-center">
                    <span className="truncate">{release?.device?.name}</span>
                    {release.isOwned ? (
                      <span className="text-[#3DC0FF] bg-[#3DC0FF33] text-xs font-medium p-1 px-2 rounded-lg ml-1">
                        Owned
                      </span>
                    ) : (
                      <span className="flex gap-1 items-center text-[10px] font-medium ms-1">
                        <Image
                          src="/icons/timer-count.svg"
                          alt="window"
                          title="window"
                          className="object-cover mr-0 w-3 h-3"
                          width={12}
                          height={12}
                        />
                        {formattedDate}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default PlayingNextCard;

import React from "react";
import CardPlus from "../../card/card-plus";
import Link from "next/link";
import DeviceIcon from "../../../../public/icons/device.svg";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import Image from "next/image";

interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  game?: any;
  token?: any;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}

const PlayingNowCard = ({
  game,
  setVisible,
  setSelectedGame,
  visible,
  selectedGame,
  setIsOpenLoginStatus,
  token,
}: IProps) => {
  let gameData = game?.game ? game?.game : game;
  return (
    <>
      <div className="relative playing-card h-[273px] xl:h-[340px] w-[216px] md:w-[236px] grid justify-items-start content-start m-auto sm:mr-auto">
        {/* {token && ( */}
        <CardPlus
          game={game}
          setVisible={setVisible}
          visible={visible}
          token={token}
          setIsOpenLoginStatus={setIsOpenLoginStatus}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
        />
        {/* // )} */}
        <Link
          target="_blank"
          href={gameData?.slug ? `/game/${gameData?.slug}` : ""}
          className="block" // Ensure the link takes full space
        >
          <Image
            src={
              gameData?.coverImage?.url
                ? gameData?.coverImage?.url
                : "/placeholder.png"
            }
            alt="device game"
            // title="device game"
            width={236}
            height={273}
            className="z-0 min-w-[216px] md:min-w-[236px]  h-[273px]  xl:h-[340px] object-cover w-full cursor-pointer rounded-md"
          />
        </Link>
      </div>
      <div className=" w-[216px]  md:w-[236px] mt-9 md:mt-3 ml-auto mr-auto pb-5">
        <Link
          target="_blank"
          href={gameData?.slug ? `/game/${gameData?.slug}` : ""}
        >
          {" "}
          <p className="text-lg font-semibold text-left">{gameData?.title}</p>
        </Link>
        <div className="w-full flex flex-col text-xl md:text-xl text-cWhite-light font-regular capitalize items-start gap-2 mt-3">
          {game?.releases &&
            game?.releases?.length > 0 &&
            game?.releases
              ?.filter((release: any, index: any, self: any) => {
                // Check if isOwned is true
                if (!release.isOwned) return false;

                // Find the first occurrence of each device with isOwned = true
                return (
                  self.findIndex(
                    (r: any) =>
                      r.device?.name === release.device?.name &&
                      r.isOwned === true
                  ) === index
                );
              })
              ?.map((release: any) => {
                return (
                  <>
                    <div
                      key={release?.id}
                      className="flex items-center mr-4 mb-2"
                    >
                      <Image
                        src={
                          release?.device?.name.toLowerCase().includes("pc")
                            ? PCIcon
                            : release?.device?.name
                                .toLowerCase()
                                .includes("playstation")
                            ? PlaystationIcon
                            : release?.device?.name
                                .toLowerCase()
                                .includes("xbox")
                            ? XboxIcon
                            : release?.device?.name
                                .toLowerCase()
                                .includes("switch")
                            ? SwitchIcon
                            : release?.device?.name
                                .toLowerCase()
                                .includes("mac")
                            ? MacIcon
                            : release?.device?.name
                                .toLowerCase()
                                .includes("android")
                            ? AndroidIcon
                            : DeviceIcon
                        }
                        alt="window"
                        // title="window"
                        className="object-cover mr-1 w-4 h-4"
                      />
                      <p className="text-xs font-medium flex items-center gap-1">
                        {release?.device?.name}{" "}
                        {release?.isOwned && (
                          <span className="text-[#3DC0FF] bg-[#3DC0FF33] text-xs font-medium p-1 px-2 rounded-lg ml-1">
                            Owned
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default PlayingNowCard;

import { TbDeviceGamepad2 } from "react-icons/tb";
import MacIcon from "../../../../public/icons/AppleLogo.svg";
import Biheadset from "../../../../public/icons/biheadset.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import { PiShieldStar } from "react-icons/pi";
import Image from "next/image";

const GameDirectoryList = ({ games, toggleVisible, timeframe }: any) => {
  const check: any = [
    {
      mac: MacIcon,
      xsx: XboxIcon,
      switch: SwitchIcon,
      ps5: PlaystationIcon,
      biheadset: Biheadset,
      pc: PCIcon,
    },
  ];
  const handleNavigate = (game: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(`/game/${game?.slug}`, "_blank");
  };

  return (
    <>
      {games?.map((game: any, index: any) => (
        <div
          key={game.id || index} // Use a unique key if available (game.id in this case)
          className="bgC-img flex items-center mb-5 gap-3 w-full border p-2 rounded-lg border-gray-800 cursor-pointer"
          onClick={(e: any) => {
            handleNavigate(game, e);
          }}
          style={{
            backgroundImage: `url(${
              game?.image ? game?.image?.url : game?.image?.url
            })`,
          }}
        >
          <Image
            src="/games/plus-icon.svg"
            className="absolute right-[-12px] top-[-12px] w-8 h-8"
            alt="played game"
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
              toggleVisible(game);
            }}
            width={32}
            height={32}
          />
          <div className="rounded-lg gap-3 flex items-center">
            <a href={`/game/${game?.slug}`} target="_blank">
              <Image
                src={
                  game?.coverImage?.url
                    ? game?.coverImage?.url
                    : "/placeholder.png"
                } // Handle missing images
                className="w-[95px] min-w-[95px] sm:w-[115px] sm:min-w-[115px] h-[130px] object-cover"
                alt={game.title}
                width={95}
                height={95}
              />
            </a>
          </div>
          <a href={`/game/${game?.slug}`} target="_blank">
            <div className="flex flex-col w-full justify-center">
              <h2 className="text-xl  md:text-lg 2xl:text-2xl  font-semibold line-clamp-2 ">
                {game.title}
              </h2>

              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex gap-2 mt-2 mb-2">
                  <div className="relative group">
                    <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                      <Image
                        src="/gameCalender/fire.svg"
                        className="w-5 h-5"
                        width={20}
                        height={20}
                        alt="calendar icon"
                        // title="calendar icon"
                      />
                      {game?.TotalHotScore || 0}
                    </span>

                    <div className="w-max absolute z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                      Hot Score: {game?.TotalHotScore || 0}
                    </div>
                  </div>

                  <div className="relative group">
                    <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                      {" "}
                      <TbDeviceGamepad2 size={22} /> {game?.queued}
                    </span>
                    {game?.queued && (
                      <div className="absolute w-max z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                        Queued: {game?.queued || 0}
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <span className="text-xs sm:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-2 h-8 items-center rounded-md w-auto">
                      <Image
                        src="/icons/calendar.svg"
                        className="w-5 h-5"
                        width={20}
                        height={20}
                        alt="calendar icon"
                        // title="calendar icon"
                      />
                      {game?.releaseByPlatforms?.release?.[0]?.releaseDate}
                    </span>
                    <div className="absolute w-max z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                      Release Date:{" "}
                      {game?.releaseByPlatforms?.release?.[0]?.releaseDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 items-center mt-0 sm:mt-1">
                {Object.keys(check[0])
                  .filter((key) =>
                    game.devices?.some((device: any) => device.slug === key)
                  )
                  .slice(0, 3)
                  .map((key, index) => (
                    <div key={index} className="relative group">
                      <span className="w-4 h-4 sm:w-6 sm:h-6 p-[2px] sm:p-1 border flex items-center justify-center rounded-[4px] sm:rounded-md border-[#596184]">
                        <Image
                          src={check[0][key]} // Access the icon URL from the object
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          alt={`${key}`}
                          title={`${key}`}
                          width={12}
                          height={12}
                        />
                      </span>
                      {/* Tooltip */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 rounded">
                        {key}{" "}
                        {/* Display the key or any value you want in the tooltip */}
                      </div>
                    </div>
                  ))}

                {Object.keys(check[0]).filter((key) =>
                  game.devices?.some((device: any) => device.slug === key)
                ).length > 3 && (
                  <span className="w-6 h-6 flex items-center justify-center rounded-md text-[#596184] text-[12px] sm:text-sm">
                    +
                    {Object.keys(check[0]).filter((key) =>
                      game.devices?.some((device: any) => device.slug === key)
                    ).length - 3}
                  </span>
                )}
              </div>
              <div className="absolute right-[8px] bottom-[8px]">
                <div className="w-full text-right gap-3 flex justify-end mt-2 md:mt-0">
                  {(game?.isSeason || game?.isExpansion) && (
                    <button className="bg-[#00ADFF33] border-[0.5px] border-solid border-[#00ADFF] text-xs rounded-2xl px-2 h-6">
                      {game?.isSeason ? "Season" : "Expansion"}
                    </button>
                  )}

                  {game?.editorialAnticipatedRelease && (
                    <span
                      className="text-[8px] sm:text-[10px] font-semibold flex gap-1 bg-[#02699a] border border-[#00ADFF] px-1 py-0.5  items-center rounded-md w-auto whitespace-nowrap"
                      style={{ background: "#00adffcc" }}
                    >
                      <PiShieldStar size={16} />
                      Anticipated
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </>
  );
};

export default GameDirectoryList;

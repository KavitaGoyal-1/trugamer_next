import MacIcon from "../../../../public/icons/AppleLogo.svg";
import Biheadset from "../../../../public/icons/biheadset.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import { PiShieldStar } from "react-icons/pi";
import Image from "next/image";

const GameDirectoryCard = ({
  games,
  toggleVisible,
  pageLocation,
  timeframe,
}: any) => {
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
        <>
          <div
            id="scrollableContainer"
            key={game?.id || index} // Use a unique key if available (game.id in this case)  bgC-img
            className={`relative flex flex-col items-center mb-8 gap-3  ${
              pageLocation
                ? "w-[47%] sm:w-[30%] lg:w-[18.2%]"
                : "w-[47%] lg:w-[22.94%] 2xl:w-[23.2%] xxl:w-[18.2%]"
            } p-0 rounded-2xl cursor-pointer`}
            onClick={(e: any) => {
              handleNavigate(game, e);
            }}
            // style={{
            //   backgroundImage: `url(${game?.image ? game?.image?.url : game?.image?.url
            //     })`,
            // }}
          >
            <Image
              src="/games/plus-icon.svg"
              className="absolute right-[-12px] top-[-12px] w-9 h-9"
              alt="played game"
              onClick={(e: any) => {
                e.stopPropagation();
                e.preventDefault();
                toggleVisible(game);
              }}
              width={36}
              height={36}
            />

            {game?.editorialAnticipatedRelease && (
              <div className="absolute left-[5px] top-[5px]">
                <span
                  className="text-[8px] sm:text-[10px] font-semibold flex gap-1 bg-[#02699a] border border-[#00ADFF] px-1 py-0.5  items-center rounded-md w-auto whitespace-nowrap"
                  style={{ background: "#00adffcc" }}
                >
                  <PiShieldStar size={16} />
                  Anticipated
                </span>
              </div>
            )}
            {/* {game?.editorialAnticipatedRelease&&(<>ff</>)} */}
            <div className="rounded-lg gap-3 flex items-center w-full">
              <a
                href={`/game/${game?.slug}`}
                target="_blank"
                className="w-full"
              >
                <Image
                  src={
                    game?.coverImage?.url
                      ? game?.coverImage?.url
                      : "/placeholder.png"
                  }
                  className={`w-full  object-cover rounded-2xl object-top ${
                    pageLocation
                      ? "h-[220px] md:h-[240px] lg:h-[270px] 2xl:h-[360px] xxl:h-[420px] xxxl:h-[480px]"
                      : "h-[220px] md:h-[230px] lg:h-[200px] xl:h-[235px] xll:h-[270px]  2xl:h-[330px] xxl:h-[280px] xxxl:h-[430px] xxxxl:h-[650px]"
                  }`}
                  alt={game?.title}
                  width={220}
                  height={240}
                  // title={game?.title}
                />
              </a>
            </div>
            <a className="w-full" href={`/game/${game?.slug}`} target="_blank">
              <div className="flex flex-col w-full p-0">
                <h2 className=" hover:text-[#adbaf5] cursor-pointer text-md sm:text-xl 2xl:text-2xl font-semibold line-clamp-1">
                  {game.title}
                </h2>

                <div className="flex gap-2 mt-2 mb-2">
                  {game?.TotalHotScore ? (
                    <div className="relative group">
                      <span className="text-[8px] sm:text-[10px] 2xl:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-1 2xl:px-2 h-5 sm:h-8 items-center rounded-md w-auto scrollbar-hide overflow-auto">
                        <Image
                          src="/gameCalender/fire.svg"
                          className="w-3 h-3 sm:w-3 sm:h-3 2xl:w-5 2xl:h-5"
                          alt=""
                          title=""
                          width={12}
                          height={12}
                        />
                        {game?.TotalHotScore && game?.TotalHotScore > 0
                          ? game?.TotalHotScore
                          : ""}
                      </span>
                      <div className="w-max absolute z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                        Hot Score:{" "}
                        {game?.TotalHotScore && game?.TotalHotScore > 0
                          ? game?.TotalHotScore
                          : ""}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="relative group">
                    <span className="text-[8px] sm:text-[10px] 2xl:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-1 2xl:px-1.5 h-5 sm:h-8 items-center rounded-md w-auto scrollbar-hide overflow-auto">
                      <Image
                        src="/gameCalender/GameController.svg"
                        className="w-3 h-3 sm:w-3 sm:h-3 2xl:w-5 2xl:h-5"
                        alt=""
                        title=""
                        width={12}
                        height={12}
                      />
                      {game?.queued || 0}
                    </span>
                    {game?.queued && (
                      <div className="absolute w-max z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                        Queued: {game?.queued || 0}
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <span className="text-[8px] sm:text-[10px] 2xl:text-sm flex gap-1 bg-[#39475B] px-1 sm:px-1 2xl:px-1.5 h-5 sm:h-8 items-center rounded-md w-auto whitespace-nowrap scrollbar-hide overflow-auto">
                      <Image
                        src="/icons/calendar.svg"
                        className="w-3 h-3 sm:w-3 sm:h-3 2xl:w-5 2xl:h-5"
                        alt=""
                        title=""
                        width={12}
                        height={12}
                      />
                      {game?.releaseByPlatforms?.release?.[0]?.releaseDate}
                      {/* {game?.releaseByPlatforms?.release?.[0]?.releaseDate} */}
                      {/* {JSON.stringify(timeframe?.split(" - "))} */}
                    </span>
                    <div className="absolute w-max z-[99] left-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-sm p-1 px-3 rounded">
                      Release Date:{" "}
                      {game?.releaseByPlatforms?.release?.[0]?.releaseDate}
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

                {/* <span className="text-sm text-left mb-1 flex items-center gap-2 ">
          Queued Count: {game?.queued}
        </span> */}
                <div className="w-full text-right ">
                  {(game?.isSeason || game?.isExpansion) && (
                    <button className="bg-[#00ADFF33] border-[0.5px] border-solid border-[#00ADFF] text-xs rounded-2xl px-2 h-6">
                      {game?.isSeason ? "Season" : "Expansion"}
                    </button>
                  )}
                </div>
              </div>
            </a>
          </div>
        </>
      ))}
    </>
  );
};

export default GameDirectoryCard;

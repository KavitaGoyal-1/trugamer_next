import MacIcon from "../../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../../public/icons/androidgrey.svg";
import PCIcon from "../../../../public/icons/window.svg";
import XboxIcon from "../../../../public/icons/xport.svg";
import DeviceIcon from "../../../../public/icons/device.svg";
import PlaystationIcon from "../../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../../public/icons/switch.svg";
import Link from "next/link";
import { INewRelease } from "@/types/new-release";
import CardPlus from "@/components/card/card-plus";
import Image from "next/image";
interface GameCardProps {
  game: INewRelease;
  onClick: VoidFunction;
  token?: string;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: any;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}

const DiscoverNewReleasesGameCard = ({
  game,
  onClick,
  token,
  setVisible,
  visible,
  selectedGame,
  setSelectedGame,
  setIsOpenLoginStatus,
}: GameCardProps) => {
  const getLatestReleaseDate = () => {
    if (
      !game ||
      !game?.attributes ||
      !game?.attributes?.releaseByPlatforms ||
      !game?.attributes?.releaseByPlatforms?.release
    ) {
      return null; // Handle the case where data is not yet available
    }
    // Access the release dates from the game object
    const releases = game?.attributes?.releaseByPlatforms.release;
    // Sort releases by release date in descending order to get the latest date
    const sortedReleases = releases.sort((a: any, b: any) => {
      return (
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    });
    // Return the release date of the latest release
    return sortedReleases[0]?.releaseDate;
  };

  const getUniqueDeviceNames = () => {
    const releases = game?.attributes?.releaseByPlatforms?.release || [];
    const uniqueNames = new Set<string>();
    releases?.forEach((release: any) => {
      if (
        release.device &&
        release.device.data &&
        release.device.data.attributes &&
        release.device.data.attributes.name
      ) {
        uniqueNames.add(release.device.data.attributes.name);
      }
    });

    return Array.from(uniqueNames);
  };
  return (
    <div className="relative xx:h-[522px] w-full">
      {/* <CardDate date={getLatestReleaseDate()} top="-10" /> */}
      <div className="flex w-full relative top-[5px]">
        {" "}
        {/* {token && ( */}
        <CardPlus
          game={game}
          setVisible={setVisible}
          visible={visible}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
          token={token}
          setIsOpenLoginStatus={setIsOpenLoginStatus}
        />
        {/* // )} */}
      </div>

      <Link
        target="_blank"
        href={game.attributes.slug && `/game/${game.attributes.slug}`}
      >
        <Image
          src={
            game?.attributes?.coverImage?.data?.attributes?.url
              ? game?.attributes?.coverImage?.data?.attributes?.url
              : "/placeholder.png"
          }
          alt={"game image"}
          // title={"game image"}
          width={273}
          height={340}
          className="w-full h-[205px] md:h-[273px] xl:h-[340px] 2xl:h-[340px] md:min-w-[236px] md:max-w-[236px] object-cover rounded-lg hover:cursor-pointer object-top"
          // onClick={onClick}
        />
      </Link>

      <>
        <Link
          target="_blank"
          href={game.attributes.slug && `/game/${game.attributes.slug}`}
        >
          <div className="w-full flex flex-col items-start mt-4">
            <h3
              className="text-base min-[320px]:text-lg font-medium truncate w-full cursor-pointer"
              // onClick={onClick}
            >
              {game?.attributes?.title}
            </h3>

            <div className="w-full flex flex-col text-xl md:text-xl text-cWhite-light font-regular capitalize items-start mt-2">
              {getUniqueDeviceNames().map((deviceName, index) => (
                <div key={index} className="flex items-center mr-4 mb-2">
                  <Image
                    src={
                      game?.attributes?.releaseByPlatforms?.release?.find(
                        (release: any) =>
                          release.device?.data?.attributes.name === deviceName
                      )?.device?.data?.attributes.icon?.image?.data?.attributes
                        .url ||
                      (deviceName.toLowerCase().includes("pc")
                        ? PCIcon
                        : deviceName.toLowerCase().includes("playstation")
                        ? PlaystationIcon
                        : deviceName.toLowerCase().includes("xbox")
                        ? XboxIcon
                        : deviceName.toLowerCase().includes("switch")
                        ? SwitchIcon
                        : deviceName.toLowerCase().includes("mac")
                        ? MacIcon
                        : deviceName.toLowerCase().includes("android")
                        ? AndroidIcon
                        : DeviceIcon)
                    }
                    alt="Device icon"
                    // title="Device icon"
                    width={24} // Adjust icon size here for uniform display
                    height={24} // Adjust icon size here for uniform display
                    style={{
                      filter:
                        "invert(50%) sepia(100%) saturate(500%) hue-rotate(190deg) brightness(90%) contrast(85%)", // Adjust filter to apply uniform color
                    }}
                    className="mr-2 w-6 h-6"
                  />

                  <span className="text-xs font-medium text-[#596184]">
                    {deviceName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </>
    </div>
  );
};

export default DiscoverNewReleasesGameCard;

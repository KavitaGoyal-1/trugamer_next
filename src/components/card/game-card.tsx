import MacIcon from "../../../public/icons/AppleLogo.svg";
import AndroidIcon from "../../../public/icons/androidgrey.svg";
import PCIcon from "../../../public/icons/window.svg";
import XboxIcon from "../../../public/icons/xport.svg";
import DeviceIcon from "../../../public/icons/device.svg";
import PlaystationIcon from "../../../public/icons/playstation5.svg";
import SwitchIcon from "../../../public/icons/switch.svg";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import CardDate from "./card-date";
import { INewRelease } from "@/types/new-release";
import Link from "next/link";
import Image from "next/image";
interface GameCardProps {
  game: INewRelease;
  onClick: VoidFunction;
}

const GameCard = ({ game, onClick }: GameCardProps) => {
  const router = useRouter();

  const getClosestReleaseDate = () => {
    const releases = game?.attributes?.releaseByPlatforms?.release;

    if (!Array.isArray(releases) || releases?.length === 0) {
      return null; // Return null if no release data is found
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Month is 0-based

    // Filter valid release dates and parse them
    const validDates = releases
      ?.map((item) => parseISO(item.releaseDate))
      ?.filter((date) => !isNaN(date.getTime())); // Keep only valid dates

    // Find the closest release date ahead of or equal to the current month/year
    const closestDate = validDates?.reduce((closest: any, date: any) => {
      const dateYear = date.getFullYear();
      const dateMonth = date.getMonth();

      const closestDiff = closest
        ? Math.abs(closest.getFullYear() - currentYear) * 12 +
          Math.abs(closest.getMonth() - currentMonth)
        : Infinity;

      const currentDiff =
        (dateYear - currentYear) * 12 + (dateMonth - currentMonth);

      // Ensure the date is current or ahead
      if (currentDiff >= 0 && currentDiff < closestDiff) {
        return date;
      }

      return closest;
    }, null);

    // Format the date to "day month year"
    if (closestDate) {
      const day = closestDate.getDate(); // Get the day of the month
      const month = String(closestDate.getMonth() + 1).padStart(2, "0"); // Month as 2-digit number
      const year = closestDate.getFullYear();

      console.log(`${month}/${day}/${year}`, "ffff");

      return `${month}/${day}/${year}`;
    }

    return null;
  };

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
    const sortedReleases = releases.sort((a, b) => {
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

    releases?.forEach((release) => {
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
    <div className="relative xx:h-[622px] w-full">
      <CardDate date={getClosestReleaseDate()} top="-10" />

      <Link
        target="_blank"
        href={game?.attributes?.slug && `/game/${game?.attributes?.slug}`}
        className="block" // Ensure the link takes full space
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

      <div className="w-full flex flex-col items-start mt-4">
        <Link
          target="_blank"
          href={game?.attributes?.slug && `/game/${game?.attributes?.slug}`}
          className="block" // Ensure the link takes full space
        >
          <h3
            className="text-base min-[320px]:text-lg font-medium line-clamp-1 w-full cursor-pointer"
            // onClick={onClick}
          >
            {game?.attributes?.title}
          </h3>

          <div className="w-full flex flex-col text-xl md:text-xl text-cWhite-light font-regular capitalize items-start mt-2">
            {getUniqueDeviceNames()?.map((deviceName, index) => (
              <div key={index} className="flex items-center mr-4 mb-2">
                <Image
                  src={
                    game?.attributes?.releaseByPlatforms?.release?.find(
                      (release) =>
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
                      : DeviceIcon) // Default icon URL if no match found
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
        </Link>
      </div>
    </div>
  );
};

export default GameCard;

import { useRouter } from "next/navigation";
import CardPlus from "../../card/card-plus";
import { PiShieldStar } from "react-icons/pi";
import CardReleseDate from "@/components/game-directory/game-directory-card/card-relese-date";
import { IGame } from "@/types/game";
import Image from "next/image";

const RelatedGameCard = ({
  game,
  index,
  visible,
  setVisible,
  selectedGame,
  setSelectedGame,
  token,
  setIsOpenLoginStatus,
}: {
  game: IGame;
  index: number;
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGame: boolean;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  token?: string;
  setUpdatedAnalytics?: any;
  fetchSelectedDevices?: any;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const router = useRouter();
  const { title, slug, coverImage } = game?.attributes;
  const imageData = coverImage?.data?.attributes;

  const releases = game?.attributes?.releaseByPlatforms?.release;

  const getLatestReleaseDate = (releases: any) => {
    const today = new Date();

    const latestRelease =
      releases &&
      releases.reduce((latest: any, current: any) => {
        return new Date(current?.releaseDate) > new Date(latest?.releaseDate)
          ? current
          : latest;
      });

    return new Date(latestRelease?.releaseDate) > today
      ? latestRelease?.releaseDate
      : null;
  };

  const futureReleaseDate = getLatestReleaseDate(releases);
  const handleClickRelatedGames = () => {
    router.push(`/game/${slug}`);
  };
  return (
    <div
      className={`m-auto  relative  z-[${index}]  rounded-[28px] shadow-cShadow-main cursor-pointer `}
    >
      <CardReleseDate
        releaseDate={futureReleaseDate && futureReleaseDate}
        type="related"
      />

      <span onClick={handleClickRelatedGames}>
        <span className="relative">
          {game?.attributes?.editorialAnticipatedRelease && (
            <div className="absolute right-[5px] bottom-[5px]">
              <span
                className="text-[8px] sm:text-[10px] font-semibold flex gap-1 bg-[#02699a] border border-[#00ADFF] px-1 py-0.5  items-center rounded-md w-auto whitespace-nowrap"
                style={{ background: "#00adffcc" }}
              >
                <PiShieldStar size={16} />
                Anticipated
              </span>
            </div>
          )}
          <Image
            src={imageData?.url ? imageData?.url : "/placeholder.png"}
            alt={imageData?.alternativeText || `${title} image`}
            // title={imageData?.alternativeText || `${title} image`}
            width={69}
            height={69}
            className="h-[220px] md:h-[180px] xl:h-[220px] 2xl:h-[280px] xxl:h-[320px] xxxl:h-[390px] w-full z-0 rounded-[14px] object-cover"
          />
        </span>
        <div className=" mt-2 text-center w-full ">
          <p className=" sm:text-base font-medium text-center leading-tight mb-4 sm:mb-8 break-words">
            {title}
          </p>
        </div>
      </span>
      {/* {token && ( */}
      <CardPlus
        game={game}
        visible={visible}
        token={token}
        setVisible={setVisible}
        setSelectedGame={setSelectedGame}
        selectedGame={selectedGame}
        setIsOpenLoginStatus={setIsOpenLoginStatus}
        // style={{
        //   height: "30px",
        //   width: "30px",
        //   top: "-10px",
        //   left: "-10px",
        // }}
      />
      {/* )} */}
    </div>
  );
};

export default RelatedGameCard;

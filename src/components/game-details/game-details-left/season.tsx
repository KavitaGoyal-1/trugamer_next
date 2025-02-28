import React from "react";
import Rating from "../../../../public/icons/rating.svg";
import SectionHeading from "@/components/section-heading";
import Image from "next/image";
interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  game?: any;
  token?: any;
  cardPlusHeight?: number;
  cardPlusWidth?: number;
  title: string;
  gameData: any;
  type?: string;
  handleClickSeasonOrExpansion?: any;
}
const Season: React.FC<IProps> = ({
  handleClickSeasonOrExpansion,
  gameData,
  type,
}) => {
  // Check if expansions or seasons exist and are more than one
  const expansionsAvailable = gameData?.expansions?.data?.length > 0;
  const seasonsAvailable = gameData?.seasons?.data?.length > 0;

  // If no expansions or seasons, return null
  if (!expansionsAvailable && !seasonsAvailable) {
    return null;
  }

  return (
    <div className="w-full bg-[#15182B] rounded-[14px]">
      {/* Render heading only if more than one expansion or season is available */}
      {expansionsAvailable && type === "Expansions" && (
        <SectionHeading title="Expansions" />
      )}
      {seasonsAvailable && type === "Seasons" && (
        <SectionHeading title="Seasons" />
      )}

      <div className="md:p-4 flex overflow-auto gap-[20px] p-3">
        {/* Expansions */}
        {type === "Expansions" &&
          expansionsAvailable &&
          gameData?.expansions?.data?.map(
            (relatedGame: any, index: any) => (
              console.log(relatedGame, "gameData::;;"),
              (
                <div
                  key={index}
                  className="min-w-[129px] w-[129px] "
                  onClick={() =>
                    handleClickSeasonOrExpansion(relatedGame.attributes.slug)
                  }
                >
                  <div className="relative related-games-card-containerw cursor-pointer">
                    <Image
                      src={
                        relatedGame?.attributes?.coverImage?.data?.attributes
                          ?.url
                          ? relatedGame?.attributes?.coverImage?.data
                              ?.attributes?.url
                          : "/placeholder.png"
                      }
                      className="min-w-[129px] w-[129px] h-[194px] rounded-[12px] object-cover"
                      alt="rating"
                      height={100}
                      width={100}
                    />
                    <div className="absolute bottom-[-10px] flex items-center w-full justify-center">
                      <div className="inline-flex gap-[6px] items-center bg-[#39475B] px-2.5 py-0.5 rounded-lg border-[3px] border-[#15182B]">
                        <Image
                          src={Rating}
                          alt="rating"
                          height={18}
                          width={18}
                        />
                        <span className="text-xs font-normal">
                          {!relatedGame?.attributes?.averageRating
                            ? 0
                            : relatedGame?.attributes?.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="flex justify-center text-center text-base font-medium pt-4 leading-5">
                    {relatedGame?.attributes?.title}
                  </span>
                </div>
              )
            )
          )}

        {/* Seasons */}
        {type === "Seasons" &&
          seasonsAvailable &&
          gameData?.seasons?.data?.map((relatedGame: any, index: any) => (
            <div
              key={index}
              className="min-w-[129px] w-[129px]"
              onClick={() =>
                handleClickSeasonOrExpansion(relatedGame.attributes.slug)
              }
            >
              <div className="relative related-games-card-containerw cursor-pointer">
                <Image
                  src={
                    relatedGame?.attributes?.coverImage?.data?.attributes?.url
                      ? relatedGame?.attributes?.coverImage?.data?.attributes
                          ?.url
                      : "/placeholder.png"
                  }
                  alt="rating"
                  className="w-full sm:w-[129px] h-[194px] rounded-[12px] object-cover"
                  height={100}
                  width={100}
                />
                <div className="absolute bottom-[-10px] flex items-center w-full justify-center">
                  <div className="inline-flex gap-[6px] items-center bg-[#39475B] px-2.5 py-0.5 rounded-lg border-[3px] border-[#15182B]">
                    <Image src={Rating} alt="rating" height={18} width={18} />
                    <span className="text-xs font-normal">
                      {!relatedGame?.attributes?.averageRating
                        ? 0
                        : relatedGame?.attributes?.averageRating}
                    </span>
                  </div>
                </div>
              </div>
              <span className="flex justify-center text-center text-base font-medium pt-4 leading-5">
                {relatedGame?.attributes?.title}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Season;

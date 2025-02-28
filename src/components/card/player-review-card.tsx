import Image from "next/image";
import blank_profile from "../../assets/PlayerProfile/blank_profile.webp";
import award from "../../assets/buttonicons/award.png";
interface playerReviewCard {
  review: string;
  review_description: string;
  player: string;
  rating: number;
  playerprofile: string;
}

const playerCard: React.FC<playerReviewCard> = ({
  review,
  review_description,
  player,
  rating,
  playerprofile,
}) => {
  return (
    <div className="bg-[#101A30] p-4 rounded-xl max-w-[596px] sm:w-full md:max-w-[596px] flex flex-col  ">
      <h2
        className="text-start mt-1 text-lg break-all md:text-xl font-semibold"
        style={{
          whiteSpace: "pre-line",
          overflowWrap: "normal",
          wordBreak: "break-all",
          display: "-webkit-box",
          WebkitLineClamp: "1",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {" "}
        {review || "No title"}{" "}
      </h2>

      <h2
        className="text-start mt-[8px] leading-5 text-base md:text-[16px] text-gray-400"
        style={{
          whiteSpace: "pre-line",
          overflowWrap: "normal",
          wordBreak: "break-all",
          display: "-webkit-box",
          WebkitLineClamp: "3",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {" "}
        {review_description || "No Review"}
      </h2>

      <div className="flex col mt-4 justify-between">
        <div className="flex flex-row items-center  gap-2">
          <Image
            src={playerprofile ? playerprofile : blank_profile}
            alt={"profile"}
            title={"profile"}
            className="rounded-full w-[40px] h-[40px]"
          />
          <div className="flex flex-col justify-start items-start">
            <h2 className="font-semibold text-base">{player}</h2>
            <h3 className="text-base text-[#667085]">
              Gave a {rating}/10 rating
            </h3>
          </div>
        </div>
        <div className=" bg-cBlue-light rounded-full w-[86.51px] h-[34.67px] flex flex-row p-2 items-center justify-center">
          <Image
            src={award}
            alt={"award"}
            title={"award"}
            className=" w-[20px] h-[20px] "
            width={20}
            height={20}
          />

          <h2 className="text-base ml-1">{rating}/10</h2>
        </div>
      </div>
    </div>
  );
};
export default playerCard;

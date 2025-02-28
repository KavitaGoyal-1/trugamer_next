import cardNumbersFormater from "@/utills/games/card-numbers-formater";
import Image from "next/image";

const CardPlayed = ({ played }: { played: string }) => {
  let playedFormated = cardNumbersFormater(played);
  return (
    <h3 className="flex mb-[14px] min-w-[200px] max-w-[200px] flex justify-center ">
      <Image
        alt="clock"
        title="clock"
        src="/icons/play.svg"
        width={16}
        height={16}
        className="mr-1"
      />
      <span className="text-base min-[320px]-text-lg md:text-[22px] text-white">
        {playedFormated} Played
      </span>
    </h3>
  );
};
export default CardPlayed;

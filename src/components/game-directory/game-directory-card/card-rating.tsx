import Image from "next/image";

const CardRating = ({ rating }: { rating: number }) => {
  let formatedRating = rating % 1 != 0 ? rating : `${rating}.0`;

  return (
    <div className="w-full flex text-xl md:text-xl text-cWhite-light font-regular capitalize">
      <Image
        alt="star"
        title="star"
        src="/blue-star.svg"
        width={16}
        height={16}
        className="mr-1"
      />
      <span className="text-[14px] min-[320px]:text-base md:text-lg">
        {formatedRating}
      </span>
    </div>
  );
};
export default CardRating;

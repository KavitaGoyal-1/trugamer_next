import { formatReleaseDate } from "@/utills/games/card-dates-formaters";

interface ICardDate {
  date: any;
  top?: string;
  bottom?: string;
  right?: string;
  left?: string;
  classValue?: string;
}
const CardDate = ({
  date,
  top,
  bottom,
  right,
  left,
  classValue,
}: ICardDate) => {
  const releaseDate = formatReleaseDate(date);
  return (
    <span
      className={`${classValue} absolute bg-cPurple-light px-2 py-1 rounded-lg border-cBlack-dark border-4 md:border-[3px] 
                text-cBlack-dark font-medium text-sm min-[320px]-text-lg text-[22px]
    ${top ? `top-[${top}px]` : ""}
    ${bottom ? `bottom-[${bottom}px]` : ""}
    ${right ? `right-[${right}px]` : ""}
    ${left ? `left-[${left}px]` : ""}
    
    `}
      style={{ zIndex: "9", right: "-12px", top: "-15px" }}
    >
      {date}
    </span>
  );
};

export default CardDate;

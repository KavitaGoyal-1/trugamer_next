import Image from "next/image";

interface ICardPlatform {
  name: string;
  img: {
    src: string;
    alt: string;
  };
  top?: string;
  bottom?: string;
  right?: string;
  left?: string;
}
const CardPlatform = ({
  name,
  img,
  top,
  bottom,
  right,
  left,
}: ICardPlatform) => {
  return (
    <span
      className={`
    absolute bg-cPurple-light p-2 rounded-xl border-cBlack-dark border-4 md:border-[6px] 
                text-cBlack-dark font-medium text-base min-[320px]-text-lg md:text-[22px]
    ${top ? `top-[${top}px]` : ""}
    ${bottom ? `bottom-[${bottom}px]` : ""}
    ${right ? `right-[${right}px]` : ""}
    ${left ? `left-[${left}px]` : ""}
    
    `}
    >
      <Image
        src={img.src}
        alt={img.alt}
        title={img.alt}
        width={22}
        height={22}
      />
      <span className="font-regular text-[22px]">{name}</span>
    </span>
  );
};

export default CardPlatform;

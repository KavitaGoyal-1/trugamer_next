import Image from "next/image";

const CardAward = () => {
  return (
    <div
      className=" p-2 rounded-2xl border-cBlack-dark border-4 md:border-[6px] 
        grid absolute bottom-[-25px] right-[15px] bg-cBlue-light"
    >
      <Image
        src="/icons/award.svg"
        alt="Award icon"
        title="Award icon"
        height={28}
        width={28}
      />
    </div>
  );
};

export default CardAward;

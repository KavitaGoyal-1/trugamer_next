import { IBtn } from "@/types/button";
import Link from "next/link";

const LightBlueBtn = ({ hrefString, text, classNames }: IBtn) => {
  return (
    <Link
      href={hrefString ? hrefString : "#"}
      className={`h-[38px] md:h-[50px] font-semibold flex items-center justify-center  bg-cBlue-light hover:bg-cBlue-main text-white text-xs md:text-base py-2 px-3 lg:px-6 rounded-lg cursor-pointer ease-in-out duration-300 capitalize shadow-cShadow-main ${classNames}`}
    >
      {text}
    </Link>
  );
};

export default LightBlueBtn;

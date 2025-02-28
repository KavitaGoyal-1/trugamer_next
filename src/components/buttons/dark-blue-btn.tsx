import { IBtn } from "@/types/button";
import Link from "next/link";
const DarkBlueBtn = ({ hrefString, text }: IBtn) => {
  return (
    <Link
      href={hrefString ? hrefString : "#"}
      className="inline-block bg-transparent border  hover:bg-cBlue-main text-white text-base py-2 px-3 md:py-3 lg:px-6 rounded-lg cursor-pointer ease-in-out duration-300 capitalize shadow-cShadow-main"
    >
      {text}
    </Link>
  );
};

export default DarkBlueBtn;

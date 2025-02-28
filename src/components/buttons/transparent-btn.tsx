import { IBtn } from "@/types/button";
import Link from "next/link";
const TransparentBtn = ({ hrefString, text }: IBtn) => {
  return (
    <Link
      href={hrefString ? hrefString : "#"}
      className="inline-block text-white text-base py-3 px-6 rounded-2xl cursor-pointer ease-in-out duration-300 capitalize
            bg-[#ffffff1a] backdrop-blur-sm shadow-cShadow-main
            "
    >
      {text}
    </Link>
  );
};

export default TransparentBtn;

import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface ISearchProps {
  width?: string;
  text?: string;
  setWord?: Dispatch<SetStateAction<string>>;
}
const Search = ({
  width = "295px",
  text = "Search Games",
  setWord,
}: ISearchProps) => {
  return (
    <div
      className={`w-[${width}] relative h-[48px] backdrop-blur-lg shadow-cShadow-main`}
    >
      <Image
        src="/icons/search.svg"
        alt="search icon"
        width={25}
        height={25}
        className="absolute top-[11px] left-3"
      />
      <input
        type="text"
        placeholder={text}
        className="bg-[#ffffff1a] py-3 pl-12 pr-6  text-[17px] w-full rounded-2xl h-full focus:outline-0 "
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWord && setWord(e.target.value)
        }
      />
    </div>
  );
};

export default Search;

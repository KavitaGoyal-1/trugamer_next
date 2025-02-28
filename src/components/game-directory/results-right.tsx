import Image from "next/image";

const ResultsRight = () => {
  return (
    <>
      <div className="gap-4 ">
        <div className="hidden lg:flex gap-2 2xl:gap-4 items-center justify-center mb-3 mt-1 lg:mb-3 w-full">
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full "
            alt="played game"
            title="played game"
            width={25}
            height={24}
          />
          <span className="flex gap-1 2xl:gap-3 font-semibold text-base 2xl:text-lg">
            {" "}
            <Image
              src="/icons/filters.svg"
              className=" w-6 h-6"
              alt="played game"
              title="played game"
              width={25}
              height={24}
            />
            Filters
          </span>
          <Image
            src="/gameCalender/DividerSmal.png"
            className=" w-full  ml-6 rotate-180 "
            alt="played game"
            title="played game"
            width={25}
            height={24}
          />
        </div>
      </div>
    </>
  );
};

export default ResultsRight;

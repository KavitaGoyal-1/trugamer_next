import Image from "next/image";

interface ISortByBtn {
  text?: string;
}
const SortByBtn = ({ text = "Sort By" }: ISortByBtn) => {
  return (
    <div className=" inline-block bg-[#ffffff1a] flex py-[10px] px-[16px] rounded-2xl cursor-pointer ease-in-out duration-300 shadow-cShadow-main">
      <Image
        src="/burger.svg"
        alt="filter icon"
        title="filter icon"
        width={20}
        height={20}
        className="mr-1"
      />

      <span className="capitalize font-normal	 text-[17px]">{text}</span>

      <Image
        src="/arrow-down.svg"
        alt="filter icon"
        title="filter icon"
        width={20}
        height={20}
        className="ml-1"
      />
    </div>
  );
};

export default SortByBtn;

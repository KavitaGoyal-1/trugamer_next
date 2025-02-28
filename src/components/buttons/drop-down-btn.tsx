import Image from "next/image";

interface IDropdownBtn {
  text: string;
  img?: string;
}
const DropDownBtn = ({ text, img = "/arrow-down.svg" }: IDropdownBtn) => {
  return (
    <div className="ml-2 inline-block h-[45px] statusbtn flex-nowrap flex-row bg-cBlue-special hover:bg-cBlue-extraLight flex py-[10px] px-[16px] rounded-2xl cursor-pointer ease-in-out duration-300 shadow-cShadow-main">
      <span className="capitalize font-normal	 text-[17px]">{text}</span>
      <Image
        src={img}
        alt="icon"
        title="icon"
        width={20}
        height={20}
        className="ml-1"
      />
    </div>
  );
};

export default DropDownBtn;

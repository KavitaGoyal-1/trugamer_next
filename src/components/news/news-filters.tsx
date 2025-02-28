import React, { FC, SetStateAction } from "react";
import { IoMdTimer } from "react-icons/io";
import { getToken } from "@/utills/cookies";
import { useRouter } from "next/router";
import { DropdownItem, DropdownWrapper } from "../dropdown";

const tags = [
  {
    name: "Latest",
    icon: () => <IoMdTimer />,
    sortBy: "latest",
  },
];

interface IProps {
  setSortBy: React.Dispatch<SetStateAction<string>>;
  sortBy: string;
  setIsOpenLogin: any;
}

const NewsFilters: FC<IProps> = ({ setSortBy, sortBy, setIsOpenLogin }) => {
  const router = useRouter();
  const token = getToken();

  const handleSortBy = (sort: string) => {
    setSortBy(sort);
  };

  const handleNavigateToSubmitArticle = () => {
    if (token) {
      router.push("/news/create");
    } else {
      localStorage.setItem("Revisedslug", "/news/create");
      setIsOpenLogin(true);
    }
  };

  return (
    <div className=" h-10 flex justify-between items-center">
      <div className="md:flex items-center hidden gap-3 ">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center ${
              tag.sortBy == sortBy ? "bg-cBlue-light" : "bg-cBlue-light"
            } rounded-lg px-2 py-1 cursor-pointer`}
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                handleSortBy(tag.sortBy == sortBy ? "" : tag.sortBy)
              }
            >
              {tag.icon()}
              <span className="ml-2">{tag.name}</span>
            </div>
          </div>
        ))}
        {/* {token ? (
          <div className="flex justify-start items-center ">
            <span className="hidden xl:block bg-white h-[30px] w-[1px] mx-4" />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#ffffff1a] rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cBlue-light"></div>
              <span className="ml-3 text-xl text-white font-medium">
                My devices
              </span>
            </label>
          </div>
        ) : null} */}
      </div>
      <div className="flex gap-3 justify-end md:w-fit w-full">
        {/* <div className="md:w-fit sm:w-[80%] dropmenubar">
          <DropdownWrapper
            title={
              <div className="flex items-center sm:p-2 gap-3 w-full">
                <img
                  src="/hamburger.png"
                  alt="filter icon"
                  title="filter icon"
                  width={30}
                  height={30}
                  className=""
                />
                <p>News</p>
              </div>
            }
            menuClassName="!bg-[#22232E] dropmenubar"
            wrapperClassName="w-full"
            buttonClassName="!bg-gray-800 !rounded-2xl w-full !p-3 !h-12"
          >
            <DropdownItem className="text-white hover:bg-[#25242d]">
              News
            </DropdownItem>
            <DropdownItem className="text-white hover:bg-[#25242d]">
              Others
            </DropdownItem>
          </DropdownWrapper>
        </div> */}
        <div className="block dropmenubar md:hidden w-[20%]">

          {/*comment by me */}
          {/* <DropdownWrapper
            title={
              <div className="flex items-center sm:p-2 gap-3">
                <img
                  src="/hamburger.png"
                  alt="filter icon"
                  title="filter icon"
                  width={30}
                  height={30}
                  className=""
                />
              </div>
            }
            showDown={false}
            menuClassName="!bg-[#22232E] "
            buttonClassName="!bg-gray-800 !rounded-2xl !p-3 !h-12"
          >
            <DropdownItem
              className="text-white hover:bg-[#25242d]"
              onClick={handleNavigateToSubmitArticle}
            >
              Submit Article
            </DropdownItem>
          </DropdownWrapper> */}
        </div>
        <button
          onClick={handleNavigateToSubmitArticle}
          className=" bg-cBlue-light px-2 py-1 rounded-2xl md:block hidden"
        >
          Submit Article
        </button>
      </div>
    </div>
  );
};

export default NewsFilters;

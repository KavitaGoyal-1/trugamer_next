import { getToken } from "@/utills/cookies";
import DarkBlueBtn from "../buttons/dark-blue-btn";
import LightBlueBtn from "../buttons/light-blue-btn";
import HeaderUserItems from "../layouts/header-user-Items";

const DirectoryPublicNavigation = () => {
  const token = getToken();
  return (
    <header className="absolute w-full xl:px-[8%] lg:px-[3%] px-[5%] top-[15px] right-0 left-0 flex flex-col md:flex-row justify-between items-center max-w-[2550px] mx-auto z-10">
      <div className="flex justify-start items-center md:mb-0 mb-5">
        <span className="hidden lg:block text-white font-bold capitalize text-[44px] text-start">
          New Releases
        </span>
        <span className="hidden lg:block bg-white h-[30px] w-[1px] mx-4" />
        <div className="flex ">
          <span className="text-cPurple-light font-semibold hover:cursor-pointer">
            Explore
          </span>
          <span className="font-semibold ml-[24px] hover:cursor-pointer">
            New Releases
          </span>
        </div>
      </div>
      {token ? (
        <HeaderUserItems />
      ) : (
        <div className="grid grid-cols-[max-content_max-content] gap-2">
          <DarkBlueBtn text="log in" href="/auth/sign-in" />
          <LightBlueBtn text="Create an Account" href="/auth/sign-up" />
        </div>
      )}
    </header>
  );
};

export default DirectoryPublicNavigation;

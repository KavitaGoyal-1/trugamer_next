import DarkBlueBtn from "../buttons/dark-blue-btn";
import LightBlueBtn from "../buttons/light-blue-btn";
import Search from "../search";
import Image from "next/image";
import { useRouter } from "next/router";

const UnAuthenticatedNavigation = () => {
  const router = useRouter();
  return (
    <header
      className="absolute w-full px-[5%] lg:px-[10%] top-[20px] right-0 left-0
    flex flex-col md:flex-row justify-between items-center
    max-w-[2550px] mx-auto z-[100]
    "
    >
      <div className="flex justify-start 	items-center">
        <Image
          src="/logo.svg"
          alt="Trugamer logo"
          title="Trugamer logo"
          width={100}
          height={50}
          className="h-[44px] w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
        {/* <span className="hidden lg:block bg-white h-[30px] w-[1px] mx-4"></span>
        <ul className="flex gap-4 mr-4 max-lg:hidden">
          <li>
            <a className="text-white text-base font-semibold">Explore</a>
          </li>
          <li>
            <a className="text-white text-base font-semibold">Release</a>
          </li>
        </ul> */}
        <div className="ml-2">
          <Search text="Discover New Games" />
        </div>
      </div>

      <div className="grid grid-cols-[max-content_max-content] gap-2 ml-2">
        <DarkBlueBtn text="log in" href="/auth/sign-in" />
        <LightBlueBtn text="Create an Account" href="/auth/sign-up" />
      </div>
    </header>
  );
};

export default UnAuthenticatedNavigation;

// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import DarkBlueBtn from "../buttons/dark-blue-btn";
import LightBlueBtn from "../buttons/light-blue-btn";
import HeaderUserItems from "./header-user-Items";
import React, { useEffect, useRef, useState } from "react";
import Search from "../search";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import SearchHeader from "../search-header";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Circle } from "rc-progress";
import axios from "axios";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import { setProgressState } from "@/store/slices/progress-slice";
import {
  storeHeaderToggle,
  storeOutsideToggle,
} from "@/store/slices/auth-slice";
import MobileMenuItems from "./mobile-menu-items";
import Image from "next/image";

const routingArray = [
  {
    title: "Game Library",
    route: "/game-library",
    destination: "/game-library",
  },
  { title: "Dashboard", route: "/dashboard", destination: "/dashboard" },
  { title: "Account", route: "/profile", destination: "/profile" },
  {
    title: "Favourite Games",
    route: "/favourite-games",
    destination: "/favourite-games",
  },
  {
    title: "Game Calendar",
    route: "/",
    destination: "/game-calendar",
  },
  { title: "Video Game News", route: "/", destination: "/news" },
  { title: "Profile", route: "/profile", destination: "/profile" },
];

interface IProps {
  text?: string | string[];
  token?: string;
  isLandingPage?: boolean;
  notscroll?: boolean;
}

const NavigationPublic = ({
  text,
  token,
  isLandingPage,
  notscroll,
}: IProps) => {
  const {
    progressPercent,
    totalUploadGames,
    pendingUploadGames,
    openUploadProgressModal,
    estimatedTime,
  } = useSelector((state: any) => state.progress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const user = useSelector((state: any) => state?.authState?.userData);
  const userId = user?.id;
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search box
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const total = 100; // Total value for progress (assuming percentage)

  const progress = 50; // Set the percentage value dynamically if needed

  const toggleSearchBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleRoutes = (text: string) => {
    const currentPath = routingArray.find((route) => route?.title === text);
    if (currentPath) {
      router.push(currentPath.destination);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false); // Closes the menu directly
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (notscroll) {
      return;
    } else {
      const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const getBackgroundColor = () => {
    const opacity = Math.min(scrollPosition / 70, 1);
    return `rgba(16, 24, 40, ${opacity})`;
  };

  const toggleMobile = () => {
    dispatch(storeHeaderToggle(true));
  };

  const toggleCloaseMobile = () => {
    dispatch(storeOutsideToggle(false));
  };
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60); // Get full minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`; // Format as MM:SS
  };

  useEffect(() => {
    const savedProgressState = localStorage.getItem("progressState");
    let interval: NodeJS.Timeout;

    if (savedProgressState) {
      const progressState = JSON.parse(savedProgressState);
      dispatch(setProgressState(progressState));

      if (
        progressState.openUploadProgressModal &&
        progressState.progressPercent < 100
      ) {
        interval = setInterval(async () => {
          try {
            const progressResponse = await axios.post(
              `${getApi()}/steam/sync-progress`,
              { userId: { id: user?.id } },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (progressResponse.status === 200) {
              const { totalGames, processedGames, progress, estimatedTime } =
                progressResponse.data;

              const currentProgressState = {
                progressPercent: progress,
                totalUploadGames: totalGames,
                pendingUploadGames: processedGames,
                estimatedTime: estimatedTime,
                openUploadProgressModal: true,
              };

              dispatch(setProgressState(currentProgressState));
              localStorage.setItem(
                "progressState",
                JSON.stringify(currentProgressState)
              );

              if (progress >= 100) {
                clearInterval(interval);
                const completedProgressState = {
                  openUploadProgressModal: false,
                  progressPercent: 0,
                  pendingUploadGames: 0,
                  totalUploadGames: 0,
                  estimatedTime: 0,
                };
                toastMessage("success", "Games uploaded successfully");
                dispatch(setProgressState(completedProgressState));
                localStorage.setItem(
                  "progressState",
                  JSON.stringify(completedProgressState)
                );
              }
            }
          } catch (progressError) {
            clearInterval(interval);
            localStorage.removeItem("progressState");
            toastMessage("error", "Failed to sync progress.");
          }
        }, 3000); // Adjust interval as needed
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [user, token]);
  return (
    <React.Fragment>
      {isOpen ? (
        <div
          className={`flex flex-col bg-[#090A17] w-full h-fit delay-500 transition-all fixed top-0 bottom-0 right-0 z-50`}
        >
          <div className="flex justify-between border-b border-b-[#F9FAFB1A] px-[30px] py-[20px] items-center">
            <Image
              src="/logo.svg"
              alt="Trugamer logo"
              title="Trugamer logo"
              width={100}
              height={50}
              className="h-[44px] w-auto"
              onClick={() => {
                router.push("/");
              }}
            />
            <RxCross2 className="w-6 h-6" onClick={toggleMenu} />
          </div>
          <div className="mt-[24px] flex flex-col items-center border-b-[2px] border-b-[#F9FAFB1A] pb-9">
            <div className="max-[500px]:w-[90%] w-[80%] ">
              <Search />
            </div>
            {typeof text === "string" ? (
              <div className="flex justify-between items-center w-[91%] w-[81%] mt-[20px]">
                <p className="text-[16px]" onClick={() => handleRoutes(text)}>
                  {text}
                </p>
                <Image
                  src="/arrowRight.png"
                  alt="arrow"
                  title="arrow"
                  className="w-[14px] h-[14px]"
                  width={14}
                  height={14}
                />
              </div>
            ) : (
              text?.map((text, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center w-[91%] w-[81%] mt-[20px]"
                >
                  <p className="text-[16px]" onClick={() => handleRoutes(text)}>
                    {text}
                  </p>
                  <Image
                    src="/arrowRight.png"
                    alt="arrow"
                    title="arrow"
                    className="w-[14px] h-[14px]"
                    width={14}
                    height={14}
                  />
                </div>
              ))
            )}
          </div>
          <div className="mt-[24px] max-[500px]:justify-center flex flex-col items-center mb-[24px]">
            <div className="w-[100%] flex justify-center">
              {token ? (
                <div className="flex justify-center w-full">
                  <MobileMenuItems />
                </div>
              ) : (
                <div className="flex gap-2 max-[500px]:flex-col justify-center max-[500px]:w-[90%] w-full">
                  <DarkBlueBtn text="log in" hrefString="/sign-in" />
                  <LightBlueBtn
                    text="Create an Account "
                    hrefString="/sign-up"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <header
          style={{
            background: isLandingPage
              ? "linear-gradient(90deg, rgb(8 19 36) 0%, rgb(8 24 41) 28.19%, rgb(9 17 31) 52.74%, rgb(8 23 41) 78.09%, rgb(9 18 33) 100%)"
              : getBackgroundColor(),
          }}
          className={`fixed bg-black py-3 md:py-4 w-full px-[5%] lg:px-[10%] h-[72px] md:h-auto top-0 right-0 left-0 flex justify-between items-center mx-auto z-[9999] shadow-[0px_8px_24px_0px_#0000000D] ${
            isLandingPage ? "border-b border-[#404e624d] " : ""
          }`}
        >
          <div className="flex justify-start items-center gap-2 sm:gap-4">
            <span
              className="flex md:hidden cursor-pointer"
              onClick={toggleMobile}
            >
              {isToggle ? (
                <>
                  <Image
                    src="/icons/menu.png"
                    alt="menu icon"
                    className="w-7 h-7"
                    width={28}
                    height={28}
                  />
                </>
              ) : (
                <>
                  <RxHamburgerMenu size={28} />
                </>
              )}
            </span>

            <span onClick={toggleCloaseMobile}>
              <Link href={"/"}>
                <Image
                  src="/logo.svg"
                  alt="Trugamer logo"
                  width={100}
                  height={50}
                  className="h-[30px] sm:h-[38px] md:h-[44px] w-auto cursor-pointer"
                  onClick={() => router.push("/")}
                />
              </Link>
            </span>
          </div>

          <div className="hidden md:flex">
            <SearchHeader />
          </div>
          {/* {uploadPercentage && token &&} */}
          <div className="flex items-center gap-2 ">
            {typeof progressPercent === "number" && progressPercent > 0 && (
              <span onClick={() => router.push("/import-wizard")}>
                <div className="relative  header-progress">
                  {/* Circular Progress Bar */}
                  <div className="circle-heade cursor-pointer">
                    <Circle
                      percent={progressPercent}
                      strokeWidth={8}
                      strokeColor="#2db7f5"
                      className="cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[8px] md:text-[10px]">
                      {progressPercent}%
                    </div>
                  </div>
                  {/* Dropdown on Hover */}
                  <div className="header-drop absolute left-1/2 -translate-x-1/2 top-14 bg-[#15182B] text-white p-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-64">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-[#15182B] rotate-45"></div>

                    <p className="text-sm">
                      <span className="font-normal text-base">
                        Total Game Uploads:
                      </span>{" "}
                      <span className="text-xs font-light text-[#9DACEC]">
                        {pendingUploadGames} / {totalUploadGames}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-normal text-base">Time Left:</span>{" "}
                      <span className="text-xs font-light text-[#9DACEC]">
                        {estimatedTime > 60
                          ? formatTime(estimatedTime)
                          : `${estimatedTime} seconds`}

                        {/* Convert estimated time to MM:SS */}
                      </span>
                    </p>
                  </div>
                </div>
              </span>
            )}
            <span className="cursor-pointer flex">
              {token && (
                <Image
                  src="/icons/Notification.svg"
                  alt="Notification logo"
                  // title="Notification logo"
                  width={24}
                  height={24}
                  className="h-[24px] w-auto me-3 flex"
                />
              )}
              <span onClick={toggleCloaseMobile}>
                <FiSearch
                  size={24}
                  className="text-white flex md:hidden mr-2"
                  onClick={toggleSearchBox}
                />
              </span>
            </span>

            {token ? (
              <span onClick={toggleCloaseMobile}>
                <HeaderUserItems />
              </span>
            ) : (
              <div
                className="grid grid-cols-[max-content_max-content] gap-3"
                onClick={toggleCloaseMobile}
              >
                <DarkBlueBtn text="log in" hrefString="/sign-in" />
                <LightBlueBtn
                  classNames="max-md:hidden"
                  text="Create an Account"
                  hrefString="/sign-up"
                />
              </div>
            )}
          </div>
        </header>
      )}
      {isSearchOpen && (
        <div
          className="fixed top-[72px] right-0 left-0 shadow-lg z-[998] p-4"
          style={{
            background: isLandingPage
              ? "linear-gradient(90deg, rgb(8, 19, 36) 0%, rgb(8, 24, 41) 28.19%, rgb(9, 17, 31) 52.74%, rgb(8, 23, 41) 78.09%, rgb(9, 18, 33) 100%)"
              : getBackgroundColor(),
          }}
        >
          <div className="flex md:hidden">
            <SearchHeader />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default NavigationPublic;

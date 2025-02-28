import React, { useEffect, useRef, useState } from "react";
import LightBlueBtn from "../buttons/light-blue-btn";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getToken } from "@/utills/cookies";
import Welcome from "../welcome/welcome";
import WelcomeOne from "../welcome/welcome-one";
import WelcomeTwo from "../welcome/welcome-two";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import LoginModal from "../login-modal/login-modal";
import LoginModalStatusBG from "../login-modal/login-modal-status-bg";
import HowItWorksDrawer from "../how-it-works-drawer";
import NewVerticalNavigation from "../vertical-navigation/new-vertical-navigation";
import Image from "next/image";

interface IProps {
  token?: string;
}

const HeroSection = ({}: IProps) => {
  const [animate, setAnimate] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenWel, setIsOpenWel] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const [isOpenWelcomeOne, setIsOpenWelcomeOne] = useState(false);
  const [isOpenWelcomeTwo, setIsOpenWelcomeTwo] = useState(false);
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const token = getToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalDetails, setTotalDetails] = useState<any>("");
  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   // Fetch reviews from the API
  //   const fetchTotals = async () => {
  //     try {
  //       const response = await axios.get(`${getApi()}/reports/all`);
  //       setTotalDetails(response.data);
  //     } catch (error) {
  //       console.error("Error fetching details:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTotals();
  // }, []);

  // Data array for stats section
  const statsData = [
    {
      imgSrc: "/home/home3.svg",
      title: loading ? "0" : totalDetails?.totalGameCount?.toLocaleString(), //totalDetails?.totalGameCount?
      description: "Total number of Games",
    },
    {
      imgSrc: "/home/home2.svg",
      title: loading ? "0" : totalDetails?.totalArticleReport?.toLocaleString(),
      description: "Total number of News Articles",
    },
    {
      imgSrc: "/home/home1.svg",
      title: loading ? "0" : totalDetails?.totalGameRating,
      description: "Total number of Reviews",
    },
  ];
  useEffect(() => {
    // Start the animation when the component mounts
    setAnimate(true);
  }, []);

  const openWelcomeOne = () => {
    setIsOpenWelcomeOne(true); // Open the WelcomeOne modal
    setIsOpenWel(false); // Close the Welcome modal
  };

  const openWelcomeTwo = () => {
    setIsOpenWelcomeTwo(true); // Open the WelcomeOne modal
    setIsOpenWel(false);
    setIsOpenWelcomeOne(false); // Close the Welcome modal
  };

  // const openLoginModal = () => {
  //   setIsOpenLogin(true); // Open the WelcomeOne modal
  // };

  // Handle disabling/enabling body scroll
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Cleanup when component unmounts
    };
  }, [isDrawerOpen]);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const handleCloseWel = () => setIsOpenWel(false);

  const closeWelcomeOne = () => {
    setIsOpenWelcomeOne(false);
  };
  const closeWelcomeTwo = () => {
    setIsOpenWelcomeTwo(false);
  };
  const handleOpenWel = () => setIsOpenWel(true);

  const handleCloseLogin = () => setIsOpenLogin(false);

  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);

  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
          // Dispatch action to close sidebar (if managed via Redux)
          console.log("Clicked outside");
          // Alternatively, use local state to manage `isToggle` and update here
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);

  useEffect(() => {
    // Utility to check if any modal is open
    const isAnyModalOpen = isOpenLogin || isOpenLoginStatus;

    // Toggle body overflow
    document.body.style.overflow = isAnyModalOpen ? "hidden" : "";

    return () => {
      // Cleanup to reset overflow when component unmounts
      document.body.style.overflow = "";
    };
  }, [isOpenLogin, isOpenLoginStatus]);

  return (
    <>
      <div className="w-[80%] mx-auto flex absolute right-0 left-0">
        {/* <button
          type="button"
          className="top-24 absolute"
        >
          {" "}
          Welcome{" "}
        </button> */}

        {!isDrawerOpen && (
          <div
            className={`bg-[url("/home/how_its_work.png")] w-[113px] h-[30px] md:w-[204px] md:h-[56px] cursor-pointer flex items-center justify-center bg-center bg-cover bg-no-repeat absolute right-0 z-[1] ${
              animate
                ? "translate-y-[70px] md:translate-y-[80px]"
                : "translate-y-0"
            }`}
            style={{
              transition: "transform 4s ease-in-out", // Custom 3-second transition
            }}
            onClick={handleOpenDrawer}
          >
            <span className="font-semibold md:font-bold text-[10px] md:text-[16px]">
              How it Works
            </span>
          </div>
        )}
      </div>

      <div
        className={
          isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
        }
        // max-md:hidden max-md
        ref={navRef}
      >
        <NewVerticalNavigation token={token} />
      </div>
      <section className="  bg-cover bg-no-repeat bg-top grid">
        <div className="w-[90%] md:w-[80%] mx-auto flex items-center mt-28 md:mt-36">
          <Image
            src="/home-logo.svg"
            alt="home icon"
            className="w-[70px] h-[78px] md:w-[105px] md:h-[120px] 2xl:w-[135px] 2xl:h-[150px] object-cover"
            width={70}
            height={78}
          />
          <div className="text-start ps-2 md:ps-6 mt-5">
            <Image
              src="/home-hero-title.svg"
              alt="trugamer logo"
              // title="trugamer logo"
              className="w-[86px] h-[15px] md:w-[102px] md:h-[18px] 2xl:w-[132px] 2xl:h-[24px] object-cover"
              width={86}
              height={15}
            />
            <h1 className="font-primary font-bold text-start text-[16px] md:text-[28px] 2xl:text-[36px] text-white mt-2">
              The Ultimate Gaming Platform
            </h1>
            <span className="text-[12px] md:text-[16px] 2xl:text-[20px] tracking-wider">
              Play Queues | Game Library | Release Calendar | Latest News |
              +More
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-[92%] md:w-[80%] mx-auto flex mt-5 mb-10 md:mb-20 flex-col ">
          <span className="flex">
            {statsData.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="flex items-start md:items-center justify-center gap-1 md:gap-4">
                  <Image
                    src={stat.imgSrc}
                    alt="trugamer logo"
                    // title="trugamer logo"
                    className="object-contain w-6 h-6 md:w-14 md:h-12"
                    width={24}
                    height={24}
                  />
                  <div>
                    <h4 className="text-[18px] md:text-[22px] 2xl:text-[28px] font-medium leading-[22px] md:leading-8">
                      {stat.title}
                    </h4>
                    <p className="text-[10px] md:text-sm font-medium text-[#C1C9EDCC]">
                      {stat.description}
                    </p>
                  </div>
                </div>
                {index < statsData.length - 1 && (
                  <span className="mx-2 md:mx-5">
                    <Image
                      src="/home/Line.svg"
                      alt="divider"
                      title="divider"
                      className="object-cover"
                      width={20}
                      height={20}
                    />
                  </span>
                )}
              </React.Fragment>
            ))}
          </span>

          <span className="flex mt-5 gap-4">
            {!token && (
              <>
                <LightBlueBtn hrefString="/sign-up" text="Create an account" />
                <Link
                  href="/sign-in"
                  className="text-xs flex items-center justify-center md:text-base border border-[#00ADFF] h-[38px] md:h-12 rounded-lg px-3 md:px-8 py-1.5 md:py-2.5"
                >
                  Log In
                </Link>
              </>
            )}
          </span>
        </div>
      </section>

      <HowItWorksDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />

      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />

      <Welcome
        isOpenWel={isOpenWel}
        onCloseWel={handleCloseWel}
        onNext={openWelcomeOne}
      />
      <WelcomeOne
        isOpenWel={isOpenWelcomeOne}
        onClose={closeWelcomeOne}
        onNext={openWelcomeTwo}
      />
      <WelcomeTwo
        isOpenWel={isOpenWelcomeTwo}
        onClose={closeWelcomeTwo}
        onNext={""}
      />
    </>
  );
  ("");
};

export default HeroSection;

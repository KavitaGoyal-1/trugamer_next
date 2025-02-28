import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Footer from "@/components/layouts/footer";
import FooterDetailed from "@/components/layouts/footer-detailed";
import NavigationPublic from "@/components/layouts/navigation-public";
import { getToken } from "@/utills/cookies";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import Image from "next/image";
const Manifesto = () => {
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const token = getToken();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className='min-h-screen w-full  bg-[url("/home/manifestoss-min.png")] bg-center bg-auto bg-no-repeat mx-auto overflow-x-hidden'>
      <NavigationPublic text={["Game Calendar"]} token={token} />

      <div
        className={
          isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
        }
        ref={navRef}
      >
        <NewVerticalNavigation token={token} />
      </div>

      <div className="flex flex-col gap-[52px] 2xl:gap-[54px] mt-[110px] 2xl:mt-[108px] mb-[109px] 2xl:mb-[209px] items-center">
        <div className="w-[80%]">
          <Image
            src="/manifesto.svg"
            className="w-full max-w-[250px] 2xl:max-w-[380px] mx-auto h-24 2xl:h-36"
            alt="manifesto"
            title="manifesto"
            width={250}
            height={144}
          />
        </div>

        <div className="flex flex-col gap-4 2xl:gap-6 text-start text-[18px] md:text-[20px] 2xl:text-[26px] font-roboto uppercase leading-[36px] 2xl:leading-[46px] mx-auto w-[90%] md:w-[80%]">
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">O</span>ur mission is
            to build the largest community of gamers in the world...
          </p>
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">W</span>e will build
            the best platform for hardcore gamers by consistently deploying
            features we actually want...
          </p>
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">T</span>his will not
            happen overnight...we are committed to the long-term, and we will
            not stop until we have built the best platform for hardcore gamers
            run by hardcore gamers...
          </p>
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">I</span>f you love
            video games and are interested in helping us build the largest
            gaming community in the world, we ask that you join us...
          </p>
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">J</span>oin us as we
            build the best video game website ever built...
          </p>
          <p>
            <span className="text-[22px] 2xl:text-[35px] ">C</span>reate an
            account...join our discord...join our community...
          </p>

          {/* <span>
            <span className="text-[22px] 2xl:text-[35px] ">J</span>oin the rebels
          </span> */}

          <div className="flex flex-col">
            <span>
              <span className="text-[22px] 2xl:text-[35px] ">R</span>eplikent
            </span>
            <span>
              <span className="text-[22px] 2xl:text-[35px] ">F</span>ounder of{" "}
              <span className="text-[22px] 2xl:text-[35px] ">T</span>rugamer
            </span>
          </div>
        </div>
      </div>

      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block">
        <FooterDetailed />
      </div>
    </div>
  );
};

export default Manifesto;

// import { PropsWithChildren } from "react";
// import { Swiper } from "swiper/react";

// interface CustomCarouselProps extends PropsWithChildren {
//   spaceBetween?: number;
// }

// const CustomCarousel = ({
//    children,
// }: CustomCarouselProps) => {
//   return (
//     <Swiper
//       spaceBetween={30}
//       loop={false}
//       slidesPerView={"auto"}

//       className="mySwiperMargin latest-gaming-news relative w-full pl-[10px] 2xl:pl-[0%] pt-0 md:pt-12"

//     >

//       {children?children:""}
//      </Swiper>
//   );
// };

// export default CustomCarousel;

import { PropsWithChildren, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CustomCarouselProps extends PropsWithChildren {
  spaceBetween?: number;
  setIsLastTGame?: any;
}

const CustomCarousel = ({ children, setIsLastTGame }: CustomCarouselProps) => {
  useEffect(() => {
    // Ensure Swiper correctly initializes navigation buttons
    const nextButton = document.querySelector(".custom-next-new");
    const prevButton = document.querySelector(".custom-prev-new");
    if (nextButton && prevButton) {
      nextButton.classList.add("swiper-button-next");
      prevButton.classList.add("swiper-button-prev");
    }
  }, []);

  const handleSlideChange = (swiper: any) => {
    setIsLastTGame(swiper?.isEnd); // Update the last slide state
  };

  return (
    <div className="relative w-full">
      {/* <CustomCarousel spaceBetween={30}> */}
      <div className="absolute top-[109px] md:top-[185px] left-[-25px] md:left-[-30px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
        <span className="bg-[#ccc] !w-8 !h-8 rounded-full p-1 md:p-2 flex items-center justify-center custom-prev-new">
          {" "}
          <FaChevronLeft className=" w-4 h-4 sm:w-5 sm:h-5" size={22} />{" "}
        </span>
      </div>

      {/* Right Arrow */}
      <div className="absolute top-[109px] md:top-[185px] right-[0px] md:right-[0px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
        <span className="bg-[#ccc] !w-8 !h-8  rounded-full p-1 md:p-2 flex items-center justify-center custom-next-new">
          {" "}
          <FaChevronRight className=" w-4 h-4 sm:w-5 sm:h-5" size={22} />{" "}
        </span>
      </div>

      <Swiper
        spaceBetween={30}
        loop={false}
        slidesPerView={"auto"}
        navigation={{
          nextEl: ".custom-next-new",
          prevEl: ".custom-prev-new",
        }}
        modules={[Navigation]}
        onSlideChange={handleSlideChange} // Add slide change listener
        className="mySwiperMargin latest-gaming-news relative w-full pl-[0px] 2xl:pl-[0%] pt-0 md:pt-2"
      >
        {children}
      </Swiper>
    </div>
  );
};

export default CustomCarousel;

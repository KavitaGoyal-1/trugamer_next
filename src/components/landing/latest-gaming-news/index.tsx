import { useEffect, useState } from "react";
import { News } from "@/types/news";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomCarousel from "../../custom-carousel";
import { Navigation } from "swiper/modules";
import LightBlueBtn from "../../buttons/light-blue-btn";
import HomeSubtitle from "../home-subtitle";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import LatestGamingNewsCard from "@/components/card/latest-gaming-news-card";
import ShadowLeft from "@/components/carousel/shadow-left";
import ShadowRight from "@/components/carousel/shadow-right";

interface LatestGameNewsProps {
  latestGamingNewsData?: News[];
}

const LatestGamingNews = ({ latestGamingNewsData }: LatestGameNewsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleNavigation = (e: any, gamingNews: any) => {
    e.stopPropagation(); // Prevent propagation if needed
    router.push(`/news/${gamingNews.slug}`);
  };

  useEffect(() => {
    // Ensure navigation buttons are correctly attached
    const nextButton = document.querySelector(".swiper-button-next-news");
    const prevButton = document.querySelector(".swiper-button-prev-news");
    if (nextButton && prevButton) {
      nextButton.classList.add("swiper-navigation-active");
      prevButton.classList.add("swiper-navigation-active");
    }
  }, []);

  return (
    <>
      <section className="mt-4 md:mt-20 flex flex-col gap-[20px] md:gap-[30px] mx-0 md:mx-auto w-full h-full overflow-x-hidden">
        <div className="flex items-center justify-start md:justify-between w-[90%] md:w-[81%] mx-auto details-gradient relative pb-3">
          <div className="flex justify-center md:justify-start">
            <HomeSubtitle text="Latest Gaming News " />
          </div>
          <div className="row-start-4 md:row-start-1 row-end-5 md:row-end-2 col-start-1 md:col-start-2 col-end-2 col-end-3 max-md:hidden">
            {latestGamingNewsData && latestGamingNewsData?.length > 5 && (
              <LightBlueBtn hrefString="/news" text={"See All"} />
            )}
          </div>
        </div>
        <div className="relative w-full sm:pb-24 pb-0 z-20 pl-[20px] md:pl-[10%] 2xl:pl-[9.5%]">
          <ShadowLeft tag="latestGamingNews" />
          <ShadowRight />
          <div className="relative">
            {/* <CustomCarousel spaceBetween={30}> */}
            <div className="absolute top-1/2 left-[-25px] md:left-[-30px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
              <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-prev-news">
                {" "}
                <FaChevronLeft
                  className=" w-4 h-4 sm:w-5 sm:h-5"
                  size={22}
                />{" "}
              </span>
            </div>

            {/* Right Arrow */}
            <div className="absolute top-1/2 right-[0px] md:right-[0px] z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
              <span className="bg-[#ccc] w-8 h-8 md:w-8 md:h-8 rounded-full p-1 md:p-2 flex items-center justify-center swiper-button-next-news">
                {" "}
                <FaChevronRight
                  className=" w-4 h-4 sm:w-5 sm:h-5"
                  size={22}
                />{" "}
              </span>
            </div>

            <Swiper
              spaceBetween={30}
              className="!pr-0"
              slidesPerView={4}
              loop={false}
              navigation={{
                nextEl: ".swiper-button-next-news",
                prevEl: ".swiper-button-prev-news",
              }}
              modules={[Navigation]}
              breakpoints={{
                2120: {
                  slidesPerView: 4.8,
                  spaceBetween: 20,
                },
                1920: {
                  slidesPerView: 4.8,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 3.8,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                580: {
                  slidesPerView: 1.4,
                  spaceBetween: 16,
                },
                320: {
                  slidesPerView: 1.3,
                  spaceBetween: 16,
                },
              }}
              pagination={{ clickable: true }}
            >
              {latestGamingNewsData && latestGamingNewsData.length > 0 ? (
                latestGamingNewsData.map((gamingNews, index) => (
                  <SwiperSlide key={index} className="latest-game-card">
                    {/* <div
                      //  to={`/news/${gamingNews.slug}`}
                      //  state={{ newsId: gamingNews.id }}
                      onClick={(event) => handleNavigation(event, gamingNews)}
                      className="block w-full h-full"
                    > */}
                    <Link
                      target="_blank"
                      href={gamingNews.slug && `/news/${gamingNews.slug}`}
                      className="block w-full h-full"
                    >
                      <LatestGamingNewsCard gamingNews={gamingNews} />
                    </Link>
                    {/* </div> */}
                  </SwiperSlide>
                ))
              ) : (
                <span className="text-[22px] text-center">
                  Don't have latest news yet
                </span>
              )}
              {/* </CustomCarousel> */}
            </Swiper>
          </div>
        </div>
        <div className="block md:hidden w-[90%] md:w-[80%] mx-auto">
          <LightBlueBtn hrefString="/news" text={"See All"} />
        </div>
      </section>
    </>
  );
};

export default LatestGamingNews;

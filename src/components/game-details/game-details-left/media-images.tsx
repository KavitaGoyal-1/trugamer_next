import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SectionHeading from "@/components/section-heading";
import Image from "next/image";

const MediaImages = ({ gameData }: any) => {
  const hasImages =
    gameData?.screenshots?.data && gameData?.screenshots?.data.length > 0;
  if (!hasImages) {
    return null;
  }

  return (
    <div className="w-full bg-[#15182B] rounded-14px">
      <SectionHeading title={"Images"} />
      <div className="px-4 md:px-0 py-0 md:pl-5 md:pr-5 pb-5">
        {hasImages ? (
          <Swiper spaceBetween={16} slidesPerView={3} loop={true}>
            {gameData?.screenshots?.data?.map((imgSrc: any, index: number) => (
              <SwiperSlide key={index}>
                <Image
                  src={imgSrc?.attributes?.url}
                  alt={`Image ${index + 1}`}
                  width={261}
                  height={182}
                  className="rounded-xl w-full min-h-[150px] sm:min-h-[182px] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-40 text-white">
            No images found
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaImages;

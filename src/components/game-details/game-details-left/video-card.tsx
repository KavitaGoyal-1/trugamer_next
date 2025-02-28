import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
import VideoCardComponent from "./video-card-component";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SectionHeading from "@/components/section-heading";

const VideoCard = ({ itemView, gameData, selectedSection }: any) => {
  const videoData = gameData?.videos || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleOpenModal = (url: any) => {
    setVideoSrc(`https://www.youtube.com/embed/${url}`);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoSrc(null);
  };

  if (videoData.length <= 0) {
    return null;
  }

  const groupedVideoCards = videoData.map((video: any, index: number) => (
    <div key={index} className="flex gap-[12px] ">
      <VideoCardComponent
        videoId={video?.url}
        videoName={video?.name}
        videoTitle={video?.title}
        handleOpenModal={() => handleOpenModal(video.url)}
        thumbnailUrl={`https://img.youtube.com/vi/${video.url}/0.jpg`}
      />
    </div>
  ));

  return (
    <div className="bg-[#15182B] mt-2.5 rounded-14px md:min-h-[375px]">
      <SectionHeading title={"Videos"} />
      <div className="flex gap-[24px] md:p-5 px-2 sm:px-0 !pt-0 mb-4">
        {videoData.length > 1 ? (
          <Swiper
            spaceBetween={16}
            slidesPerView={2}
            className="w-full"
            breakpoints={{
              3000: {
                slidesPerView: itemView || 3,
              },
              1920: {
                slidesPerView: itemView || 3,
              },
              1400: {
                slidesPerView: selectedSection === "Media" ? 2 : 1.5,
              },
              1200: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 1.5,
              },
              320: {
                slidesPerView: 1.2,
              },
            }}
            pagination={{ clickable: true }}
          >
            {groupedVideoCards.map((group: any, index: any) => (
              <SwiperSlide key={index}>{group}</SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex gap-[24px]">{groupedVideoCards}</div>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              onClick={handleCloseModal}
              className="cursor-pointer flex justify-end mb-2"
            >
              <IoMdClose className="text-3xl text-white font-bold" />
            </div>

            {videoSrc && (
              <iframe
                className="md:!w-[70vw] !w-[70vw] sm:h-[70vh] h-fit rounded-lg"
                src={videoSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;

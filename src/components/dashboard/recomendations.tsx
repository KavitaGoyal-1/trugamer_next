import Image from "next/image";
import LightBlueBtn from "../buttons/light-blue-btn";
import HomeSubtitle from "../landing/home-subtitle";
import { Swiper, SwiperSlide } from "swiper/react";

const Recomendations = () => {
  return (
    <section className="max-w-[2550px] py-20 md:py-28 px-[5%] md:px-[10%] grid grid-cols-1 w-full">
      <div className="flex justify-between">
        <HomeSubtitle text="You may also like" />
        <div className="max-md:hidden">
          <LightBlueBtn href="/" text={"Discover More"} />
        </div>
      </div>
      <div className="md:mt-[60px] mt-[38px]">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          className="w-full"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1080: {
              slidesPerView: 3,
            },
            1250: {
              slidesPerView: 3,
            },
            1800: {
              slidesPerView: 3,
            },
          }}
        >
          {relatedGamesContent?.length > 0 &&
            relatedGamesContent?.map((game, index) => (
              <SwiperSlide key={index}>
                <RecomendedCard key={index} game={game} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

const relatedGamesContent = [
  {
    title: "God Of War",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tristique facilisis aliquam egestas adipiscing eget neque eget. Augue feugiat integer morbi maecenas eu quam tempor. Faucibus morbi.",
    coverImg: "/recommended-games/gow-cover.png",
    img: {
      alt: "alt",
      src: "/recommended-games/gow-img.png",
    },
  },
  {
    title: "Dark Souls II",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tristique facilisis aliquam egestas adipiscing eget neque eget. Augue feugiat integer morbi maecenas eu quam tempor. Faucibus morbi.",
    coverImg: "/recommended-games/ds-cover.png",
    img: {
      alt: "alt",
      src: "/recommended-games/ds-img.png",
    },
  },
  {
    title: "Call of duty",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tristique facilisis aliquam egestas adipiscing eget neque eget. Augue feugiat integer morbi maecenas eu quam tempor. Faucibus morbi.",
    coverImg: "/recommended-games/cod-cover.png",
    img: {
      alt: "alt",
      src: "/recommended-games/cod-img.png",
    },
  },
];

const RecomendedCard = ({ game }: any) => {
  return (
    <div className=" bg-[#0F111F] p-3 rounded-[16px] sm:mr-3 mr-0">
      <div>
        <Image
          className="w-full min-h-[180px]"
          src={game.coverImg}
          alt="recomended card"
          title="recomended card"
          width={180}
          height={180}
        />
      </div>
      <div className="mx-auto max-w-[90%] translate-y-[-60px]">
        <div className="grid grid-cols-5 gap-2 mb-6">
          <Image
            src={game.img.src}
            alt={game.img.alt}
            title={game.img.alt}
            width={108}
            height={130}
            className="col-start-1 col-end-3 w-full h-auto"
          />
          <div className="col-start-3 col-end-6 grid grid-cols-1 place-items-start place-content-end gap-2F">
            <h2 className="font-bold capitalize text-lg">{game.title}</h2>
            <div className="flex  items-center">
              <button className="bg-cPurple-light py-1 px-3 rounded-[5px] flex items-center max-xl:hidden">
                <Image
                  src="/icons/plus-white.svg"
                  alt="plus icon"
                  title="plus icon"
                  width={13}
                  height={13}
                />
                <span className="font-semibold capitalize text-[14px]">
                  Add Queue
                </span>
              </button>

              <div className="flex items-center ml-2">
                <span className="text-cBlue-light text-[14px] mr-1">1.7k</span>
                <Image
                  src="/icons/hand-up.svg"
                  alt="hand up"
                  title="hand up"
                  height={14}
                  width={16}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-start text-cPurple-light font-normal font-base">
          {game.description}
        </p>
        <button className="bg-cPurple-light py-2 px-3 rounded-14px flex items-center w-full flex justify-center mt-5 xl:hidden block">
          <Image
            src="/icons/plus-white.svg"
            alt="plus icon"
            title="plus icon"
            width={13}
            height={13}
          />
          <span className="ml-2 font-semibold capitalize text-[16px]">
            Add Queue
          </span>
        </button>
      </div>
    </div>
  );
};

export default Recomendations;

import Image from "next/image";
import CardPlus from "../card/card-plus";
import RegularHeading from "../regular-heading";

const content = [
  {
    id: 1,
    img: {
      alt: "Alt",
      src: "/games/game1.png",
    },
    played: 3.6,
    queued: 900,
    platform: {
      name: "PC",
      img: {
        alt: "alt",
        src: "/platforms/pc-dark.svg",
      },
    },
  },
  {
    id: 2,
    img: {
      alt: "Alt",
      src: "/games/game2.png",
    },
    played: 3.6,
    queued: 900,
    platform: {
      name: "Switch",
      img: {
        alt: "alt",
        src: "/platforms/switch-dark.svg",
      },
    },
  },
  {
    id: 3,
    img: {
      alt: "Alt",
      src: "/games/game3.png",
    },
    played: 3.6,
    queued: 900,
    platform: {
      name: "PS5",
      img: {
        alt: "alt",
        src: "/platforms/ps-dark.svg",
      },
    },
  },
  {
    id: 4,
    img: {
      alt: "Alt",
      src: "/games/game4.png",
    },
    played: 3.6,
    queued: 900,
    platform: {
      name: "PC",
      img: {
        alt: "alt",
        src: "/platforms/pc-dark.svg",
      },
    },
  },
  {
    id: 5,
    img: {
      alt: "Alt",
      src: "/games/game5.png",
    },
    played: 3.6,
    queued: 900,
    platform: {
      name: "XSX",
      img: {
        alt: "alt",
        src: "/platforms/xbox-dark.svg",
      },
    },
  },
];

const PlayingNow = () => {
  return (
    <section className="max-w-[2550px] mx-auto py-16 grid grid-cols-1  px-[5%] md:px-[10%]">
      <RegularHeading text="Trending Games" />
      <div
        className="
        grid grid-cols-5 gap-4
        w-full
        my-12 md:my-20 
    "
      >
        {content?.length > 0 &&
          content?.map((item) => (
            <div
              key={item.id}
              className="relative min-w-[230px]  grid justify-items-center	 content-center "
            >
              <CardPlus />
              <Image
                src={item.img.src ? item.img.src : "/placeholder.png"}
                alt={item.img.alt}
                title={item.img.alt}
                width={69}
                height={69}
                className="w-full h-auto z-0"
              />
              <div
                className={`absolute bg-cPurple-light p-2 rounded-xl border-cBlack-dark border-4 md:border-[6px] 
                grid grid-cols-[max-content_1fr] gap-2 items-center 
                bottom-0 translate-y-[25px]
                `}
              >
                <Image
                  src={item.platform.img.src}
                  alt={item.platform.img.alt}
                  title={item.platform.img.alt}
                  width={22}
                  height={22}
                />
                <span className="text-cBlack-dark font-medium text-base min-[320px]-text-lg md:text-[22px]">
                  {item.platform.name}
                </span>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default PlayingNow;

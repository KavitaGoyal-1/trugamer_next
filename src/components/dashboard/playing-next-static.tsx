import Image from "next/image";
import CardDate from "../card/card-date";
import RegularHeading from "../regular-heading";

const titles = [
  {
    id: 1,
    title: "Call Of Duty",
    img: {
      alt: "alt",
      src: "/releases/game1.png",
    },
    platform: {
      name: "Xbox Series X",
      img: {
        alt: "alt",
        src: "/platforms/xbox-light.svg",
      },
    },
    release: "08 Dec",
  },
  {
    id: 2,
    title: "God of war",
    img: {
      alt: "alt",
      src: "/releases/game2.png",
    },
    platform: {
      name: "Playsation 5",
      img: {
        alt: "alt",
        src: "/platforms/ps-light.svg",
      },
    },
    release: "12 Dec",
  },
  {
    id: 3,
    title: "Dark Souls II",
    img: {
      alt: "alt",
      src: "/releases/game3.png",
    },
    platform: {
      name: "Switch",
      img: {
        alt: "alt",
        src: "/platforms/switch-light.svg",
      },
    },
    release: "15 Dec",
  },
  {
    id: 4,
    title: "Far Cry IV",
    img: {
      alt: "alt",
      src: "/releases/game4.png",
    },
    platform: {
      name: "PC Gaming",
      img: {
        alt: "alt",
        src: "/platforms/pc-light.svg",
      },
    },
    release: "24 Dec",
  },
  {
    id: 5,
    title: "Fornite",
    img: {
      alt: "alt",
      src: "/releases/game5.png",
    },
    platform: {
      name: "Xbox Series X",
      img: {
        alt: "alt",
        src: "/platforms/xbox-light.svg",
      },
    },
    release: "29 Dec",
  },
];

const PlayingNext = () => {
  return (
    <section className="max-w-[2550px] w-full  mx-auto py-16  grid grid-cols-1  px-[5%] md:px-[10%]">
      <RegularHeading text="Playing Next" />
      <div
        className="
    grid grid-cols-5 gap-4 gap-4
    w-full
    my-12 md:my-20 
    relative
    "
      >
        {titles?.length > 0 &&
          titles?.map((item, index) => {
            let zI = titles?.length - index;
            return (
              <div
                key={item.id}
                className="relative  grid justify-items-center	 content-center"
                style={{ zIndex: zI }}
              >
                <CardDate date={item.release} top="-10" right="-15" />
                <Image
                  src={item.img.src}
                  alt={"playing image"}
                  title={"playing image"}
                  width={69}
                  height={69}
                  className="w-full h-auto z-0"
                />
                <span
                  className={`absolute text-[80px] font-bold text-cPurple-light
            bottom-[-30px] left-[-20px]
                

            `}
                  style={{
                    textShadow:
                      " 8px 0 #0F111F, -4px 0 #0F111F, 0 8px #0F111F, 0 -8px #0F111F,4px 4px #0F111F, -4px -4px #0F111F, 4px -4px #0F111F, -4px 4px #0F111F",
                    zIndex: zI,
                  }}
                >
                  {index + 1}
                </span>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default PlayingNext;

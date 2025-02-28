import Image from "next/image";
import CardPlus from "../card/card-plus";
import RegularHeading from "../regular-heading";

const titles2 = [
  {
    id: 6,
    title: "Grand Theft Auto V",
    img: {
      alt: "alt",
      src: "/releases/game6.png",
    },
    platform: {
      name: "Xbox Series X",
      img: {
        alt: "alt",
        src: "/platforms/xbox-light.svg",
      },
    },
    release: "01 Jan",
  },
  {
    id: 7,
    title: "Elden Ring",
    img: {
      alt: "alt",
      src: "/releases/game7.png",
    },
    platform: {
      name: "Xbox Series X",
      img: {
        alt: "alt",
        src: "/platforms/xbox-light.svg",
      },
    },
    release: "07 Jan",
  },
  {
    id: 8,
    title: "League Of Legends",
    img: {
      alt: "alt",
      src: "/releases/game8.png",
    },
    platform: {
      name: "PC Gaming",
      img: {
        alt: "alt",
        src: "/platforms/pc-light.svg",
      },
    },
    release: "18 Jan",
  },
  {
    id: 9,
    title: "Need For Speed",
    img: {
      alt: "alt",
      src: "/releases/game9.png",
    },
    platform: {
      name: "Playsation 5",
      img: {
        alt: "alt",
        src: "/platforms/ps-light.svg",
      },
    },
    release: "20 Jan",
  },
  {
    id: 10,
    title: "Assasins Creed IV",
    img: {
      alt: "alt",
      src: "/releases/game10.png",
    },
    platform: {
      name: "Xbox Series X",
      img: {
        alt: "alt",
        src: "/platforms/xbox-light.svg",
      },
    },
    release: "30 Jan",
  },
];
const RecentlyPlayed = () => {
  return (
    <section className=" w-full  mx-auto py-16  grid grid-cols-1  px-[5%] md:px-[10%]">
      <RegularHeading text="Recently Played" />
      <div
        className="
    grid grid-cols-5 gap-4 gap-4
    w-full
    my-12 md:my-20
    relative
    "
      >
        {titles2?.length > 0 &&
          titles2?.map((item, index) => {
            let zI = titles2?.length - index;
            return (
              <div
                key={item.id}
                className="relative  grid justify-items-center	 content-center"
                style={{ zIndex: zI }}
              >
                <CardPlus />
                <Image
                  src={item.img.src}
                  alt={"Recently Played Image"}
                  title={"Recently Played Image"}
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
export default RecentlyPlayed;

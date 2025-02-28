import Image from "next/image";
import React, { useEffect, useState } from "react";

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
  {
    id: 1,
    title: "Call Of Duty Black Ops",
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
];

interface IUserProfilePopUp {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserProfilePopUp = ({ setIsModalOpen }: IUserProfilePopUp) => {
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [game, setGame] = useState<any>(null);
  useEffect(() => {
    if (searchTerm.length > 0) {
      let findOne = titles.find((game) =>
        game.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
      findOne !== undefined && setGame(findOne);
    } else {
      setGame(null);
    }
  }, [searchTerm]);

  return (
    <div className="fixed grid top-0 left-0 right-0 bottom-0 backdrop-blur-sm  z-40 shadow-cShadow-main">
      <div
        className={`self-center place-self-center
                w-[343px] 
                bg-[#1A2947] rounded-2xl relative
                pt-5  px-4
                ${game ? "pb-0" : "pb-4"}
                `}
      >
        <div className={`grid gap-4 ${game ? "mb-0" : "mb-6"}`}>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-start">
              Add Favourite Game
            </span>
            <p className="text-[#A2A6B8] text-sm ">
              Please enter a game title to search.
            </p>
          </div>
          <UserProfilePopUpInput setSearchTerm={setSearchTerm} />

          {game && (
            <div className="bg-cBlack-dark pt-4 pb-3  rounded-bl-2xl rounded-br-2xl translate-y-[-1.30rem] shadow-cShadow-main">
              <div className="grid grid-cols-[max-content_1fr] py-4 px-4 gap-3">
                <Image
                  width={70}
                  height={80}
                  src={game?.img.src}
                  alt={`${game?.title} icon`}
                  title={`${game?.title} icon`}
                />
                <div>
                  <h5 className="text-[17px] font-semibold">{game?.title}</h5>
                  <span className="flex text-cPurple-light mt-1 mb-3 text-[14px]">
                    <Image
                      width={16}
                      height={16}
                      src="/icons/play.svg"
                      alt="play icon"
                      title="play icon"
                    />
                    25K Plays
                  </span>
                  <div className="flex text-[#98A2B3] text-[14px]">
                    <Image
                      width={17}
                      height={17}
                      src="/icons/blue-star.svg"
                      alt="play icon"
                      title="play icon"
                    />
                    4.2
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!game && (
          <div className="grid grid-cols-2 gap-3">
            <a
              className="bg-white text-[#344054] hover:text-[#344054] px-[18px] py-2.5 rounded-xl	shadow-cShadow-main"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </a>
            <a
              className="bg-cBlue-light text-white pl-3.5 pr-[18px] py-2.5 rounded-xl	shadow-cShadow-main"
              onClick={() => setIsModalOpen(false)}
            >
              Add Game
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

interface IUserProfilePopUpInput {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}
const UserProfilePopUpInput = ({ setSearchTerm }: IUserProfilePopUpInput) => {
  const handleChange = (event: any) => {
    setSearchTerm(...([event.target?.value] as const));
  };
  return (
    <form className="grid gap-1.5 z-10">
      <label htmlFor="popupInput" className="text-sm font-medium text-start">
        Name of Game
      </label>
      <input
        autoComplete="off"
        type="text"
        placeholder="e.g. God of War"
        name="popupInput"
        className="py-2.5 px-3.5 rounded-xl text-[#66708599] font-normal	w-full focus:outline-0 shadow-cShadow-main"
        onChange={handleChange}
      />
    </form>
  );
};

export default UserProfilePopUp;

import React from "react";
import CardPlus from "../../card/card-plus";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  game?: any;
  index: number;
}

const RecentlyPlayedCard = ({
  game: Game,
  index,
  setVisible,
  setSelectedGame,
  visible,
  selectedGame,
}: IProps) => {
  let game = Game?.game;
  return (
    <div className="relative">
      <div className=" w-[236px] h-[340px] relative grid justify-items-center content-center m-auto sm:mr-auto">
        <CardPlus
          game={Game}
          setVisible={setVisible}
          visible={visible}
          setSelectedGame={setSelectedGame}
          selectedGame={selectedGame}
          positionPlus={true}
        />
        <Link
          href={`/game/${game.slug}`}
          className="block" // Ensure the link takes full space
        >
          <Image
            src={game?.image?.url ? game?.image?.url : "/placeholder.png"}
            alt={"Recently Played Image"}
            title={"Recently Played Image"}
            width={69}
            height={69}
            className="h-[340px] w-full z-0 rounded-3xl"
          />
        </Link>
        <div className="absolute bottom-[-54px] left-0 right-0">
          <span
            className={`absolute text-[80px] font-bold text-cPurple-light
            bottom-[4px] left-[-22px]`}
            style={{
              textShadow:
                " 8px 0 #0F111F, -4px 0 #0F111F, 0 8px #0F111F, 0 -8px #0F111F,4px 4px #0F111F, -4px -4px #0F111F, 4px -4px #0F111F, -4px 4px #0F111F",
            }}
          >
            {index + 1}
          </span>

          {Game.device && (
            <>
              <div
                className={
                  index + 1 > 9
                    ? `absolute bg-cPurple-light p-2 ml-[18px] rounded-xl m-auto max-w-max border-cBlack-dark border-4 md:border-[6px] 
            flex item-center left-[78px] right-[6px] gap-2 items-center 
             bottom-[42px] translate-y-[8px]`
                    : `absolute bg-cPurple-light p-2  rounded-xl m-auto max-w-max border-cBlack-dark border-4 md:border-[6px] 
            flex item-center left-10 right-3 gap-2 items-center 
            bottom-[42px] translate-y-[8px]
            `
                }
              >
                <Image
                  src={Game?.device?.logo?.image?.url}
                  alt={"device game"}
                  title={"device game"}
                  width={22}
                  height={22}
                />
                <span className="text-cBlack-dark truncate font-medium text-base min-[320px]-text-lg md:text-[22px]">
                  {Game?.device && Game?.device?.name}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-[236px] mt-9 md:mt-8 mx-auto">
        <p className="text-xl flex-wrap text-center "> {game?.title}</p>
      </div>
    </div>
  );
};

export default RecentlyPlayedCard;

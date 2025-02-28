import { useEffect } from "react";
import Link from "next/link";
import CardPlus from "@/components/card/card-plus";
import { IGame } from "@/types/game";
import Image from "next/image";

interface TrendingGameCardProps {
  game: IGame;
  devices: any;
  index: number;
  onClick?: VoidFunction;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setNonLoggedUser?: React.Dispatch<React.SetStateAction<any>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: any;
  token?: string;
  nonLoggedUser?: any;
  setIsOpenLoginStatus?: any;
}
const GameCardForNew = ({
  game,
  devices,
  index,
  setVisible,
  setNonLoggedUser,
  nonLoggedUser,
  visible,
  selectedGame,
  setSelectedGame,
  token,
  setIsOpenLoginStatus,
}: TrendingGameCardProps) => {
  useEffect(() => {
    !token ? setNonLoggedUser?.(true) : setNonLoggedUser?.(false);
  }, [token, nonLoggedUser]);
  return (
    <>
      <div
        className={`pt-3 md:pt-0 h-[205px] md:h-[280px] w-[142px] md:w-[236px] relative grid justify-items-center  m-auto sm:mr-auto z-[${index}]`}
      >
        <div className="flex w-full relative top-[5px] z-10">
          {" "}
          {/* {token && ( */}
          <CardPlus
            game={game}
            setVisible={setVisible}
            setIsOpenLoginStatus={setIsOpenLoginStatus}
            visible={visible}
            setSelectedGame={setSelectedGame}
            selectedGame={selectedGame}
            token={token}
          />
          {/* // )} */}
        </div>
        <Link
          target="_blank"
          href={game?.attributes?.slug && `/game/${game?.attributes?.slug}`}
          className="block shadow-[15px_4.39px_45px_-2.19px_#000000] rounded-3xl w-full relative" // Ensure the link takes full space
        >
          <Image
            src={game?.attributes?.coverImage?.data?.attributes?.url}
            alt={"game image"}
            // title={"game image"}
            width={69}
            height={69}
            className="z-0 h-[205px] md:h-[280px] md:min-w-[236px] md:max-w-[236px] w-full cursor-pointer rounded-2xl md:rounded-3xl object-cover"
          />
        </Link>
      </div>

      <div className="flex flex-col gap-1 sm:gap-2 pt-4 pl-2">
        <div className="w-full flex items-center text-sm sm:text-base md:text-xl font-semibold capitalize h-7 cursor-pointer">
          <Link
            target="_blank"
            href={game?.attributes?.slug && `/game/${game?.attributes?.slug}`}
            className="flex text-start rounded-3xl w-full hover:text-[#adbaf5]" // Ensure the link takes full space
          >
            <span className="line-clamp-1">{game?.attributes?.title}</span>
          </Link>
        </div>
        <div className="w-full flex flex-col items-start gap-2 justify-center text-md sm:text-base md:text-xl font-medium capitalize ">
          {devices?.map((device: any, idx: any) => (
            <div key={idx} className="flex items-center mr-4 mb-2">
              <Image
                src={device?.icon}
                alt={`${device?.name} icon`}
                // title={device?.name}
                width={24}
                height={24}
                className="mr-2 w-6 h-6"
                style={{
                  filter:
                    "invert(50%) sepia(100%) saturate(500%) hue-rotate(190deg) brightness(90%) contrast(85%)", // Adjust filter to apply uniform color
                }}
              />
              <span className="text-white text-xs sm:text-sm text-left">
                {device?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameCardForNew;

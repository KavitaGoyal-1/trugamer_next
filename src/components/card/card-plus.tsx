import React, { useState } from "react";

import { usePathname } from "next/navigation";
import Image from "next/image";
interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: any;
  game?: any;
  style?: object;
  positionPlus?: boolean;
  token?: string;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}

const CardPlus = ({
  setVisible,
  visible,
  game,
  setSelectedGame,
  positionPlus,
  style,
  token,
  setIsOpenLoginStatus,
}: IProps) => {
  const pathname = usePathname();
  const toggleVisible = () => {
    if (!token) {
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLoginStatus?.(true);
    } else {
      if (setSelectedGame) {
        setSelectedGame(game);
      }

      if (setVisible) {
        setVisible(!visible);
        setIsOpenLoginStatus?.(false);
      }
    }
  };
  return (
    <>
      <Image
        alt="more"
        src="/games/plus-iconWhite.svg"
        width={45}
        style={{ ...style }}
        height={45}
        className={`absolute z-1 ${
          positionPlus ? "-top-[15px]" : "top-[-15px]"
        } right-[-15px] hover:cursor-pointer w-8 h-8`}
        onClick={toggleVisible}
      />
    </>
  );
};
export default CardPlus;

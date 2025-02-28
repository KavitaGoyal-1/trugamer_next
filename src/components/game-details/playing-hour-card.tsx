import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { IGameAttributes } from "@/types/game";
import { selectAuthState } from "@/store/slices/auth-slice";

interface IProps {
  game: IGameAttributes;
  gameRank: any;
}

const PlayingHourCard: FC<IProps> = ({ game, gameRank }) => {
  const user = useSelector(selectAuthState);
  const [rank, setRank] = useState(-1);
  useEffect(() => {
    if (user?.userData?.played_hour?.length && game) {
      let index = user?.userData?.played_hour.findIndex(
        (gamePlayed: any) => gamePlayed?.game?.slug === game?.slug
      );
      if (index >= 0) {
        setRank(index + 1);
      }
    }
  }, []);
  const renderRank = () => {
    switch (rank) {
      case 1:
        return "/ranking/gold.png";
      case 2:
        return "/ranking/silver.png";
      case 3:
        return "/ranking/bronze.png";

      default:
        return "/ranking/unranked.png";
    }
  };
  return gameRank ? (
    <div className="bg-[#1A2947] p-4 rounded-xl max-w-[350px]">
      <p className="text-left font-bold ">Play Ranking</p>
      <div className="flex items-center gap-4 mt-4">
        <div>
          {renderRank() && (
            <Image
              src={renderRank()}
              alt="ranking"
              title="ranking"
              className="w-10 h-10"
              width={40}
              height={40}
            />
          )}
        </div>
        <div>
          <p className="font-bold">#{rank} Played Game</p>
          <p className="text-gray-400">{gameRank.hours} hours</p>
        </div>
      </div>
    </div>
  ) : null;
};

export default PlayingHourCard;

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectAuthState } from "@/store/slices/auth-slice";
import Image from "next/image";

const PlayRanking = ({ analytics, game, gameSlug }: any) => {
  const user = useSelector(selectAuthState);
  const [rank, setRank] = useState(-1);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (user?.userData?.played_hour?.length && game) {
      const sameGamePlays = user.userData.played_hour.filter(
        (gamePlayed: any) => gamePlayed?.game?.slug === game?.slug
      );

      const totalPlayedHours = sameGamePlays?.reduce(
        (sum: number, gamePlayed: any) => sum + (gamePlayed?.hours || 0),
        0
      );

      setTotalHours(totalPlayedHours);

      if (totalPlayedHours === 0) {
        setRank(-1);
        return;
      }

      // Step 3: Get total played hours for all games, excluding the current game
      const otherGamesHours = user?.userData?.played_hour
        .filter((gamePlayed: any) => gamePlayed?.game?.slug !== game?.slug) // Exclude current game
        .reduce((acc: Map<string, number>, gamePlayed: any) => {
          const slug = gamePlayed?.game?.slug;
          const hours = gamePlayed.hours || 0;
          acc.set(slug, (acc.get(slug) || 0) + hours);
          return acc;
        }, new Map());

      // Step 4: Sort total played hours of all other games in descending order
      const sortedTotalHours = [...otherGamesHours.values()].sort(
        (a, b) => b - a
      );

      // Step 5: Find the rank of the current game
      const rank =
        sortedTotalHours.findIndex((hour) => hour <= totalPlayedHours) + 1;

      console.log(rank, "rank2");

      if (rank > 0) {
        setRank(rank);
      }
    }
  }, [user, game]);
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

  console.log(rank, "rank");
  return (
    <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
      <h3 className="section-card-heading">Play Ranking</h3>
      <div className="w-full bg-[#15182B] p-4 rounded-xl">
        <div className="flex gap-4">
          <div className="relative flex flex-col items-center justify-center">
            <Image
              src={renderRank()}
              alt="connector"
              width={41}
              height={40}
              className="h-[40px] bg-rank relative"
            />
            <Image
              src="/game-details/Connector.svg"
              alt="connector"
              className="mt-2"
              width={3}
              height={26}
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            {/* <span className="text-base font-semibold leading-6">
              #{rank== -1?0: rank} Played Game
            </span>
            <span className="text-base font-normal text-[#A2A6B8] leading-6">
              {totalHours} hours
            </span> */}

            {totalHours > 0 ? (
              <>
                <span className="text-base font-semibold leading-6">
                  #{rank === -1 ? 0 : rank} Played Game
                </span>
                <span className="text-base font-normal text-[#A2A6B8] leading-6">
                  {totalHours} hours
                </span>
              </>
            ) : (
              <span className="text-base text-[#A2A6B8] flex items-center justify-center h-full">
                You haven't played yet
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayRanking;

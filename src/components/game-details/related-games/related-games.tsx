import { useEffect } from "react";
import LightBlueBtn from "../../buttons/light-blue-btn";
import RelatedGamesCarousel from "./related-games-carousell";
import { IGame } from "@/types/game";
import SectionHeading from "@/components/section-heading";

const RelatedGames = ({
  games,
  visible,
  setVisible,
  selectedGame,
  setSelectedGame,
  token,
  setIsOpenLoginStatus,
  setUpdatedAnalytics,
  showMoadl,
  fetchSelectedDevices,
}: {
  games: IGame[];
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGame: boolean;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  token?: string;
  setUpdatedAnalytics?: React.Dispatch<React.SetStateAction<any>>;
  showMoadl: boolean;
  fetchSelectedDevices?: any;
  setIsOpenLoginStatus?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  if (games?.length <= 0) {
    return null;
  }
  // useEffect(()=>{
  if (Array.isArray(games)) {
    games = games?.filter((game) => game?.attributes?.title);
  }
  // },[games])

  return (
    <>
      {showMoadl && (
        <div className="w-full bg-cBlue-secondary rounded-14px mt-[10px]">
          <SectionHeading title={"Related Games"} />
          <RelatedGamesCarousel
            token={token}
            games={games}
            visible={visible}
            setIsOpenLoginStatus={setIsOpenLoginStatus}
            setVisible={setVisible}
            setSelectedGame={setSelectedGame}
            selectedGame={selectedGame}
            setUpdatedAnalytics={setUpdatedAnalytics}
            fetchSelectedDevices={fetchSelectedDevices}
          />

          <div className="hidden mb-12">
            <LightBlueBtn href="/" text="See All" />
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedGames;

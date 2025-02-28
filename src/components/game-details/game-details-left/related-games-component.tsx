import CardPlus from "@/components/card/card-plus";
import SectionHeading from "@/components/section-heading";
import React from "react";

interface IProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGame?: React.Dispatch<React.SetStateAction<any>>;
  visible?: boolean;
  selectedGame?: boolean;
  game?: any;
  token?: any;
  cardPlusHeight?: number; // Add height prop
  cardPlusWidth?: number; // Add width prop
  showMoadl: boolean;
  gameData: any;
}

const RelatedGamesComponent = ({
  setVisible,
  setSelectedGame,
  visible,
  selectedGame,
  cardPlusHeight = 30, // Default height value
  cardPlusWidth = 30, // Default width value
  showMoadl,
  gameData,
}: IProps) => {
  return (
    <>
      {showMoadl && (
        <div className="w-full bg-cBlue-secondary rounded-14px mt-[10px]">
          <SectionHeading title={"Related Games"} />

          <div className="p-5 pt-3 flex flex-wrap md:gap-3 gap-5">
            {gameData?.related_games &&
              gameData?.related_games &&
              gameData?.related_games.data &&
              gameData?.related_games.data?.length > 0 &&
              gameData?.related_games?.data?.map(
                (relatedGame: any, index: any) => {
                  return (
                    <div key={index} className="w-[46%] md:w-[138px]">
                      <div className="related-games-card-container">
                        <CardPlus
                          game={relatedGame}
                          setVisible={setVisible}
                          visible={visible}
                          setSelectedGame={setSelectedGame}
                          selectedGame={selectedGame}
                          style={{
                            height: cardPlusHeight,
                            width: cardPlusWidth,
                          }}
                        />
                      </div>
                      <span className="flex justify-start text-start text-base font-medium pt-2 leading-5 overflow-hidden break-words">
                        {relatedGame?.attributes?.title}
                      </span>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedGamesComponent;

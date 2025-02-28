import GameDirectoryCardLibrary from "./game-directory-card/index-lib-card";
import GameDirectoryListLibrary from "./game-directory-card/index-lib-list";

const LibraryResults = ({
  selectedCardOrList,
  toggleVisible,
  openModal,
  handleGameLibrary,
}: any) => {
  return (
    <>
      <div className="flex gap-4 w-full justify-between flex-wrap p-4 pl-0 pr-0 sticky top-0 z-[999]">
        {selectedCardOrList == "Card" ? (
          <>
            <GameDirectoryCardLibrary
              toggleVisible={toggleVisible}
              openModal={openModal}
              handleGameLibrary={handleGameLibrary}
            />
          </>
        ) : selectedCardOrList == "List" ? (
          <>
            <GameDirectoryListLibrary
              toggleVisible={toggleVisible}
              openModal={openModal}
              handleGameLibrary={handleGameLibrary}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default LibraryResults;

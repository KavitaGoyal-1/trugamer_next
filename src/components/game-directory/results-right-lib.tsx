import ResultsFiltersLib from "./results-filters-lib";

const ResultsRightLib = ({ handleChangeListOrCardView, gameLibrary }: any) => {
  return (
    <>
      <div className="gap-4 w-full sticky top-40 mt-2">
         

        <ResultsFiltersLib handleChangeListOrCardView={handleChangeListOrCardView} gameLibrary={gameLibrary} />
      </div>
    </>
  );
};

export default ResultsRightLib;

export const MenuArray = [
  {
    id: "1",
    name: "Overview",
    link: "Overview",
  },
   
  {
    id: "3",
    name: "Media",
    link: "Media",
  },
  {
    id: "4",
    name: "Seasons & Expansions",
    link: "Seasons & Expansions",
  },
];
const GameDetailNavbarSection = ({
  selectedSection,
   showMoadl,
  gameData,
  handleClickTabs,
}: any) => {
  const hasImages =
    gameData?.screenshots?.data && gameData?.screenshots?.data.length > 0;
  const hasVideos = gameData?.videos && gameData?.videos.length > 0;
  const hasExpansions =
    gameData?.expansions?.data && gameData?.expansions?.data.length > 0;
  const hasSeasons =
    gameData?.seasons?.data && gameData?.seasons?.data.length > 0;

  const filteredMenuArray = MenuArray.filter((item) => {
    if (item.name === "Media" && !hasImages && !hasVideos) {
      return false;
    }
    if (
      item?.name === "Seasons & Expansions" &&
      !(hasExpansions || hasSeasons)
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      {showMoadl && (
        <nav className="navbar">
          <ul className="navbar-menu flex justify-start max-md:gap-y-3 overflow-x-scroll scrollbar-hide whitespace-nowrap">
            {filteredMenuArray?.map((item, index) => {
              return (
                <li key={index}>
                  <a
                    href="#"
                    className={`nav-item ${
                      selectedSection === item?.link
                        ? "bg-[#39475B] text-white font-semibold"
                        : "text-[#C1C9EDCC] font-normal"
                    } flex text-xs sm:text-sm  py-2 px-5 rounded-[10px]`}
                     onClick={() => handleClickTabs(item?.link)}
                  >
                    {item?.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
};

export default GameDetailNavbarSection;

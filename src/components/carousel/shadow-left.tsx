
interface LatestGamingNewsProp {
  tag?: string;
}
const ShadowLeft = ({ tag }: LatestGamingNewsProp) => {
  return (
    <div
      className={`${
        tag == "newRelease"
          ? "block absolute top-0 z-[30] left-[0%] md:left-[6%]  bb bottom-0 h-full w-[5%] z-[100]"
          : tag == "playingNow"
          ? "block absolute top-0 z-[30] left-[0%] md:left-[6%] iii bottom-0 h-full w-[5%] z-[100]"
          : tag == "playingNext"
          ? "block absolute top-0 z-[30] left-[0%] md:left-[6%] qqq bottom-0 h-full w-[5%] z-[100]"
          : tag == "upcomingGame"
          ? "block absolute top-0 z-[30] left-[0%] md:left-[6%] mmm bottom-0 h-full w-[5%] z-[100]"
          : tag == "latestGamingNews"
          ? "block absolute top-0 z-[30] left-[0%] md:left-[6%] kkk bottom-0 h-full w-[5%] z-[100]"
          : "block absolute top-0 z-[30] left-[0%] md:left-[6%] ggg bottom-0 h-full w-[5%] z-[100]"
      }`} 
    ></div>
  );
};

export default ShadowLeft;


interface LatestGamingNewsProp {
  tag?: string;
}
const ShadowRight = ({ tag }: LatestGamingNewsProp) => {
  return (
    <div
      className={`${
        tag == "newRelease"
          ? "block absolute   top-0 right-[0%] md:right-[0%] bottom-0 h-full w-[13%] md:w-[10%] 2xl:w-[2.5%] z-[100] bg-[linear-gradient(270deg,_#090D1A_0%,_rgba(9,13,26,0)_100%)]"
          : tag == "upcomingGame"
          ? "block absolute top-0  right-[0%] md:right-[0%] bottom-0 h-full w-[13%] md:w-[5%] z-[100] bg-[linear-gradient(270deg,_#090D1A_0%,_rgba(9,13,26,0)_100%)]"
          : tag == "playingNow"
          ? "block absolute top-0  right-[0%] md:right-[0%] bottom-0 h-full w-[13%] md:w-[5%] 2xl:w-[4%] z-[100] bg-[linear-gradient(270deg,_#090D1A_0%,_rgba(9,13,26,0)_100%)]"
          : "block absolute top-0  right-0 bottom-0 h-full w-[13%] md:w-[5%] 2xl:w-[4%] z-[100] bg-[linear-gradient(270deg,_#090D1A_0%,_rgba(9,13,26,0)_100%)]"
      }`} 
    ></div>
  );
};

export default ShadowRight;

import { useSelector } from "react-redux";
import Rating from "../../../../public/icons/rating.svg";
import StarBadge from "../../../../public/icons/star_badge.svg";
import Image from "next/image";

const StatsSection = ({ analyticsHours, analytics_data, gameData }: any) => {
  const gameRating = useSelector((state: any) => state?.gameData?.gameRating);
  console.log(gameData, "useLoaderData");

  // const [analytics, setAnalytics] = useState(null);
  // const getGameAnalytics = async (slug: string) => {
  //   try {
  //     const data = (await axios.get(`${getApi()}/game/getAnalytics/${slug}`))
  //       .data;
  //       console.log(data,"kk;;")
  //     if (data) {
  //       setAnalytics(data);
  //     } else null;
  //   } catch (error) {
  //     // GameDetailNavbarSection;
  //     return error;
  //   }
  // };

  // useEffect(() => {
  //   getGameAnalytics()
  // }, [gameHours]);

  return (
    <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
      <h3 className="section-card-heading">Stats</h3>
      <div className=" bg-cBlue-secondary rounded-xl">
        <div className="grid grid-cols-2 gradient-divider w-full  relative">
          <div className="flex flex-col items-center justify-center px-2 py-4">
            <div className="inline-flex gap-1 items-center">
              <p className="text-sm font-bold">
                {analytics_data?.total_playing_now}
              </p>
            </div>
            <p className="text-xs font-normal text-[#C1C9ED] flex items-center">
              <span
                className="bg-[#95E512] w-[8px] h-[8px] rounded-full mr-1
"
              ></span>
              Playing Now
            </p>
          </div>

          <div className="flex flex-col items-center justify-center px-2 py-4">
            <div className="inline-flex gap-1 items-center">
              <p className="text-sm font-bold">
                {analytics_data?.total_hours_played
                  ? analytics_data?.total_hours_played
                  : 0}
              </p>
            </div>
            <p className="text-xs font-normal text-[#C1C9ED]">
              Total Hours Played
            </p>
          </div>

          <div className="flex flex-col items-center justify-center px-2 py-4">
            <div className="inline-flex gap-1 items-center">
              <Image src={Rating} alt={`Icon`} height={12} width={9} />

              {/* <p className="text-sm font-bold">{analyticsHours?.avg_rating}</p> */}
              <p className="text-sm font-bold">
                {!gameRating ? 0 : gameRating}
              </p>
            </div>
            <p className="text-xs font-normal text-[#C1C9ED]">Users Rating</p>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-4">
            <div className="inline-flex gap-1 items-center">
              <Image src={Rating} alt={`Icon`} height={12} width={9} />

              {/* <p className="text-sm font-bold">
                {analyticsHours?.total_rating_count}
              </p> */}
              <p className="text-sm font-bold">
                {!gameData?.criticRatings || gameData?.criticRatings == "N/A"
                  ? 0
                  : gameData?.criticRatings}
              </p>
            </div>
            <p className="text-xs font-normal text-[#C1C9ED]">Critic Ratings</p>
          </div>
        </div>

        <div className="inline-flex items-center py-1.5 px-9 gap-[6px] m-5 border border-[#59618466] rounded-[12px] bg-[#59618466]">
          <Image src={StarBadge} alt="star_badge" height={24} width={24} />
          <span className="text-sm font-medium sm:font-bold">
            <b className="font-bold text-[#00ADFF]">
              {analyticsHours?.avg_is_recommended}
              {"     "}
            </b>
            Recommended
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

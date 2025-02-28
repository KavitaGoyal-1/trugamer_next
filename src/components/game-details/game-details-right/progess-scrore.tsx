import { getToken } from "@/utills/cookies";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface LoaderData {
  analytics: Record<string, any>;
}
const ProgessScrore = ({ analytics }: any) => {
  const token = getToken();
  // const { analytics } = useLoaderData() as LoaderData;
  console.log(
    analytics?.avg_played_hours_of_user,
    "analytics?.avg_played_hours_of_user"
  );
  return (
    <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
      <h3 className="section-card-heading">Time Played Compared to Avg</h3>
      <div className="w-full bg-[#15182B] p-5 rounded-xl">
        <div className="flex gap-4">
          <div className="w-20 h-18 flex items-start justify-center mt-1">
            <CircularProgressbar
              value={
                token && !isNaN(analytics?.avg_played_hours_of_user)
                  ? analytics?.avg_played_hours_of_user
                  : 0
              }
              text={
                token && !isNaN(analytics?.avg_played_hours_of_user)
                  ? `${analytics?.avg_played_hours_of_user || 0}%`
                  : "0%"
              }
              strokeWidth={13}
              styles={buildStyles({
                textSize: 15,
                textColor: "#fff",
                pathColor:
                  analytics?.avg_hours_played >= 100 ? "#FFD700" : "#00ADFF",
                trailColor: "#f2f4f773",
              })}
            />
          </div>

          <div className="flex flex-col items-start justify-start">
            <span className="text-sm font-medium leading-6 text-white text-start">
              {analytics?.avg_hours_played} Hours Played On Avg
            </span>
            <span className="text-sm font-normal text-left leading-6 text-[#A2A6B8]">
              You played{" "}
              {token && !isNaN(analytics?.avg_played_hours_of_user)
                ? analytics?.avg_played_hours_of_user
                : 0}
              {token ? "% " : " "}
              hours the average user.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgessScrore;

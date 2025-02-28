import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IReview } from "@/types/game";
import { getGameAnalytics } from "@/services/game";

interface IStatsCard {
  played: string | undefined;
  queued: string | undefined;
  beat: string | undefined;
  hoursToComplete: number | undefined;
  review?: IReview;
  payingAndQueuedCountStats?: any;
  updatedAnalytics?: any;
}
const StatsCard = ({
  review,
  payingAndQueuedCountStats,
  updatedAnalytics,
}: IStatsCard) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    getAnalytics();
  }, []);

  useEffect(() => {
    getAnalytics();
  }, [review]);

  const getAnalytics = async () => {
    try {
      const data = await getGameAnalytics(slug as string);
      setAnalytics(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#1A2947] p-4 rounded-xl max-w-[350px]">
      <h3 className="font-semibold text-base mb-4">Trugamer stats</h3>

      <div className="grid gap-[10px] pl-3">
        <div className="grid grid-cols-[max-content_1fr] gap-2 items-center	min-h-[36px]">
          <Image
            src="/icons/play.svg"
            alt="play icon"
            title="play icon"
            width={24}
            height={24}
          />
          <p className="font-normal opacity-60 text-base">
            {payingAndQueuedCountStats?.PlayingNowCount
              ? payingAndQueuedCountStats?.PlayingNowCount
              : 0}{" "}
            Users playing now
          </p>
        </div>

        <div className="grid grid-cols-[max-content_1fr] gap-2 items-center	min-h-[36px]">
          <Image
            src="/icons/layers.svg"
            alt="play icon"
            title="play icon"
            width={24}
            height={24}
          />

          <p className="font-normal opacity-60 text-base">{`${
            payingAndQueuedCountStats?.ShelvedCount || 0
          } Users queued`}</p>
        </div>

        <div className="grid grid-cols-[max-content_1fr] gap-2 items-center	min-h-[36px]">
          <Image
            src="/icons/award.svg"
            alt="play icon"
            title="play icon"
            width={24}
            height={24}
          />
          <p className="font-normal opacity-60 text-base">{`${
            analytics?.total_rating_count || 0
          } Users rated`}</p>
        </div>

        <div className="grid grid-cols-[max-content_1fr] gap-2 items-center	min-h-[36px]">
          <Image
            src="/icons/award.svg"
            alt="play icon"
            title="play icon"
            width={24}
            height={24}
          />
          <p className="font-normal opacity-60 text-base">{`${
            Math.round(analytics?.avg_rating) || 0
          } Avg. rating`}</p>
        </div>

        <div className="grid grid-cols-[max-content_1fr] gap-2 items-center	min-h-[36px]">
          <Image
            src="/icons/clock.svg"
            alt="play icon"
            title="play icon"
            width={24}
            height={24}
          />
          <p className="font-normal opacity-60 text-base">{`${
            updatedAnalytics?.total_hours_played
              ? updatedAnalytics?.total_hours_played
              : analytics?.total_hours_played || 0
          }H Total users played`}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

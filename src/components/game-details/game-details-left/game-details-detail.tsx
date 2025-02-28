import GameDevAndPublisher from "./game-dev-and-publisher";
import GameLinksAndStores from "./game-links-and-stores";
import GameReleases from "./game-releases";
import GameVedioDetails from "./game-video-details";
import GameReviewDetails from "./game-review-details";
import {
  GamePreview,
  IReview,
  Publisher,
  ReleaseByPlatforms,
} from "@/types/game";
import { Link } from "@/types/link";
import { Store } from "@/types/store";
import { Developer } from "@/types/developers";
import { useRouter } from "next/router";

interface IGameDetailsDetails {
  releaseByPlatforms: ReleaseByPlatforms | undefined;
  developer?: Developer | undefined;
  publisher?: Publisher | undefined;
  title?: string;
  links: Link[] | undefined;
  stores: Store[] | undefined;
  reviews: IReview[] | null;
  previews: GamePreview[] | undefined;
}

const GameDetailsDetails = ({
  releaseByPlatforms,
  developer,
  publisher,
  title,
  links,
  stores,
  reviews,
  previews,
}: IGameDetailsDetails) => {
  const publisherData = publisher ? publisher : undefined;
  const developerData = developer ? developer : undefined;
  // const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { slug } = router.query;

  const handleReviews = () => {
    router.push(`/${slug}/reviews`);
  };
  return (
    <div className="grid gap-4 pr-4">
      <h2 className="text-start font-bold text-[24px]">Game Details</h2>
      <div className="flex justify-between max-[500px]:flex-col gap-4">
        <div>
          {releaseByPlatforms && (
            <GameReleases releaseByPlatforms={releaseByPlatforms} />
          )}
        </div>
        <div>
          <GameDevAndPublisher
            developer={developerData}
            publisher={publisherData}
          />
        </div>
        <div>
          <GameLinksAndStores links={links} stores={stores} />
        </div>
      </div>

      {previews && previews?.length > 0 && (
        <GameVedioDetails title={title} previews={previews} />
      )}
      <div className="mb-4 mt-4 flex justify-between items-center w-full">
        <h2 className="sm:font-[700] font-[600] sm:text-[38px] text-[24px] capitalize text-start">
          {" "}
          Player Reviews{" "}
        </h2>
        <button
          className="ml-3 min-h-[36px] bg-cBlue-light py-1.5 px-[18px] text-white text-sm font-semibold rounded-[10px] flex justify-center items-center shadow-cShadow-main"
          onClick={handleReviews}
        >
          See All
        </button>
      </div>
      <GameReviewDetails reviews={reviews} />
    </div>
  );
};

export default GameDetailsDetails;

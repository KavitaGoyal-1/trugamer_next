import { FC } from "react";
import PlayerCard from "../../card/player-review-card";
import { IReview } from "@/types/game";

interface IProps {
  reviews: IReview[] | null;
}

const GameReviewDetails: FC<IProps> = ({ reviews }) => {
  return (
    <div className={"grid gap-4 lg:grid-cols-2 grid-cols-1"}>
      {reviews && reviews.length > 0 ? (
        reviews.map((data, index) => (
          <PlayerCard
            key={index}
            review={data.review_title}
            review_description={data.review}
            playerprofile={
              data.user?.picture?.url ? data.user?.picture?.url : ""
            }
            rating={data.rating}
            player={data.user?.username ? data.user?.username : ""}
          />
        ))
      ) : (
        <p>No reviews</p>
      )}
    </div>
  );
};

export default GameReviewDetails;

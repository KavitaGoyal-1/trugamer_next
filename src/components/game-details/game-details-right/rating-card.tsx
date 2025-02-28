import { useEffect, useState } from "react";
import axios from "axios";
import RatingButton from "../../buttons/rating-button";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { IGame, IReview } from "@/types/game";
import { useRouter } from "next/navigation";

interface IProps {
  game: IGame;
  review?: IReview;
}

const RatingCard = ({ game, review }: IProps) => {
  const buttonCount = 10;
  const numbers = Array.from({ length: buttonCount }, (_, index) => index + 1);
  const [ratingInput, setRatingInput] = useState<number>(review?.rating || 0);
  const [reviewTitle, setReviewTitle] = useState<string>(
    review?.review_title || ""
  );
  const [reviewDescription, setReviewDescription] = useState<string>(
    review?.review || ""
  );

  const router = useRouter();

  const token = getToken();

  const handleButtonClick = (numb: number) => {
    // Update the ratingInput state when a button is clicked
    if (numb == 1 && ratingInput == 1) {
      setRatingInput(0);
    }
    setRatingInput(numb);
  };

  useEffect(() => {
    setRatingInput(ratingInput);
    setReviewTitle(review?.review_title || "");
  }, [review]);

  const handleUserReviews = async () => {
    let payload = {
      game: game && { id: game.id },
      rating: ratingInput && ratingInput,
      review_title: reviewTitle && reviewTitle,
      review: reviewDescription && reviewDescription,
    };
    try {
      if (reviewTitle && reviewTitle.length >= 150) {
        toastMessage("error", "Tile is too long");
      } else {
        let res = await axios.post(`${getApi()}/game-ratings`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        router.refresh();

        // revalidator.revalidate();
        toastMessage("success", "Thank you for submitting your review!");
      }
    } catch (error: any) {
      let msg = error?.response?.data?.error?.message || "Something went wrong";
      toastMessage("error", msg);
    }
  };
  return (
    <div
      className="bg-[#1A2947] p-2 rounded-xl grid gap-4 max-w-[350px]"
      style={{ border: "2px solid green" }}
    >
      <div className="flex flex-row justify-between">
        <h3 className="font-semibold text-xl">Write a review</h3>
        <button className="text-white h-8 w-16 rounded-full bg-sky-400">
          {ratingInput}/ 10
        </button>
      </div>
      <div className="grid grid-cols-10 w-fit gap-1.5">
        {numbers.map((num) => (
          <RatingButton
            key={num}
            number={num}
            bgcolor={num <= ratingInput ? true : false}
            onClick={() => handleButtonClick(num)}
          />
        ))}
      </div>
      {!review ? (
        <>
          <h3 className="text-xl mt-1">Title</h3>
          <textarea
            className="text-black p-1 border outline-none rounded-lg h-12 text-xl"
            name="review_title"
            id="review_title"
            value={reviewTitle}
            placeholder="Enter a title..."
            onChange={(e) => setReviewTitle(e.target.value)}
          />

          <h3 className="text-xl mt-1">Description</h3>

          <textarea
            className="text-black p-1 border outline-none rounded-lg h-32 text-xl"
            name="review_description"
            id="review_description"
            value={reviewDescription}
            placeholder="Enter a Description..."
            onChange={(e) => setReviewDescription(e.target.value)}
          />
        </>
      ) : (
        "You Have Reviewed This Game"
      )}
      {!review && (
        <button
          onClick={handleUserReviews}
          className="mt-1 rounded-xl bg-cPurple-light py-1.5 px-[18px] text-white shadow-cShadow-main"
        >
          Review this game
        </button>
      )}
    </div>
  );
};

export default RatingCard;

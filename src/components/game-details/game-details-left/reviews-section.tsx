// working code with object
import { toastMessage } from "@/utills/toast";
import AddYourReview from "./add-your-review";
import ReviewCard from "./review-card";
import axios from "axios";
import { useState } from "react";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import LoginModal from "@/components/login-modal/login-modal";

const ReviewsSection = ({
  reviewId,
  userId,
  fetchLikeCountsAndReports,
  reviews,
  setReviews,
  gameSlug,
  showMoadl,
  loadFromDetails,
  game_data,
}: any) => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const handleCloseLogin = () => setIsOpenLogin(false);
  const token = getToken();

  const getUserData = async () => {
    const { data } = await axios.get(`${getApi()}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const handleLike = async (reviewId: number) => {
    try {
      const user = await getUserData();
      const checkResponse = await axios.get(`${getApi()}/rating-likes`, {
        params: {
          "filters[user][id]": user?.id,
          "filters[rating][id]": reviewId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const likeData = checkResponse?.data?.data[0];

      console.log(checkResponse?.data?.data[0], "checkResponse?.data?.data[0]");

      if (likeData) {
        const updateData = {
          data: { isDeleted: !likeData.attributes.isDeleted },
        };
        await axios.put(`${getApi()}/rating-likes/${likeData.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("inside 554");
        fetchLikeCountsAndReports();
        if (likeData?.attributes.isDeleted == true)
          toastMessage("success", "Liked the Review");
      } else {
        const data = {
          data: {
            user: { id: user.id },
            rating: { id: reviewId },
            isDeleted: false,
          },
        };
        await axios.post(`${getApi()}/rating-likes`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toastMessage("success", "Liked the Review");
        fetchLikeCountsAndReports();
      }
      console.log("outside 1");
      const likeResponse = await axios.get(`${getApi()}/rating-likes`, {
        params: {
          "filters[rating][id]": reviewId,
          "filters[isDeleted][$eq]": false,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const likeCount = likeResponse.data.data.length;
      setReviews((prevReviews: any) =>
        prevReviews?.map((review: any) =>
          review.id === reviewId
            ? {
                ...review,
                likeCount,
                likedByCurrentUser: !review.likedByCurrentUser,
              }
            : review
        )
      );
    } catch (error) {
      toastMessage("error", "Something went wrong");
      console.error(error);
    }
  };

  const handleReport = async (reviewId: number) => {
    try {
      const response = await axios.get(
        `${getApi()}/game-ratings/${reviewId}?populate=reported_by`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentReportedBy =
        response.data?.data?.attributes?.reported_by?.data?.map(
          (user: any) => user.id
        ) || [];
      if (!currentReportedBy.includes(userId)) {
        currentReportedBy.push(userId);
      }
      const data = { data: { reported_by: currentReportedBy } };
      await axios.put(`${getApi()}/game-ratings/${reviewId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toastMessage(
        "success",
        "Thank you for the report. We’ll review it soon."
      );
      setReviews((prevReviews: any) =>
        prevReviews?.map((review: any) =>
          review.id === reviewId
            ? { ...review, reportedByCurrentUser: true }
            : review
        )
      );
    } catch (error) {
      toastMessage("error", "Something went wrong");
      console.error(error);
    }
  };

  const hasReviewed =
    reviews &&
    reviews.length > 0 &&
    reviews.some((review: any) => review.user.id === userId);

  const sortedReviews = reviews?.length > 0 ? [...reviews] : [];

  // Find the user's review
  const userReviewIndex = sortedReviews.findIndex(
    (review: any) => review.user.id === userId
  );

  if (userReviewIndex !== -1) {
    // Move the user's review to the front
    const userReview = sortedReviews.splice(userReviewIndex, 1)[0];
    sortedReviews.unshift(userReview);
  }
  return (
    <>
      {/* Separate Section for Logged-in User's Review */}
      {userReviewIndex !== -1 && (
        <div className="mb-0 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            You have already reviewed this game
          </h3>
          <ReviewCard
            reviewId={reviewId}
            key={sortedReviews[0].id}
            showMoadl={showMoadl}
            review={sortedReviews[0]}
            handleLike={handleLike}
            handleReport={handleReport}
            reportsViewAll={true}
            loadFromDetails={loadFromDetails}
            setIsOpenLogin={setIsOpenLogin}
          />
        </div>
      )}

      <div className="auto-fill grid grid-cols-1 sm:grid-cols-2 gap-3 mb-[30px]">
        {!hasReviewed && (
          <AddYourReview
            fetchLikeCountsAndReports={fetchLikeCountsAndReports}
            gameSlug={gameSlug}
            review={reviews}
            userId={userId}
            setIsOpenLogin={setIsOpenLogin}
            hasReviewed={hasReviewed}
            game_data={game_data}
          />
        )}

        {sortedReviews
          .slice(userReviewIndex !== -1 ? 1 : 0) // Exclude user's review from this list
          .map((review: any) => (
            <ReviewCard
              reviewId={reviewId}
              key={review.id}
              showMoadl={showMoadl}
              review={review}
              handleLike={handleLike}
              handleReport={handleReport}
              reportsViewAll={true}
              loadFromDetails={loadFromDetails}
              setIsOpenLogin={setIsOpenLogin}
            />
          ))}
      </div>

      {/* Separate Section for Other Users' Reviews */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"></div> */}

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
    </>
  );
};

export default ReviewsSection;

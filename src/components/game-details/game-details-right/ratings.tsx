import { useState, useEffect } from "react";
import ReviewModal from "../game-details-left/review-modal";
import axios from "axios";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import LoginModal from "@/components/login-modal/login-modal";
import { usePathname } from "next/navigation";

const Ratings = ({
  fetchLikeCountsAndReports,
  gameSlug,
  gameData,
  userId,
}: any) => {
  const token = getToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const handleCloseLogin = () => setIsOpenLogin(false);
  const pathname = usePathname();

  const handleOpenModal = () => {
    if (userRating == 0) {
      if (token) {
        setIsModalOpen(true);
      } else {
        // navigate("/auth/sign-in");
        localStorage.setItem("Revisedslug", pathname && pathname);
        setIsOpenLogin(true);
        // localStorage.setItem("Revisedslug", gameSlug);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getUserData = async () => {
    console.log("inside 10");
    const { data } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  };

  const fetchReviews = async () => {
    console.log("rating 1");
    try {
      const { data } = await axios.get(
        `${getApi()}/game-rating/${gameSlug}`
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );
      const userReview = data.find((rev: any) => rev?.user?.id === userId);
      if (userReview) {
        setUserRating(userReview?.rating);
      } else {
        setUserRating(0);
      }
    } catch (error) {
      console.error("Error fetching user data or reviews:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  const handleReviewSubmit = async () => {
    await fetchReviews();
  };
  return (
    <>
      <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
        <h3 className="section-card-heading">Your Rating</h3>

        <div className="w-full bg-[#15182B] p-4 rounded-xl flex flex-col gap-3">
          <div className="flex justify-center gap-1 box-border">
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="w-[10%]" key={index}>
                <button
                  className={`w-[22px] h-[22px] rounded-full text-xs font-medium cursor-default ${
                    index + 1 <= userRating ? "bg-cBlue-light" : "bg-[#596184]"
                  }`}
                >
                  {index + 1}
                </button>
              </div>
            ))}
          </div>

          <div>
            <button
              className="w-full text-sm font-semibold leading-6 bg-[#596184] p-[6px_18px] rounded-[12px]"
              onClick={handleOpenModal}
            >
              {userRating
                ? "You have already reviewed this game"
                : "Rate this game"}
            </button>

            {isModalOpen && (
              <ReviewModal
                onClose={handleCloseModal}
                onSubmit={handleReviewSubmit}
                fetchLikeCountsAndReports={fetchLikeCountsAndReports}
                game={gameData}
              />
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
    </>
  );
};
export default Ratings;

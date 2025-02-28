import { useState } from "react";
import Rating from "../../../../public/icons/rating.svg";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
// import "swiper/css";
import ReviewModal from "./review-modal";
import ReviewCard from "./review-card";
import axios from "axios";
import Link from "next/link";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import LoginModal from "@/components/login-modal/login-modal";
import Image from "next/image";

const GameDetailsReview = ({
  reviewId,
  showMoadl,
  setLoadModal,
  userId,
  fetchLikeCountsAndReports,
  reviews,
  setReviews,
  token,
  gameSlug,
  setLoadFromDetails,
  gameData,
}: any) => {
  console.log(reviews, "llllllllllllllllllllllllllll", gameData);
  // interface LoaderData {
  //   game: Record<string, any>;
  // }

  // const { game } = useLoaderData() as LoaderData;
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const handleCloseLogin = () => setIsOpenLogin(false);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (token) {
      setIsModalOpen(true);
    } else {
      // navigate("/auth/sign-in");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
      // localStorage.setItem("Revisedslug", gameSlug);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  let hasUserReviewed;
  if (userId && reviews && reviews?.length > 0) {
    hasUserReviewed = reviews.some(
      (review: any) => review?.user?.id === userId
    );
  }

  // useEffect(() => {
  //   console.log(
  //     typeof reviewId,
  //     typeof setLoadModal,
  //     typeof userId,
  //     typeof fetchLikeCountsAndReports,
  //     typeof reviews,
  //     typeof gameSlug,
  //     typeof token
  //   );
  //   console.log(
  //     "This is new era p1",
  //     reviewId,
  //     setLoadModal,
  //     userId,
  //     fetchLikeCountsAndReports,
  //     reviews,
  //     setReviews,
  //     token,
  //     gameSlug
  //   );
  // }, []);

  const getUserData = async () => {
    console.log("inside 12");
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
          "filters[user][id]": user.id,
          "filters[rating][id]": reviewId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const likeData = checkResponse?.data?.data[0];

      if (likeData) {
        const updateData = {
          data: { isDeleted: !likeData?.attributes.isDeleted },
        };
        await axios.put(`${getApi()}/rating-likes/${likeData.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchLikeCountsAndReports();
        if (likeData?.attributes?.isDeleted == true)
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
        fetchLikeCountsAndReports();
        toastMessage("success", "Liked the Review");
      }
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

  return (
    <>
      <div>
        <div className="flex justify-between relative details-gradient items-center pb-3 mb-5">
          <h4 className="text-lg font-bold text-start">Reviews</h4>
          <div className="flex gap-2 items-center">
            {!hasUserReviewed && (
              <button
                className="md:px-5 md:py-2 px-3 py-1.5 h-[38px] rounded-[10px] flex items-center font-semibold border border-cBlue-light shadow-[0px_4px_6px_#1018280D] gap-1 md:text-lg text-xs"
                onClick={openModal}
              >
                <Image
                  src={Rating}
                  alt="rating"
                  height={20}
                  width={20}
                  className="md:h-5 md:w-5 h-4 w-4"
                />
                <span className=" font-semibold text-xs md:text-base">
                  Add Your Review
                </span>
              </button>
            )}
            {reviews && reviews.length >= 1 && (
              <Link
                href={`/game/${
                  gameData?.data?.[0]?.attributes?.slug ?? ""
                }/reviews`}
              >
                <button
                  type="button"
                  // onClick={() => {
                  //   setLoadModal(false);
                  //   setLoadFromDetails(true);
                  // }}
                  className="md:px-5 px-3 py-0 h-[38px] rounded-[10px] md:text-base text-xs font-semibold bg-cBlue-light text-white"
                >
                  See All
                </button>
              </Link>
            )}
          </div>
        </div>

        {reviews && reviews.length > 0 ? (
          <Swiper
            spaceBetween={24}
            className="mySwiper detail-review_side "
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            modules={[Navigation]}
            slidesPerView={2.5}
            loop={true}
            // pagination={{ clickable: true }}

            // loop={false}
            // slideToClickedSlide={true}
            // navigation={true}
            // modules={[Navigation]}
            breakpoints={{
              1200: {
                slidesPerView: reviews.length > 1 ? 2 : 1,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              480: {
                slidesPerView: 1.2,
                spaceBetween: 15,
              },
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
            pagination={{ clickable: true }}
          >
            {reviews &&
              reviews.length > 0 &&
              reviews?.map((review: any, index: any) => (
                <SwiperSlide key={index}>
                  <ReviewCard
                    reviewId={review.id}
                    navigateRoute={`/game/${gameData?.slug ?? ""}/reviews`}
                    key={review.id}
                    setIsOpenLogin={setIsOpenLogin}
                    review={review}
                    handleLike={handleLike}
                    handleReport={handleReport}
                    // setLoadModal={setLoadModal}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-40 rounded-14px mt-4">
            <p className="text-center text-sm md:text-base font-semibold text-gray-400">
              No reviews yet! Be the first to add a review for this game.
            </p>
          </div>
        )}

        {isModalOpen && (
          <ReviewModal
            onClose={closeModal}
            fetchLikeCountsAndReports={fetchLikeCountsAndReports}
            game={gameData}
          />
        )}
      </div>

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
    </>
  );
};

export default GameDetailsReview;

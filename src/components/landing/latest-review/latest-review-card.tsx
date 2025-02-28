import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import ThumbsUpFill from "../../../../public/icons/ThumbsUpFill.svg";
import ThumbsUp from "../../../../public/icons/ThumbsUp.svg";
import Flag from "../../../../public/icons/Flag.svg";
import FlagFill from "../../../../public/icons/FlagFill.svg";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoginModal from "@/components/login-modal/login-modal";
import LoaderBar from "@/components/loader-bar";
import { selectAuthState } from "@/store/slices/auth-slice";
import { getToken } from "@/utills/cookies";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import Image from "next/image";

const LatestReviewCard = () => {
  type Review = {
    id: number;
    reportCount: number;
    reportedByCurrentUser: boolean;
    likedBy: Array<{ email: string }>;
    reported_by: Array<{ email: string }>;
    likeCount: number;
    review_title?: string;
    review?: string;
    rating: number;
    game: {
      slug: string;
      title: string;
      image: { url: string };
    };
    user: {
      username: string;
      picture: { url: string };
    };
  };

  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const handleCloseLogin = () => setIsOpenLogin(false);
  const pathname = usePathname();
  const token = getToken();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${getApi()}/game-ratings/top-reviews`);
      setReviews(response?.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (userData && token) {
  //     setEmail(userData.email);
  //   } else {
  //     console.warn("Token is undefined");
  //   }

  //   fetchReviews();
  // }, [userData]);

  useEffect(() => {
    // Ensure Swiper correctly initializes navigation buttons
    const nextButton = document.querySelector(".custom-next");
    const prevButton = document.querySelector(".custom-prev");

    if (nextButton && prevButton) {
      nextButton.classList.add("swiper-button-next");
      prevButton.classList.add("swiper-button-prev");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center text-xl font-semibold text-[#97A6B1]">
        <LoaderBar />
      </div>
    );
  }

  const isLikedByCurrentUser = (likedBy: Array<{ email: string }>) => {
    return likedBy && likedBy.some((like) => like.email === email);
  };
  const isReportedByCurrentUser = (reportedBy: any[]) => {
    return reportedBy && reportedBy.some((user) => user.email === email);
  };

  const getUserData = async () => {
    console.log("inside 7");
    const { data } = await axios.get(`${getApi()}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const handleLikeClick = async (reviewId: number) => {
    if (!token) {
      toastMessage("You must be logged in to like a review", "error");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
      return;
    } else {
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
            data: { isDeleted: !likeData.attributes.isDeleted },
          };
          await axios.put(
            `${getApi()}/rating-likes/${likeData.id}`,
            updateData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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
        }
        console.log("outside 4");
        const likeResponse = await axios.get(`${getApi()}/rating-likes`, {
          params: {
            "filters[rating][id]": reviewId,
            "filters[isDeleted][$eq]": false,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const likeCount = likeResponse?.data?.data?.length;
        setReviews((prevReviews: any) =>
          prevReviews.map((review: any) =>
            review.id === reviewId
              ? {
                  ...review,
                  likeCount,
                  likedByCurrentUser: !review.likedByCurrentUser,
                }
              : review
          )
        );
        fetchReviews();
      } catch (error) {
        toastMessage("error", "Something went wrong");
        console.error(error);
      }
    }
  };

  const { id } = userData;
  const userId = id;
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
      const reportResponse = await axios.put(
        `${getApi()}/game-ratings/${reviewId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastMessage(
        "success",
        "Thank you for the report. We’ll review it soon."
      );
      const reportCount = reportResponse?.data?.data?.length;

      setReviews((prevReviews: any) =>
        prevReviews.map((review: any) =>
          review.id === reviewId
            ? { ...review, reportCount, reportedByCurrentUser: true }
            : review
        )
      );
      fetchReviews();
    } catch (error) {
      toastMessage("error", "Something went wrong");
      console.error(error);
    }
  };

  const handleReportClick = async (reviewId: number) => {
    if (!token) {
      toastMessage("You must be logged in to report a review", "error");
      localStorage.setItem(
        "Revisedslug",
        location.pathname && location.pathname
      );
      setIsOpenLogin(true);
      return;
    }

    if (
      isReportedByCurrentUser(
        reviews.find((r) => r.id === reviewId)?.reported_by || []
      )
    ) {
      toastMessage("error", "You have already reported this review.");
      return;
    }

    try {
      await handleReport(reviewId);
    } catch (error) {
      toastMessage("error", "Something went wrong");
      console.error(error);
    }
  };

  const renderStars = (rating: any) => {
    const maxStars = 5;
    const filledStars = Math.floor(rating / 2);
    const halfStar = (rating / 2) % 1 !== 0;

    // Create filled stars
    const filled = [...Array(filledStars)].map((_, index) => (
      <Image
        key={`filled-${index}`}
        src="/home/reviewfill.png"
        alt="filled star"
        className="w-5 h-5"
        width={20}
        height={20}
      />
    ));

    // Add a half star if needed
    const half = halfStar ? (
      <Image
        key="half-star"
        src="/home/reviewhalf.svg"
        alt="half star"
        className="w-5 h-5"
        width={20}
        height={20}
      />
    ) : null;

    // Create empty stars
    const empty = [...Array(maxStars - filledStars - (halfStar ? 1 : 0))].map(
      (_, index) => (
        <Image
          key={`empty-${index}`}
          src="/home/reviewicon.svg"
          alt="empty star"
          className="w-5 h-5"
          width={20}
          height={20}
        />
      )
    );

    return [...filled, half, ...empty];
  };

  return (
    <>
      <div className="relative">
        <div className="absolute top-1/2 left-[-25px] md:left-[-30px] flex justify-center z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
          <span className="bg-[#ccc] !w-8 !h-8 rounded-full p-1 md:p-2 flex items-center justify-center custom-prev">
            {" "}
            <FaChevronLeft
              className=" w-4 h-4 sm:w-5 sm:h-5 text-[#007aff]"
              size={22}
            />{" "}
          </span>
        </div>

        {/* Right Arrow */}
        <div className="absolute top-1/2 right-[-22px] md:right-[0px] flex justify-center z-[999] transform -translate-y-1/2 cursor-pointer text-white arrowss w-14 h-14">
          <span className="bg-[#ccc] !w-8 !h-8  rounded-full p-1 md:p-2 flex items-center justify-center custom-next">
            {" "}
            <FaChevronRight
              className=" w-4 h-4 sm:w-5 sm:h-5 text-[#007aff]"
              size={22}
            />{" "}
          </span>
        </div>

        <Swiper
          spaceBetween={30}
          className="!pr-0"
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          slidesPerView={4}
          breakpoints={{
            1920: {
              slidesPerView: 2.8,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1.6,
              spaceBetween: 16,
            },
            580: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
          }}
          pagination={{ clickable: true }}
        >
          {reviews && Array.isArray(reviews) && reviews?.length > 0 ? (
            reviews?.map((review: any) => (
              <SwiperSlide key={review.id}>
                <div className="review  bg-[url('/home/reviewbg.svg')] bg-center bg-cover bg-no-repeat p-4 rounded-xl !border !border-[#ffffff3b]">
                  <div className="flex border border-[#3C4F63] rounded-md items-center justify-between p-1">
                    <div
                      className="flex gap-2 cursor-pointer items-center font-semibold text-[16px] md:text-[20px]"
                      onClick={() => {
                        router.push(`/game/${review?.game?.slug}`);
                      }}
                    >
                      <Image
                        src={review?.game?.image?.url || "/placeholder.png"}
                        alt={review.game.title}
                        width={38}
                        height={36}
                        className="w-8 h-8 object-cover rounded-md"
                      />
                      <span className="text-left truncate w-20 md:w-52">
                        {review.game.title}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center font-medium text-base pr-1 md:pr-3">
                      <div className="flex gap-1 md:gap-2">
                        {renderStars(review.rating)}
                      </div>
                      {review.rating}/10
                    </div>
                  </div>

                  <div
                    className="details-gradient relative pb-3 cursor-pointer  text-left mt-4"
                    onClick={() => {
                      router.push(`/game/${review?.game?.slug}/reviews`, {
                        // state: {
                        //   fromLatestReviewCard: true,
                        //   reviewId: review?.id,
                        // },
                      });
                    }}
                  >
                    <span
                      className="text-[16px] md:text-[20px] font-semibold inline-block truncate"
                      style={{ width: "100%" }}
                    >
                      {review.review_title || "No review title given"}
                    </span>
                    <p className="text-[#97A6B1] text-xs leading-6 md:leading-8 md:text-base break-words font-normal min-h-[96px] mt-1">
                      {review.review?.length > 120 ? (
                        <>
                          {review.review.slice(0, 120)}...
                          <span
                            className="text-blue-500 cursor-pointer ml-2 hover:underline text-xs sm:text-[14px]"
                            onClick={() => {
                              router.push(`/game/${review?.game?.slug}`, {
                                // state: {
                                //   fromLatestReviewCard: true,
                                //   reviewId: review.id,
                                // },
                              });
                            }}
                          >
                            See More
                          </span>
                        </>
                      ) : (
                        review.review || "No review given"
                      )}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Image
                        src={review?.user?.picture?.url || "/dummyimg.png"}
                        alt={review.user.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      {review.user.username}
                    </div>
                    <div className="flex gap-3">
                      <div className="inline-flex gap-1 cursor-pointer items-center">
                        {/* ThumbsUp image*/}
                        <Image
                          src={
                            isLikedByCurrentUser(review.likedBy)
                              ? ThumbsUpFill
                              : ThumbsUp
                          }
                          alt="thumbsup"
                          height="20"
                          width="20"
                          onClick={() => handleLikeClick(review.id)}
                        />
                        <span className="text-xs text-[#C1C9ED] font-medium">
                          {review.likeCount}
                        </span>
                      </div>
                      <div className="inline-flex gap-1 cursor-pointer items-center">
                        <Image
                          src={
                            isReportedByCurrentUser(review.reported_by)
                              ? FlagFill
                              : Flag
                          }
                          alt="flag"
                          height="20"
                          width="20"
                          onClick={() => handleReportClick(review.id)}
                        />
                        <span className="text-xs text-[#C1C9ED] font-medium">
                          {review.reportCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex justify-center items-center text-[22px] text-center text-[#fff]">
              No reviews yet.
            </div>
          )}
        </Swiper>
      </div>

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
    </>
  );
};

export default LatestReviewCard;

// working code with object
import { useEffect, useRef, useState } from "react";
import Profile from "../../../../public/icons/user.svg";
import Rating from "../../../../public/icons/rating.svg";
import ThumbsUp from "../../../../public/icons/ThumbsUp.svg";
import ThumbsUpFill from "../../../../public/icons/ThumbsUpFill.svg";
import Flag from "../../../../public/icons/Flag.svg";
import FlagFill from "../../../../public/icons/FlagFill.svg";
import { usePathname } from "next/navigation";
import { getToken } from "@/utills/cookies";
import { toastMessage } from "@/utills/toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ReviewCard = ({
  navigateRoute,
  reviewId,
  review,
  handleLike,
  handleReport,
  showMoadl,
  setIsOpenLogin,
  reportsViewAll = false,
  loadFromDetails,
}: any) => {
  // const [isExpanded, setIsExpanded] = useState(true);
  // const [isOpenLogin, setIsOpenLogin] = useState(false);
  // const handleCloseLogin = () => setIsOpenLogin(false);

  const token = getToken();
  const router = useRouter();
  const reviewRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // State to track expanded review
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (review?.id === reviewId) {
      setExpandedReviewId(reviewId);
    }
  }, [reviewId, review?.id]);

  const handleToggle = () => {
    setExpandedReviewId((prev) => (prev === review.id ? null : review.id));
  };
  const isExpanded = expandedReviewId !== review.id;

  // const handleToggle = () => {
  //   setIsExpanded((prev) => !prev);
  // };

  const isLong = review.review.length > 120;
  const displayedText = isExpanded
    ? review.review
    : review.review.slice(0, 120) + (isLong ? "..." : "");
  if (!review) return null;
  // const isLong = review.review.length > 20;
  // const displayedText = isExpanded
  //   ? review.review
  //   : review.review.slice(0, 20) + (isLong && "...");

  const isLongInReviewPage = review.review.length > 200;
  const displayedTextInReviewPage = !isExpanded
    ? review.review
    : review.review.slice(0, 200) + (isLongInReviewPage && "...");

  const handleLikeClick = async () => {
    if (!token) {
      toastMessage("You must be logged in to like a review", "error");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
    } else {
      await handleLike(review?.id);
    }
  };

  const handleReportClick = async () => {
    if (!token) {
      toastMessage("You must be logged in to like a review", "error");
      localStorage.setItem("Revisedslug", pathname && pathname);
      setIsOpenLogin(true);
    } else {
      if (review.reportedByCurrentUser) {
        toastMessage("error", "You have already reported this review.");
        return;
      }

      await handleReport(review?.id);
    }
  };

  // const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reviewId === review.id && reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [reviewId, review.id]);
  console.log(loadFromDetails, "loadFromDetails", isExpanded);
  return (
    <>
      <div ref={reviewRef} className="flex flex-col gap-5">
        <div className="bg-cBlack-main flex flex-col rounded-xl p-5 gap-3 cursor-pointer">
          <div className="flex flex-col justify-between min-h-[99px] gap-2">
            <span className="review_title text-sm sm:text-base font-semibold text-start mb-1 break-words text-white">
              {review?.review_title}
            </span>
            <span
              className={`review_comments text-start text-xs sm:text-base font-normal break-words text-[#97A6B1] leading-5 ${
                reportsViewAll && ""
              } 
            
            `}
            >
              {!showMoadl && !loadFromDetails && reportsViewAll === false && (
                <>
                  {displayedText}
                  {review?.review?.length > 20 && (
                    <button
                      onClick={() =>
                        router.push(
                          navigateRoute
                          // {
                          // state: {
                          //   fromLatestReviewCard: true,
                          //   reviewId: reviewId,
                          // },
                          // }
                        )
                      }
                      className={`cursor-pointer text-xs font-semibold text-cBlue-light inline ${
                        isExpanded ? "ms-[4px]" : "ms-[6px]"
                      }`}
                    >
                      {/* {isExpanded ? "Show More" : "Show Less"} */}
                      Show More
                    </button>
                  )}
                </>
              )}

              {/* This work on review page only */}
              {!showMoadl && !loadFromDetails && reportsViewAll === true ? (
                <>
                  {displayedTextInReviewPage}
                  {review?.review.length > 200 && (
                    <button
                      onClick={handleToggle}
                      className={`cursor-pointer text-xs font-semibold text-cBlue-light inline ${
                        isExpanded ? "ms-[4px]" : "ms-[6px]"
                      } ${showMoadl === false ? "" : "line-clamp-2"}`}
                    >
                      {!isExpanded ? "Show Less" : " Show More"}
                    </button>
                  )}
                </>
              ) : loadFromDetails ? (
                <>
                  {isExpanded
                    ? review?.review
                    : review?.review.slice(0, 200) + "..."}
                  {review?.review?.length > 200 && (
                    <button
                      onClick={handleToggle}
                      className={`cursor-pointer text-xs sm:text-[12px] font-semibold text-cBlue-light inline ${
                        isExpanded
                          ? "ms-[8px] text-xs sm:text-[12px]"
                          : "text-xs sm:text-[12px]"
                      }`}
                    >
                      {isExpanded ? " Show Less" : "Show More"}
                    </button>
                  )}
                </>
              ) : (
                <>{reportsViewAll === true && review?.review} </>
              )}
              {/* This work on review page only */}
            </span>
            <div className="flex justify-between mt-3">
              <div className="flex gap-2 items-center">
                <Image
                  className="rounded-full min-h-10 min-w-10 h-10 w-10 object-cover"
                  src={
                    review?.user?.picture?.url
                      ? review?.user?.picture?.url
                      : Profile
                  }
                  alt="Profile Review"
                  height={40}
                  width={40}
                />
                <span className="pr-3 w-full overflow-hidden whitespace-nowrap overflow-ellipsis text-sm sm:text-base font-bold">
                  {review?.user?.username}
                </span>
              </div>

              <button className="flex gap-1 items-center bg-cBlue-light py-1 px-4 rounded-2xl h-[34px]">
                <Image
                  src={Rating}
                  alt="Profile Rating"
                  height={16}
                  width={12}
                />
                <span className="text-xs sm:text-base font-medium">
                  {" "}
                  {review.rating}/10
                </span>
              </button>
            </div>
          </div>
          <div className="flex-1 border-t border-gray-600"></div>

          <div className="flex justify-between">
            <div
              onClick={handleLikeClick}
              className="inline-flex gap-1 items-center"
            >
              <Image
                src={review.likedByCurrentUser ? ThumbsUpFill : ThumbsUp}
                alt="thumbsup"
                height={20}
                width={20}
              />
              <span className="text-xs font-medium">{review.likeCount}</span>
            </div>

            <div onClick={handleReportClick}>
              <Image
                src={review.reportedByCurrentUser ? FlagFill : Flag}
                alt="Flag"
                title="Flag"
                height={15}
                width={15}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCard;

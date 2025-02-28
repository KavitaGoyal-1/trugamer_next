import React, { useState } from "react";
import Rating from "../../../../public/icons/rating.svg";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { toastMessage } from "@/utills/toast";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface LoaderData {
  game: Record<string, any>;
}
interface AddYourReviewProps {
  fetchLikeCountsAndReports: any;
  gameSlug: any;
  review: any;
  userId: any;
  setIsOpenLogin: any;
  hasReviewed?: any;
  game_data?: any;
}
const AddYourReview: React.FC<AddYourReviewProps> = ({
  fetchLikeCountsAndReports,
  gameSlug,
  review,
  userId,
  setIsOpenLogin,
  hasReviewed,
  game_data,
}) => {
  // const { game } = useLoaderData() as LoaderData;
  const token = getToken();
  const [rating, setRating] = useState<number>(0);
  const [recommend, setRecommend] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const [validErrors, setValidErrors] = useState({
    rating: "",
    title: "",
    description: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const handleRatingChange = (num: number) => {
    setRating(num);
  };

  const validateForm = (
    rating: number | null,
    title: string,
    description: string
  ) => {
    let newErrors = {
      rating: "",
      title: "",
      description: "",
    };

    //  Rating Validation
    if (rating === 0 || rating === null) {
      newErrors.rating = "Rating must be greater than 0.";
    }

    //  Title Validations
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long.";
    } else if (title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    // Description Validations
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.trim().length < 250) {
      newErrors.description =
        "Description must be at least 250 characters long.";
    } else if (description.trim().length > 5000) {
      newErrors.description = "Description cannot exceed 1000 words.";
    }

    // 🔹 Preventing Empty Spaces
    if (title.trim().length === 0) {
      newErrors.title = "Title cannot be empty or just spaces.";
    }
    if (description.trim().length === 0) {
      newErrors.description = "Description cannot be empty or just spaces.";
    }

    setValidErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== ""); // Returns `true` if no errors
  };

  const handleReviewSubmit = async () => {
    if (hasReviewed) {
    } else {
      if (token) {
        if (!validateForm(rating, title, description)) return;
        setSaveLoading(true);
        try {
          const data = {
            rating,
            game: { id: game_data.data[0].id },
            review: description,
            review_title: title,
            is_recommended: recommend,
          };
          const response = await axios.post(`${getApi()}/game-ratings`, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSaveLoading(false);
          if (response) {
            fetchLikeCountsAndReports();
          }
          if (response) {
            toastMessage("success", "Thank you for submitting your review!");
            setRating(8);
            setTitle("");
            setDescription("");
            setRecommend(false);
          }
        } catch (error: any) {
          setSaveLoading(false);
          const msg =
            error?.response?.data?.error?.message || "Something went wrong";
          toastMessage("error", msg);
        }
      } else {
        localStorage.setItem("Revisedslug", pathname && pathname);
        setIsOpenLogin(true);
        // localStorage.setItem("Revisedslug", gameSlug);
      }
    }
  };

  return (
    <>
      <>
        <div className="bg-[#101A30]  md:p-5 shadow-lg rounded-xl px-3 py-8 max-h-[440px] max-h-full">
          <div className="flex justify-between mb-3">
            <h2 className="text-white md:text-lg font-semibold leading-6 text-xs">
              Add your review
            </h2>
            <div className="inline-flex bg-cBlue-light px-3.5 py-1 rounded-full gap-[4px] items-center">
              <Image
                src={Rating}
                alt="ratings"
                className="h-5 w-5"
                width={20}
                height={20}
              />
              <span className="text-white text-base font-medium">
                {rating}/10
              </span>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex gap-1 flex-wrap mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleRatingChange(num)}
                  className={`w-7 h-7 rounded-full text-white ${
                    num <= rating ? "bg-cBlue-light" : "bg-[#293759]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            {validErrors.rating && (
              <span className="text-red-500 text-xs mt-4 block text-start px-1">
                {validErrors.rating}
              </span>
            )}
          </div>

          <div className="mb-3 flex flex-col gap-2 items-start">
            <span className="text-white text-sm font-medium leading-5">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              className="w-full py-1.5 px-3.5 h-[36px] rounded-md bg-white text-[#667085] placeholder-gray-400 focus:outline-none"
            />
            {validErrors.title && (
              <span className="text-red-500 text-xs mt-1 w-full block text-start">
                {validErrors.title}
              </span>
            )}
          </div>

          <div className="mb-3 flex flex-col gap-2 items-start">
            <div className="text-white text-sm font-medium leading-5">
              Do You Recommend?
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  checked={recommend === true}
                  onChange={() => setRecommend(true)}
                  className="mr-2 h-4 w-4"
                />
                Yes
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  checked={recommend === false}
                  onChange={() => setRecommend(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-[8px] items-start">
            <div className="text-white text-sm font-medium leading-5">
              Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description..."
              className="w-full px-3.5 py-3 h-20 rounded-md bg-white text-[#667085] placeholder-gray-400 focus:outline-none"
            />
            {validErrors.description && (
              <span className="text-red-500 text-xs mt-1 w-full block text-start">
                {validErrors.description}
              </span>
            )}
            {/* <button
            className="py-1.5 px-4 text-sm font-semibold leading-6 bg-[#596184] rounded-xl flex mt-2 mb-3"
            onClick={handleReviewSubmit}
          >
            {hasReviewed ? "You have already reviewed this game" : "Rate this game"}
          </button> */}

            <button
              onClick={handleReviewSubmit}
              disabled={saveLoading || hasReviewed}
              className={`py-1.5 px-4 text-sm font-semibold leading-6 bg-[#596184] rounded-xl flex mt-2 mb-3
    ${
      saveLoading || hasReviewed
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#596184] hover:bg-[#4a5270]"
    }`}
            >
              {saveLoading && (
                <AiOutlineLoading3Quarters className="animate-spin text-white" />
              )}
              {saveLoading ? "Submitting..." : "Rate this game"}
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default AddYourReview;

import { useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { toastMessage } from "@/utills/toast";

const ReviewModal = ({
  onClose,
  fetchLikeCountsAndReports,
  gameData,
  game,
}: any) => {
  const token = getToken();
  const [rating, setRating] = useState<number | null>(0);
  const [title, setTitle] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [description, setDescription] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validErrors, setValidErrors] = useState({
    rating: "",
    title: "",
    description: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
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

    // 🔹 Description Validations
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.trim().length < 250) {
      newErrors.description =
        "Description must be at least 250 characters long.";
    } else if (description.split(/\s+/).length > 5000) {
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

  const handleSubmit = async () => {
    try {
      if (!validateForm(rating, title, description)) return;

      setSaveLoading(true);

      const data = {
        rating: rating,
        game: { id: gameData ? gameData.current.id : game.data[0].id },
        review: description,
        review_title: title,
        is_recommended: recommend,
      };

      let response = await axios.post(`${getApi()}/game-ratings`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaveLoading(false);
      if (response) {
        toastMessage("success", "Thank you for submitting your review!");
        fetchLikeCountsAndReports();
        onClose();
      }
    } catch (error: any) {
      setSaveLoading(false);
      let msg = error?.response?.data?.error?.message || "Something went wrong";
      toastMessage("error", msg);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg"
      style={{ zIndex: "999" }}
    >
      <div className="bg-[#1A2947] rounded-lg px-4 py-8 w-[354px] flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-white text-lg font-semibold leading-6">
              Write a review{" "}
            </h2>
            <span className=" bg-cBlue-light px-3 py-1 rounded-full text-white text-sm">
              {rating}/10
            </span>
          </div>
          <div className="flex items-start flex-col  justify-between">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleRatingChange(num)}
                  onMouseEnter={() => setHoveredRating(num)} // Set hovered rating on mouse enter
                  onMouseLeave={() => setHoveredRating(0)} // Reset on mouse leave
                  className={`w-7 h-7 rounded-full text-white ${
                    num <= (rating || 0) || num <= hoveredRating
                      ? "bg-cBlue-light" // Blue background for rated or hovered buttons
                      : "bg-[#293759]" // Default background color
                  } transition-colors duration-200`} // Smooth transition on hover
                >
                  {num}
                </button>
              ))}
            </div>
            {validErrors.rating && (
              <span className="text-red-500 mt-2">{validErrors.rating}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-start">
          <span className="text-white text-sm font-medium leading-5">
            Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            className="w-full py-2 px-3 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {validErrors.title && (
            <span className="text-red-500">{validErrors.title}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-white text-sm font-medium leading-5">
            Do You Recommend?
          </div>
          <div className="flex space-x-4">
            <label className="flex items-center text-white">
              <input
                type="radio"
                checked={recommend === true}
                onChange={() => setRecommend(true)}
                className="mr-2"
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
        <div className="flex flex-col gap-2 items-start">
          <div className="text-white text-sm font-medium leading-5">
            Description
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description..."
            className="w-full py-3 px-3.5 h-28 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {validErrors.description && (
          <span className="text-red-500 text-start">
            {validErrors.description}
          </span>
        )}
        {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="p-1.5 px-4 rounded-xl bg-[#596184] text-white text-sm font-semibold leading-6 w-[153px]"
          >
            Cancel
          </button>
          {/* <button
            onClick={handleSubmit}
            className="p-1.5 px-4 rounded-xl bg-[#596184] text-white text-sm font-semibold leading-6 w-[153px]"
          >
            Review this game
          </button> */}

          <button
            onClick={handleSubmit}
            disabled={saveLoading}
            className={`flex items-center justify-center gap-2 p-1.5 px-4 rounded-xl text-white text-sm font-semibold leading-6 w-[153px] 
    ${
      saveLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#596184] hover:bg-[#4a5270]"
    }`}
          >
            {saveLoading && (
              <AiOutlineLoading3Quarters className="animate-spin text-white" />
            )}
            {saveLoading ? "Submitting..." : "Review this game"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

import { useState, useEffect } from "react";
import { TfiAngleDown } from "react-icons/tfi";
import axios from "axios";
import { getToken } from "@/utills/cookies";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/slices/auth-slice";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";

type Genre =
  | "Point-and-click"
  | "Fighting"
  | "Shooter"
  | "Music"
  | "Platform"
  | "Puzzle"
  | "Racing"
  | "Real Time Strategy (RTS)"
  | "Role-playing (RPG)"
  | "Simulator"
  | "Sport"
  | "Strategy"
  | "Turn-based strategy (TBS)"
  | "Tactical"
  | "Hack and slash/Beat 'em up"
  | "Quiz/Trivia"
  | "Pinball"
  | "Adventure"
  | "Indie"
  | "Arcade"
  | "Visual Novel"
  | "Card & Board Game"
  | "MOBA";

interface IProps {
  data: { favouriteGenres: Genre[] };
}

export default function GenreSelector({ data }: IProps) {
  const token = getToken();
  const dispatch = useDispatch();

  const genres: Genre[] = [
    "Point-and-click",
    "Fighting",
    "Shooter",
    "Music",
    "Platform",
    "Puzzle",
    "Racing",
    "Real Time Strategy (RTS)",
    "Role-playing (RPG)",
    "Simulator",
    "Sport",
    "Strategy",
    "Turn-based strategy (TBS)",
    "Tactical",
    "Hack and slash/Beat 'em up",
    "Quiz/Trivia",
    "Pinball",
    "Adventure",
    "Indie",
    "Arcade",
    "Visual Novel",
    "Card & Board Game",
    "MOBA",
  ];

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  // Update selectedGenres whenever data.favouriteGenres changes
  useEffect(() => {
    if (data?.favouriteGenres) {
      setSelectedGenres(data?.favouriteGenres);
    }
  }, [data?.favouriteGenres]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as Genre;
    if (selectedValue && !selectedGenres.includes(selectedValue)) {
      setSelectedGenres([...selectedGenres, selectedValue]);
    }
    event.target.value = "";
  };

  const removeGenre = (genre: Genre) => {
    setSelectedGenres(selectedGenres.filter((item) => item !== genre));
  };

  const handleClickSaveGenres = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    let payload = {
      userData: {
        // ...data,
        favouriteGenres: selectedGenres,
      },
    };
    let payload1 = {
      userData: {
        ...data,
        favouriteGenres: selectedGenres,
      },
    };
    try {
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(signIn(payload1));
      toastMessage("success", "Profile updated successfully");
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };

  return (
    <>
      <label className="text-left text-sm font-medium text-white mb-2">
        Select Your Favourite Genres
      </label>

      <div className="py-4 pt-2 flex gap-5 flex-wrap xl:flex-nowrap">
        <div className="relative min-w-full md:min-w-[300px]">
          <TfiAngleDown className="absolute right-2 top-4 text-[#667085]" />
          <select
            onChange={handleSelect}
            className="p-2 border appearance-none h-11 border-[#D0D5DD] bg-white text-[#101828] rounded-lg mb-1 w-full focus-visible:outline-0"
            defaultValue=""
          >
            <option value="" disabled>
              Select Your Favourite Genres
            </option>
            {genres
              .filter((genre) => !selectedGenres.includes(genre)) // Exclude selected genres
              .map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-0">
          {selectedGenres.map((genre) => (
            <div
              key={genre}
              className="flex items-center bg-[#596184] text-white rounded-xl h-9 px-3 py-1 "
            >
              <span className="text-sm font-semibold">{genre}</span>
              <button
                onClick={() => removeGenre(genre)}
                className="ml-2 text-[#E60801] hover:text-red-700 text-2xl"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start gap-x-l3 mb-8">
        <button
          onClick={handleClickSaveGenres}
          className="bg-cBlue-light hover:bg-cBlue-main max-[500px]:w-full text-white text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold"
        >
          Save Genres
        </button>
      </div>
    </>
  );
}

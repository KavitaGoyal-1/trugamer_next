import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import { status } from "@/store/slices/auth-slice";
import Image from "next/image";

interface IGameDetailsPopUp {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  game_data?: any;
}
const GameDetailsPopUp = ({ setIsModalOpen, game_data }: IGameDetailsPopUp) => {
  const [review, setReview] = useState("");

  const token = getToken();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `${getApi()}/?populate=picture&populate=favorite_games.image&populate=active_devices.logo.image,inactive_devices.logo.images&populate=playing_now.image,playing_next.image,beaten_games.game.image,playing_now.devices.icon.image,playing_now.devices.logo.image,playing_next.devices.icon.image,playing_next.devices.logo.image,playing_now.releaseByPlatforms.release,playing_next.releaseByPlatforms.release&populate=games_library.image,games_library.devices.icon.image&populate=played_hour.game`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let payload = {
        userData: {
          playing_now: data.playing_now,
          playing_next: data.playing_next,
          beaten_games: data.beaten_games,
        },
      };
      dispatch(status(payload));
    } catch (error) {
      console.log(error);
    }
  };
  const handleExperience = async () => {
    let payload3 = {
      game: { id: game_data.data[0].id },
      user_xp: review,
    };
    try {
      let res = await axios.post(
        `${getApi()}/users-permissions/user/beat-game`,
        payload3,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastMessage("success", "You've successfully completed this game");
      getUser();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed grid top-0 left-0 right-0 bottom-0 backdrop-blur-sm  z-40">
      <div
        className="self-center place-self-center
                        w-[343px] pt-5 pb-4 px-4
                        bg-[#1A2947] rounded-2xl	
                        "
      >
        <div className="mb-6 grid gap-4">
          <div className="flex justify-center	pt-[7px]">
            <Image
              src="/game-details/user-1.png"
              alt="user image 1"
              width={56}
              height={56}
              className="translate-x-[20px] z-10"
            />
            <Image
              src="/game-details/user-3.png"
              alt="user image 3"
              width={56}
              height={56}
              className="translate-y-[-7px] z-20"
            />
            <Image
              src="/game-details/user-2.png"
              alt="user image 2"
              width={56}
              height={56}
              className="translate-x-[-20px] z-10"
            />
          </div>
          <div>
            <span className="font-semibold text-lg">Share Your Experience</span>
            <p className="text-[#A2A6B8] text-sm text-center">
              Please take a moment to let us know how long it took you to
              complete the game.
            </p>
          </div>
          <form className="grid gap-1.5">
            <label
              htmlFor="popupInput"
              className="text-sm font-medium text-start"
            >
              Feedback (optional)
            </label>
            <input
              type="text"
              placeholder="E.g. It's great.."
              name="popupInput"
              className="py-2.5 px-3.5 rounded-xl text-[#66708599] font-normal	w-full focus:outline-0 shadow-cShadow-main"
              onChange={(e) => {
                setReview(e.target.value);
              }}
            />
          </form>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <a
            className="bg-cBlue-light text-white pl-3.5 pr-[18px] py-2.5 rounded-xl	shadow-cShadow-main"
            onClick={handleExperience}
          >
            Send Feedback
          </a>
          <a
            className="bg-cPurple-light text-white px-[18px] py-2.5 rounded-xl	shadow-cShadow-main"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPopUp;

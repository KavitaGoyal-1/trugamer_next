import { logOut } from "@/store/slices/auth-slice";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const PrivacyContent = () => {
  const [userData, setUserData] = useState<any>();
  const [selectedOption, setSelectedOption] = useState(""); // state to manage the selected option
  const token = getToken();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleLogout = () => {
    dispatch(logOut());
    return router.push("/sign-in");
  };

  const getUserData = async () => {
    const { data: user } = await axios.get(
      `${getApi()}/users/me?populate=picture&populate=favorite_games.image&populate=active_devices.logo.image,inactive_devices.logo.images&populate=playing_now.image,playing_next.image,beaten_games.game.image,playing_now.devices.icon.image,playing_now.devices.logo.image,playing_next.devices.icon.image,playing_next.devices.logo.image,playing_now.releaseByPlatforms.release,playing_next.releaseByPlatforms.release&populate=games_library.image,games_library.devices.icon.image`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserData(user);
  };

  useEffect(() => {
    getUserData();
    if (!token) {
      handleLogout();
    }
  }, []);

  return (
    <div className="w-full py-4 pt-0 md:pt-2 bg-[#0F111F] rounded-lg pb-0 overflow-auto h-full md:h-[75vh] lg:h-[500px] 2xl:h-[540px] xxl:h-[60vh] relative overflow-x-hidden">
      <div className="w-full max-w-[100%] pb-4 rounded-[14px] px-4 hidden md:flex">
        <h3 className="text-2xl font-bold my-0 ">Privacy Settings</h3>
      </div>

      <div className="w-full px-4 mb-6">
        <div className="grid public-profile">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              // defaultChecked={
              //   updateProfile.publicProfile && updateProfile.publicProfile
              // }
              value=""
              className="sr-only peer focus:outline-0 ps-2 focus:shadow-none"
              // onChange={(e) =>
              //   setUpdateProfile({
              //     ...updateProfile,
              //     publicProfile: e.target.checked,
              //   })
              // }
            />
            <div className="pro-sha w-[36px] h-[20px] bg-[#ffffff1a] rounded-full peer peer-focus:ring-4 peer-focus:ring-none dark:peer-focus:ring-none  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cBlue-light "></div>
            <span className="ml-3 text-sm text-white font-medium">
              Public profile
            </span>
          </label>
          <p className="ml-[48px] text-start text-sm text-cPurple-light ">
            Share your gaming experience with others.
          </p>
        </div>
      </div>

      {/* Popular Genres */}
      <div className="w-full px-4 mb-6">
        <div className=" relative mb-2">
          <h2 className="text-lg font-semibold">
            <span className="bg-[#0f111f] relative z-10 pr-3 ">
              Queue Visibility
            </span>
            <span className="line-right"></span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <form className="flex gap-4 flex-col">
            <div className="flex public-profile flex-col items-start justify-start">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="public"
                  name="visibility" // Same name for all radio buttons to ensure one selection at a time
                  checked={selectedOption === "public"}
                  onChange={handleRadioChange}
                  className="ps-2 focus:shadow-none w-6 h-6"
                />
                <div className="text-left">
                  <span className="ml-3 text-sm text-white font-medium">
                    Public
                  </span>
                  <p className="ml-3 text-start text-sm text-cPurple-light ">
                    Anyone can view your queues.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex public-profile flex-col items-start justify-start">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="followers-only"
                  name="visibility" // Same name for all radio buttons
                  checked={selectedOption === "followers-only"}
                  onChange={handleRadioChange}
                  className="ps-2 focus:shadow-none w-6 h-6"
                />
                <div className="text-left">
                  <span className="ml-3 text-sm text-white font-medium">
                    Followers Only
                  </span>
                  <p className="ml-3 text-start text-sm text-cPurple-light ">
                    Only followers can view your queues.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex public-profile flex-col items-start justify-start">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="not-visible"
                  name="visibility" // Same name for all radio buttons
                  checked={selectedOption === "not-visible"}
                  onChange={handleRadioChange}
                  className="ps-2 focus:shadow-none w-6 h-6"
                />
                <div className="text-left">
                  <span className="ml-3 text-sm text-white font-medium">
                    Not Visible
                  </span>
                  <p className="ml-3 text-start text-sm text-cPurple-light ">
                    No one can view your queues.
                  </p>
                </div>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-btm mt-6 flex items-start justify-start px-4">
        <button className=" bg-cBlue-light py-3 md:py-2 px-3 cursor-pointer text-white text-xs md:text-base font-semibold rounded-[10px]">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PrivacyContent;

import { selectAuthState, signIn, status } from "@/store/slices/auth-slice";
import { setSteamId } from "@/store/slices/steam-id-slice";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface passwordProps {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

interface IProps {
  data: any;
  loading: any;
  setLoading: any;
}

type GamerTag = {
  Steam?: string;
  Xbox?: string;
  Playstation?: string;
  Ubisoft?: string;
};

const SettingsContent = ({ data, loading, setLoading }: IProps) => {
  const [passwordInput, setPasswordInput] = useState<passwordProps>({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });
  // const [curPassword, setCurPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [retypePassword, setRetypePassword] = useState("");
  const [showPasswordLoading, setShowPasswordLoading] = useState(false);
  // const [currentPassword, setCurrentPassword] = useState(false);
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  // const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const { userData } = useSelector(selectAuthState);
  const [updateProfile, setUpdateProfile] = useState({
    publicProfile: userData?.publicProfile,
    username: userData?.username,
    xboxLiveGamerTagId: userData?.xboxLiveGamerTagId,
    steamId: userData.steamId,
    playstationNetworkId: userData?.playstationNetworkId,
    user_gamer_tag: userData.user_gamer_tag,
  });
  const token = getToken();
  // console.log(userData.user_gamer_tag, "userData::");

  const platforms = ["Steam", "Xbox", "Playstation", "Ubisoft"];
  // const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<{
    [key: string]: string;
  }>({});
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userGamerTag = userData?.user_gamer_tag;

    if (userGamerTag) {
      const platforms = Object.keys(userGamerTag);
      const newSelectedPlatforms: any = {};

      platforms.forEach((platform) => {
        if (userGamerTag[platform]) {
          newSelectedPlatforms[platform] = userGamerTag[platform];
        }
      });

      setSelectedPlatforms(newSelectedPlatforms[0]);
    }
  }, [userData, data]);

  // Handle platform selection
  const handleSelect = (platform: string) => {
    setSelectedPlatforms((prev = {}) => {
      if (prev.hasOwnProperty(platform)) {
        // Remove platform if already selected
        const updatedPlatforms = { ...prev };
        delete updatedPlatforms[platform];
        return updatedPlatforms;
      } else {
        // Add platform with an empty input value
        return { ...prev, [platform]: "" };
      }
    });
  };

  // Handle input change for each platform
  const handleInputChange = (platform: string, value: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  // Handle platform deletion
  const handleDelete = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const updatedPlatforms = { ...prev };
      delete updatedPlatforms[platform];
      return updatedPlatforms;
    });
  };

  const handlePasswordChange = async (e: any) => {
    try {
      setShowPasswordLoading(true);
      const res = await axios.post(
        `${getApi()}/auth/change-password`,
        passwordInput,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowPasswordLoading(false);
      toastMessage("success", "Password change successfully");
    } catch (error: any) {
      setShowPasswordLoading(false);
      if (error?.response?.data?.error?.message == "Internal Server Error") {
        toastMessage("error", "Please check your paasword");
      } else {
        toastMessage("error", error?.response?.data?.error?.message);
      }
    }
  };

  const togglePassword = (field: string) => {
    switch (field) {
      case "currentPass":
        {
          if (currentPasswordType === "password") {
            setCurrentPasswordType("text");
            return;
          }
          setCurrentPasswordType("password");
        }
        break;
      case "newPass":
        {
          if (newPasswordType === "password") {
            setNewPasswordType("text");
            return;
          }
          setNewPasswordType("password");
        }
        break;
      case "confirmPass":
        {
          if (confirmPasswordType === "password") {
            setConfirmPasswordType("text");
            return;
          }
          setConfirmPasswordType("password");
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Remove spaces from the input value
    const cleanedValue = value.replace(/\s+/g, "");

    setUpdateProfile((prevProfile: any) => ({
      ...prevProfile,
      [name]: cleanedValue,
    }));
  };

  const handleSaveChanges = async (e?: any, wizardText?: string) => {
    e.preventDefault();
    const filteredPlatforms = Object.fromEntries(
      Object.entries(selectedPlatforms).filter(([key, value]) => key.length > 0)
    );

    let payload = {
      userData: {
        // ...data,
        xboxLiveGamerTagId: updateProfile?.xboxLiveGamerTagId || 0,
        playstationNetworkId: updateProfile?.playstationNetworkId || 0,
        steamId: updateProfile?.steamId || 0,
        user_gamer_tag:
          Object.keys(filteredPlatforms).length > 0
            ? [filteredPlatforms]
            : null,
      },
    };
    let payload1 = {
      userData: {
        ...data,
        xboxLiveGamerTagId: updateProfile?.xboxLiveGamerTagId || 0,
        playstationNetworkId: updateProfile?.playstationNetworkId || 0,
        steamId: updateProfile?.steamId || 0,
        user_gamer_tag:
          Object.keys(filteredPlatforms).length > 0
            ? [filteredPlatforms]
            : null,
      },
    };
    try {
      setLoading(true);
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload?.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const payload2 = {
        userData: {
          ...data,
          user_gamer_tag: [selectedPlatforms],
        },
      };
      dispatch(signIn(payload1));
      dispatch(status(payload2));
      await dispatch(setSteamId(updateProfile?.steamId));
      if (!wizardText) {
        setLoading(false);
        // if("gamer_tag must be at least 3 characters"){}
        toastMessage("success", "Profile updated successfully");
      }
    } catch (error: any) {
      setLoading(false);
      if (
        error?.response?.data?.error?.message ===
        "gamer_tag must be at least 3 characters"
      ) {
        toastMessage("error", "Gamer tag must be at least 3 characters");
      } else {
        toastMessage("error", "Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="w-full py-4 pt-0 md:pt-4 bg-[#0F111F] rounded-lg pb-0 overflow-x-hidden overflow-auto h-full md:h-[75vh] lg:h-[500px] 2xl:h-[540px] xxl:h-[60vh] relative">
        <div className="w-full max-w-[100%] pb-4 rounded-[14px] px-4">
          <h3 className="text-2xl font-bold my-0 ">Settings</h3>
        </div>

        <div className=" relative px-4 ">
          <h2 className="text-lg font-semibold">
            <span className="bg-[#0f111f] relative z-10 pr-3">Basic Info</span>
            <span className="line-right"></span>
          </h2>
        </div>

        <div className="mt-4 px-4">
          <div className="w-full flex flex-wrap text-start gap-4">
            <div className="mb-2 w-full lg:w-[98%]">
              <label className="block text-sm font-medium text-white mb-1">
                Username
              </label>
              <input
                type="text"
                // value="Robert"
                defaultValue={updateProfile.username && updateProfile.username}
                disabled={true}
                readOnly
                className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
              />
            </div>
            {/* <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                Profile Link
              </label>
              <a
                href="https://trugamer.com/rfox22"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-base text-[#667085] flex items-center gap-2"
              >
                trugamer.com/rfox22 <img src="/Account/arrow-bottom.png" />
              </a>
            </div> */}

            <div className="mb-2 w-full lg:w-[98%]">
              <label className="block text-sm font-medium text-white mb-1">
                Enter Current Password
              </label>
              <div className="relative">
                <input
                  type={currentPasswordType}
                  value={passwordInput.currentPassword}
                  onChange={(e) =>
                    setPasswordInput({
                      ...passwordInput,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  // onClick={() => setCurrentPassword(!currentPassword)}
                  className="absolute right-3 top-3 text-[#667085]"
                >
                  {currentPasswordType === "password" ? (
                    <BsEyeSlash onClick={() => togglePassword("currentPass")} />
                  ) : (
                    <BsEye onClick={() => togglePassword("currentPass")} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={newPasswordType}
                  value={passwordInput.password}
                  onChange={(e) =>
                    setPasswordInput({
                      ...passwordInput,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  // onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#667085]"
                >
                  {newPasswordType === "password" ? (
                    <BsEyeSlash onClick={() => togglePassword("newPass")} />
                  ) : (
                    <BsEye onClick={() => togglePassword("newPass")} />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordType}
                  value={passwordInput.passwordConfirmation}
                  onChange={(e) =>
                    setPasswordInput({
                      ...passwordInput,
                      passwordConfirmation: e.target.value,
                    })
                  }
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
                />

                <button
                  type="button"
                  // onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute right-3 top-3 text-[#667085]"
                >
                  {confirmPasswordType === "password" ? (
                    <BsEyeSlash onClick={() => togglePassword("confirmPass")} />
                  ) : (
                    <BsEye onClick={() => togglePassword("confirmPass")} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex">
              <button
                type="button"
                className="w-full px-4 py-2 text-sm text-white bg-[#00ADFF] rounded-lg hover:bg-[#007ACC] transition-colors"
                onClick={handlePasswordChange}
                disabled={showPasswordLoading}
              >
                {showPasswordLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className=" relative px-4 mt-6">
          <h2 className="text-lg font-semibold">
            <span className="bg-[#0f111f] relative z-10 pr-3">Platform ID</span>
            <span className="line-right "></span>
          </h2>
        </div>

        <div className="mt-4 px-4">
          <div className="w-full flex flex-wrap text-start gap-4">
            <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                Steam ID
              </label>
              <input
                type="number"
                name="steamId"
                value={
                  updateProfile?.steamId == 0
                    ? ""
                    : updateProfile?.steamId || ""
                }
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 18) {
                    target.value = target.value.slice(0, 18); // Restrict input to 4 characters
                  }
                }}
                placeholder="Enter Steam Id"
                className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                Play Station ID
              </label>
              <input
                type="number"
                name="playstationNetworkId"
                value={
                  updateProfile?.playstationNetworkId == 0
                    ? ""
                    : updateProfile?.playstationNetworkId || ""
                }
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 20) {
                    target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                  }
                }}
                placeholder="Enter PlayStation Id"
                className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
              />
            </div>

            <div className="mb-2 w-full lg:w-[48%]">
              <label className="block text-sm font-medium text-white mb-1">
                Xbox ID
              </label>
              <input
                type="number"
                name="xboxLiveGamerTagId"
                value={
                  updateProfile?.xboxLiveGamerTagId == 0
                    ? ""
                    : updateProfile.xboxLiveGamerTagId
                }
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 20) {
                    target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                  }
                }}
                placeholder="Enter Xbox Id"
                className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className=" relative px-4 mt-6">
          <h2 className="text-lg font-semibold">
            <span className="bg-[#0f111f] relative z-10 pr-3">Gamer Tag</span>
            <span className="line-right "></span>
          </h2>
        </div>

        <div className="mt-4 mb-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dropdown (Always Left) */}
            <div className="mb-2 w-full lg:w-[100%] md:col-span-1">
              <label className="block text-sm font-medium text-white mb-1 text-start">
                Select Platforms
              </label>
              <button
                className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none text-start flex justify-between items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Select Platforms
                <span>
                  {dropdownOpen ? (
                    <FaAngleUp size={20} />
                  ) : (
                    <FaAngleDown size={20} />
                  )}
                </span>
              </button>

              {dropdownOpen && (
                <div className="mt-2 bg-white rounded-md shadow-lg border border-[#D0D5DD] z-10">
                  {platforms.map((platform) => (
                    <label
                      key={platform}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-[#D0D5DD] last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={platform in (selectedPlatforms || {})} // Check if platform exists in state
                        onChange={() => handleSelect(platform)}
                        id={platform}
                        className="form-checkbox"
                      />
                      <span
                        className={`${
                          selectedPlatforms?.[platform]
                            ? "text-[#101828]"
                            : "text-[#1018284D]"
                        }`}
                      >
                        {platform}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Input Fields (Zig-Zag Layout) */}
            {Object.keys(selectedPlatforms || {})?.map((platform, index) => (
              <div
                key={platform}
                className={`relative mb-2 w-full lg:w-[100%] ${
                  index % 2 === 0 ? "md:col-start-2" : "md:col-start-1"
                }`}
              >
                <label className="block text-sm font-medium text-white mb-1 text-left">
                  {platform}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedPlatforms[platform]}
                    onChange={(e) =>
                      handleInputChange(platform, e.target.value)
                    }
                    placeholder="Enter text"
                    className="w-full px-4 py-2 h-11 text-sm bg-white text-[#667085] rounded-lg focus:outline-none"
                  />
                  <RiDeleteBin6Line
                    className="text-red-500 cursor-pointer absolute right-3 top-3.5"
                    onClick={() => handleDelete(platform)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex mt-3 mb-8">
            <button
              type="button"
              onClick={handleSaveChanges}
              className=" px-4 py-2 text-sm text-white bg-[#00ADFF] rounded-lg hover:bg-[#007ACC] transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsContent;

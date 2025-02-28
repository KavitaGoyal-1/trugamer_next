import React, { useEffect, useState } from "react";
import UserEmailInput from "./user-email-input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Select } from "react-daisyui";
import Modal from "../modal";
import { RxCross2 } from "react-icons/rx";
import { BiHide, BiShow } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import Welcome from "../welcome/welcome";
import WelcomeOne from "../welcome/welcome-one";
import WelcomeTwo from "../welcome/welcome-two";
import { toastMessage } from "@/utills/toast";
import { selectAuthState, signIn } from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import { uploadImage } from "@/utills/upload-image";
import Image from "next/image";

const countryArray = ["USA", "UK", "Canada", "Australia", "New Zealand"];

interface passwordProps {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

const UserProfileSettings = () => {
  const { userData } = useSelector(selectAuthState);
  const [updateProfile, setUpdateProfile] = useState({
    gamer_tag: userData.gamer_tag,
    country: userData.country,
    bio: userData.bio,
    publicProfile: userData.publicProfile,
    username: userData.username,
  });
  const [image, setImage] = useState<any>(userData.picture);
  const [countryDropdown, setCountryDropdown] = useState<any>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [showWelcomePopupOne, setShowWelcomePopupOne] = useState(false);
  const [showWelcomePopupSecond, setShowWelcomePopupSecond] = useState(false);
  const [showWelcomePopupThree, setShowWelcomePopupThree] = useState(false);
  const [passwordInput, setPasswordInput] = useState<passwordProps>({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });

  const dispatch = useDispatch();
  const token = getToken();
  const Option = Select.Option;

  const getuser = async () => {
    const res = await axios.get(`${getApi()}/users/${userData.id}`);
    const data = res?.data;
    if (data?.newRegister) {
      setShowWelcomePopupOne(true);
    }
  };

  useEffect(() => {
    if (userData.id) {
      getuser();
    }
  }, [userData.id]);

  const imageUpload = async (e: any) => {
    const apiResponse: any = await uploadImage(e, `${token}`);
    setImage(apiResponse.response.data[0]);
  };

  const handleChange = async (e: any) => {
    e.preventDefault();
    let payload = {
      userData: {
        // ...userData,
        gamer_tag: updateProfile.gamer_tag,
        country: updateProfile.country,
        bio: updateProfile.bio,
        picture: image,
        publicProfile: updateProfile.publicProfile,
      },
      checking: false,
      hRemember: false,
    };
    let payload1 = {
      userData: {
        ...userData,
        gamer_tag: updateProfile.gamer_tag,
        country: updateProfile.country,
        bio: updateProfile.bio,
        picture: image,
        publicProfile: updateProfile.publicProfile,
      },
      checking: false,
      hRemember: false,
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

  const toggleVisible = (e: any) => {
    e.preventDefault();
    setVisible(!visible);
    setPasswordInput({
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    });
  };

  const handlePasswordChange = async (e: any) => {
    try {
      const res = await axios.post(
        `${getApi()}/auth/change-password`,
        passwordInput,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastMessage("success", "Password change successfully");
      toggleVisible(e);
    } catch (error: any) {
      toastMessage("error", error?.response?.data?.error?.message);
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
  const isDisabled = true;

  const openWelcomeOne = () => {
    setShowWelcomePopupSecond(true); // Open the WelcomeOne modal
    setShowWelcomePopupOne(false); // Close the Welcome modal
  };
  const openWelcomeTwo = () => {
    setShowWelcomePopupThree(true); // Open the WelcomeOne modal
    setShowWelcomePopupOne(false);
    setShowWelcomePopupSecond(false); // Close the Welcome modal
  };
  const handleProfile = async () => {
    //  navigate("/profile");
    let payload = {
      userData: {
        // ...userData,
        newRegister: false,
      },
      checking: false,
      hRemember: false,
    };
    let payload1 = {
      userData: {
        ...userData,
        newRegister: false,
      },
      checking: false,
      hRemember: false,
    };
    try {
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload?.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(signIn(payload1));
      // setHandleClose(true)
      setShowWelcomePopupThree(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="grid justify-items-start max-lg:px-[5%] mt-[5px] max-md:px-0">
        <h1 className="font-bold text-[24px]">Profile Settings</h1>
        <form className="grid grid-cols-1 gap-4 py-5 px-0 w-full">
          <div className="grid">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={
                  updateProfile.publicProfile && updateProfile.publicProfile
                }
                value=""
                className="sr-only peer focus:outline-0 ps-2"
                onChange={(e) =>
                  setUpdateProfile({
                    ...updateProfile,
                    publicProfile: e.target.checked,
                  })
                }
              />
              <div className="w-[36px] h-[20px] bg-[#ffffff1a] rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cBlue-light "></div>
              <span className="ml-3 text-sm text-white font-medium">
                Public profile
              </span>
            </label>
            <p className="ml-[48px] text-start text-sm text-cPurple-light ">
              Share your gaming experience with others.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Username (Disabled) */}
            <div className="grid grid-cols-1 gap-2 justify-items-start content-center">
              <label htmlFor="userName" className="text-[14px] font-medium">
                User Name
              </label>
              <div className="grid grid-cols-[max-content_1fr] w-full">
                <div
                  className={`${
                    isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white"
                  } rounded-tl-lg rounded-bl-lg h-[44px] py-2.5 px-3.5 border-r-[1px] border-[#D0D5DD]`}
                >
                  <p className="text-base text-cGray-500 font-normal">
                    trugamer.com/
                  </p>
                </div>
                <input
                  type="text"
                  name="userName"
                  defaultValue={
                    updateProfile.username && updateProfile.username
                  }
                  placeholder="rfox22"
                  disabled={isDisabled}
                  className={`${
                    isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white"
                  } rounded-br-lg rounded-l-none rounded-tr-lg h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Email (Disabled) */}
            <UserEmailInput email={userData.email} />

            {/* Profile Link */}
            <div className="grid grid-cols-1 gap-2 justify-items-start content-center">
              <label htmlFor="profileLink" className="text-[14px] font-medium">
                Profile Link
              </label>
              <div className="w-full relative">
                <input
                  type="text"
                  name="profileLink"
                  placeholder="trugamer.com/rfox22"
                  className="bg-white rounded-lg h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                />
                <FaRegCopy className="absolute cursor-pointer right-2 top-3 text-[#667085]" />
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="grid grid-cols-[1] gap-2 justify-items-start content-center">
            <label htmlFor="location" className="text-[14px] font-medium">
              Country
            </label>
            <Select
              value={updateProfile.country}
              name="location"
              onChange={(e: any) => {
                setUpdateProfile({ ...updateProfile, country: e.target.value });
              }}
              className="bg-white px-3 rounded-lg h-[44px]	py-2.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0 relative cursor-pointer"
            >
              {countryDropdown && (
                <>
                  <Option className="my-2" value={"default"} disabled>
                    Select your country
                  </Option>
                  {countryArray?.map((country, index) => (
                    <Option
                      value={country}
                      key={index}
                      className="hover:bg-gray-300 py-2 rounded-lg my-2"
                    >
                      <div className="flex grid grid-cols-1 ">
                        <p className="ml-2">{country}</p>
                      </div>
                    </Option>
                  ))}
                </>
              )}
            </Select>
          </div>
          {/* Bio */}
          <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
            <label htmlFor="bio" className="text-[14px] font-medium">
              Bio
            </label>
            <textarea
              name="bio"
              placeholder="Who are you and what brings you to the Trugamer community."
              maxLength={275}
              defaultValue={updateProfile.bio && updateProfile.bio}
              onChange={(e) =>
                setUpdateProfile({ ...updateProfile, bio: e.target.value })
              }
              className="bg-white rounded-lg h-[128px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
            />
            <p className="text-[#999DB0] text-sm font-normal">
              {!updateProfile.bio ? "275" : 275 - updateProfile.bio.length}{" "}
              characters left
            </p>
          </div>
          {/* Profile Image Upload */}
          <div className="grid grid-cols-[1fr_max-content] gap-5">
            <div className="w-full h-[126px] bg-white rounded-lg grid place-items-center place-content-center cursor-pointer">
              <input
                type="file"
                onChange={(e: any) => imageUpload(e.target.files[0])}
                className="bg-red-300"
                hidden
                id="imageUpload"
              />
              <label htmlFor="imageUpload">
                <div className="h-[94px] grid grid-cols-1 grid-rows-[max-content_1fr] gap-y-3 justify-items-center">
                  <Image
                    src="/icons/upload-cloud.svg"
                    alt="Upload Icon"
                    // title="Upload Icon"
                    height={40}
                    width={40}
                  />
                  <p className="text-cGray-500 text-sm text-center">
                    <span className="text-cBlue-light font-semibold">
                      Click to upload
                    </span>
                    <br />
                    SVG, PNG, JPG or GIF (max. 800x800px)
                  </p>
                </div>
              </label>
            </div>

            {image && (
              <Image
                src={image && image?.url}
                alt="User Image"
                // title="User Image"
                height={64}
                width={64}
                className="rounded-full w-[60px] h-[60px]"
              />
            )}
          </div>

          {/* Change Password */}
          <div className="grid grid-cols-1 gap-2 justify-items-start content-center my-3">
            <button
              onClick={(e) => toggleVisible(e)}
              className="inline-block bg-cBlue-light hover:bg-cBlue-main text-white text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold max-[500px]:w-full"
            >
              Change Password
            </button>
          </div>
          {/* Save Changes Button */}
          <div className="flex justify-start gap-x-3 mb-8">
            <button
              onClick={handleChange}
              className="bg-cBlue-light hover:bg-cBlue-main max-[500px]:w-full text-white text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold"
            >
              Save changes
            </button>
          </div>
        </form>
        <Modal show={visible} setShow={setVisible}>
          <div className="bg-[#1A2947] h-[400px] flex flex-col justify-between">
            <div className="flex flex-col mx-6">
              <div className="flex justify-end py-3">
                <RxCross2 className="w-6 h-6" onClick={toggleVisible} />
              </div>
              <p className="text-[18px] font-[600] mb-4">Change Password</p>
              <div className="mb-2">
                <label
                  htmlFor="currentPassword"
                  className="text-[14px] font-medium "
                >
                  Current Password
                </label>
                <div className="grid grid-cols-[max-content_1fr] w-full">
                  <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
                    {currentPasswordType === "password" ? (
                      <BiShow
                        onClick={() => togglePassword("currentPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    ) : (
                      <BiHide
                        onClick={() => togglePassword("currentPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    )}
                  </div>

                  <input
                    type={currentPasswordType}
                    value={passwordInput.currentPassword}
                    name="currentPassword"
                    placeholder="Enter your Current Password"
                    className="bg-white rounded-tr-lg rounded-br-lg  h-[44px] pl-2	py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                    onChange={(e) =>
                      setPasswordInput({
                        ...passwordInput,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="newPassword"
                  className="text-[14px] font-medium "
                >
                  New Password
                </label>
                <div className="grid grid-cols-[max-content_1fr] w-full">
                  <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
                    {newPasswordType === "password" ? (
                      <BiShow
                        onClick={() => togglePassword("newPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    ) : (
                      <BiHide
                        onClick={() => togglePassword("newPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    )}
                  </div>

                  <input
                    type={newPasswordType}
                    name="newPassword"
                    placeholder="Enter your New Password"
                    value={passwordInput.password}
                    className="bg-white rounded-tr-lg rounded-br-lg  h-[44px] pl-2	py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                    onChange={(e) =>
                      setPasswordInput({
                        ...passwordInput,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="text-[14px] font-medium ">
                  Confirm Password
                </label>
                <div className="grid grid-cols-[max-content_1fr] w-full">
                  <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
                    {confirmPasswordType === "password" ? (
                      <BiShow
                        onClick={() => togglePassword("confirmPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    ) : (
                      <BiHide
                        onClick={() => togglePassword("confirmPass")}
                        className="text-gray-600 w-5 h-5"
                      />
                    )}
                  </div>

                  <input
                    type={confirmPasswordType}
                    name="confirmPassword"
                    placeholder="Confirm your Password"
                    value={passwordInput.passwordConfirmation}
                    className="bg-white rounded-tr-lg rounded-br-lg  h-[44px] pl-2	py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                    onChange={(e) =>
                      setPasswordInput({
                        ...passwordInput,
                        passwordConfirmation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-x-4">
                <button
                  onClick={toggleVisible}
                  className="inline-block bg-white  text-[#344054] text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="inline-block bg-cBlue-light hover:bg-cBlue-main text-white text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </section>

      <Welcome isOpenWel={showWelcomePopupOne} onNext={openWelcomeOne} />
      <WelcomeOne isOpenWel={showWelcomePopupSecond} onNext={openWelcomeTwo} />
      <WelcomeTwo isOpenWel={showWelcomePopupThree} onClose={handleProfile} />
    </>
  );
};

export default UserProfileSettings;

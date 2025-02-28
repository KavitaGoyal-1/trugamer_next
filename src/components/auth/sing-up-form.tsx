import axios, { AxiosError } from "axios";
import { useForm } from "../../hooks/use-form";
import { useSelector, useDispatch } from "react-redux";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toastMessage } from "@/utills/toast";
import {
  authError,
  selectAuthState,
  signIn,
  startChecking,
  endChecking,
} from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import LoaderSpinner from "@/components/loader-spinner";
import { setTokenWithExpiration } from "@/utills/expiration-dates";
import GoogleAuthBtn from "@/components/auth/google-auth-btn";

const SingUpForm = () => {
  const [errorMsg, setErrorMsg] = useState<SetStateAction<null | string>>(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [ageCheckboxChecked, setAgeCheckboxChecked] = useState(false);
  const [emailVerificationMessage, setEmailVerificationMessage] =
    useState<SetStateAction<null | string>>(null);
  const [showWelcomePopupOne, setShowWelcomePopupOne] = useState(false);
  const [showWelcomePopupSecond, setShowWelcomePopupSecond] = useState(false);
  const [showWelcomePopupThree, setShowWelcomePopupThree] = useState(false);
  const router = useRouter();
  const [formValues, handleImputChange] = useForm({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { checking } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const { userName, email, password, confirmPassword } = formValues;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(startChecking());
    try {
      if (password !== confirmPassword) {
        toastMessage("error", "Passwords doesn't match");
        dispatch(endChecking());
        return;
      } else {
        const { data, statusText } = await axios.post(
          `${getApi()}/auth/local/register`,
          {
            username: userName,
            email: email,
            password: password,
          }
        );
        if (statusText === "OK") {
          const { user, jwt } = data;
          router.push("/");
          if (user !== undefined && jwt === undefined) {
            dispatch(endChecking());
            setEmailVerificationMessage(
              "Thanks for registering, please check your email for verification!"
            );
          } else {
            setTokenWithExpiration(false, jwt);
            let payload = {
              userData: user,
              checking: false,
              hRemember: false,
            };
            // Dispatch the signIn action
            await dispatch(signIn(payload));
            const isSlugInLocalstorage = localStorage.getItem("Revisedslug");
            if (isSlugInLocalstorage) {
              localStorage.removeItem("Revisedslug");
              return router.push(`${isSlugInLocalstorage}`);
            } else {
              setShowWelcomePopupOne(true);
            }
          }
        }
      }
    } catch (error: Error | AxiosError | unknown) {
      dispatch(authError());
      if (axios.isAxiosError(error)) {
        const axiosErroMsg = error?.response?.data.error.message;
        if (axiosErroMsg == "Internal Server Error") {
          setErrorMsg("Please enter a valid User Name, Email and Password");
        } else {
          setErrorMsg("Sorry seems to be an issue. Please try again later.");
        }
      } else {
        setErrorMsg("Sorry seems to be an issue. Please try again later.");
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((preState) => !preState);
  };
  // const openWelcomeOne = () => {
  //   setShowWelcomePopupSecond(true); // Open the WelcomeOne modal
  //   setShowWelcomePopupOne(false); // Close the Welcome modal
  // };
  // const openWelcomeTwo = () => {
  //   setShowWelcomePopupThree(true); // Open the WelcomeOne modal
  //   setShowWelcomePopupOne(false);
  //   setShowWelcomePopupSecond(false); // Close the Welcome modal
  // };
  // const handleProfile = () => {
  //    navigate("/profile");
  // };
  return (
    <>
      <form className="grid grid-cols-1 gap-[18px]" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
          <label htmlFor="userName" className="text-[14px] font-medium ">
            User Name*
          </label>
          <input
            type="text"
            name="userName"
            placeholder="Choose a user name"
            className="bg-white rounded-lg	py-2 px-4 w-full
                    text-base text-cPurple-light font-normal
                    placeholder:text-base placeholder:text-cPurple-light
                    h-[44px]
                    focus:outline-0
                    "
            value={userName}
            onChange={handleImputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
          <label htmlFor="email" className="text-[14px] font-medium ">
            Email*
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="bg-white rounded-lg	py-2 px-4 w-full
                    text-base text-cPurple-light font-normal
                    placeholder:text-base placeholder:text-cPurple-light
                    h-[44px]
                    focus:outline-0
                    "
            value={email}
            onChange={handleImputChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-2 justify-items-start content-center">
          <label htmlFor="password" className="text-[14px] font-medium">
            Password*
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              className="bg-white rounded-lg	py-2 pl-4 pr-12 w-full
                        text-base text-cPurple-light font-normal
                        placeholder:text-base placeholder:text-cPurple-light
                        h-[44px]
                        focus:outline-0
                    "
              value={password}
              onChange={handleImputChange}
              required
            />
            <span
              className="absolute right-5 top-2/4 transform -translate-y-2/4 cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <BsEye className="fill-black" />
              ) : (
                <BsEyeSlash className="fill-black" />
              )}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 justify-items-start content-center">
          <label htmlFor="password" className="text-[14px] font-medium">
            Confirm Password*
          </label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              className="bg-white rounded-lg	py-2 px-4 w-full
                        text-base text-cPurple-light font-normal
                        placeholder:text-base placeholder:text-cPurple-light
                        h-[44px]
                        focus:outline-0
                    "
              value={confirmPassword}
              onChange={handleImputChange}
              required
            />
            <span
              className="absolute right-5 top-2/4 transform -translate-y-2/4 cursor-pointer"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? (
                <BsEye className="fill-black" />
              ) : (
                <BsEyeSlash className="fill-black" />
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <input
            type="checkbox"
            name="age"
            id="age"
            checked={ageCheckboxChecked}
            onChange={() => setAgeCheckboxChecked(!ageCheckboxChecked)}
          />
          {/* TODO: Links */}
          <label
            htmlFor="age"
            className="flex items-center gap-1 text-cPurple-light text-[14px] font-medium"
          >
            I confirm that I am 18 years or older
          </label>
        </div>
        <div className="flex items-center justify-start gap-2">
          <input
            type="checkbox"
            name="policy"
            id="policy"
            checked={checkboxChecked}
            onChange={() => setCheckboxChecked(!checkboxChecked)}
          />
          {/* TODO: Links */}
          <label
            htmlFor="policy"
            className="flex items-center gap-1 text-cPurple-light text-[14px] font-medium"
          >
            I accept the <a>Privacy Policy</a> and <a>Terms of Service</a>
          </label>
        </div>

        {errorMsg && (
          <p
            className={`mt-[-2px] text-[14px] text-gray-500 font-normal
                transition-all
                ${
                  !errorMsg
                    ? "translate-y-[100px] opacity-0"
                    : "translate-y-0 opacity-1"
                }
                `}
          >
            {`${errorMsg}`}
          </p>
        )}
        {emailVerificationMessage && (
          <p className="mt-[-2px] text-[14px] text-gray-500 font-normal">
            {`${emailVerificationMessage}`}
          </p>
        )}
        <button
          disabled={checking || emailVerificationMessage || !checkboxChecked}
          className="bg-cBlue-light w-full rounded-2xl cursor-pointer ease-in-out duration-300 capitalize font-semibold h-[48px] relative disabled:bg-cBlue-navy disabled:cursor-not-allowed"
        >
          {checking ? <LoaderSpinner /> : "Create an account"}
        </button>
      </form>
      <GoogleAuthBtn checking={checking} title="Sign up with google" />
      {/* <Welcome
        isOpenWel={showWelcomePopupOne}
         onNext={openWelcomeOne}
      />
      <WelcomeOne
        isOpenWel={showWelcomePopupSecond}
         onNext={openWelcomeTwo}
      />
      <WelcomeTwo
        isOpenWel={showWelcomePopupThree}
        onClose={handleProfile}
       /> */}
    </>
  );
};

export default SingUpForm;

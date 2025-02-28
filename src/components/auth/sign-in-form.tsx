import axios, { AxiosError } from "axios";
import React, { SetStateAction, useState } from "react";
import { useForm } from "../../hooks/use-form";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toastMessage } from "@/utills/toast";
import LoaderSpinner from "@/components/loader-spinner";
import GoogleAuthBtn from "@/components/auth/google-auth-btn";
import { getApi } from "@/utills/get-api";
import {
  selectAuthState,
  signIn,
  startChecking,
  authError,
  endChecking,
} from "@/store/slices/auth-slice";
import { setTokenWithExpiration } from "@/utills/expiration-dates";

interface FormError {
  email?: string;
  password?: string;
}
const SignInForm = () => {
  const [errorMsg, setErrorMsg] = useState<SetStateAction<null | string>>(null);
  const [emailVerificationMessage, setEmailVerificationMessage] =
    useState<SetStateAction<null | string>>(null);
  const [visibleForgotPasswordModal, setVisibleForgotPasswordModal] =
    useState<boolean>(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const router = useRouter();
  const [formValues, handleImputChange] = useForm({
    email: "",
    password: "",
  });
  const [forgotPasswordLoader, setForgotPasswordLoader] =
    useState<boolean>(false);
  const [forgotEmailVerificationMessage, setforgotEmailVerificationMessage] =
    useState<SetStateAction<null | string>>(null);
  const [validationError, setValidationError] = useState<FormError>({});
  const { email, password } = formValues;
  const authState = useSelector(selectAuthState);
  const { checking, googleErrorMsg } = authState;
  const dispatch = useDispatch();

  const isFormValid = (
    email: string,
    password: string,
    setError: (error: FormError) => void
  ): boolean => {
    let isValid = true;
    const formError: FormError = {};
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!email) {
      isValid = false;
      formError["email"] = "Please enter email";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      formError["email"] = "Please enter valid email";
    }
    if (!password) {
      isValid = false;
      formError["password"] = "Please enter password";
    }
    setValidationError(formError);
    return isValid;
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (isFormValid(email, password, setValidationError)) {
        dispatch(startChecking());
        const { data, statusText } = await axios.post(
          `${getApi()}/auth/local?populate=%2A`,
          {
            identifier: email,
            password: password,
          }
        );
        if (statusText === "OK") {
          const { user, jwt } = data;
          console.log("inside 13");
          const { data: apiData } = await axios.get(
            `${getApi()}/users-permissions/user-data`,
            {
              headers: { Authorization: `Bearer ${jwt}` },
            }
          );
          console.log(data, "dtatatattatatattatat");
          if (user !== undefined && jwt === undefined) {
            dispatch(endChecking());
            setEmailVerificationMessage(
              "Please check your email for verification!"
            );
          } else {
            setTokenWithExpiration(checkboxChecked, jwt);
            let payload = {
              userData: apiData,
              shelvedGameForDevices: apiData.shelvedGames,
              checking: false,
              hRemember: checkboxChecked,
            };
            dispatch(signIn(payload));
            const isSlugInLocalstorage = localStorage.getItem("Revisedslug");
            if (isSlugInLocalstorage) {
              localStorage.removeItem("Revisedslug");
              return router.push(
                isSlugInLocalstorage ? `${isSlugInLocalstorage}` : "#"
              );
            } else {
              return router.push("/dashboard");
            }
          }
        }
      }
    } catch (error: Error | AxiosError | unknown) {
      dispatch(authError());
      if (axios.isAxiosError(error)) {
        const axiosErroMsg = error?.response?.data.error.message;
        console.log(
          error?.response?.data.error,
          "error?.response?.data.error.message"
        );
        if (axiosErroMsg == "Internal Server Error") {
          setErrorMsg("Please enter a valid Email and Password");
        } else {
          setErrorMsg("Sorry seems to be an issue. Please try again later.");
        }
      } else {
        setErrorMsg("Sorry seems to be an issue. Please try again later.");
      }
    }
  };
  const openForgotPasswordModal = () => {
    setForgotEmail("");
    setVisibleForgotPasswordModal(!visibleForgotPasswordModal);
    setforgotEmailVerificationMessage(null);
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      let response = await axios.post(`${getApi()}/auth/forgot-password`, {
        email,
      });
      if (response?.data?.ok) {
        toastMessage(
          "success",
          "Password reset email sent. Please check your inbox"
        );
        setforgotEmailVerificationMessage("");
        openForgotPasswordModal();
      } else {
        toastMessage("error", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toastMessage("error", "Something went wrong");
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    setForgotPasswordLoader(true);
    if (!forgotEmail) {
      setforgotEmailVerificationMessage("Please enter email");
      setForgotPasswordLoader(false);
      return;
    }
    if (forgotEmail && !regex.test(forgotEmail)) {
      setforgotEmailVerificationMessage("Please enter valid email address!");
      setForgotPasswordLoader(false);
      return;
    }
    try {
      const response = await axios.get(`${getApi()}/users`);
      const usersArr = response?.data;
      const userExists = usersArr.some(
        (user: { email: string }) => user.email === forgotEmail
      );
      if (!userExists) {
        setForgotPasswordLoader(false);
        setforgotEmailVerificationMessage(null);
        return toastMessage("error", "Email does not exist");
      }
      await forgotPassword(forgotEmail);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setForgotPasswordLoader(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <form className="grid grid-cols-1 gap-[18px]" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 justify-items-start content-center">
          <label htmlFor="email" className="text-[14px] font-medium ">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="bg-white rounded-lg	py-2 px-4 w-full
                        text-base text-cPurple-light font-normal
                        placeholder:text-base placeholder:text-cPurple-light
                        h-[44px] focus:outline-0 
                    "
            onChange={handleImputChange}
            value={email}
          />
          {validationError && validationError?.email && (
            <p className="mt-[-2px] text-[14px] text-red-500 font-normal">
              {`${validationError?.email}`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
          <label htmlFor="password" className="text-[14px] font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="
                        bg-white rounded-lg	py-2 px-4 w-full
                        text-base text-cPurple-light font-normal
                        placeholder:text-base placeholder:text-cPurple-light
                        h-[44px] focus:outline-0
                    "
              onChange={handleImputChange}
              value={password}
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
        {validationError && validationError?.password ? (
          <p className="mt-[-2px] text-[14px] text-red-500 font-normal">
            {`${validationError?.password}`}
          </p>
        ) : (
          errorMsg && (
            <p className="mt-[-2px] text-[14px] text-red-500 font-normal">
              {`${errorMsg}`}
            </p>
          )
        )}

        {googleErrorMsg && (
          <p className="mt-[-2px] text-[14px] text-red-500 font-normal">
            {`${googleErrorMsg}`}
          </p>
        )}

        {emailVerificationMessage && (
          <p className="mt-[-2px] text-[14px] text-gray-500 font-normal">
            {`${emailVerificationMessage}`}
          </p>
        )}
        <div className="w-full flex justify-between">
          <div>
            <input
              type="checkbox"
              name="remember"
              className="mr-1"
              checked={checkboxChecked}
              onChange={() => setCheckboxChecked(!checkboxChecked)}
            />
            <label
              htmlFor="remember"
              className="text-cPurple-light text-[14px] font-medium"
            >
              Remember for 30 days
            </label>
          </div>
          <div onClick={openForgotPasswordModal}>
            <span className="font-semibold cursor-pointer text-cBlue-light text-[14px]">
              Forgot password
            </span>
          </div>
        </div>
        <button
          disabled={checking}
          className="bg-cBlue-light w-full rounded-2xl cursor-pointer ease-in-out duration-300 capitalize font-semibold h-[48px] relative"
        >
          {checking ? <LoaderSpinner /> : "Sign In"}
          {/* Sign In */}
        </button>
      </form>
      <GoogleAuthBtn checking={checking} checkbox={checkboxChecked} />
      <Modal
        show={visibleForgotPasswordModal}
        setShow={setVisibleForgotPasswordModal}
      >
        <div className="bg-[#1A2947] h-[280px] flex flex-col justify-between">
          <div className="">
            <div className="flex flex-col mx-6 mt-6">
              <p className="text-[18px] font-[600] mb-2">
                Please Enter your email!
              </p>
              <label
                htmlFor="searchGame"
                className="mt-5 mb-2 text-[14px] font-medium "
              >
                Email
              </label>
              <input
                type="text"
                value={forgotEmail}
                name="searchGame"
                placeholder="john@gmail.com"
                className="bg-white rounded-lg z-10	h-[44px] py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForgotEmail && setForgotEmail(e.target.value)
                }
              />
              {forgotEmailVerificationMessage ? (
                <p className="mt-[4px] text-[14px] text-red-500 font-normal">
                  {`${forgotEmailVerificationMessage}`}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex justify-between mb-5 mx-6">
            <button
              onClick={openForgotPasswordModal}
              className="w-[48%] h-[50px] bg-white hover:bg-gray-100 text-[16px] font-[600] text-[#344054] rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleForgotPassword}
              className="w-[48%] h-[50px] bg-cBlue-light hover:bg-cBlue-main rounded-xl text-[16px] font-[600]"
            >
              {forgotPasswordLoader ? <LoaderSpinner /> : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignInForm;

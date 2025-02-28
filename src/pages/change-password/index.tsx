import { useState } from "react";
import axios from "axios";
import { BiHide, BiShow } from "react-icons/bi";
import { toastMessage } from "@/utills/toast";
import { getApi } from "@/utills/get-api";
import { useRouter } from "next/router";
interface passwordProps {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}
interface passwordVarificationProps {
  password: string;
  confirmPassword: string;
}
const ChangePassword = () => {
  const router = useRouter();
  let code: any;
  const url = window.location.href;
  const queryString = url.split("?")[1]; // Get the query string without the leading '?'
  const params = new URLSearchParams(queryString);

  if (params.has("code")) {
    code = params.get("code");
  }

  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState<passwordProps>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [varificationMessages, setVerificationMessages] =
    useState<passwordVarificationProps>({
      password: "",
      confirmPassword: "",
    });
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

  const validatePasswords = (password: string, confirmPassword: string) => {
    const newMessages: passwordVarificationProps = {
      password: "",
      confirmPassword: "",
    };

    if (!password) {
      newMessages.password = "Please enter password";
    }
    if (!confirmPassword) {
      newMessages.confirmPassword = "Please enter confirm password";
    }
    if (password !== confirmPassword) {
      newMessages.confirmPassword = "Password must be same";
    }
    return newMessages;
  };
  const handleResetPassword = async () => {
    const { password, confirmPassword } = passwordInput;

    const validationMessages = validatePasswords(password, confirmPassword);
    if (validationMessages.password || validationMessages.confirmPassword) {
      setVerificationMessages({
        password: validationMessages.password,
        confirmPassword: validationMessages.confirmPassword,
      });
      return;
    }
    if (password !== confirmPassword) {
      toastMessage("error", "Passwords doesn't match");
      return;
    }
    try {
      const response = await axios.post(`${getApi()}/auth/reset-password`, {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      if (response.status === 200) {
        toastMessage("success", "Password has been reset successfully.");
        setVerificationMessages({
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 6000);
      } else {
        toastMessage("error", "Something went wrong.");
      }
    } catch (error) {
      toastMessage("error", "An error occurred. Please try again later.");
    }
  };

  return (
    <section className="flex items-center justify-center h-full min-h-screen justify-items-start max-lg:px-[5%] max-md:px-0">
      <div className="bg-[#1A2947] py-8 rounded-lg  flex flex-col items-center justify-center">
        <div className="flex flex-col mx-6">
          <p className="text-white text-[22px] max-[500px]:text-[22px] text-start font-semibold mb-2">
            Change Password
          </p>
          <div className="mb-2"></div>
          <div className="mb-4 text-left">
            <label
              htmlFor="newPassword"
              className="text-[14px] mb-1 block font-medium "
            >
              New Password
            </label>
            <div className="grid grid-cols-[max-content_1fr] w-full">
              <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
                {newPasswordType !== "password" ? (
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
                className="bg-white rounded-tr-lg rounded-br-lg  h-[44px] pl-2	py-2.5 pr-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                onChange={(e) =>
                  setPasswordInput({
                    ...passwordInput,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <p className="mt-[2px] text-[14px] text-red-500 font-normal">
              {varificationMessages.password && varificationMessages.password}
            </p>
          </div>
          <div className="mb-6 text-left">
            <label
              htmlFor="email"
              className="text-[14px] mb-1 block font-medium "
            >
              Confirm Password
            </label>
            <div className="grid grid-cols-[max-content_1fr] w-full">
              <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
                {confirmPasswordType !== "password" ? (
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
                value={passwordInput.confirmPassword}
                className="bg-white rounded-tr-lg rounded-br-lg  h-[44px] pl-2	py-2.5 pr-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0"
                onChange={(e) =>
                  setPasswordInput({
                    ...passwordInput,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <p className="mt-[2px] text-[14px] text-red-500 font-normal">
              {varificationMessages.confirmPassword &&
                varificationMessages?.confirmPassword}
            </p>
          </div>
          <div className="flex justify-end gap-x-4">
            <button
              onClick={handleResetPassword}
              className="bg-cBlue-light w-full rounded-2xl cursor-pointer ease-in-out duration-300 capitalize font-semibold h-[48px] relative"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;

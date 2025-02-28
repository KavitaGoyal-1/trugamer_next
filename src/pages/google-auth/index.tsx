import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  googleError,
  logOut,
  selectAuthState,
  signIn,
  startChecking,
} from "@/store/slices/auth-slice";
import { setTokenWithExpiration } from "@/utills/expiration-dates";
import LoaderSpinner from "@/components/loader-spinner";

const GoogleAuthRedirection = () => {
  const pathname = usePathname();
  let url = process.env.NEXT_GOOGLE_AUTH_USER_DATA;
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const { hRemember } = authState;
  const router = useRouter();
  useEffect(() => {
    handleGAuth();
  }, []);

  const handleGAuth = async () => {
    try {
      dispatch(startChecking());
      let req = await axios.get(`${url}${pathname.search}`);
      let { data, statusText } = req;
      if (statusText === "OK") {
        let { jwt, user } = data;
        setTokenWithExpiration(hRemember, jwt);
        let payload = {
          userData: user,
          checking: false,
        };
        dispatch(signIn(payload));
        return router.push("/profile");
      } else {
        dispatch(logOut());
        dispatch(googleError("Sorry something went wrong with Google"));
      }
    } catch (error: Error | AxiosError | unknown) {
      dispatch(logOut());
      if (axios.isAxiosError(error)) {
        const axiosErroMsg = error?.response?.data.error.message;
        if (axiosErroMsg) {
          dispatch(googleError(axiosErroMsg));
        } else {
          dispatch(
            googleError("Sorry seems to be an issue. Please try again later.")
          );
        }
      } else {
        dispatch(
          googleError("Sorry seems to be an issue. Please try again later.")
        );
      }
      return router.push("/auth/sign-in");
    }
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center">
      <LoaderSpinner />
    </div>
  );
};

export default GoogleAuthRedirection;

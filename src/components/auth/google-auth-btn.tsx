import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import { signIn } from "@/store/slices/auth-slice";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/assets/icons/google-icon";
import { setTokenWithExpiration } from "@/utills/expiration-dates";

interface IGoogleAuthBtn {
  checking: boolean;
  title?: string;
  checkbox?: boolean;
}

interface CustomJwtPayload {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}
const GoogleAuthBtn = ({ checkbox = false }: IGoogleAuthBtn) => {
  const [showWelcomePopupOne, setShowWelcomePopupOne] = useState(false);
  const [showWelcomePopupSecond, setShowWelcomePopupSecond] = useState(false);
  const [showWelcomePopupThree, setShowWelcomePopupThree] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

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
  const googleSuccess = async (res: any) => {
    try {
      const gmailToken = res?.access_token;
      const response: any = await axios.get<CustomJwtPayload>(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${gmailToken}`,
          },
        }
      );
      const userData = response?.data;
      if (userData && userData?.email) {
        const response = await axios.get(`${getApi()}/users`);
        const usersArr = response?.data;
        const isUserExists = usersArr.some(
          (user: { email: string }) => user.email === userData?.email
        );
        if (!isUserExists) {
          //signup
          const { data, statusText } = await axios.post(
            `${getApi()}/auth/local/register`,
            {
              username: userData?.given_name,
              email: userData?.email,
              password: "xyz1234",
            }
          );
          if (statusText === "OK") {
            const { user, jwt } = data;
            if (user !== undefined && jwt === undefined) {
              toastMessage(
                "success",
                "Thanks for registering, please check your email for verification!"
              );
            } else {
              setTokenWithExpiration(false, jwt);
              let payload = {
                userData: user,
                checking: false,
                hRemember: false,
              };
              await dispatch(signIn(payload));
              router.push("/");
              const isSlugInLocalstorage = localStorage.getItem("Revisedslug");
              if (isSlugInLocalstorage) {
                localStorage.removeItem("Revisedslug");
                router.push(`${isSlugInLocalstorage}`);
              } else {
                setShowWelcomePopupOne(true);
              }
            }
          }
        } else {
          //login
          const userDetails = usersArr.find(
            (user: { email: string }) => user.email === userData.email
          );
          const { data, statusText } = await axios.post(
            `${getApi()}/users-permissions/auth/custom-login`,
            {
              email: userDetails.email,
            }
          );
          if (statusText === "OK") {
            const { user, jwt } = data;
            console.log("inside 14");
            // const { data: apiData } = await axios.get(
            //   `${getApi()}/users/me?populate[picture]=true
            //   &populate[favorite_games][image]=true
            //   &populate[active_devices][logo][image]=true
            //   &populate[inactive_devices][logo][images]=true
            //   &populate[playing_now]={
            //     populate: ["image", "devices.icon.image", "devices.logo.image", "releaseByPlatforms.release"]
            //   }
            //   &populate[playing_next]={
            //     populate: ["image", "devices.icon.image", "devices.logo.image", "releaseByPlatforms.release"]
            //   }
            //   &populate[beaten_games]={
            //     populate: [
            //       "game.image",
            //       "game.devices.icon.image",
            //       "game.releaseByPlatforms.release",
            //       "device.logo.image"
            //     ]
            //   }
            //   &populate[games_library]={
            //     populate: [
            //       "image",
            //       "game.image",
            //       "game.devices.icon.image",
            //       "game.releaseByPlatforms.release",
            //       "device.logo.image"
            //     ]
            //   }
            //   &populate[shelvedGames]={
            //     populate: [
            //       "game.image",
            //       "game.coverImage",
            //       "game.devices.icon.image",
            //       "game.releaseByPlatforms.release",
            //       "device.logo.image",
            //       "releases.device"
            //     ]
            //   }
            //   &populate[recentlyPlayed]={
            //     populate: [
            //       "game.image",
            //       "game.devices.icon.image",
            //       "game.releaseByPlatforms.release",
            //       "device.logo.image"
            //     ]
            //   }
            //   &populate[played_hour][game]=true`,
            //   {
            //     headers: { Authorization: `Bearer ${jwt}` },
            //   }
            // );
            const { data: apiData } = await axios.get(
              `${getApi()}/users-permissions/user-data`,
              {
                headers: { Authorization: `Bearer ${jwt}` },
              }
            );
            setTokenWithExpiration(checkbox, jwt);
            let payload = {
              userData: apiData,
              shelvedGameForDevices: apiData.shelvedGames,
              checking: false,
              hRemember: checkbox,
            };
            dispatch(signIn(payload));

            const isSlugInLocalstorage = localStorage.getItem("Revisedslug");
            if (isSlugInLocalstorage) {
              localStorage.removeItem("Revisedslug");
              window.location.href = isSlugInLocalstorage;
            } else {
              return router.push("/dashboard");
            }
          }
        }
      } else {
        toastMessage("error", "Something went wrong");
      }
    } catch (err) {
      console.error(err, "error");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response: any) => {
      try {
        const userInfo = await googleSuccess(response);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });

  return (
    <>
      <button className="google-btn" onClick={() => login()}>
        <span>
          <GoogleIcon />
        </span>
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleAuthBtn;

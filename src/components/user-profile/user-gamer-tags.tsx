// components/GamerTagsForm.js
import { useEffect, useState } from "react";
import ImportWizardModal from "../import-wizard/import-wizard-popup/import-wizard-modal";
import ImportWizardContentModal from "../import-wizard/import-wizard-popup/import-wizard-content-modal";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { getToken } from "@/utills/cookies";
import { useSelector } from "react-redux";
import LoaderSpinner from "../loader-spinner";
import { getApi } from "@/utills/get-api";
import { signIn } from "@/store/slices/auth-slice";
import { toastMessage } from "@/utills/toast";
import { closeWelcomeOne, openWelcomeOne } from "@/store/slices/modal-slice";
import { setSteamId } from "@/store/slices/steam-id-slice";
import { setProgressState } from "@/store/slices/progress-slice";
import { useRouter } from "next/router";
import Image from "next/image";

interface IProps {
  data: any;
}
const UserGamerTags = ({ data }: IProps) => {
  const {
    progressPercent,
    totalUploadGames,
    pendingUploadGames,
    openUploadProgressModal,
  } = useSelector((state: any) => state.progress);
  const dispatch = useDispatch();
  const token = getToken();
  const isOpenWelcomeOne = useSelector(
    (state: any) => state.modal.isOpenWelcomeOne
  );
  const router = useRouter();
  const user = useSelector((state: any) => state?.authState?.userData);
  const [isOpenWel, setIsOpenWel] = useState(false);
  // const [isOpenWelcomeOne, setIsOpenWelcomeOne] = useState(false);
  const [steamValidationMessage, setSteamValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingForIMP, setloadingForIMP] = useState(false);
  const [updateProfile, setUpdateProfile] = useState({
    xboxLiveGamerTagId: data?.xboxLiveGamerTagId,
    twitchId: data?.twitchId,
    playstationNetworkId: data?.playstationNetworkId,
    nintendoNetworkId: data?.nintendoNetworkId,
    eaAppId: data?.eaAppId,
    ubiSoftConnetId: data?.ubiSoftConnetId,
    steamId: data?.steamId,
    nintendoSwitchId: data?.nintendoSwitchId,
    gamer_tag: data?.gamer_tag,
  });

  const resetSteamValidationMessage = () => {
    setSteamValidationMessage("");
  };

  const openWelcome = () => {
    dispatch(openWelcomeOne());
    setIsOpenWel(false); // Dispatch the Redux action to open the modal
  };

  const onCloseWel = () => {
    setIsOpenWel(false);
    dispatch(closeWelcomeOne()); // Dispatch the Redux action to close the modal
  };

  const handleOpenWel = async () => {
    try {
      setloadingForIMP(true);
      const response = await axios.get(
        `${getApi()}/steam/steam-games/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.data && response.data.data.length > 0) {
        await dispatch(setSteamId(data?.steamId));
        setloadingForIMP(false);
        router.push(`/import-wizard`);
      } else {
        setloadingForIMP(false);
        setIsOpenWel(true);
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      setloadingForIMP(false);
      setIsOpenWel(true);
    }
  };

  const handleCloseWel = () => {
    setIsOpenWel(false);
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

  useEffect(() => {
    if (data) {
      setUpdateProfile({
        xboxLiveGamerTagId: data?.xboxLiveGamerTagId || 0,
        twitchId: data?.twitchId || 0,
        playstationNetworkId: data?.playstationNetworkId || 0,
        nintendoNetworkId: data?.nintendoNetworkId || 0,
        eaAppId: data?.eaAppId || 0,
        ubiSoftConnetId: data?.ubiSoftConnetId || 0,
        steamId: data?.steamId || 0,
        nintendoSwitchId: data?.nintendoSwitchId || 0,
        gamer_tag: data?.gamer_tag || "",
      });
    }
  }, [data]);

  const handleSaveChanges = async (e?: any, wizardText?: string) => {
    e.preventDefault();
    let payload = {
      userData: {
        // ...data,
        xboxLiveGamerTagId: updateProfile?.xboxLiveGamerTagId || 0,
        twitchId: updateProfile?.twitchId || 0,
        playstationNetworkId: updateProfile?.playstationNetworkId || 0,
        nintendoNetworkId: updateProfile?.nintendoNetworkId || 0,
        eaAppId: updateProfile?.eaAppId || 0,
        ubiSoftConnetId: updateProfile?.ubiSoftConnetId || 0,
        steamId: updateProfile?.steamId || 0,
        nintendoSwitchId: updateProfile?.nintendoSwitchId || 0,
        gamer_tag: updateProfile?.gamer_tag || null,
      },
    };
    let payload1 = {
      userData: {
        ...data,
        xboxLiveGamerTagId: updateProfile?.xboxLiveGamerTagId || 0,
        twitchId: updateProfile?.twitchId || 0,
        playstationNetworkId: updateProfile?.playstationNetworkId || 0,
        nintendoNetworkId: updateProfile?.nintendoNetworkId || 0,
        eaAppId: updateProfile?.eaAppId || 0,
        ubiSoftConnetId: updateProfile?.ubiSoftConnetId || 0,
        steamId: updateProfile?.steamId || 0,
        nintendoSwitchId: updateProfile?.nintendoSwitchId || 0,
        gamer_tag: updateProfile?.gamer_tag || null,
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
      dispatch(signIn(payload1));
      await dispatch(setSteamId(updateProfile?.steamId));
      if (!wizardText) {
        setLoading(false);
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

  const handleContinueWizard = async (e: any) => {
    try {
      setLoading(true);

      if (updateProfile?.steamId === 0) {
        setSteamValidationMessage("Please enter steam Id");
        setLoading(false);
        return;
      }

      // Initialize Progress State
      const initialProgressState = {
        progressPercent: 0,
        openUploadProgressModal: true,
        estimatedTime: 0,
        totalUploadGames: 0,
        // pendingUploadGames: 0,
        syncInProgress: true,
      };
      dispatch(closeWelcomeOne());
      dispatch(setProgressState(initialProgressState));
      localStorage.setItem(
        "progressState",
        JSON.stringify(initialProgressState)
      );

      const importRequest = axios.post(
        `${getApi()}/steam/create-update-games?steamId=${
          updateProfile?.steamId
        }`,
        { userId: { id: user?.id } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const progressPolling = new Promise<void>((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const progressResponse = await axios.post(
              `${getApi()}/steam/sync-progress`,
              { userId: { id: user?.id } },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (progressResponse.status === 200) {
              const { totalGames, processedGames, progress, estimatedTime } =
                progressResponse.data;

              const currentProgressState = {
                progressPercent: progress,
                totalUploadGames: totalGames,
                pendingUploadGames: processedGames,
                estimatedTime: estimatedTime,
                openUploadProgressModal: true,
                syncInProgress: true,
              };

              // Update Progress State
              dispatch(setProgressState(currentProgressState));
              localStorage.setItem(
                "progressState",
                JSON.stringify(currentProgressState)
              );

              if (progress >= 100) {
                clearInterval(interval);
                // Set the modal to false and reset the progress state
                // const completedProgressState = {
                //   progressPercent: 100,
                //   totalUploadGames,
                //   pendingUploadGames: processedGames,
                //   estimatedTime,
                //   openUploadProgressModal: false,
                // };

                // dispatch(setProgressState(completedProgressState)); // Close modal and complete progress
                // localStorage.setItem(
                //   "progressState",
                //   JSON.stringify(completedProgressState)
                // );
                resolve();
              }
            }
          } catch (progressError) {
            clearInterval(interval);
            localStorage.removeItem("progressState");
            reject(progressError);
          }
        }, 2000);
      });

      await Promise.all([importRequest, progressPolling]);

      await handleSaveChanges(e, "wizard");
      // await dispatch(setSteamId(updateProfile?.steamId));
      setLoading(false);
      router.push(`/import-wizard`);

      // Final reset of progress state (after completion)
      dispatch(
        setProgressState({
          openUploadProgressModal: false,
          progressPercent: 0,
          pendingUploadGames: 0,
          totalUploadGames: 0,
          estimatedTime: 0,
          syncInProgress: false,
        })
      );
      localStorage.removeItem("progressState");
      toastMessage("success", "Games successfully synced!");
    } catch (error) {
      // Error Handling
      localStorage.removeItem("progressState");
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "An unexpected error occurred.";
        setSteamValidationMessage(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
      setLoading(false);

      dispatch(
        setProgressState({
          openUploadProgressModal: false,
          progressPercent: 0,
          pendingUploadGames: 0,
          totalUploadGames: 0,
          estimatedTime: 0,
          syncInProgress: false,
        })
      );
      toastMessage("error", "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-start gap-8 flex-col md:flex-row">
      <div className="pt-4 w-full max-w-[100%] md:max-w-[50%] ">
        <h1 className="text-2xl font-bold text-white mb-6">Gamer Tags</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Xbox Live Gamertag
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
              placeholder="Xbox Live Gamertag ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
              focus:outline-none focus:ring-0 appearance-none no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Twitch</label>
            <input
              type="number"
              name="twitchId"
              value={
                updateProfile?.twitchId == 0 ? "" : updateProfile?.twitchId
              }
              onChange={handleChange}
              placeholder="Twitch ID"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Playstation Network ID
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
              placeholder="Playstation Network ID"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Nintendo Network ID
            </label>
            <input
              type="number"
              name="nintendoNetworkId"
              value={
                updateProfile?.nintendoNetworkId == 0
                  ? ""
                  : updateProfile?.nintendoNetworkId || ""
              }
              onChange={handleChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              placeholder="Nintendo Network ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">EA App ID</label>
            <input
              type="number"
              name="eaAppId"
              value={
                updateProfile?.eaAppId == 0 ? "" : updateProfile?.eaAppId || ""
              }
              onChange={handleChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              placeholder="EA App ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ubisoft Connect ID
            </label>
            <input
              type="number"
              name="ubiSoftConnetId"
              value={
                updateProfile?.ubiSoftConnetId == 0
                  ? ""
                  : updateProfile?.ubiSoftConnetId || ""
              }
              onChange={handleChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              placeholder="Ubisoft Connect ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Steam ID</label>
            <input
              type="number"
              name="steamId"
              value={
                updateProfile?.steamId == 0 ? "" : updateProfile?.steamId || ""
              }
              onChange={handleChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 18) {
                  target.value = target.value.slice(0, 18); // Restrict input to 4 characters
                }
              }}
              placeholder="Steam ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nintendo Switch ID
            </label>
            <input
              type="number"
              name="nintendoSwitchId"
              value={
                updateProfile?.nintendoSwitchId == 0
                  ? ""
                  : updateProfile?.nintendoSwitchId || ""
              }
              onChange={handleChange}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20); // Restrict input to 4 characters
                }
              }}
              placeholder="Nintendo Switch ID"
              className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0 no-arrows"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Gamer Tag</label>
          <input
            type="text"
            name="gamer_tag"
            maxLength={20}
            value={updateProfile?.gamer_tag || ""}
            onChange={handleChange}
            placeholder="www.trugamer.com"
            className="w-full px-4 py-2 rounded-lg text-cBlue-navy bg-white h-11 border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D]
 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex justify-start gap-x-l3 mb-8 mt-5">
          <button
            onClick={handleSaveChanges}
            className="bg-cBlue-light hover:bg-cBlue-main max-[500px]:w-full text-white text-sm py-2 px-4 rounded-lg cursor-pointer ease-in-out duration-300 capitalize font-semibold"
          >
            {loading ? <LoaderSpinner /> : <>Save Tags</>}
          </button>
        </div>
      </div>
      <div className='pt-4 w-full max-w-[100%] md:max-w-[50%] mt-0 md:mt-24 p-5 rounded-[14px] bg-[url("/games/about-game.png")] bg-center h-[425px] bg-[#15182b] bg-contain bg-no-repeat'>
        <div className="">
          <Image
            src="/icons/oui_import.svg"
            alt="import icon"
            width={20}
            height={20}
          />
          <h3 className="text-2xl font-bold my-2">
            Import & Manage Your Gaming Library
          </h3>
          <p className="text-base text-[#838383] font-medium">
            Easily sync your Steam, PlayStation and X Box games with <br></br>
            TruGamer for a unified experience.
          </p>
          <button
            className="mt-5 bg-[#00ADFF] p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center gap-2"
            onClick={handleOpenWel}
          >
            {loadingForIMP ? (
              <LoaderSpinner />
            ) : (
              <>
                Proceed to Game Import Wizard{" "}
                <Image
                  src="/icons/download-white.svg"
                  alt="download icon"
                  width={20}
                  height={20}
                />{" "}
              </>
            )}
          </button>
        </div>
      </div>

      <ImportWizardModal
        isOpenWel={isOpenWel}
        onCloseWel={onCloseWel}
        onNext={openWelcome}
      />
      <ImportWizardContentModal
        isOpenWel={isOpenWelcomeOne}
        resetSteamValidationMessage={resetSteamValidationMessage}
        onClose={onCloseWel}
        steamId={updateProfile?.steamId}
        handleChange={handleChange}
        handleContinueWizard={handleContinueWizard}
        steamValidationMessage={steamValidationMessage}
        loading={loading}
        onNext=""
      />
    </div>
  );
};

export default UserGamerTags;

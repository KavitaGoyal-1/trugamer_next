import { closeWelcomeOne, openWelcomeOne } from "@/store/slices/modal-slice";
import { setProgressState } from "@/store/slices/progress-slice";
import { setSteamId } from "@/store/slices/steam-id-slice";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { toastMessage } from "@/utills/toast";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ImportWizardContentModal from "@/components/import-wizard/import-wizard-popup/import-wizard-content-modal";
import ImportWizardModal from "@/components/import-wizard/import-wizard-popup/import-wizard-modal";
import Image from "next/image";

interface IProps {
  data: any;
}

const IntegrationsContent = ({ data }: IProps) => {
  const [isOpenWel, setIsOpenWel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForIMP, setloadingForIMP] = useState(false);
  const [steamValidationMessage, setSteamValidationMessage] = useState("");
  const [isSteamActive, setIsSteamActive] = useState(false);
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
  const dispatch = useDispatch();
  const token = getToken();
  const isOpenWelcomeOne = useSelector(
    (state: any) => state.modal.isOpenWelcomeOne
  );
  const router = useRouter();
  const user = useSelector((state: any) => state?.authState?.userData);

  const resetSteamValidationMessage = () => {
    setSteamValidationMessage("");
  };

  const openWelcome = () => {
    dispatch(openWelcomeOne());
    setIsOpenWel(false);
  };

  const onCloseWel = () => {
    setIsOpenWel(false);
    dispatch(closeWelcomeOne());
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
      if (response?.data?.data && response?.data?.data?.length > 0) {
        await dispatch(setSteamId(data?.steamId));
        setloadingForIMP(false);
        router.push(`/import-wizard`);
      } else {
        setloadingForIMP(false);
        setIsOpenWel(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setloadingForIMP(false);
      setIsOpenWel(true);
    }
  };
  const isSteamActiveOrNot = async () => {
    try {
      const response = await axios.get(
        `${getApi()}/steam/steam-games/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.data && response?.data?.data?.length > 0) {
        setIsSteamActive(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setIsSteamActive(false);
    }
  };
  useEffect(() => {
    isSteamActiveOrNot();
  }, [user?.id]);
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
        setloadingForIMP(true);
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
              console.log(progress, "progress");
              if (progress == 1) {
                setloadingForIMP(false);
                router.push(`/import-wizard`);
              }

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

      // await handleSaveChanges(e, "wizard");
      // await dispatch(setSteamId(updateProfile?.steamId));
      setLoading(false);

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
    <>
      <div className="w-full py-4 pt-0 md:pt-4 bg-[#0F111F] rounded-lg pb-0  overflow-x-hidden overflow-auto h-full md:h-[75vh] lg:h-[500px] 2xl:h-[540px] xxl:h-[60vh] relative">
        <div>
          <div className="w-full max-w-[100%] pb-8 rounded-[14px] line-botom relative px-3 md:px-4">
            <div className="flex items-start gap-2 md:gap-3">
              <Image
                src="/icons/oui_import.svg"
                className="w-6 h-6 mt-1"
                alt="import icon"
                width={24}
                height={24}
              />

              <div className="">
                <h3 className="text-sm md:text-lg 2xl:text-3xl font-bold my-0 ">
                  Import & Manage Your Gaming Library
                </h3>

                <p className="text-xs md:text-sm 2xl:text-xl mt-2 md:mt-1 text-[#838383] font-medium leading-7 md:leading-7">
                  Easily sync your Steam, PlayStation and X Box games with{" "}
                  <br className="hidden md:block"></br>
                  TruGamer for a unified experience.
                </p>
                <button
                  className={`mt-3 md:mt-5 bg-[#00ADFF] p-2 rounded-lg px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 ${
                    loadingForIMP ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleOpenWel}
                  disabled={loadingForIMP}
                >
                  {loadingForIMP ? (
                    <>
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
                        Proceed to Game Import Wizard...
                      </span>
                    </>
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
          </div>

          <div className="px-8 md:px-12 py-7 w-full md:w-96 rounded-md ">
            <div className="flex items-center justify-between mb-10 md:mb-5">
              <span className="flex items-center gap-2">
                <FaSteam size={20} />
                Steam
              </span>
              {isSteamActive ? (
                <span className="bg-[#02D256] px-2 py-1 rounded-lg font-semibold text-xs flex gap-1 items-center">
                  <span className="w-3 h-3 bg-white block rounded-full"></span>
                  Active
                </span>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
            <div className="flex items-center justify-between mb-10 md:mb-5">
              <span className="flex items-center gap-2">
                <FaPlaystation size={20} />
                PlayStation
              </span>
              <span className="text-gray-500">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FaXbox size={20} />
                Xbox
              </span>
              <span className="text-gray-500">-</span>
            </div>
          </div>

          {/* <div className="mt-6 bg-[#344054] flex items-center justify-between py-4 px-4 md:px-8 rounded-br-md rounded-bl-md md:absolute bottom-5 w-full">
            <div className="flex items-center justify-center gap-3">
              <img src="/Account/oui_import.svg" />
              <span className="text-base md:text-lg font-bold md:font-normal">
                Automatic Updates
              </span>
              <span className="elit-bg text-xs px-2 py-1 rounded">
                        Elite
                      </span>
            </div>
            <label className="mt-2 inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 rounded-full shadow-inner"></div>
            </label>

            <label className="inline-flex relative items-center cursor-pointer box-none">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-8 h-4 rounded-full bg-[#EEF1F8] peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-[#0243EC] peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-4 peer-checked:after:border-[#fff] peer-checked:after:bg-[#fff] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#39475B] after:border-[#39475B] after:border after:rounded-full after:h-3 after:w-3 after:transition-all">
                {" "}
              </div>
            </label>
          </div> */}
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
    </>
  );
};

export default IntegrationsContent;

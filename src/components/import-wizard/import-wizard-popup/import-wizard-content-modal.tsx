import LoaderSpinner from "@/components/loader-spinner";
import Image from "next/image";
import { FaSteam } from "react-icons/fa";

const ImportWizardContentModal = ({
  isOpenWel,
  onClose,
  steamId,
  handleChange,
  handleContinueWizard,
  steamValidationMessage,
  loading,
  resetSteamValidationMessage,
}: any) => {
  const platformDetails = {
    description:
      "You're about to connect your Steam account to TruGamer. This integration will enable the following features.",
    features: [
      {
        title: "Games",
        items: [
          "Library",
          "Installing & launching",
          "Achievements",
          "Game time",
        ],
      },
      {
        title: "Friends",
        items: ["Friend list", "Friend requests", "Friend activity"],
      },
      {
        title: "Community",
        items: ["Forums", "Groups", "Discussions"],
      },
      {
        title: "Statistics",
        items: ["Game stats", "Leaderboards", "Milestones"],
      },
      {
        title: "Store",
        items: ["Wishlist", "Purchases", "Recommendations"],
      },
    ],
  };

  const handleClose = () => {
    resetSteamValidationMessage(); // Clear the validation message
    onClose(); // Close the modal
  };

  return (
    <>
      {isOpenWel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[99999998]" />
      )}

      <div
        className={`fixed pb-0 top-0 bottom-0 flex items-center justify-center left-0 w-full max-w-[950px] mx-auto right-0  h-full overflow-auto  rounded-xl z-[99999999] transition-transform duration-500 ${
          isOpenWel ? "translate-y-0" : "-translate-y-full"
        } z-40 custom-scrollbar`}
      >
        <div className="pb-0 m-8 w-full max-w-[90%] md:max-w-[515px] lg:max-w-[515px] shadow-lg mx-auto rounded-xl  bg-[#15182B] ">
          <div className="relative text-white p-4 md:p-8 rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-[-10px] right-[-10px] text-white font-bold text-lg"
              onClick={handleClose}
            >
              <Image
                src="/home/close.svg"
                alt="close icon"
                width={20}
                height={20}
              />
            </button>

            {/* Title */}
            <h2 className="text-center text-lg font-bold mb-5">
              Connect to Steam Account
            </h2>
            <div className="gradient-divider relative mb-4"></div>

            {/* Platform Options */}
            <div className="pt-4 mb-6 h-[50vh] 2xl:h-[65vh] overflow-y-auto">
              {/* Description */}
              <p className="text-sm font-normal mb-4">
                {platformDetails.description}
              </p>

              {/* Features */}
              {platformDetails.features.map((feature, index) => (
                <div key={index} className="mb-4">
                  <h2 className="font-bold text-sm mb-2">{feature.title}:</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="text-sm font-normal">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <div className="gradient-divider relative mt-5 mb-4"></div>

              <div className="mt-4 pt-4">
                <div className="relative">
                  <input
                    type="number"
                    name="steamId"
                    onChange={handleChange}
                    value={steamId}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target?.value?.length > 20) {
                        target.value = target?.value.slice(0, 20); // Restrict input to 4 characters
                      }
                    }}
                    placeholder="Please enter steam ID"
                    className="text-black border border-[#D0D5DD] shadow-sm w-full rounded-xl p-2 h-[38px] focus:outline-none"
                  />
                  <FaSteam
                    size={24}
                    color="#000"
                    className="absolute right-2 top-[6px]"
                  />
                  <span className="text-red-400">{steamValidationMessage}</span>
                </div>
                <div className="flex gap-4">
                  {/* Continue Button */}
                  <button
                    className="mt-4 bg-[#596184] h-10 w-full p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center m-auto"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="mt-4 bg-[#00ADFF] relative h-10  w-full p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center m-auto"
                    onClick={handleContinueWizard}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="absolute right-0 left-0 m-auto loder-btn top-[6px]">
                        <LoaderSpinner />
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportWizardContentModal;

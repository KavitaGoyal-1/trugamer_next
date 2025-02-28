import Image from "next/image";
import { useState } from "react";
import { FaSteam, FaPlaystation, FaXbox } from "react-icons/fa";

const ImportWizardModal = ({ isOpenWel, onCloseWel, onNext }: any) => {
  const [selectedPlatform, setSelectedPlatform] = useState("Steam");

  const platforms = [
    { name: "Steam", icon: <FaSteam size={20} />, enabled: true },
    { name: "PlayStation", icon: <FaPlaystation size={20} />, enabled: false },
    { name: "X Box", icon: <FaXbox size={20} />, enabled: false },
  ];

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
        <div className='pb-0 m-8 w-full max-w-[90%] md:max-w-[515px] lg:max-w-[515px] shadow-lg mx-auto rounded-xl  bg-[url("/games/myGame.png")] bg-top  bg-cover bg-no-repeat '>
          <div className="relative text-white p-8 rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-[-10px] right-[-10px] text-white font-bold text-lg"
              onClick={onCloseWel}
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
              Select platform to import data
            </h2>

            {/* Platform Options */}
            <div className="flex justify-center gap-3 mb-6">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  className={`flex flex-col items-center justify-center w-28 h-24 rounded-lg relative ${
                    platform.enabled
                      ? selectedPlatform === platform.name
                        ? "bg-gray-800 border-2 border-blue-500"
                        : "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-700  cursor-not-allowed"
                  }`}
                  onClick={() =>
                    platform.enabled ? setSelectedPlatform(platform.name) : null
                  }
                >
                  {!platform.enabled && (
                    <Image
                      src="/home/howit/coming.svg"
                      alt="Coming Soon"
                      className="object-cover absolute top-[-23px] right-[-18px] z-50 w-20 h-24"
                      width={20}
                      height={24}
                    />
                  )}
                  <div
                    className={`flex flex-col items-center justify-center w-28 h-24 rounded-lg relative ${
                      platform.enabled
                        ? selectedPlatform === platform.name
                          ? "bg-gray-800 border-2 border-blue-500"
                          : "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-700 opacity-30 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      platform.enabled
                        ? setSelectedPlatform(platform.name)
                        : null
                    }
                  >
                    {platform.icon}
                    <span className="mt-2 text-sm font-medium">
                      {platform.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <button
              className="mt-5 bg-[#00ADFF] p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center m-auto"
              onClick={onNext}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportWizardModal;

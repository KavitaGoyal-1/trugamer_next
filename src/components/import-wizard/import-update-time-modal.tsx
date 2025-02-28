import LoaderSpinner from "../loader-spinner";

const ImportUpdateTimeModal = ({
  isOpenWel,
  onClose,
  handleRadioChange,
  selectedValue,
  handleClickContinueUpdate,
  loading,
}: any) => {
  return (
    <>
      {isOpenWel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[99999998]" />
      )}

      <div
        className={`fixed pb-0 top-0 bottom-0 flex items-center justify-center left-0 w-full max-w-[90%] md:max-w-[450px] mx-auto right-0  h-full overflow-auto  rounded-xl z-[99999999] transition-transform duration-500 ${
          isOpenWel ? "translate-y-0" : "-translate-y-full"
        } z-40 custom-scrollbar`}
      >
        <div className="pb-0 m-8 w-full max-w-[90%] md:max-w-[515px] lg:max-w-[515px] shadow-lg mx-auto rounded-xl  bg-[#15182B] ">
          <div className="relative text-white p-4 mb-5 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-center text-lg font-bold mb-5">Update Time</h2>
            <div className="gradient-divider relative mb-4"></div>
            <div className="pt-4 mb-2 h-full overflow-y-auto">
              <div className="space-y-4 text-gray-300">
                {/* Radio Buttons */}
                {[
                  { id: "selectAll", label: "Select All", value: "all" },
                  { id: "top10", label: "Top 10", value: "10" },
                  { id: "top50", label: "Top 50", value: "50" },
                  { id: "top100", label: "Top 100", value: "100" },
                  { id: "top250", label: "Top 250", value: "250" },
                ].map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.id}
                      name="ranking"
                      value={option.value}
                      className="w-4 h-4 text-[#00ADFF] bg-[#00ADFF] border-[#00ADFF] focus:ring-[#00ADFF] focus:none"
                      checked={selectedValue === option.value}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor={option.id}
                      className="text-base font-medium cursor-pointer text-white"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div>
              <div className="mt-0 pt-0">
                <div className="flex gap-4">
                  {/* Cancel Button */}
                  <button
                    className="mt-4 bg-[#596184] h-10 w-full p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center m-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    className="mt-4 bg-[#00ADFF] relative h-10 w-full p-2 rounded-lg px-5 text-sm font-semibold flex items-center justify-center m-auto"
                    onClick={handleClickContinueUpdate}
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

export default ImportUpdateTimeModal;

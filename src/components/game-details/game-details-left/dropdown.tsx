import { HiChevronDown } from "react-icons/hi";
import Reset from "../../../../public/icons/reset.svg";
import { FiStar } from "react-icons/fi";

const Dropdown = ({
  handleSelectReviewFilter,
  isOpen,
  setIsOpen,
  selectedReviewFilter,
  selectedReviewFilterIcon,
  setSelectedReviewFilter,
  toggleDropdown,
  reviewOptions,
}: any) => {
  return (
    <div className="relative inline-block text-left" style={{ zIndex: "99" }}>
      <div>
        <button
          onClick={toggleDropdown}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#22232E] rounded-md hover:bg-[#344054] border border-[#51525B]"
        >
          <div className="inline-flex gap-5 items-center">
            <div className="inline-flex gap-2">
              {selectedReviewFilterIcon ? selectedReviewFilterIcon : <FiStar />}
              <span className="mr-2 text-xs font-normal">
                {selectedReviewFilter}
              </span>
            </div>
            <HiChevronDown
              className={`transform transition-transform h-5 w-5 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
          <div className="py-1">
            {reviewOptions?.map((option: any) => (
              <button
                key={option.name}
                onClick={() =>
                  handleSelectReviewFilter(option.name, option.icon)
                }
                className="flex !items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700"
              >
                <span className="mr-2">{option.icon}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

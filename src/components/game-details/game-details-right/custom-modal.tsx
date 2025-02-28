import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

interface CustomModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isNotClosed?:any
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  onClose,
  children,
  isNotClosed
}) => {

  useEffect(() => {
    if (show) {
      document.body.classList.add("open-modals");
    } else {
      document.body.classList.remove("open-modals");
    }

    // Cleanup function to remove class when the component unmounts
    return () => {
      document.body.classList.remove("open-modals");
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center  bg-gray-900 bg-opacity-75"
      style={{ zIndex: "999" }}
    >
      <div className="relative bg-cBlue-tab md:px-16 md:py-12 md:rounded-lg md:min-w-[642px] w-[355px] max-w-lg px-4 py-8 rounded-3xl">
        <button
          className="absolute top-4 right-4  w-[26px] h-[26px] flex justify-center items-center rounded-full"
          onClick={onClose}
        >
          {isNotClosed ?'':
          
           <RxCross2 className="w-6 h-6 cursor-pointer"  />
          }
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;

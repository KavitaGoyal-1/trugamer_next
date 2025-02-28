const Modal = ({ show, children, isOverFlow = true }: any) => {
  return (
    <div
      className={`fixed z-[1000] cs-overflow flex items-center justify-center h-full overflow-y-auto top-0 bottom-0 w-full left-0 ${
        show ? "" : "hidden"
      } max-h-screen overflow-y-auto`}
    >
      <div className="flex mt-[70px] md:mt-0 items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div
          className={`max-h-[75vh]  inline-block align-center bg-[#1A2947] rounded-lg text-left  shadow-xl transform transition-all sm:my-12 sm:align-middle sm:max-w-lg sm:w-full ${
            isOverFlow && "overflox-y-auto overflow-x-hidden"
          }` }
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

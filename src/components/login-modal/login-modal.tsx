import { useEffect } from "react";
import Link from "next/link";
import GoogleAuthBtn from "../auth/google-auth-btn";
import Image from "next/image";

const LoginModal = ({ isOpenLogin, onCloseLogin }: any) => {
  useEffect(() => {
    if (isOpenLogin) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpenLogin]);

  return (
    <>
      <>
        {isOpenLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[9999999998]" />
        )}

        <div
          className={`fixed pb-0 top-0 bottom-0 flex items-center justify-center left-0 w-full max-w-[950px] mx-auto right-0  h-full overflow-auto  rounded-2xl z-[99999999999] transition-transform duration-500 ${
            isOpenLogin ? "translate-y-0" : "-translate-y-full"
          } z-40 custom-scrollbar`}
        >
          <div className="pb-0 m-8 w-full max-w-[90%] md:max-w-[400px] lg:max-w-[400px] shadow-lg mx-auto rounded-2xl  bg-[#15182B] ">
            <div className="relative text-white py-4 md:py-8 px-4 md:px-12 rounded-lg shadow-lg">
              {/* Close Button */}
              <button
                className="absolute top-[10px] right-[10px] text-white font-bold text-lg"
                onClick={onCloseLogin}
              >
                <Image
                  src="/home/close.svg"
                  alt="close icon"
                  width={20}
                  height={20}
                />
              </button>

              {/* Title */}
              <h2 className="text-center text-base font-normal mb-5 text-[#C1C9ED] pt-4">
                Please sign up or continue with google.
              </h2>

              <div className="flex gap-3 flex-col google-modal">
                <Link href="/sign-up">
                  {" "}
                  <button className="bg-cBlue-light w-full rounded-xl cursor-pointer ease-in-out duration-300 capitalize font-semibold h-[40px] relative">
                    Create Account
                  </button>
                </Link>
                <GoogleAuthBtn checking={false} />
              </div>
              <div className="text-base font-normal text-[#C1C9ED] mt-2">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-cBlue-light hover:text-cBlue-light "
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default LoginModal;

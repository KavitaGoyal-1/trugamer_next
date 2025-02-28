import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { clearToken } from "@/utills/cookies";
import { logOut, selectAuthState } from "@/store/slices/auth-slice";
import AccountModal from "./account-modal/account-modal";
import Image from "next/image";

const HeaderUserItems = () => {
  const { userData } = useSelector(selectAuthState);
  const isPicture = userData.picture;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const [isOpenWel, setIsOpenWel] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    console.log(" this is log out clicked -");
    clearToken();
    dispatch(logOut());
    // clearToken();
    // return navigate("/");
  };

  const handleSignOut = () => {
    closeDropdown();

    clearToken();
    dispatch(logOut());
    return router.push("/");
  };

  const handleCloseWel = () => setIsOpenWel(false);
  const handleOpenWel = () => setIsOpenWel(true);

  return (
    <div className="flex items-center justify-self-end relative">
      <div className="relative grid place-items-center"></div>
      <div
        className="grid items-center grid-cols-[max-content_1fr] gap-0 sm:gap-2 "
        onClick={toggleDropdown}
      >
        {isPicture ? (
          <Image
            src={userData.picture.url}
            alt="User Image"
            width={45}
            height={45}
            className="rounded-full min-h-[32px] w-[32px] h-[32px] sm:min-h-[45px] sm:h-[45px] sm:w-[45px] object-cover  cursor-pointer"
            // onClick={navigateToProfile}
          />
        ) : (
          <Image
            src="/dummyimg.png"
            alt="User Image"
            width={45}
            height={45}
            className="rounded-full min-h-[32px] w-[32px] h-[32px] sm:min-h-[45px] sm:h-[45px] sm:w-[45px] object-cover  cursor-pointer"
            // onClick={navigateToProfile}
          />
        )}
        <div>
          <h2
            className="font-normal text-xl cursor-pointer capitalize hidden md:flex"
            // onClick={navigateToProfile}
          >
            {userData.username && userData.username}
          </h2>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="absolute top-full right-0 mt-3 w-48 bg-[#15182B] shadow-lg rounded-xl py-0 z-[99999]"
          onClick={(e) => e.stopPropagation()} // Prevent click outside handling
        >
          <button
            className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-[#344054] rounded-tr-xl rounded-tl-xl"
            onClick={() => {
              closeDropdown();
              handleOpenWel();
              // navigateToProfile();
              console.log("Navigate to Account Setting");
              // Add your account setting navigation logic here
            }}
          >
            <div>
              <FaRegUserCircle className="text-lg" />
            </div>
            Account Setting
          </button>
          <button
            className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-[#344054] rounded-br-xl rounded-bl-xl"
            onClick={handleSignOut}
          >
            <div
              // onClick={handleLogout}
              className="flex gap-2 items-center justify-center"
            >
              <MdLogout className=" group-hover:block cursor-pointer text-white text-lg" />
              Sign Out{" "}
            </div>
          </button>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
      )}

      <AccountModal isOpenWel={isOpenWel} onCloseWel={handleCloseWel} />
    </div>
  );
};

export default HeaderUserItems;

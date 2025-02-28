import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearToken } from "@/utills/cookies";
import { logOut, selectAuthState } from "@/store/slices/auth-slice";
import Image from "next/image";

const MobileMenuItems = () => {
  const { userData } = useSelector(selectAuthState);
  const isPicture = userData.picture;
  const router = useRouter();
  const dispatch = useDispatch();

  const navigateToProfile = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    dispatch(logOut());
    clearToken();
    return router.push("/sign-in");
  };

  const MenuItems = [
    { name: "Dashboard", route: "/dashboard" },
    { name: "Game Library", route: "/game-library" },
    { name: "Game Calendar", route: "/game-calendar" },
    { name: "News", route: "/news" },
    { name: "Settings", route: "/profile" },
  ];

  return (
    <React.Fragment>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center border-b-[2px] border-b-[#F9FAFB1A] mb-9 w-full pb-4">
          {MenuItems.map((item: any, index: number) => (
            <p
              key={index}
              className="mb-3 font-[500] text-[18px]"
              onClick={() => router.push(item.route)}
            >
              {item.name}
            </p>
          ))}
          <p className="mb-3 font-[500] text-[18px]" onClick={handleLogout}>
            Logout
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-[max-content_1fr] gap-4">
            {isPicture && (
              <Image
                src={userData.picture.url}
                alt="User Image"
                title="User Image"
                width={45}
                height={45}
                className="rounded-full w-[40px] cursor-pointer"
                onClick={navigateToProfile}
              />
            )}

            <div>
              <h2
                className="font-normal text-xl cursor-pointer"
                onClick={navigateToProfile}
              >
                {userData.username && userData.username}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MobileMenuItems;

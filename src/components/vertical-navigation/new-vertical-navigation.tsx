import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import {
  logOut,
  selectAuthState,
  storeHeaderToggle,
} from "@/store/slices/auth-slice";
import Link from "next/link";
import { clearToken } from "@/utills/cookies";
import AccountModal from "../layouts/account-modal/account-modal";
import LoginModal from "../login-modal/login-modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navigationAtBottom = [
  {
    label: "Discord",
    route: "https://discord.com/invite/77XY6sAaFJ",
    icon: "/icons/discord-icon.jpg",
  },
  {
    label: "settings",
    route: "",
    icon: "/navigation/settings.svg",
  },
];
interface IProps {
  token?: string;
  isActive?: any;
  item?: any;
}

const VerticalNavigationLink = ({
  item,
  token,
  isActive,
  onClick,
}: IProps & { onClick?: () => void }) => {
  const isDashboardOrLibrary =
    item.label === "dashboard" || item.label === "My Library";
  return (
    <li
      className={`${
        isDashboardOrLibrary && token ? "login" : "without"
      } inline-flex w-full max-h-[42px] `}
    >
      <Link
        target={item.label === "Discord" ? "_blank" : undefined}
        href={item.route ? item.route : "#"}
        className={`${
          isDashboardOrLibrary && !token ? "hover:bg-[#293242]" : ""
        } ${
          isActive ? "bg-[#344054]" : ""
        } group/a inline-flex hover:bg-[#344054] rounded-[5px] p-[9px] p-2.5 w-full overflow-hidden`}
        onClick={onClick}
      >
        <Image
          src={item.icon}
          alt={`${item.label} icon`}
          width={19}
          height={18}
          className={`${
            isDashboardOrLibrary && !token ? "opacity-20" : ""
          } z-20 h-5 w-5 rounded-xl`}
        />
        <span
          className={`${
            isDashboardOrLibrary && !token
              ? "opacity-20 group-hover:opacity-20"
              : ""
          } z-10 opacity-1 text-[13px] md:text-base  ml-4 capitalize text-white whitespace-nowrap`}
        >
          {item.label}
        </span>
      </Link>
    </li>
  );
};

const NewVerticalNavigation = ({ token, isActive }: IProps) => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenWel, setIsOpenWel] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const isPicture = userData?.picture;
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const router = useRouter();
  const pathname = usePathname();
  const handleCloseLogin = () => setIsOpenLogin(false);
  const handleCloseWel = () => setIsOpenWel(false);
  const handleOpenWel = () => setIsOpenWel(true);

  const toggleMobile = () => {
    dispatch(storeHeaderToggle(true));
  };

  const handleNavigationClick = (item: any) => {
    const restrictedPages = ["dashboard", "My Library", "settings"];

    if (!token && restrictedPages?.includes(item?.label)) {
      setIsOpenLogin(true); // Open login modal if token is missing
      return;
    }

    if (item?.label === "settings") {
      handleCloseWel();
      handleOpenWel();
    }

    if (!item?.route?.startsWith("http")) {
      router.push(item?.route);
      toggleMobile(); // Close the mobile menu if opened
    } else {
      // Handle external links
      console.log("Opening external link:", item?.route); // Debug
      window.open(item.route, "_blank");
    }
  };

  const navigationAtTop = [
    token
      ? {
          label: "dashboard",
          route: "/dashboard",
          icon: "/navigation/bar-chart.svg",
        }
      : {
          label: "dashboard",
          icon: "/navigation/bar-chart.svg",
        },
    token
      ? {
          label: "My Library",
          route: "/game-library",
          icon: "/navigation/book.svg",
        }
      : {
          label: "My Library",
          icon: "/navigation/book.svg",
        },
    {
      label: "Game Calendar",
      route: "/game-calendar",
      icon: "/navigation/calendar.svg",
    },
    {
      label: "Video Game News",
      route: "/news",
      icon: "/navigation/news.png",
    },
  ];
  return (
    <>
      {" "}
      {/**Line at the right */}
      <span className="shadow-cShadowNavigationVertial max-h-[650px] fixed top-[0px] md:top-[123px] bottom-0 left-0 w-[12px] h-screen bg-cBlue-navy z-40"></span>
      <aside
        className="fixed top-[94px] md:top-[123px] overflow-y-auto max-h-[650px] h-[calc(100vh-120px)] md:h-[calc(100vh-123px)]  left-0 md:w-[70px]  bg-cBlue-navy px-4 py-8 
          rounded-br-[25px]
          rounded-tr-[25px]
          z-[9999999] md:z-[1009]
          md:hover:w-[240px] group
          flex flex-col justify-between	
          transition-all duration-500 ease-in-out
          shadow-cShadowNavigationVertial
          bottom-slidebar
          "
      >
        {/**This is the top */}
        <div className="grid grid-cols-1 gap-[0px] md:gap-[19px] group-hover:place-items-start">
          <div className="grid gap-5 w-full">
            {/**Logo */}
            <Link
              href="/"
              className="h-[38px] w-full  flex justify-start md:justify-center	items-center group-hover:justify-start overflow-hidden"
            >
              <Image
                src="/home-logo.svg"
                alt="Trugamer icon"
                height={30}
                width={27}
              />
              <Image
                src="/home-hero-title.svg"
                alt="trugamer logo"
                // title="trugamer logo"
                className="h-[16px] w-auto flex md:hidden group-hover:block transition-all delay-150 ml-2"
                width={16}
                height={16}
              />
            </Link>
            {/**Division */}
            <span className="block bg-[#475467] h-[1px] w-full"></span>
          </div>

          {/**Menu at the top */}
          <nav className="w-full">
            <ul className="grid grid-cols-1 justify-center group-hover:justify-start gap-0 w-full">
              {navigationAtTop?.map((item, index) => (
                <VerticalNavigationLink
                  item={item}
                  key={index}
                  token={token}
                  isActive={pathname === item.route}
                  onClick={() => handleNavigationClick(item)}
                />
              ))}
            </ul>
          </nav>
        </div>

        {/**This is the bottom */}
        <div className="grid grid-cols-1 gap-[19px] group-hover:place-items-start">
          {/**Menu at the bottom */}
          <nav className="w-full">
            <ul className="grid grid-cols-1 justify-center group-hover:justify-start gap-0 w-full">
              {navigationAtBottom?.map((item, index) => (
                <VerticalNavigationLink
                  item={item}
                  key={index}
                  token={token}
                  isActive={location.pathname === item.route}
                  onClick={() => handleNavigationClick(item)}
                />
              ))}
            </ul>
          </nav>
          {/**Division */}
          {token && (
            <>
              <span className=" block bg-[#475467] h-[1px] w-full"></span>

              {/**User Image */}

              <div className="w-full pl-1.5 flex justify-between items-center overflow-hidden">
                <div className="flex items-center">
                  {isPicture ? (
                    <Image
                      src={userData?.picture?.url}
                      alt="user image"
                      // title="user image"
                      width={32}
                      height={32}
                      className="transition-all w-[28px] object-cover h-[28px] min-w-[28px]  group-hover:h-[32px] group-hover:w-[32px] rounded-full"
                    />
                  ) : (
                    <Image
                      src="/dummyimg.png"
                      alt="User Image"
                      // title="User Image"
                      width={32}
                      height={32}
                      className="transition-all w-[28px] h-[28px] group-hover:h-[32px] group-hover:w-[32px] rounded-full"
                    />
                  )}

                  <div className="ml-[9px]  grid grid-cols-1  ">
                    <h5 className="text-white font-semibold text-[11px] break-all whitespace-nowrap">
                      {userData?.username && userData?.username}
                    </h5>
                    <p className="text-white text-[11px] me-[10px] max-w-[180px] break-all whitespace-nowrap">
                      {userData.email && userData.email}
                    </p>
                  </div>
                </div>
                <LogoutIcon />
              </div>
            </>
          )}
        </div>
      </aside>
      <Image
        src="/navigation/mask-for-borders.svg"
        alt="mask"
        width={64}
        height={64}
        className="absolute top-[598px] left-[11px] z-30 hidden"
      />
      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
      <AccountModal isOpenWel={isOpenWel} onCloseWel={handleCloseWel} />
    </>
  );
};
export default NewVerticalNavigation;

export const LogoutIcon = () => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    dispatch(logOut());
    // clearToken();
    return router.push("/");
  };

  return (
    <>
      <div onClick={handleLogout}>
        <MdLogout className="hidden group-hover:block cursor-pointer text-white text-[20px]" />
      </div>
    </>
  );
};

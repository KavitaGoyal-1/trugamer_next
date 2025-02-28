import { useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { IoGameControllerOutline } from "react-icons/io5";
import { TbGoGame } from "react-icons/tb";
import { LuNewspaper } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { TbBrandDiscord } from "react-icons/tb";
import { clearToken } from "@/utills/cookies";
import { logOut } from "@/store/slices/auth-slice";
import { setIsScrollOnTop, setIsUpWords } from "@/store/slices/scroll-slice";

interface IProps {
  token?: string;
  notscroll?: boolean;
}

const FixedHeader = ({ token, notscroll }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    dispatch(logOut());
    clearToken();
    return router.push("/sign-in");
  };

  const handleScroll = () => {
    let currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      dispatch(setIsScrollOnTop(true));
      dispatch(setIsUpWords(true));
    }
    if (currentScrollY > lastScrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    if (notscroll) {
      return;
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY, notscroll]);

  const menuItems = [
    token
      ? {
          icon: <RxDashboard size={18} />,
          text: "Dashboard",
          href: "/dashboard",
        }
      : {
          icon: <RxDashboard size={18} />,
          text: "Dashboard",
          href: "/sign-in",
          className: "opacity-30",
          iconClass: "opacity-70",
        },
    token
      ? {
          icon: <IoGameControllerOutline size={18} />,
          text: "My Library",
          href: "/game-library",
        }
      : {
          icon: <IoGameControllerOutline size={18} />,
          text: "My Library",
          href: "/sign-in",
          className: "opacity-30",
          iconClass: "opacity-70",
        },
    {
      icon: <TbGoGame size={18} />,
      text: "Game Calendar",
      href: "/game-calendar",
    },
    {
      icon: <LuNewspaper size={18} />,
      text: "Video Game News",
      href: "/news",
    },
    {
      icon: <TbBrandDiscord size={18} />,
      text: "Discord",
      href: "https://discord.com/invite/77XY6sAaFJ",
    },
    {
      icon: <IoSettingsOutline size={18} />,
      text: "Settings",
      href: "/profile",
    },
    token
      ? {
          icon: <AiOutlineLogout size={18} />,
          text: "Logout",
          onClick: handleLogout, // Set the handleLogout function directly here
        }
      : {
          icon: <AiOutlineLogout size={18} />,
          text: "Login",
          href: "/sign-in",
        },
  ];

  return (
    <div
      className={`menu-bar md:hidden fixed ${
        visible ? "visible-header" : "hide-header"
      }`}
    >
      <div>
        <ul className="flex gap-4 bg-[#090A17] w-full !overflow-auto scroll-design">
          {menuItems.map((item, index) => (
            <li key={index} className="text-center my-5 px-3">
              <div className="block">
                {item.onClick ? (
                  <>
                    <div className="cursor-pointer" onClick={item.onClick}>
                      <div className="icons text-white flex justify-center">
                        {item.icon}
                      </div>
                      <button
                        className={`text-xs text-white whitespace-nowrap font-semibold`}
                      >
                        {item.text}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      target={item.text === "Discord" ? "_blank" : undefined}
                      href={item.href && item.href}
                      className={` text-xs text-white whitespace-nowrap font-semibold`}
                    >
                      <div
                        className={`${item.iconClass} icons text-white flex justify-center`}
                      >
                        {item.icon}
                      </div>

                      <span className={`${item.className}`}>{item.text}</span>
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FixedHeader;

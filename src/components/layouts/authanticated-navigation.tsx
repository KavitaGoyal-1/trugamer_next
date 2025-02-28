// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import HeaderUserItems from "./header-user-Items";
// interface IProps {
//   text?: string;
//   token?: string;
// }

// const AuthenticatedNavigation = ({ text, token }: IProps) => {
//   const navigate = useNavigate();
//   const [scrollPosition, setScrollPosition] = useState(0);
//   useEffect(() => {
//     const handleScroll = () => {
//       const position = window.scrollY;
//       setScrollPosition(position);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const getBackgroundColor = () => {
//     const opacity = Math.min(scrollPosition / 200, 1);
//     return `rgba(16, 24, 40, ${opacity})`;
//   };

//   return (
//     <header
//       style={{ backgroundColor: getBackgroundColor() }}
//       className={`fixed z-[100] py-4  w-full px-[5%] md:px-[10%] top-[0px] right-0 left-0
//     grid grid-cols-2
//     mx-auto items-center justify-between gap-8`}
//     >
//       <div className="flex justify-start	items-center">
//         <img
//           src="/logo.svg"
//           alt="Trugamer logo"
//           title="Trugamer logo"
//           width={100}
//           height={50}
//           className="h-[44px] w-auto cursor-pointer"
//           onClick={() => navigate("/")}
//         />
//         {/* <span className="hidden lg:block bg-white h-[30px] w-[1px] mx-4 lines"></span> */}
//         <span className="hidden lg:block text-white font-bold capitalize text-2xl text-start">
//           {text}
//         </span>
//       </div>

//       {/* <Search /> */}

//       <HeaderUserItems />
//     </header>
//   );
// };

// export default AuthenticatedNavigation;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // If using App Router (app directory)
import HeaderUserItems from "./header-user-Items";
import Image from "next/image";

interface IProps {
  text?: string;
  token?: string;
}

const AuthenticatedNavigation = ({ text, token }: IProps) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBackgroundColor = () => {
    const opacity = Math.min(scrollPosition / 200, 1);
    return `rgba(16, 24, 40, ${opacity})`;
  };

  return (
    <header
      style={{ backgroundColor: getBackgroundColor() }}
      className={`fixed z-[100] py-4 w-full px-[5%] md:px-[10%] top-0 right-0 left-0 grid grid-cols-2 mx-auto items-center justify-between gap-8`}
    >
      <div className="flex justify-start items-center">
        <Image
          src="/logo.svg"
          alt="Trugamer logo"
          title="Trugamer logo"
          width={100}
          height={50}
          className="h-[44px] w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
        <span className="hidden lg:block text-white font-bold capitalize text-2xl text-start">
          {text}
        </span>
      </div>

      <HeaderUserItems />
    </header>
  );
};

export default AuthenticatedNavigation;

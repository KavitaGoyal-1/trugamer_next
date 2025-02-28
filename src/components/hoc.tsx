// import React, { FC, useState } from "react";
// import Cookies from "universal-cookie";

// const cookie = new Cookies(null);

// interface IProps {
//   children: React.ReactNode;
// }

// const HOC: FC<IProps> = ({ children }) => {
//   const [openModal, setOpenModal] = useState(false);

//   return (
//     <>
//       {children}
//       {openModal && (
//         <div className="h-screen w-full fixed top-0 left-0 z-[100] flex items-center justify-center">
//           <div className="fixed w-full h-screen opacity-50 bg-black" />
//           <div className="relative z-[10000] py-10 rounded-2xl text-black min-h-[20vh] bg-white w-[90%] md:w-[60%] flex flex-col items-center justify-center p-4">
//             <h1 className="text-2xl font-bold mb-4">Cookie Policy</h1>
//             <p className="text-center mb-4">
//               This website uses cookies to ensure you get the best experience on
//               our website.
//             </p>
//             <div className="flex gap-2">
//               <button
//                 className="bg-cBlack-main text-white  px-4 py-2 rounded-md"
//                 onClick={() => {
//                   cookie.set("cookieApproval", true);
//                   setOpenModal(false);
//                 }}
//               >
//                 Accept
//               </button>

//               <button
//                 className="bg-cBlack-main text-white px-4 py-2 rounded-md"
//                 onClick={() => {
//                   cookie.set("cookieApproval", false);
//                   setOpenModal(false);
//                 }}
//               >
//                 Decline
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default HOC;

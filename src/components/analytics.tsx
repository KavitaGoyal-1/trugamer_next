// import Image from "next/image";
// import { useLoaderData } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import PageLayout from "./layouts/page-layout";
// import { useRouter } from "next/router";

// const Analytics = () => {
//   const data: any = useLoaderData();
//   const router = useRouter();
//   const renderHead = (key: string) => {
//     switch (key) {
//       case "total_playing_now":
//         return "Games Playing Now ";
//         break;
//       case "total_playing_next":
//         return "Games Playing Next";
//         break;
//       case "total_beaten_games":
//         return "Beaten Games";
//         break;
//       case "total_favourite_games":
//         return "Total Favourite Games";
//         break;
//       case "total_hours":
//         return "Total Hours Played";
//         break;
//       case "total_game_rated":
//         return "Total Games Rated";
//         break;
//       case "avg_rating":
//         return "Average Rating";
//         break;
//     }
//   };
//   return (
//     <>
//       <PageLayout title="Analytics" bgImage={""}>
//         <div className="w-full bg-cBlue-tag">
//           {data && data?.analytics ? (
//             <div className="flex w-full gap-3 justify-between flex-wrap">
//               {Object.keys(data?.analytics)?.map((key, index) => {
//                 return !Array.isArray(data?.analytics[key]) ? (
//                   <div
//                     key={index}
//                     className="w-[48%] p-3 bg-cBlue-tab rounded-lg"
//                   >
//                     <h1 className=" text-sm md:text-xl text-center">
//                       {renderHead(key)}
//                     </h1>
//                     <div>
//                       {Array.isArray(data?.analytics[key]) ? (
//                         <></>
//                       ) : (
//                         <p className=" text-center mt-6 text-3xl text-green-500 font-bold">
//                           {data?.analytics[key]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ) : null;
//               })}
//             </div>
//           ) : null}

//           {data?.analytics?.top_10_games?.length && (
//             <h1 className=" text-3xl font-bold mt-10">Top Played Games</h1>
//           )}

//           <div className="md:block hidden">
//             {data?.analytics?.top_10_games &&
//               data?.analytics["top_10_games"]?.length && (
//                 <div className="mt-10">
//                   <div className="mt-8 flex flex-wrap gap-1 justify-between">
//                     {data?.analytics["top_10_games"]?.map(
//                       (game: any, index: number) => {
//                         return (
//                           <div
//                             key={index}
//                             className="flex items-center mb-5 gap-3 w-full sm:w-[48%] lg:w-[30%] border p-2 rounded-lg border-gray-800 cursor-pointer"
//                             onClick={() =>
//                               router.push(`/game/${game?.game?.slug}`)
//                             }
//                           >
//                             <div className="w-18 h-18 rounded-lg gap-3 flex items-center">
//                               <Image
//                                 src={game?.game?.image?.url}
//                                 className=" w-[80px] h-[80px]"
//                                 alt="game img"
//                                 title="game img"
//                                 width={80}
//                                 height={80}
//                               />
//                             </div>
//                             <div className="flex flex-col">
//                               <h1 className="text-lg font-bold">
//                                 {game?.game?.title}
//                               </h1>
//                               <p className="text-sm">{game?.game?.desc}</p>
//                               <span className="text-sm text-left">
//                                 hours played: {game?.hours}
//                               </span>
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>
//               )}
//           </div>
//           <div className="md:hidden block mt-8">
//             <Swiper
//               slidesPerView={1}
//               spaceBetween={0}
//               grabCursor={true}
//               className="w-full"
//               breakpoints={{
//                 640: {
//                   slidesPerView: 1,
//                 },
//                 768: {
//                   slidesPerView: 1,
//                 },
//                 1080: {
//                   slidesPerView: 1,
//                 },
//                 1250: {
//                   slidesPerView: 1,
//                 },
//                 1800: {
//                   slidesPerView: 1,
//                 },
//               }}
//             >
//               {data?.analytics?.top_10_games &&
//                 data?.analytics["top_10_games"]?.length && (
//                   <div className="mt-10">
//                     <h1 className=" text-3xl font-bold">Top Played Games</h1>
//                     <div className="mt-8 flex flex-wrap gap-1 justify-between">
//                       {data?.analytics["top_10_games"]?.map(
//                         (game: any, index: number) => {
//                           return (
//                             <SwiperSlide key={index}>
//                               <div
//                                 className="flex items-center mb-5 gap-3 w-full border p-2 rounded-lg border-gray-800 cursor-pointer"
//                                 onClick={() =>
//                                   router.push(`/game/${game?.game?.slug}`)
//                                 }
//                               >
//                                 <div className="w-18 h-18 rounded-lg gap-3 flex items-center">
//                                   <Image
//                                     src={game?.game?.image?.url}
//                                     className=" w-[80px] h-[80px]"
//                                     alt="slide game img"
//                                     title="slide game"
//                                     width={80}
//                                     height={80}
//                                   />
//                                 </div>
//                                 <div className="flex flex-col">
//                                   <h1 className="text-lg font-bold">
//                                     {game?.game?.title}
//                                   </h1>
//                                   <p className="text-sm">{game?.game?.desc}</p>
//                                   <span className="text-sm text-left">
//                                     hours played: {game?.hours}
//                                   </span>
//                                 </div>
//                               </div>
//                             </SwiperSlide>
//                           );
//                         }
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </Swiper>
//           </div>
//         </div>
//       </PageLayout>
//     </>
//   );
// };

// export default Analytics;

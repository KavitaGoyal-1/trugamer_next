import ShadowLeft from "@/components/carousel/shadow-left";
import HomeSubtitle from "../home-subtitle";
import LatestReviewCard from "./latest-review-card";
import ShadowRight from "@/components/carousel/shadow-right";

const LatestReview = () => {
  return (
    <>
      <section className="mt-8 md:mt-0 flex flex-col gap-[20px] md:gap-[30px] mx-0 md:mx-auto w-full h-full overflow-x-hidden">
        <div className="flex items-center justify-start md:justify-between w-[90%] md:w-[81%] mx-auto details-gradient relative pb-3">
          <div className="flex justify-center md:justify-start">
            <HomeSubtitle text="Latest Reviews" />
          </div>
        </div>
        <div className="relative w-full sm:pb-24 pb-0 z-20 px-5 md:px-0 md:pl-[10%] 2xl:pl-[9.5%]">
          <ShadowLeft tag="LatestReview" />
          <ShadowRight tag="LatestReview" />
          <LatestReviewCard />
        </div>
      </section>
    </>
  );
};

export default LatestReview;

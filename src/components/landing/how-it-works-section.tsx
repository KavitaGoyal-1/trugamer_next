import Image from "next/image";
import LightBlueBtn from "../buttons/light-blue-btn";
import HomeSubtitle from "./home-subtitle";

interface IProps {
  token?: string;
}

const HowItWorksSection = ({ token }: IProps) => {
  return (
    <section className="max-w-[2550px] mx-auto py-18 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_max-content] px-[5%] md:px-[10%] ">
      <div className="max-md:hidden flex">
        <HomeSubtitle text="What Is Trugamer ?" />
      </div>
      <div className="md:hidden block flex justify-center">
        <HomeSubtitle text="What Is Trugamer ?" />
      </div>
      <div className="row-start-3 md:row-start-1 row-end-4 md:row-end-2 col-start-1 md:col-start-2 col-end-2 col-end-3 max-md:hidden">
        {!token && <LightBlueBtn hrefString="/sign-up" text={"sign up"} />}
      </div>

      <div>
        <div className="min-h-[501px] grid grid-cols-3 gap-4 mt-5 w-full">
          <div className="col-span-1 h-full bg-cBlue-extraLight rounded-3xl">
            <div className="p-3 w-full h-1/2 flex flex-col justify-around">
              <h2>Track What your playing</h2>
              <p>Track what your playing now and plan to play next</p>
            </div>
            <div className="w-full h-1/2 flex items-end">
              <Image
                src="/home/card1.png"
                alt="how icon"
                title="how icon"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="col-span-2">
            <h2>Track What your playing</h2>
            <p>Track what your playing now and plan to play next</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

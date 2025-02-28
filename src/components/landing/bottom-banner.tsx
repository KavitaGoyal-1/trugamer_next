import Image from "next/image";
import LightBlueBtn from "../buttons/light-blue-btn";
import TransparentBtn from "../buttons/transparent-btn";

interface IProps {
  token?: string;
}

const BottomBanner = ({ token }: IProps) => {
  return (
    <section
      className="
      max-w-[2550px] mx-auto py-20 md:py-28 px-[5%] md:px-[10%]
      grid
    "
    >
      <div className='bg-[url("/home-banner-bottom.png")] bg-cover bg-no-repeat bg-center w-full mx-auto grid grid-cols-2 max-lg:grid-cols-1 rounded-[56px] min-h-[453px] relative max-lg:place-items-center'>
        <div className="lg:pl-[150px] pl-0  grid gap-6 place-content-center place-items-start max-lg:place-items-center lg:w-full w-[80%] max-[500px]:w-[95%]">
          <span className="font-primary font-bold uppercase text-[18px] text-cBlue-light">
            Organize your gaming
          </span>
          <h2 className="lg:text-start text-center max-sm:text-[44px] xl:text-[64px] text-[50px] font-bold xl:leading-[74px] max-sm:leading-[52px] leading-[55px]">
            Plan Your Gaming Like Never Before
          </h2>

          {!token ? (
            <div className="flex gap-2 max-lg:justify-center max-[700px]:flex-col w-full">
              <TransparentBtn hrefString="/sign-in" text="login" />
              <LightBlueBtn hrefString="/sign-up" text="Create an account" />
            </div>
          ) : null}
        </div>

        <div className="relative max-lg:hidden">
          <Image
            src="/home-banner-bottom-character.png"
            alt="character"
            title="character"
            width={591}
            height={672}
            className="absolute top-[-100px] right-[-50px] h-[700px] w-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;

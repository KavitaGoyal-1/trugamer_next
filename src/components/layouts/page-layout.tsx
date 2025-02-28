import React, { FC } from "react";
// import Container from "../Container";
import FooterDetailed from "./footer-detailed";
import NavigationPublic from "./navigation-public";
import Footer from "./footer";
import { getToken } from "@/utills/cookies";
interface IProps {
  children: React.ReactNode;
  title?: string;
  bgImage?: string;
}

const PageLayout: FC<IProps> = ({ children, title, bgImage }) => {
  const token = getToken();

  return (
    <>
      <section
        className={` !bg-cBlack-dark min-h-screen max-w-full sm:max-w-[2050px] mx-auto py-[80px] md:py-28 grid grid-cols-1  place-content-start  pl-[5%] md:pl-[6%]  pr-[5%] lg:pr-[5%] `}
      >
        {bgImage && (
          <div
            style={{
              zIndex: 1,
              backgroundImage: `radial-gradient(59.57% 62.95% at 50% 21.65%, rgba(10, 2, 18, 0) 0%, rgba(2, 6, 18, 0.95) 99.3%),  url(${bgImage})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        )}

        <>
          <div className="z-10">
            <NavigationPublic text={["Video Game News"]} token={token} />
          </div>
        </>

        {/* <Container> */}
        <>
          {title && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_max-content] items-center mb-6 mt-0 md:mb-12">
              <div className="flex justify-between items-center">
                <h1 className="font-bold mt-[35px] sm:mt-[0px] text-[30px] sm:text-[44px] text-start">
                  {title}
                </h1>
              </div>
            </div>
          )}
        </>
        <div className={`z-10`}>{children}</div>
        {/* </Container> */}
      </section>
      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block">
        <FooterDetailed />
      </div>
    </>
  );
};

export default PageLayout;

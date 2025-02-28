import { useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import SignInForm from "@/components/auth/sign-in-form";
import Header from "@/components/auth/header";

const SignIn = () => {
  const currentYear = moment()?.format("YYYY");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <section className="relative min-h-screen grid max-md:grid-cols-1 grid-cols-2 bg-cBlack-dark ">
        <div className="relative flex items-start sm:items-center">
          <div className=" mx-auto md:w-[360px] w-[70%] max-[500px]:w-[95%] grid gap-6 grid-cols-1 py-24 md:py-20 ">
            <div className="w-full">
              <h1 className="text-white text-[36px] max-[500px]:text-[24px] text-start font-semibold">
                {" "}
                Log in
              </h1>
              <p className="text-cPurple-light text-base font-regular">
                Welcome back! Please enter your details.
              </p>
            </div>
            <SignInForm />
            <div className="text-[14px] font-normal text-cGray-500">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-cBlue-light hover:text-cBlue-light "
              >
                Sign Up
              </Link>
            </div>
          </div>

          <footer
            className="absolute
                w-full px-[5%] bottom-[20px] right-0 left-0
                flex justify-between align-center"
          >
            <p className="text-cGray-500 text-[14px]">
              © Trugamer {currentYear ? currentYear : "2024"}{" "}
            </p>
          </footer>
        </div>

        {/**Right Image */}
        <div className="bg-[url('/auth/login-bg-img.png')] bg-center bg-cover bg-no-repeat max-md:hidden"></div>
      </section>
    </>
  );
};

export default SignIn;

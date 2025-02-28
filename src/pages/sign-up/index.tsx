import { useEffect } from "react";
import Link from "next/link";
import Header from "../../components/auth/header";
import SingUpForm from "../../components/auth/sing-up-form";
import moment from "moment";
import Image from "next/image";

const SignUp = () => {
  const currentYear = moment()?.format("YYYY");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />

      <section className="relative min-h-screen grid max-md:grid-cols-1 grid-cols-2  bg-cBlack-dark ">
        <SignUpContentLeft />

        <div className="relative flex items-center">
          <div className="lg:w-[480px] md:w-[90%] w-[75%] max-[500px]:w-[90%] mx-auto grid gap-6 grid-cols-1 py-20">
            <div className="w-full">
              <h1 className="text-white text-[36px] max-[500px]:text-[24px] text-start font-semibold">
                Create Your Free Account
              </h1>
            </div>
            <SingUpForm />

            <div className="text-[14px] font-normal text-cGray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-cBlue-light hover:text-cBlue-light "
              >
                Log in
              </Link>
            </div>
          </div>

          <footer
            className="absolute
                w-full px-[5%] bottom-[20px] right-0 left-0
                flex justify-between align-center"
          >
            <p className="text-cGray-500 text-[14px]">
              © Trugamer {currentYear ? currentYear : "2024"}
            </p>
            <span className="text-cGray-500 text-[14px] grid grid-cols-[max-content_1fr] gap-1 ">
              <Image
                src="/auth/mail.svg"
                alt="email icon"
                title="email icon"
                width={16}
                height={16}
              />{" "}
              help@trugamer.com
            </span>
          </footer>
        </div>
      </section>
    </>
  );
};

const SignUpContentLeft = () => (
  <div className="bg-[url('/auth/register-bg.png')] bg-center bg-no-repeat bg-cover grid place-items-center place-content-center max-md:hidden">
    <div className="max-w-[650px] mx-auto">
      <div className="relative grid place-items-center place-content-center">
        <Image
          src="/auth/newSignup.svg"
          alt="games image"
          title="games image"
          width={515}
          height={456}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-[32px] font-[800] capitalize text-center">
          Create an account
        </h1>
        <p className="text-[32px] font-[800] text-center">
          Join our Growing community
        </p>
      </div>
    </div>
  </div>
);

export default SignUp;

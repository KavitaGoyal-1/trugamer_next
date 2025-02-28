import moment from "moment";
import Image from "next/image";

const FooterDetailed = () => {
  const currentYear = moment()?.format("YYYY");
  return (
    <footer className="bg-cBlack-main mx-auto pt-[44px] pb-[38px] md:pt-[64px] md:pb-[48px]  relative">
      <div className="max-w-full md:max-w-[2550px] mx-auto px-[5%] sm:px-[10%] ">
        <div className="flex flex-col items-center">
          {/* 1st section */}
          <div>
            <Image
              src="/logo.svg"
              alt="Trugamer logo"
              title="Trugamer logo"
              width={180}
              height={44}
            />
          </div>
        </div>

        <span className="hidden md:block h-[1px] w-full bg-[#ffffff1a] mb-[32px] mt-[40px]"></span>

        <div className="flex items-center md:flex-row flex-col mt-8 md:mt-0">
          <span className="text-cPurple-light text-start mb-10 md:mb-0">
            © {currentYear ? currentYear : "2024"} Trugamer. All rights
            reserved.
          </span>

          <div className="md:mb-0 mb-[16px]">
            <ul className="flex gap-3">
              <li>
                <span className="text-[10px] font-medium flex gap-2 items-center justify-center">
                  Current Build{" "}
                  <span className="bg-[#00ADFF] p-1 rounded-md">Alpha</span>
                </span>
              </li>
              <li className="mr-2">
                <a
                  href="/term-condition"
                  rel="nofollow"
                  className="text-cPurple-light"
                >
                  Terms
                </a>
              </li>
              <li className="mr-2">
                <a
                  href="/privacy-policy"
                  rel="nofollow"
                  className="text-cPurple-light"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a className="text-cPurple-light">Cookies</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDetailed;

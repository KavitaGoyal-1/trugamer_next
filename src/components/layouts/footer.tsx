import moment from "moment";
import Image from "next/image";

const Footer = () => {
  const currentYear = moment().format("YYYY");

  return (
    <footer
      className="bg-cBlack-main lg:bg-[#090A16] mx-auto pt-[20px] pb-[20px] relative 
    "
    >
      <div className="max-w-[2550px] mx-auto xl:px-[8%] lg:px-[3%] px-[5%]">
        <div className="flex justify-between items-center lg:flex-row flex-col gap-8 lg:gap-4">
          <div>
            <Image
              src="/logo.svg"
              alt="Trugamer logo"
              width={180}
              height={44}
            />
          </div>
          <div className="flex justify-center">
            <span className="text-cPurple-light text-base">
              © {currentYear ? currentYear : "2024"} Trugamer. All rights
              reserved.
            </span>
          </div>
          <div>
            <ul className="flex justify-center gap-4">
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

export default Footer;

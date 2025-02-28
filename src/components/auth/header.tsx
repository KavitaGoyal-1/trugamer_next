import Image from "next/image";
import Link from "next/link";
//This is use in sign up and sing in because is different to the other heading
const Header = () => {
  return (
    <header
      className="absolute w-full px-[3%] top-[20px] right-0 left-0
    flex flex-row justify-between items-center
    z-[100]
    "
    >
      <Link href="/" className="flex justify-start	items-center">
        <Image
          src="/logo.svg"
          alt="Trugamer logo"
          title="Trugamer logo"
          width={100}
          height={50}
          className="h-auto w-auto"
        />
      </Link>
    </header>
  );
};

export default Header;

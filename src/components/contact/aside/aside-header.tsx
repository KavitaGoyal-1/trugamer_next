import Image from "next/image";
import { useRouter } from "next/router";

const AsideHeader = ({ intro }: { intro: string }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };
  return (
    <div className="grid gap-2">
      <Image
        src="/logo.svg"
        alt="Trugamer logo"
        title="Trugamer logo"
        width={180}
        height={44}
        onClick={handleClick}
        className="cursor-pointer"
      />
      <p className="text-lg text-cGray-400 text-start">{intro}</p>
    </div>
  );
};
export default AsideHeader;

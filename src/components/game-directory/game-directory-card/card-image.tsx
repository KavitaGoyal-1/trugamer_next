// import { Image } from "../../../../types/Games";

import { ImageData } from "@/types/game";
import Image from "next/image";

const CardImage = ({ image, title }: { image: ImageData; title: string }) => {
  let src =
    image?.data?.attributes?.url || image?.url
      ? image?.data?.attributes?.url || image?.url
      : "/placeholder.png";
  return (
    <Image
      src={src ? src : ""}
      alt={"Card Image"}
      title={"Card Image"}
      width={200}
      height={290}
      className="w-full  h-[340px] rounded-3xl object-cover "
    />
  );
};

export default CardImage;

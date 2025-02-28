import { getImageUrl } from "@/utills/get-api";
import Image from "next/image";

const AsideSocialIcons = ({ socialIcons }: any) => {
  return (
    <div className="flex flex-wrap self-end mt-12">
      {socialIcons?.map((socialIcon: any) => {
        let { id, attributes } = socialIcon.icon.data;
        let { url, alternativeText } = attributes;
        return (
          <Image
            key={id}
            src={`${getImageUrl()}${url}`}
            title={alternativeText || "icon"}
            alt={alternativeText || "icon"}
            width={24}
            height={24}
            className="not-last first:ml-0 ml-3 cursor-pointer"
          />
        );
      })}
    </div>
  );
};

export default AsideSocialIcons;

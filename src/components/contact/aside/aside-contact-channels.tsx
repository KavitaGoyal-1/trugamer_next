import { getImageUrl } from "@/utills/get-api";
import Image from "next/image";

const AsideContactChannels = ({ contactMeans }: any) => {
  return (
    <div className="pt-8 grid grid-cols-1 gap-8 ">
      {contactMeans?.map((contactMean: any) => {
        const { url } = contactMean.icon.data[0].attributes;
        return (
          <div
            key={contactMeans.id}
            className="grid grid-cols-[max-content_1fr] gap-8"
          >
            <Image
              alt={"alternativeText"}
              title={"alternativeText"}
              src={`${getImageUrl()}${url}`}
              width={24}
              height={24}
            />
            <div className="grid">
              <h3 className="text-start text-white font-semibold	text-xl">
                {contactMean.title}
              </h3>
              <p className="text-start text-cGray-400 font-normal text-base mt-2 mb-3">
                {contactMean.description}
              </p>
              <span className="text-start text-white font-semibold text-base cursor-pointer">
                {contactMean.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AsideContactChannels;

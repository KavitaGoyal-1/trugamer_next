import AsideHeader from "./aside-header";
import AsideContactChannels from "./aside-contact-channels";
import AsideSocialIcons from "./aside-social-icons";
import { IAttributes } from "@/types/contact";
export const Aside = ({ contactInfo }: { contactInfo: IAttributes | null }) => {
  return (
    <aside
      className="bg-[#101828] p-[48px]
        grid justify-items-start content-start
        grid-rows-[repeat(2,max-content)_1fr]
    "
    >
      {contactInfo !== null && (
        <>
          <AsideHeader intro={contactInfo.intro} />
          <AsideContactChannels contactMeans={contactInfo.contactMeans} />
          <AsideSocialIcons socialIcons={contactInfo.social_icons} />
        </>
      )}
    </aside>
  );
};

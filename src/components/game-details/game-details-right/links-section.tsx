import React from "react";
import Steam from "../../../../public/icons/steam.svg";
import Epic from "../../../../public/icons/epic.svg";
import Facebook from "../../../../public/icons/facebook.svg";
import Youtube from "../../../../public/icons/youtube.svg";
import Twitter from "../../../../public/icons/twitter.svg";
import Reddit from "../../../../public/icons/reddit.svg";
import Wikipedia from "../../../../public/icons/wikipedia.svg";
import Wikia from "../../../../public/icons/wikipedia.svg";
import Discord from "../../../../public/icons/discord.svg";
import OfficialSite from "../../../../public/icons/official-site.svg";
import Community from "../../../../public/icons/community-wiki.svg";
import Twitch from "../../../../public/icons/twitch.svg";
import Link from "next/link";
import Gog from "../../../../public/icons/gog.svg";
import IosIpad from "../../../../public/icons/ios-ipad.svg";
import IosIphone from "../../../../public/icons/ios-iphone.svg";
import Itch from "../../../../public/icons/itch.svg";
import Playstore from "../../../../public/icons/play-store.svg";
import Instagram from "../../../../public/icons/instagram.svg";
import Image from "next/image";

type LinkCategory =
  | "official"
  | "steam"
  | "epicgames"
  | "facebook"
  | "youtube"
  | "twitter"
  | "reddit"
  | "wikipedia"
  | "discord"
  | "community"
  | "twitch"
  | "gog"
  | "itch"
  | "ipad"
  | "iphone"
  | "android"
  | "instagram"
  | "wikia";

const iconMap: Record<LinkCategory, string> = {
  official: OfficialSite,
  steam: Steam,
  epicgames: Epic,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  reddit: Reddit,
  wikipedia: Wikipedia,
  discord: Discord,
  community: Community,
  twitch: Twitch,
  gog: Gog,
  itch: Itch,
  ipad: IosIpad,
  iphone: IosIphone,
  android: Playstore,
  instagram: Instagram,
  wikia: Wikia,
};

interface LinksSectionProps {
  linksData: {
    url: string;
    category: LinkCategory;
  }[];
}

const LinksSection: React.FC<LinksSectionProps> = ({ linksData }) => {
  if (!linksData || linksData.length === 0) {
    return null;
  }
  const hasPlatformLinks = linksData?.some((linkData) =>
    ["steam", "epicgames", "gog", "twitch"].includes(linkData.category)
  );

  const hasOtherLinks = linksData?.some(
    (linkData) =>
      !["steam", "epicgames", "gog", "twitch"].includes(linkData.category)
  );
  return (
    <div className="block max-w-full md:max-w-[350px] pr-0 sm:pr-0">
      <h3 className="section-card-heading">Links</h3>
      <div className="w-full bg-cBlue-secondary p-5 rounded-xl">
        <div className="flex flex-col ">
          <div className="flex gap-[16px] flex-wrap">
            {linksData
              ?.filter((linkData) =>
                ["steam", "epicgames", "gog", "twitch"].includes(
                  linkData.category
                )
              )
              .map((linkData, index) => {
                const IconComponent = iconMap[linkData.category]; // Get the correct icon based on category
                return (
                  <Link
                    href={linkData.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={IconComponent}
                      alt={linkData.category}
                      width={32}
                      height={32}
                      className="rounded-[10px]"
                    />
                  </Link>
                );
              })}
          </div>

          {/* Gradient Divider */}
          {hasPlatformLinks && hasOtherLinks && (
            <div className="gradient-divider relative mt-[16px] mb-[16px]"></div>
          )}

          {/* Second div only shows non-steam, epicgames, gog, twitch categories */}
          <div className="flex gap-4 flex-wrap">
            {linksData
              ?.filter(
                (linkData) =>
                  !["steam", "epicgames", "gog", "twitch"].includes(
                    linkData.category
                  )
              )
              .map((linkData, index) => {
                const IconComponent = iconMap[linkData.category];
                return (
                  <Link
                    href={linkData.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={IconComponent}
                      alt={linkData.category}
                      width={32}
                      height={32}
                      className="rounded-[10px]"
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksSection;

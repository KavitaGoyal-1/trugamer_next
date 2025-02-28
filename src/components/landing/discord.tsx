import { useEffect, useState } from "react";
import LightBlueBtn from "../buttons/light-blue-btn";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getApi } from "@/utills/get-api";
import Image from "next/image";

interface IProps {
  token?: string;
}

const Discord = ({ token }: IProps) => {
  const [banner, setBanner] = useState<any>(null);
  const [discordLink, setDiscordLink] = useState<any>("");
  const router = useRouter();

  const getBanner = async () => {
    try {
      const { data } = await axios.get(
        `${getApi()}/home-promo?populate=column1_square.icon.image,column1_square.background.image,column1_square.game,column2_square.icon.image,column2_square.background.image,column2_square.game,column3_square.icon.image,column3_square.background.image,column3_square.game,column4_square.game,column4_square.icon.image,column4_square.background.image,column4_square.game,column1_rectangle.icon.image,column1_rectangle.background.image,column4_rectangle.game,column1_rectangle.game,column4_rectangle.background.image,column4_rectangle.icon.image`,
        { headers: { Authorization: token && `Bearer ${token}` } }
      );
      setBanner(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiscordLink = async () => {
    try {
      const { data } = await axios.get(`${getApi()}/discord-link`, {
        headers: { Authorization: token && `Bearer ${token}` },
      });
      setDiscordLink(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanner();
    getDiscordLink();
  }, []);

  return (
    <section className="max-w-[2550px] mx-auto px-[5%] md:px-[10%] grid grid-cols-1 md:grid-cols-[1fr_max-content] ">
      <div className="grid max-md:hidden lg:grid-cols-4 grid-cols-2 gap-6">
        <div className="h-[673px] grid grid-cols-1 grid-rows-3 gap-6 place-items-center">
          <div
            className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column1_square[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column1_square[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column1_square[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column1_square[0].icon.alt}
                title={banner && banner?.attributes.column1_square[0].icon.alt}
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column1_square[0].followers}
              </p>
            </div>
          </div>
          <div
            className="grid row-span-2 rounded-xl w-full h-full place-items-center cursor-pointer"
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column1_rectangle[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column1_rectangle[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column1_rectangle[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column1_rectangle[0].icon.alt}
                title={
                  banner && banner?.attributes.column1_rectangle[0].icon.alt
                }
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column1_rectangle[0].followers}
              </p>
            </div>
          </div>
        </div>
        <div className="h-[674px] grid grid-cols-1 grid-rows-3 gap-6 place-items-center ">
          {banner &&
            banner?.attributes.column2_square.map(
              (data: any, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${data.background.image.data.attributes.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
                  onClick={() =>
                    router.push(`/game/${data.game.data.attributes.slug}`)
                  }
                >
                  <div>
                    <Image
                      src={data && data.icon.image.data.attributes.url}
                      alt={data && data.icon.alt}
                      title={data && data.icon.alt}
                      width={24}
                      height={24}
                    />
                    <p className="text-center mt-3">{data && data.followers}</p>
                  </div>
                </div>
              )
            )}
        </div>
        <div className="h-[674px] grid grid-cols-1 grid-rows-3 gap-6 place-items-center">
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column3_square[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column3_square[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column3_square[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column3_square[0].icon.alt}
                title={banner && banner?.attributes.column3_square[0].icon.alt}
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column3_square[0].followers}
              </p>
            </div>
          </div>
          <div className="grid row-span-2 bg-[#21283D] rounded-xl w-full h-full place-items-center">
            <div className="flex flex-col justify-center items-center h-[100%]">
              <Image
                src="/discord/discord-logo.svg"
                alt="disord logo"
                title="disord logo"
                width={40}
                height={40}
                className="mt-12 mb-5"
              />
              <span className="text-[32px] mb-24">
                Join The Trugamer Community
              </span>
              <LightBlueBtn
                hrefString={discordLink && discordLink.attributes.url}
                text="Join our discord"
              />
            </div>
          </div>
        </div>
        <div className="h-[674px] grid grid-cols-1 grid-rows-3 gap-6 place-items-center">
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column4_rectangle[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-2 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column4_rectangle[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column4_rectangle[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column4_rectangle[0].icon.alt}
                title={
                  banner && banner?.attributes.column4_rectangle[0].icon.alt
                }
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column4_rectangle[0].followers}
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column4_square[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column4_square[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column4_square[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column4_square[0].icon.alt}
                title={banner && banner?.attributes.column4_square[0].icon.alt}
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column4_square[0].followers}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:hidden block grid-cols-2 gap-6">
        {/* Upper Left column */}
        <div className="h-[450px] grid grid-cols-1 grid-rows-2 gap-6 place-items-center">
          <div
            className="grid row-span-2 rounded-xl w-full h-full place-items-center cursor-pointer"
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column1_rectangle[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column1_rectangle[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column1_rectangle[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column1_rectangle[0].icon.alt}
                title={
                  banner && banner?.attributes.column1_rectangle[0].icon.alt
                }
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column1_rectangle[0].followers}
              </p>
            </div>
          </div>
        </div>
        {/* Upper Right 2 squares */}
        <div className="h-[450px] grid grid-cols-1 grid-rows-2 gap-6 place-items-center ">
          {banner &&
            banner?.attributes.column2_square
              .slice(0, 2)
              .map((data: any, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${data.background.image.data.attributes.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
                  onClick={() =>
                    router.push(`/game/${data.game.data.attributes.slug}`)
                  }
                >
                  <div>
                    <Image
                      src={data && data.icon.image.data.attributes.url}
                      alt={data && data.icon.alt}
                      title={data && data.icon.alt}
                      width={24}
                      height={24}
                    />
                    <p className="text-center mt-3">{data && data.followers}</p>
                  </div>
                </div>
              ))}
        </div>

        <div className="grid row-span-2 col-span-full bg-[#21283D] rounded-xl w-full h-full place-items-center">
          <div className="flex flex-col justify-center items-center h-[350px]">
            <Image
              src="/discord/discord-logo.svg"
              alt="disord logo"
              title="disord logo"
              width={60}
              height={60}
              className="mb-5"
            />
            <span className="text-[32px] mb-10">
              Join The Trugamer Community
            </span>
            <LightBlueBtn
              hrefString={discordLink && discordLink.attributes.url}
              text="Join our discord"
            />
          </div>
        </div>

        {/* Below Left 2 squares */}
        <div className="h-[450px] grid grid-cols-1 grid-rows-2 gap-6 place-items-center">
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column3_square[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column3_square[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column3_square[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column3_square[0].icon.alt}
                title={banner && banner?.attributes.column3_square[0].icon.alt}
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column3_square[0].followers}
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column4_square[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-1 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column4_square[0].game.data.attributes.slug}`
              )
            }
          >
            <div>
              <Image
                src={
                  banner &&
                  banner?.attributes.column4_square[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column4_square[0].icon.alt}
                title={banner && banner?.attributes.column4_square[0].icon.alt}
                width={24}
                height={24}
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column4_square[0].followers}
              </p>
            </div>
          </div>
        </div>
        {/* Below right column */}
        <div className="h-[450px] grid grid-cols-1 grid-rows-2 gap-6 place-items-center">
          <div
            style={{
              backgroundImage: `url(${
                banner &&
                banner?.attributes.column4_rectangle[0].background.image.data
                  .attributes.url
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="grid row-span-2 rounded-xl w-full h-full place-items-center cursor-pointer"
            onClick={() =>
              router.push(
                `/game/${banner?.attributes.column4_rectangle[0].game.data.attributes.slug}`
              )
            }
          >
            <div className="">
              <Image
                src={
                  banner &&
                  banner?.attributes.column4_rectangle[0].icon.image.data
                    .attributes.url
                }
                alt={banner && banner?.attributes.column4_rectangle[0].icon.alt}
                title={
                  banner && banner?.attributes.column4_rectangle[0].icon.alt
                }
                width={24}
                height={24}
                className="w-"
              />
              <p className="text-center mt-3">
                {banner && banner?.attributes.column4_rectangle[0].followers}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discord;

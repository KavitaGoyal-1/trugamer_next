import axios from "axios";
import { FC, useEffect, useState } from "react";
import LightBlueBtn from "../buttons/light-blue-btn";
import { useRouter, useParams } from "next/navigation";
import LoaderSpinner from "../loader-spinner";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import Image from "next/image";

interface IProps {}

const Visitor: FC<IProps> = () => {
  const [profileData, setProfileData] = useState<any>();
  const token = getToken();
  const router = useRouter();

  const params = useParams();
  const slug = params?.slug;

  // let slug = router.query.slug;

  const getUserByTag = async () => {
    try {
      const { data } = await axios.get(
        `${getApi()}/users-permissions/user/tag/${slug}`,
        {
          headers: { Authorization: token && `Bearer ${token}` },
        }
      );
      setProfileData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (slug) {
      getUserByTag();
    }
  }, [slug]);

  return (
    <>
      <div className="mt-32 px-[10%] mb-32">
        <div className="mt-10 flex items-center">
          <Image
            src={profileData?.user && profileData.user.picture.url}
            alt="User Image"
            title="User Image"
            width={45}
            height={45}
            className="rounded-full w-24"
          />
          {profileData?.user && (
            <div className="ml-5">
              <p className="text-[28px]  font-[600]">{`${profileData.username}`}</p>
              <p className="mt-1 ml-1">{profileData.user.country}</p>
            </div>
          )}
        </div>
        <div className="border border-cBlue-light mt-10 mb-2" />
        <div>
          <p className="text-[24px] font-[600] ml-2">About Me</p>
          <div className="border border-cBlue-light mt-2" />

          {profileData?.user && (
            <p className="text-[16px] ml-2 font-[400] mt-4">
              {profileData.user.bio}
            </p>
          )}
        </div>
        <div className="border border-cBlue-light mt-16 mb-2" />
        <div>
          <div className="flex justify-between items-center">
            <p className="text-[24px] font-[600] ml-2">Favourite Games</p>
            <div className="max-[500px]:hidden">
              <LightBlueBtn text="See All" href={`/user/games/${slug}`} />
            </div>
          </div>
          <div className="border border-cBlue-light mt-2" />

          {profileData?.user ? (
            <div className="grid md:grid-cols-6 grid-cols-3 max-[500px]:grid-cols-2 gap-x-[10px] gap-y-[10px] mt-4">
              {profileData.user.favorite_games.length !== 0 ? (
                profileData.user.favorite_games.map(
                  (game: any, index: number) => (
                    <div key={index} className="w-full rounded-[13.3px]">
                      <Image
                        src={game.image.url}
                        alt="image alt"
                        title="image alt"
                        width={10}
                        height={10}
                        className="w-full h-full hover:cursor-pointer rounded-xl"
                        onClick={() => router.push(`/game/${game.slug}`)}
                      />
                    </div>
                  )
                )
              ) : (
                <div className="ml-2">
                  <p> No Data</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center my-12 md:my-20">
              <LoaderSpinner />
            </div>
          )}

          <div className="max-[500px]:block hidden mt-5">
            <LightBlueBtn text="See All Games" href={`/user/games/${slug}`} />
          </div>
        </div>
        <div className="border border-cBlue-light mt-16 mb-2" />
        <div className="border border-transparent">
          <div className="flex justify-between items-center">
            <p className="text-[24px] font-[600] ml-2">Devices</p>
            <div className="max-[500px]:hidden">
              <LightBlueBtn text="See All" href="#" />
            </div>
          </div>
          <div className="border border-cBlue-light mt-2" />
          {profileData?.user ? (
            <div className="grid md:grid-cols-6 grid-cols-3 max-[500px]:grid-cols-2 gap-x-[10px] gap-y-[10px] my-4">
              {profileData?.user.active_devices.length !== 0 ? (
                profileData?.user.active_devices.map(
                  (device: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-[13.3px] flex flex-col justify-center items-center "
                    >
                      <Image
                        src={device.logo.image.url}
                        alt="alt"
                        title="alt"
                        width={200}
                        height={200}
                        className="h-auto rounded-[13.3px] cursor-pointer"
                      />
                    </div>
                  )
                )
              ) : (
                <div className="ml-2">
                  <p> No Data</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center my-12 md:my-20">
              <LoaderSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Visitor;

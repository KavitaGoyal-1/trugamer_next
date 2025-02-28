import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/components/layouts/footer";
import GameDirectoryCard from "@/components/game-directory/game-directory-card";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import FooterDetailed from "@/components/layouts/footer-detailed";
import NavigationPublic from "@/components/layouts/navigation-public";
import { useParams } from "next/navigation";

const VisitProfileFavGames = () => {
  const [profileData, setProfileData] = useState<any>();
  const token = getToken();

  const params = useParams();
  const slug = params?.slug;

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
      <section className="min-h-screen bg-cBlack-dark max-w-[2550px] mx-auto py-[60px] md:py-28 grid grid-cols-1  place-content-start xl:px-[8%] lg:px-[3%] px-[5%] ">
        <NavigationPublic token={token} />
        <div>
          <h1 className="font-bold lg:text-[36px] md:text-[32px] text-[28px] capitalize mt-10">
            Favourite Games
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xx:grid-cols-6 xxl:grid-cols-7 gap-6 w-full gap-y-[80px] my-[40px]">
          {profileData?.user &&
            profileData?.user?.favorite_games?.map(
              (game: any, index: number) => (
                <GameDirectoryCard
                  key={game.id}
                  title={game.title}
                  slug={game.slug}
                  hoursToComplete={game.hoursToComplete}
                  image={game.image}
                  rating={game.rating}
                  played={game.played}
                  isFavorite={true}
                />
              )
            )}
        </div>
      </section>
      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block">
        <FooterDetailed />
      </div>
    </>
  );
};

export default VisitProfileFavGames;

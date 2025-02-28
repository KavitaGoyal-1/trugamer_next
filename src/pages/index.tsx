import React, { useEffect, useState } from "react";
import DiscoverNewReleases from "../components/landing/discover-new-releases";
import HeroSection from "../components/landing/hero-section";
import TrendingGames from "../components/landing/trending-games";
import "swiper/css";
// import SeoMeta from "src/components/SeoMeta";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { selectAuthState, signIn } from "@/store/slices/auth-slice";
import WelcomeTwo from "@/components/welcome/welcome-two";
import WelcomeOne from "@/components/welcome/welcome-one";
import Welcome from "@/components/welcome/welcome";
import LatestReview from "@/components/landing/latest-review";
import NavigationPublic from "@/components/layouts/navigation-public";
import FooterDetailed from "@/components/layouts/footer-detailed";
import LatestGamingNews from "@/components/landing/latest-gaming-news";
import Manifesto from "@/components/landing/manifesto";
import UpcomingGames from "@/components/landing/upcoming-games";
import Footer from "@/components/layouts/footer";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { getlatestNews } from "@/services/news";
import config from "@/config";
import SeoMeta from "@/components/seo-meta";
interface Props {
  trendingGames?: any[];
  newReleasedGames?: any[];
  upcomingGames?: any[];
  latestGamingNewsData?: any[];
}

const Landing = ({
  trendingGames,
  newReleasedGames,
  upcomingGames,
  latestGamingNewsData,
}: Props) => {
  const { userData } = useSelector(selectAuthState);
  const [scrollTop, setScrollTop] = React.useState(false);
  const [showWelcomePopupOne, setShowWelcomePopupOne] = useState(false);
  const [showWelcomePopupSecond, setShowWelcomePopupSecond] = useState(false);
  const [showWelcomePopupThree, setShowWelcomePopupThree] = useState(false);
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);
  const token = getToken();
  const pathname = usePathname();

  const getuser = async () => {
    const res = await axios.get(`${getApi()}/users/${userData.id}`);
    const data = res?.data;
    if (data?.newRegister) {
      setShowWelcomePopupOne(true);
    }
  };

  useEffect(() => {
    if (userData.id) {
      getuser();
    }
  }, [userData.id]);

  // Scroll to top when pathname changes
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500); // Adjust the delay if necessary
  }, [pathname]);

  // Monitor scroll position for back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 340) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const bottomToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWelcomeOne = () => {
    setShowWelcomePopupSecond(true); // Open the WelcomeOne modal
    setShowWelcomePopupOne(false); // Close the Welcome modal
  };
  const openWelcomeTwo = () => {
    setShowWelcomePopupThree(true); // Open the WelcomeOne modal
    setShowWelcomePopupOne(false);
    setShowWelcomePopupSecond(false); // Close the Welcome modal
  };

  const handleProfile = async () => {
    //  navigate("/profile");
    let payload = {
      userData: {
        // ...userData,
        newRegister: false,
      },
      checking: false,
      hRemember: false,
    };
    let payload1 = {
      userData: {
        ...userData,
        newRegister: false,
      },
      checking: false,
      hRemember: false,
    };
    try {
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload?.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(signIn(payload1));
      // setHandleClose(true)
      setShowWelcomePopupThree(false);
    } catch (error) {
      console.log(error);
    }
  };

  const canonicalUrl = config.NEXT_PUBLIC_URL;
  console.log(canonicalUrl, "canonicalurl1111111111");
  // const title = "Trugamer | The Ultimate Gaming Platform";
  const title =
    "Trugamer | The Ultimate Gaming Platform for News, Reviews & Releases";
  // const description =
  //   "Organize your gaming with queues and lists, get the latest gaming news, track the release calendar, and discuss games in Game Hubs.";
  const description =
    "Discover trending games, in-depth reviews, and the latest gaming news on Trugamer. Join a community of passionate players and stay ahead of upcoming releases.";
  const keywords =
    "video games, trending games, latest video games, game hubs, latest gaming news, gaming community, game updates, video game release dates, hardcore gamers";
  const ogImage = "https://trugamer.com/logo.svg";
  const ogTitle = "Trugamer | The Ultimate Gaming Platform";
  const ogDescription =
    "Stay updated on trending games, in-depth reviews, and the latest gaming news.";
  const ogUrl = "https://www.trugamer.com";
  const twitterCard = "summary_large_image";
  const twitterTitle = "Trugamer | The Ultimate Gaming Platform";
  const twitterDescription =
    "Join Trugamer to explore trending games, fresh reviews, and the latest news.";
  const twitterImage = "https://trugamer.com/logo.svg";
  console.log(twitterTitle, twitterDescription, twitterImage, "twitterImage");
  return (
    <>
      <div className='relative min-h-screen w-full bg-cBlack-dark mx-auto overflow-x-hidden bg-[url("/home/bghOME.svg")] bg-center bg-cover bg-no-repeat '>
        <SeoMeta
          title={title}
          description={description}
          canonicalUrl={canonicalUrl}
          keywords={keywords}
          ogType="Website"
          ogTitle={ogTitle}
          ogDescription={ogDescription}
          ogUrl={ogUrl}
          ogImage={ogImage}
          twitterCard={twitterCard}
          twitterTitle={twitterTitle}
          twitterDescription={twitterDescription}
          twitterImage={twitterImage}
          bestRating={null}
          worstRating={null}
          ratingCount={null}
          reviewCount={null}
          videoTitle={null}
          descriptionFull={null}
          datePublished={null}
          dateModified={null}
          videoUrl={null}
          genre={null}
          gamePlatform={null}
          publisher={""}
        />
        <div className="header-Bg">
          <NavigationPublic
            text={["Game Calendar", "Video Game News"]}
            token={token}
            isLandingPage={true}
          />
        </div>
        <HeroSection token={token} />
        <div className="flex flex-col gap-[20px] lg:gap-[10px]">
          <TrendingGames trendingGames={trendingGames} />
          <LatestGamingNews latestGamingNewsData={latestGamingNewsData} />

          <LatestReview />

          <DiscoverNewReleases
            token={token}
            setIsOpenLoginStatus={setIsOpenLoginStatus}
            newReleasedGames={newReleasedGames}
          />
          <UpcomingGames upcomingGames={upcomingGames} />
          <Manifesto />
        </div>

        <div className="max-md:hidden">
          <Footer />
        </div>
        <div className="md:hidden block ">
          <FooterDetailed />
        </div>
        {scrollTop && (
          <button onClick={bottomToTop} className="backToTop">
            <Image
              src="/home/Scroll_up.svg"
              alt="scroll icon"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>

      <Welcome isOpenWel={showWelcomePopupOne} onNext={openWelcomeOne} />
      <WelcomeOne isOpenWel={showWelcomePopupSecond} onNext={openWelcomeTwo} />
      <WelcomeTwo isOpenWel={showWelcomePopupThree} onClose={handleProfile} />

      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </>
  );
};

export default Landing;

// export const getServerSideProps: GetServerSideProps = async () => {
//   const token = getToken();
//   console.log(token, "tokenn");
//   let userData = null;
//   if (token) {
//     try {
//       const res = await axios.get(`${getApi()}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       userData = res.data;
//     } catch (error) {
//       console.log("Error fetching user data", error);
//     }
//   }
//   return {
//     props: { userData },
//   };
// };

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);

    // Fetch All APIs at the Same Time
    const [
      trendingResponse,
      newReleasesResponse,
      upcomingResponse,
      latestNewsResponse,
    ] = await Promise.all([
      axios.get(`${config.NEXT_API_ENDPOINT}/trending-games`),
      axios.get(`${config.NEXT_API_ENDPOINT}/get-new-releases`),
      axios.get(`${config.NEXT_API_ENDPOINT}/upcoming-games`),
      getlatestNews(1, 10, "latest"),
    ]);

    // Trending Games
    const trendingGames = trendingResponse?.data?.games || [];

    // New Releases
    const currentYear = currentDate.getFullYear();
    const newReleasedGames = newReleasesResponse?.data?.games?.filter(
      (game: any) => {
        const releaseDate =
          game?.attributes?.releaseByPlatforms?.release?.[0]?.releaseDate;
        return (
          releaseDate && new Date(releaseDate).getFullYear() === currentYear
        );
      }
    );

    // Upcoming Games
    const uniqueGamesMap = new Map();
    upcomingResponse?.data?.games?.forEach((game: any) => {
      const gameId = game.id;
      const latestRelease =
        game?.attributes?.releaseByPlatforms?.release?.reduce(
          (latest: any, release: any) => {
            const releaseDate = new Date(release.releaseDate);
            if (!latest || releaseDate > new Date(latest.releaseDate)) {
              return { ...release, gameId };
            }
            return latest;
          },
          null
        );

      if (latestRelease && !uniqueGamesMap.has(gameId)) {
        uniqueGamesMap.set(gameId, {
          id: gameId,
          release: latestRelease,
          attributes: game.attributes,
        });
      }
    });

    const upcomingGames = Array.from(uniqueGamesMap.values())
      .filter((game) => {
        const releaseDate = new Date(game.release.releaseDate);
        return releaseDate >= currentDate && releaseDate <= futureDate;
      })
      .slice(0, 10);

    // Latest News
    const latestGamingNewsData = latestNewsResponse?.length
      ? latestNewsResponse
      : [];

    return {
      props: {
        trendingGames,
        newReleasedGames,
        upcomingGames,
        latestGamingNewsData,
      },
    };
  } catch (error) {
    console.error("Error in server side props:", error);
    return {
      props: {
        trendingGames: [],
        newReleasedGames: [],
        upcomingGames: [],
        latestGamingNewsData: [],
      },
    };
  }
};

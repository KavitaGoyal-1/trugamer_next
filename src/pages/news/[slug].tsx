import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PostComment from "@/components/post-comment";
import NewsCard from "@/components/news/news-card";
import { Comment } from "@/types/comments";
import { News } from "@/types/news";

// Slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlayingNowCard from "@/components/dashboard/playing-now/playing-now-card";
import LatestGamingNewsCard from "@/components/card/latest-gaming-news-card";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import { useSelector, useDispatch } from "react-redux";
import LoginModalStatusBG from "@/components/login-modal/login-modal-status-bg";
import NewGamePopup from "@/components/news/new-game-popup";
import { getToken } from "@/utills/cookies";
import NavigationPublic from "@/components/layouts/navigation-public";
import { storeOutsideToggle, selectAuthState } from "@/store/slices/auth-slice";
import { getSingleNews } from "@/services/news";
import { getNewsComments } from "@/services/comments";
import PageLayout from "@/components/layouts/page-layout";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
  arrows: false,
  centerPadding: "5px",
};

const Details = ({ news }: { news: News }) => {
  const token = getToken();
  const [comments, setComments] = useState<Comment[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<any>();
  const [isOpenLoginStatus, setIsOpenLoginStatus] = useState(false);
  const handleCloseLoginStatus = () => setIsOpenLoginStatus(false);
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);
  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    getComments();
    if (window) {
      window.scrollTo(0, 0);
    }
  }, [news]);

  const getComments = async () => {
    try {
      const commentsData = await getNewsComments(news.id);
      setComments(commentsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);

  return (
    <>
      <div
        className={
          isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
        }
        ref={navRef}
      >
        <NewVerticalNavigation token={token} />
      </div>

      <NavigationPublic text={[""]} token={token} />
      <PageLayout title="News Details" bgImage="/games/pubg_news.jpg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div
            className={`'md:col-span-2 ${
              news?.related_game ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            <NewsCard
              news={news}
              direction="flex-row-reverse justify-between"
              detailCard={true}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            {news?.related_game && (
              <div className="bg-cBlue-special cursor-pointer rounded-2xl flex flex-col w-full sm:w-fit px-5 py-4 h-96 overflow-auto">
                <div className="flex justify-center w-full mb-5">
                  <h1 className="text-xl font-bold">Related Game</h1>
                </div>
                <NewGamePopup
                  game={news?.related_game}
                  setIsOpenLoginStatus={setIsOpenLoginStatus}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 w-full">
          <h2 className="font-bold text-3xl mb-3 md:text-[44px] text-start w-full">
            Comments ({comments?.length})
          </h2>
          <div className="w-full mb-10">
            <div>
              <p className="mb-2 pl-2 font-bold text-lg">Post a comment</p>
              <PostComment refetch={getComments} />
            </div>
          </div>
          <div className="max-h-[30rem] mb-12 px-2 overflow-y-auto"></div>
        </div>
        {news?.news?.length > 0 && (
          <div className="mt-12 w-full">
            <h1 className="font-bold text-3xl mb-6 md:text-[44px] text-start w-full">
              Related News
            </h1>
            <div className="sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 hidden">
              {news?.news.map((newsItem: News, index: number) => (
                <div className="mb-12" key={index}>
                  <LatestGamingNewsCard
                    key={index}
                    gamingNews={newsItem}
                    onClick={() => router.push(`/news/${newsItem?.slug}`)}
                  />
                </div>
              ))}
            </div>
            <div className="sm:hidden grid gap-6 grid-cols-1">
              <Slider {...sliderSettings}>
                {news?.news?.map((newsItem: News, index: number) => (
                  <div className="mb-12 mr-3 md:mx-3 p-2 m-auto" key={index}>
                    <LatestGamingNewsCard
                      gamingNews={newsItem}
                      onClick={() => router.push(`/news/${newsItem?.slug}`)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </PageLayout>
      <LoginModalStatusBG
        isOpenLogin={isOpenLoginStatus}
        onCloseLogin={handleCloseLoginStatus}
      />
    </>
  );
};

export default Details;

export async function getServerSideProps(context: any) {
  const { slug } = context.params;

  try {
    const data = await getSingleNews(slug);
    return {
      props: {
        news: data || null,
      },
    };
  } catch (error) {
    return {
      props: {
        news: null,
      },
    };
  }
}

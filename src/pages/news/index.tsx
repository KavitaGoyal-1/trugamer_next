import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoginModal from "@/components/login-modal/login-modal";
import { getNews, getFeaturedNews } from "@/services/news";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import SeoMeta from "@/components/seo-meta";
import { getToken } from "@/utills/cookies";
import NavigationPublic from "@/components/layouts/navigation-public";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import { useAppSelector } from "@/hooks/use-app-selector";
import { fetchNewsSuccess, setNewsPageNumber } from "@/store/slices/new-slice";
import LoaderSpinner from "@/components/loader-spinner";
import NewsFilters from "@/components/news/news-filters";
import NewsSection from "@/components/news/news-section";
import { getApi } from "@/utills/get-api";
import { News, NewsItem } from "@/types/news";
import PageLayout from "@/components/layouts/page-layout";
import useInfiniteCalendarScroll from "@/hooks/use-infinite-scroll";

const NewsPage = () => {
  const token = getToken();
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  const storedNews = useAppSelector((state: any) => state.news.items);
  const currentPageNumber: number = useAppSelector(
    (state: any) => state.news.pageNumber
  );

  const news =
    storedNews?.length > 0
      ? [...storedNews].sort(
          (a: NewsItem, b: NewsItem) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      : [];
  const dispatch = useDispatch();
  const [newsdata, setNewsdata] = useState<any>();
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const handleCloseLogin = () => setIsOpenLogin(false);
  const NOAUTHHEADER = true;

  const getNewsData = async () => {
    try {
      const data: any = await getNews();
      const featured = await getFeaturedNews();
      const dataSet = {
        news: data?.data,
        featuredNews: featured,
        pagination: data?.pagination,
      };
      setNewsdata(dataSet);
      // return {
      //   news: data?.data,
      //   featuredNews: featured,
      //   pagination: data?.pagination,
      // };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewsData();
  }, []);

  const memorizedQuery = useMemo(() => {
    return {
      populate: ["news_tags.icon", "coverImage", "author"],
      orderBy: "latest",
      findBy: sortBy === "trending" ? "trending" : "",
      sort: sortBy
        ? sortBy == "latest"
          ? "updatedAt:desc"
          : "updatedAt:asc"
        : "updatedAt:desc",
    };
  }, [sortBy]);

  const { data, ref, isLoading, dataPagination } = useInfiniteCalendarScroll({
    url: `${getApi()}/news`,
    pageSize: 9,
    query: memorizedQuery,
    disableAuthHeader: NOAUTHHEADER,
    page: currentPageNumber,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (newsdata?.featuredNews) {
      let temp = [];
      const data = newsdata?.featuredNews;
      if (data?.featured) temp.push(data?.featured);
      if (data?.featured_1) temp.push(data?.featured_1);
      if (data?.featured_1) temp.push(data?.featured_2);
      if (temp?.length) {
        setFeaturedNews(temp);
      }
    }
  }, [newsdata]);

  useEffect(() => {
    // getNewsData()
    if (data) {
      if (data?.length > 0) {
        const uniqueAllNews = data.filter(
          (item: any) =>
            !storedNews?.some((storedNews: any) => storedNews.id === item.id)
        );
        dispatch(fetchNewsSuccess([...storedNews, ...uniqueAllNews]));
        if (dataPagination) {
          dispatch(setNewsPageNumber(dataPagination.page));
        }
      }
    }
  }, [data, dispatch]);
  const truncatedTitle = "Video Game News";
  const truncatedDescription =
    "Get the latest and most comprehensive video game news at Trugamer. Stay informed with breaking news, game updates, reviews, and in-depth articles from the gaming world.";
  const canonicalUrl = `${process.env.NEXT_SITE_URL}/news`;
  const keywords =
    "Video game news, video game updates, gaming news, game reviews, breaking gaming news, hot gaming news";
  const ogImage = "https://trugamer.com/logo.svg";

  const navRef = useRef<HTMLDivElement | null>(null);

  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
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
      {/* <SeoMeta
        title={truncatedTitle}
        description={truncatedDescription}
        canonicalUrl={canonicalUrl}
        keywords={keywords}
        ogType="Article"
        ogImage={ogImage}
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
      /> */}

      <div
        className={
          isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
        }
        ref={navRef}
      >
        <NewVerticalNavigation token={token} />
      </div>
      {/* Appbar */}
      <NavigationPublic text={["Video Game News"]} token={token} />
      <div className="relative">
        <PageLayout title="All News" bgImage={"/games/pubg_news.jpg"}>
          <div className="max-w-[1500px] mx-auto">
            <NewsFilters
              setSortBy={setSortBy}
              sortBy={sortBy}
              setIsOpenLogin={setIsOpenLogin}
            />
            <div className="mt-3">
              <NewsSection data={news} featuredNews={featuredNews} />
              <div ref={ref}>{isLoading && <LoaderSpinner />}</div>
            </div>
          </div>
        </PageLayout>
      </div>

      <LoginModal isOpenLogin={isOpenLogin} onCloseLogin={handleCloseLogin} />
    </>
  );
};

export default NewsPage;

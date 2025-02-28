import { FC } from "react";
import LatestGamingNewsCard from "../card/latest-gaming-news-card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { News } from "@/types/news";
interface IProps {
  data: News[];
  featuredNews: News[];
}

const NewsSection: FC<IProps> = ({ data, featuredNews }) => {
  const router = useRouter();
  const renderGrid = (i: number) => {
    if (i == 0) return "row-span-1 md:row-span-2 col-span-full lg:col-span-2 ";
    if (i == 1) return "col-span-full lg:col-span-2";
    if (i == 2) return "col-span-full lg:col-span-2";
  };

  // const handleClick = (slug: string, id: number) => {
  //   router.push(`/news/${slug}`, { state: { newsId: id } });
  // };
  // const handleFeatureNewsClick = (slug: string, id: number, e: any) => {
  //   e.stopPropagation();
  //   // e.preventDefault();
  //   router.push(`/news/${slug}`, { state: { newsId: id } }); // Custom navigation logic
  // };
  return (
    <>
      <div className="grid grid-cols-4 gap-3 head-information">
        {featuredNews.length >= 0 &&
          featuredNews.slice(0, 3).map((news: News, index: number) => {
            return (
              <div key={index} className={`my-2 colorred ${renderGrid(index)}`}>
                {/* <div
                  // onClick={(e) => handleFeatureNewsClick(news.slug, news.id, e)}
                  className="block w-full h-full" // Ensure the link takes full space
                > */}
                <Link
                  target="_blank"
                  href={`/news/${news.slug}`}
                  className="block w-full h-full"
                >
                  <LatestGamingNewsCard
                    key={index}
                    keyIndex={index}
                    direction={index === 0 ? "column" : "row"}
                    showFullDescription={index === 0}
                    gamingNews={news}
                  />
                </Link>
                {/* </div> */}
              </div>
            );
          })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center">
        {data.length >= 0 &&
          data.map((news: News, index: number) => {
            return (
              <div key={index} className={`my-2 col-span-full md:col-span-1`}>
                <Link
                  target="_blank"
                  href={`/news/${news.slug}`}
                  className="block w-full h-full" // Ensure the link takes full space
                >
                  <LatestGamingNewsCard key={index} gamingNews={news} />
                </Link>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default NewsSection;

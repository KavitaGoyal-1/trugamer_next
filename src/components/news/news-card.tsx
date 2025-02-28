import { FC } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { HiExternalLink } from "react-icons/hi";
import { usePathname } from "next/navigation";
import SeoMeta from "../seo-meta";
import { News, NewsTagsAttributes } from "@/types/news";
import { useFitText } from "@/hooks/use-fit-text";
import { formatDateToRelativeTime } from "@/utills/format-date-to-relative-time";
import { useRouter } from "next/router";
import Image from "next/image";

interface CardProps {
  news: News;
  direction?: string;
  key?: number;
  fixedHeight?: boolean;
  isSmallCard?: boolean;
  detailCard?: boolean;
}

const NewsCard: FC<CardProps> = ({
  news,
  direction = "md:flex-col",
  fixedHeight,
  detailCard = false,
}) => {
  // const navigate = useNavigate();
  const router = useRouter();
  // const location = useLocation();
  const pathname = usePathname();
  const truncatedTitle = news?.title?.substring(0, 54) + " | Trugamer";
  const truncatedDescription = news?.description?.substring(0, 160);
  const descriptionFull = news?.description;
  const canonicalUrl = `${process.env.NEXT_SITE_URL}/news/${news?.slug}`;
  const gamingNewsLink = news?.link
    ?.replace(/^https?:\/\/(?:www\.)?/i, "") // Remove protocol and www.
    .split(".")[0];
  const keywords = `${gamingNewsLink} news, ${gamingNewsLink} article, ${gamingNewsLink} gaming news, latest ${gamingNewsLink} news`;

  const { ref } = useFitText();

  return (
    <>
      {/* <SeoMeta
        title={truncatedTitle}
        description={truncatedDescription}
        canonicalUrl={canonicalUrl}
        keywords={keywords}
        ogType="Article"
        ogImage={news?.coverImage?.url}
        bestRating={null}
        worstRating={null}
        ratingCount={null}
        reviewCount={null}
        videoTitle={null}
        descriptionFull={descriptionFull}
        datePublished={news?.createdAt}
        dateModified={news?.updatedAt}
        videoUrl={null}
        genre={null}
        gamePlatform={null}
        publisher={""}
      /> */}
      <div
        onClick={() =>
          !pathname.includes("details") &&
          router.push(
            `/news/${news?.slug}`
            //  { state: { newsId: news.id } }
          )
        }
        className={` flex  ${
          direction
            ? direction.includes("reverse")
              ? "flex-col md:flex-row-reverse"
              : `flex-col lg:${direction}`
            : "md:flex-col"
        } justify-between cursor-pointer  h-full gap-3 p-3 rounded-2xl bg-cBlue-special`}
      >
        <div
          className={`${
            direction && direction.includes("flex-row")
              ? "w-full lg:w-[50%]"
              : "w-full"
          }`}
        >
          <Image
            src={news?.coverImage?.url || "/placeholder.png"}
            alt="news-img"
            title="news-img"
            className={`object-contain object-top rounded-2xl  w-full min-w-[200px] ${
              pathname.includes("details")
                ? fixedHeight
                  ? " !max-h-[250px] "
                  : "max-h-[364px] h-full"
                : fixedHeight
                ? "h-[250px]"
                : "max-h-[350px]"
            }`}
            width={200}
            height={364}
          />
        </div>
        <div
          className={`flex flex-col justify-between gap-3 h-full ${
            direction && direction.includes("flex-row")
              ? "w-auto md:w-full lg:w-[50%]"
              : "w-auto md:w-full"
          }`}
        >
          <div>
            <div className="flex gap-2 my-2 items-center text-xs">
              <Image
                src={
                  news?.author?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr46ydiwgJKxiV5C7tTyEzY-vIOEF_KtcAtg&usqp=CAU"
                }
                alt={"news card"}
                className="w-5 h-5 rounded-full"
                width={20}
                height={20}
              />
              <p className="opacity-50">{news?.author?.name || "unknown"}</p>
              <p className="flex text-xs  items-center gap-2 text-[#00ADFF]">
                <AiOutlineClockCircle />{" "}
                {formatDateToRelativeTime(news?.createdAt)}
              </p>
              <p className="flex  text-xs items-center gap-2 text-[#00ADFF]">
                <BiComment color="#00ADFF" /> {news?.comment_count}
              </p>
            </div>

            <h3
              //  className="hidden lg:block text-md lg:text-[30px]  mb-2 font-bold leading-normal"
              className={`hidden lg:block font-semibold  ${
                direction === "column" ? "leading-11" : "leading-14"
              }  line-clamp-6 text-white h-28 `}
              ref={ref}
            >
              {news?.title}
            </h3>

            <p
              className="text-gray-200 text-lg leading-6 break-words line-clamp-4"
              // ref={ref}
            >
              {!detailCard ? news?.description : news?.description}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div
              onClick={() => {
                window.open(
                  news?.link?.includes("https")
                    ? news?.link
                    : `https://${news?.link}`
                );
              }}
              className="bg-cPurple-main rounded-2xl px-2 py-1  text-white text-sm flex items-center gap-2 text-left w-full min-w-full font-medium"
            >
              <HiExternalLink color="#ffffff" size={30} />
              <span className="truncate w-full">{news?.link} </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsCard;

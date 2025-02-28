import { useFitText } from "@/hooks/use-fit-text";
import { News } from "@/types/news";
import { formatDateToRelativeTime } from "@/utills/format-date-to-relative-time";
import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { HiExternalLink } from "react-icons/hi";

interface AuthorProps {
  avatar: string;
  name: string;
  gamingNewsCreatedAt: string | Date;
  gamingNewsCommentsCount?: number;
}
const Author = ({ name, avatar }: AuthorProps) => {
  return (
    <div className="flex gap-2 items-center text-xs">
      <Image
        src={
          avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr46ydiwgJKxiV5C7tTyEzY-vIOEF_KtcAtg&usqp=CAU"
        }
        className="w-5 h-5 rounded-full"
        alt="gamingNews"
        // title="gamingNews"
        width={20}
        height={20}
      />
      <p className="opacity-1 truncate max-w-[100px]">{name || "unknown"}</p>
    </div>
  );
};

interface LatestGamingNewsCardProp {
  gamingNews: News;
  direction?: "row" | "column";
  showFullDescription?: boolean;
  className?: string;
  onClick?: VoidFunction;
  keyIndex?: any;
}

const LatestGamingNewsCard = ({
  gamingNews,
  direction = "column",
  className,
  onClick,
}: LatestGamingNewsCardProp) => {
  const gamingNewsLink = gamingNews?.link
    ?.replace(
      /\.(com|net|org|edu|gov|mil|biz|uk|za|it|gg|games|ca|au)(\/.*)?$/,
      ".$1"
    )
    .replace(/^https?:\/\/(?:www\.)?/i, "");
  const { ref } = useFitText();

  const openNews = (event: any) => {
    event.stopPropagation();
    window.open(
      gamingNews?.link?.includes("https")
        ? gamingNews?.link
        : `https://${gamingNews?.link}`
    );
  };
  return (
    <>
      <div></div>

      {/* <Link
          to={gamingNews?.link?.includes("https")
    ? gamingNews?.link
    : `https://${gamingNews?.link}`}
          className="block" // Ensure the link takes full space
     
     > */}

      <div
        // onClick={onClick}
        className={`flex box-info ${
          direction === "column"
            ? "flex-col"
            : "flex-col md:flex-row colInSmall"
        } gap-3 xl:gap-6 cursor-pointer h-full w-[100%] m-auto md:m-0 md:w-full p-4 rounded-lg bg-[#15182B] border border-[#FFFFFF33]  ${className}`}
      >
        {/* Card Image */}
        <div className={`relative`}>
          <Image
            src={gamingNews?.coverImage?.url || "/placeholder.png"}
            className={`w-full ${
              direction === "column"
                ? "h-[200px] lg:h-[300px] xl:h-[260px]"
                : "h-[200px] lg:h-[140px] xl:h-[200px]"
            }  object-cover rounded-lg`}
            alt="gamingNews Img"
            width={200}
            height={200}
            // title="gamingNews Img"
          />
        </div>
        {/* Card Details */}
        <div
          className={`head-info-1 flex flex-col justify-normal xl:justify-between gap-3 subColInSm ${
            direction === "row" && "w-[80%] xl:w-[70%]"
          }`}
        >
          <div className="flex justify-between items-center gap-2">
            <Author
              name={gamingNews?.author?.name}
              avatar={gamingNews?.author?.avatar}
              gamingNewsCommentsCount={gamingNews?.comment_count}
              gamingNewsCreatedAt={gamingNews?.updatedAt}
            />

            <a
              href={
                gamingNews?.link?.includes("https")
                  ? gamingNews?.link
                  : `https://${gamingNews?.link}`
              }
              target="_blank"
              rel="noopener noreferrer"
              // onClick={(e) => openNews(e)}
              className="bg-[#00ADFF] border border-[#15182B] rounded-lg px-2 py-1.5 text-white text-xs xl:text-sm flex items-center gap-1 font-bold"
            >
              <HiExternalLink color="#fff" size={"18px"} />
              <span className="w-[85px] truncate">{gamingNewsLink}</span>
            </a>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-3 head-data">
            <h3
              ref={ref}
              className={`font-semibold  ${
                direction === "column" ? "leading-11" : "leading-14"
              }  line-clamp-6 text-white h-28 `}
            >
              {gamingNews?.title}
            </h3>

            <div className="flex gap-5">
              <p className="flex flex-nowrap whitespace-nowrap items-center gap-2 text-[#00ADFF]">
                <AiOutlineClockCircle size={"16px"} />{" "}
                <span>{formatDateToRelativeTime(gamingNews?.updatedAt)}</span>
              </p>
              <p className="flex items-center gap-2 text-[#00ADFF]">
                <BiComment color="#00ADFF" size={"16px"} />{" "}
                {gamingNews?.comment_count}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
};

export default LatestGamingNewsCard;

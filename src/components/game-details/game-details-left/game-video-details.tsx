import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { VideoType } from "../../card/card-video";
import CardVideo from "../../card/card-video";
import { GamePreview } from "@/types/game";

interface Title {
  title: string | undefined;
  previews: GamePreview[] | undefined;
}

const GameVideoDetails: React.FC<Title> = ({ title, previews }) => {
  const [links, setlinks] = useState<any[]>([]);

  useEffect(() => {
    if (previews?.length) {
      let temp: any[] = [];
      previews.map((data) => {
        let tempdata = { ...data };
        if (data?.link) {
          tempdata.link =
            typeof data.link == "string" ? JSON.parse(data.link) : data.link;
          temp.push(tempdata);
        }
      });
      setlinks(temp);
    }
  }, []);

  // Common settings for the Slider component
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
    // Enable center mode
    centerPadding: "2px", // Adjust this value to control the gap size
  };
  return (
    <div>
      <h2 className="text-start font-bold text-2xl">{title} Videos</h2>
      <div className={`mt-4 w-full`}>
        <div className="sm:hidden grid gap-4 grid-cols-1">
          <Slider {...sliderSettings}>
            {links?.map((data, index) => (
              <CardVideo
                key={index}
                thumbnail={data?.link?.thumbnail}
                title={data.title}
                subtitle={""}
                vediolink={data?.link?.url}
                type={data.tag as VideoType}
                rawData={data?.link?.rawData}
              />
            ))}
          </Slider>
        </div>
        <div className="sm:flex hidden gap-8 flex-wrap  ">
          {links?.map((data, index) => (
            <CardVideo
              key={index}
              thumbnail={data?.link?.thumbnail}
              title={data.title}
              subtitle={""}
              vediolink={data?.link?.url}
              type={data.tag as VideoType}
              rawData={data?.link?.rawData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameVideoDetails;

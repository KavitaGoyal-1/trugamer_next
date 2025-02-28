import { FC, useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import { usePathname } from "next/navigation";
// import Head from "next/head";
import {
  NextSeo,
  VideoJsonLd,
  ArticleJsonLd,
  SocialProfileJsonLd,
} from "next-seo";

interface SeoMetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: any;
  bestRating?: any;
  worstRating?: any;
  ratingCount?: any;
  reviewCount: any;
  videoTitle?: any;
  videoUrl?: any;
  descriptionFull?: any;
  datePublished?: any;
  dateModified?: any;
  genre?: any;
  gamePlatform?: any;
  publisher?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: any;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: any;
}

const SeoMeta: FC<SeoMetaProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogType,
  ogImage,
  bestRating,
  worstRating,
  ratingCount,
  reviewCount,
  videoTitle,
  videoUrl,
  descriptionFull,
  datePublished,
  dateModified,
  genre,
  gamePlatform,
  publisher,
  ogTitle,
  ogDescription,
  ogUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const pathname = usePathname();
  const isGameDetail = pathname.includes("game");
  const isNewsDetail = pathname.includes("news");

  const currentDateTime = new Date().toISOString();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageType, setImageType] = useState<string>("");

  const getFileExtension = (url: string): string | null => {
    const parts = url && url.split(".");
    if (parts && parts.length > 1) {
      return parts[parts.length - 1].split("?")[0];
    }
    return null;
  };

  useEffect(() => {
    const img = new Image();
    img.src = ogImage;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    const extension = getFileExtension(ogImage);
    if (extension) {
      setImageType(extension);
    }
  }, [ogImage]);
  const pageTitle = title && title.trim() !== "" ? `${title}` : " ";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    articleBody: descriptionFull,
    articleSection: null,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    headline: title,
    image: [ogImage],
    keywords: keywords,
    thumbnailUrl: ogImage,
    url: canonicalUrl,
    author: [
      {
        "@type": "Person",
        name: "Samina",
        url: canonicalUrl, //Samina's profile url
      },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
      description: description,
      thumbnailUrl: ogImage,
    },
    publisher: {
      "@type": "Organization",
      name: "TruGamer",
      logo: {
        "@type": "ImageObject",
        url: "http://stg.trugamer.com/logo.svg",
      },
    },
  };
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: videoTitle,
    thumbnailUrl: "https://i.ytimg.com/vi/debAPFFUL-0/hqdefault.jpg",
    uploadDate: datePublished,
    duration: "PT2M47S",
    contentUrl: videoUrl,
    potentialAction: {
      "@type": "SeekToAction",
      target: "https://trugamer.com/?seek_to={seek_to_second_number}",
      "startOffset-input": "required name=seek_to_second_number",
    },
  };

  const videoGameSchema = {
    "@context": "https://schema.org/",
    "@type": "VideoGame",
    name: title,
    dateCreated: datePublished,
    datePublished: dateModified,
    description: descriptionFull,
    image: ogImage,
    url: canonicalUrl,
    genre: genre,
    gamePlatform: gamePlatform,
    ...(ratingCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        name: "Trugamer", //Ask client to get static description
        description:
          "Trugamer is a single score representing the critical consensus for games, movies, TV shows, and albums.",
        bestRating: "10",
        worstRating: "0",
        ratingValue: ratingCount || "0",
        reviewCount: ratingCount || "0",
        url: canonicalUrl,
      },
    }),
    screenshot: {
      "@type": "ImageObject",
      caption: title,
      contentUrl: ogImage,
    },
    publisher: {
      "@type": "Organization",
      name: publisher,
    },
  };
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: ogType,
          url: ogUrl,
          title: ogTitle,
          description: ogDescription,
          images: [
            {
              url: ogImage || "",
              width: imageDimensions.width,
              height: imageDimensions.height,
              alt: "Trugamer",
            },
          ],
          site_name: "Trugamer",
        }}
        twitter={{
          handle: "@trugamer",
          site: "@trugamer",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          { name: "keywords", content: keywords || "" },
          {
            name: "robots",
            content:
              "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
          },
          {
            name: "twitter:title",
            content: twitterTitle || "",
          },
          {
            name: "twitter:description",
            content: twitterDescription || "",
          },
          {
            name: "twitter:image",
            content: twitterImage || "",
          },
          {
            name: "twitter:card",
            content: twitterCard || "",
          },
        ]}
      />

      {videoUrl && videoTitle && (
        <VideoJsonLd
          name={videoTitle}
          description={descriptionFull}
          uploadDate={datePublished}
          contentUrl={videoUrl}
          thumbnailUrls={[ogImage || ""]}
        />
      )}

      {datePublished && dateModified && (
        <ArticleJsonLd
          type="NewsArticle"
          url={canonicalUrl || ""}
          title={title || ""}
          images={[ogImage]}
          datePublished={datePublished}
          dateModified={dateModified}
          authorName={["Samina"]}
          publisherName="Trugamer"
          publisherLogo="http://stg.trugamer.com/logo.svg"
          description={description || ""}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: title,
            description: descriptionFull,
            articleBody: descriptionFull,
            datePublished: datePublished,
            dateModified: dateModified,
            image: [ogImage],
            keywords: keywords,
            url: canonicalUrl,
            thumbnailUrl: ogImage,
            author: {
              "@type": "Person",
              name: "Samina",
              url: canonicalUrl,
            },
            publisher: {
              "@type": "Organization",
              name: "TruGamer",
              logo: {
                "@type": "ImageObject",
                url: "http://stg.trugamer.com/logo.svg",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
              description: description,
              thumbnailUrl: ogImage,
            },
          }),
        }}
      />
      {genre && gamePlatform && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "VideoGame",
              name: title,
              genre: genre,
              gamePlatform: gamePlatform,
              publisher: { "@type": "Organization", name: publisher },
              url: canonicalUrl,
              image: ogImage,
            }),
          }}
        />
      )}
    </>
  );
};

export default SeoMeta;

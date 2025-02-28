import GameDetailsTitle from "./game-details-title";
// import SeoMeta from "src/components/SeoMeta";
import { useEffect, useState } from "react";

type ReviewStats = {
  highestRating: number | null;
  lowestRating: number | null;
  countOfUsersWithRating: number;
  countOfUsersWithReview: number;
};
const GameDetailsLeft = ({
  isUserAuth,
  game,
  setIsModalOpen,
  reviews,
  coverImage,
  analytics,
  getPlayedAndQueuedCount,
  slug,
  handlePlayedHoursUpdate,
  activeTab,
  setActiveTab,
  queryParams,
  selectedDevices,
  handleDeviceClick,
  progressData,
  beatStatus,
  setBeatStatus,
  hoursPlayed,
  setHoursPlayed,
  handleEditClick,
  handleSubmitProgressFromGameStatus,
}: any) => {
  console.log(game, "gamemememememe");
  const { title, image, description, rating, game_preview } = game;
  const getReviewStats = (reviews: any): ReviewStats => {
    if (!reviews || reviews.length === 0) {
      return {
        highestRating: 0,
        lowestRating: 0,
        countOfUsersWithRating: 0,
        countOfUsersWithReview: 0,
      };
    }

    let highestRating = -Infinity;
    let lowestRating = Infinity;
    const userIdsWithRating = new Set();
    const userIdsWithReview = new Set();

    reviews?.forEach((review: any) => {
      // Update highest and lowest ratings
      if (review.rating > highestRating) highestRating = review.rating;
      if (review.rating < lowestRating) lowestRating = review.rating;

      // Track users who gave ratings
      if (review.rating !== undefined) {
        userIdsWithRating.add(review?.user?.id);
      }

      // Track users who gave reviews
      if (review.review && review.review.trim() !== "") {
        userIdsWithReview.add(review?.user?.id);
      }
    });

    return {
      highestRating,
      lowestRating,
      countOfUsersWithRating: userIdsWithRating.size,
      countOfUsersWithReview: userIdsWithReview.size,
    };
  };

  const [stats, setStats] = useState<ReviewStats>({
    highestRating: null,
    lowestRating: null,
    countOfUsersWithRating: 0,
    countOfUsersWithReview: 0,
  });

  useEffect(() => {
    const calculatedStats = getReviewStats(reviews);
    setStats(calculatedStats);
  }, [reviews]);
  const truncatedTitle = title.substring(0, 50) + " | Trugamer";
  const truncatedDescription = `Get the latest information about the game ${title}. Read reviews from other gamers.`;
  const keywords = `${title} reviews, ${title} ratings, ${title} release date, ${title} information, ${title} videos, ${title} trailers, ${title} discussion`;
  const canonicalUrl = `${process.env.NEXT_SITE_URL}/game/${slug}`;

  const videoPreviews =
    game_preview &&
    game_preview.length > 0 &&
    game_preview
      .map((preview: any) => {
        try {
          const link = JSON.parse(preview.link);
          return { title: link.title, url: link.url };
        } catch (error) {
          console.error("Error parsing game preview link:", error);
          return null;
        }
      })
      .filter(
        (preview: { title: string; url: string } | null) => preview !== null
      );
  const categoryTitles =
    game &&
    game?.categories &&
    game?.categories?.data &&
    game?.categories?.data.length > 0 &&
    game?.categories?.data?.map((category: any) => category.attributes.title);

  const deviceNames =
    game &&
    game?.devices &&
    game?.devices?.data &&
    game?.devices?.data?.length > 0 &&
    game?.devices?.data.map((device: any) => device.attributes.name);
  const publisherName = game?.publisher?.data?.attributes?.Name;

  return (
    <>
      <div className="grid grid-cols-1 gap-[20px] md:gap-[40px] place-content-start ">
        {/* {videoPreviews && videoPreviews?.length > 0 ? (
          videoPreviews?.map((preview: any, index: any) => (
            <SeoMeta
              key={index}
              title={truncatedTitle}
              description={truncatedDescription}
              canonicalUrl={canonicalUrl}
              keywords={keywords}
              ogType="Website"
              ogImage={image?.data?.attributes?.url}
              bestRating={stats?.highestRating ? stats?.highestRating : null}
              worstRating={stats?.lowestRating ? stats?.lowestRating : null}
              ratingCount={
                stats?.countOfUsersWithRating
                  ? stats?.countOfUsersWithRating
                  : null
              }
              reviewCount={
                stats?.countOfUsersWithReview
                  ? stats?.countOfUsersWithReview
                  : null
              }
              videoTitle={preview?.title ? preview.title : null}
              videoUrl={preview?.url ? preview?.url : null}
              descriptionFull={description}
              datePublished={game?.createdAt}
              dateModified={game?.createdAt}
              genre={categoryTitles ? categoryTitles : null}
              gamePlatform={deviceNames ? deviceNames : null}
              publisher={publisherName ? publisherName : ""}
            />
          ))
        ) : (
          <SeoMeta
            title={truncatedTitle}
            description={truncatedDescription}
            canonicalUrl={canonicalUrl}
            keywords={keywords}
            ogType="Website"
            ogImage={image?.data?.attributes?.url}
            bestRating={stats?.highestRating ? stats?.highestRating : null}
            worstRating={stats?.lowestRating ? stats?.lowestRating : null}
            ratingCount={
              stats?.countOfUsersWithRating
                ? stats?.countOfUsersWithRating
                : null
            }
            reviewCount={
              stats?.countOfUsersWithReview
                ? stats?.countOfUsersWithReview
                : null
            }
            videoTitle={null}
            descriptionFull={description}
            datePublished={game?.createdAt}
            dateModified={game?.createdAt}
            videoUrl={null}
            genre={categoryTitles ? categoryTitles : null}
            gamePlatform={deviceNames ? deviceNames : null}
            publisher={publisherName ? publisherName : ""}
          />
        )} */}

        <GameDetailsTitle
          analytics={analytics}
          isUserAuth={isUserAuth}
          rating={rating}
          title={title}
          image={coverImage}
          setIsModalOpen={setIsModalOpen}
          getPlayedAndQueuedCount={getPlayedAndQueuedCount}
          slug={slug}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handlePlayedHoursUpdate={handlePlayedHoursUpdate}
          gameData={game}
          queryParams={queryParams}
          selectedDevices={selectedDevices}
          handleDeviceClick={handleDeviceClick}
          progressData={progressData}
          beatStatus={beatStatus}
          setBeatStatus={setBeatStatus}
          hoursPlayed={hoursPlayed}
          setHoursPlayed={setHoursPlayed}
          handleEditClick={handleEditClick}
          handleSubmitProgressFromGameStatus={
            handleSubmitProgressFromGameStatus
          }
        />
      </div>
    </>
  );
};

export default GameDetailsLeft;

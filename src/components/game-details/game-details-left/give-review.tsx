import GameDetailsTitle from "./game-details-title";

const GiveReview = () => {
  // Sample data for props, replace these with actual data or state as necessary
  const isUserAuth = true; // or false
  const rating = 4.5; // example rating
  const title = "Sample Game Title"; // example title
  const image = {
    data: {
      attributes: {
        url: "",
        alternativeText: "Sample Game Image",
      },
    },
  }; // example image object
  const setIsModalOpen = () => {}; // example function
  const analytics = {}; // example analytics object
  const getPlayedAndQueuedCount = () => {}; // example function
  const slug = "sample-game"; // example slug
  const handlePlayedHoursUpdate = () => {}; // example function

  return (
    <div>
      {/* <GameDetailsTitle
        analytics={analytics}
        isUserAuth={isUserAuth}
        rating={rating}
        title={title}
        image={image}
        setIsModalOpen={setIsModalOpen}
        getPlayedAndQueuedCount={getPlayedAndQueuedCount}
        slug={slug}
        handlePlayedHoursUpdate={handlePlayedHoursUpdate}
      /> */}
    </div>
  );
};

export default GiveReview;

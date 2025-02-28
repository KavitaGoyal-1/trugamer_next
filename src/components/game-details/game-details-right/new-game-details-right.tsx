import LinksSection from "./links-section";
import ProgessSection from "./progess-section";
import OwnerShipSection from "./owner-ship-section";
import Ratings from "./ratings";
import ProgessScrore from "./progess-scrore";
import PlayRanking from "./play-ranking";
import StatsSection from "./stats-section";
import CountdownTimer from "./countdown-timer";
import Link from "next/link";
import Divider from "../../../../public/game-details/Divider.svg";
import QuterTimer from "./quter-timer";
import Image from "next/image";

const NewGameDetailsRight = ({
  gameData,
  analytics_data,
  gameSlug,
  fetchLikeCountsAndReports,
  analytics,
  isGreater,
  exactDate,
  latestRelease,
  selectedDevices,
  setSelectedDevices,
  setProgressData,
  progressData,
  fetchSelectedDevices,
  createOrUpdateDevice,
  handleOwnershipDeviceClick,
  loadingOnProgress,
  globalLoading,
  setBeatStatus,
  beatStatus,
  setHoursPlayed,
  hoursPlayed,
  setShowModal,
  showModal,
  setUpdateDeviceId,
  updateDeviceId,
  handleSubmitProgress,
  handleHoursChange,
  currentItem,
  setCurrentItem,
  handleEditClick,
  analyticsHours,
  userId,
}: any) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="rounded-lg text-white flex flex-col gap-5">
      {/*  Game Realead Hour's , hidden for phone view */}
      {isGreater && latestRelease && (
        <>
          <div className="hidden sm:block relative lg:absolute top-[0px] lg:top-[-200px] left-0 right-0">
            <CountdownTimer latestReleaseDate={latestRelease} />
          </div>{" "}
        </>
      )}
      {isGreater && exactDate && (
        <div className="hidden sm:block absolute top-[-200px] left-0 right-0">
          <QuterTimer exactDate={exactDate} />
        </div>
      )}
      <StatsSection
        analyticsHours={analyticsHours}
        analytics_data={analytics_data}
        gameData={gameData}
      />
      <div>
        {!isGreater && (
          <>
            <OwnerShipSection
              selectedDevices={selectedDevices}
              setProgressData={setProgressData}
              setSelectedDevices={setSelectedDevices}
              deviceData={gameData?.devices}
              fetchSelectedDevices={fetchSelectedDevices}
              game={gameData}
              globalLoading={globalLoading}
              createOrUpdateDevice={createOrUpdateDevice}
              handleOwnershipDeviceClick={handleOwnershipDeviceClick}
            />
            <ProgessSection
              selectedDevices={selectedDevices}
              progressData={progressData}
              beatStatus={beatStatus}
              setBeatStatus={setBeatStatus}
              hoursPlayed={hoursPlayed}
              setHoursPlayed={setHoursPlayed}
              updateDeviceId={updateDeviceId}
              setUpdateDeviceId={setUpdateDeviceId}
              showModal={showModal}
              loadingOnProgress={loadingOnProgress}
              setShowModal={setShowModal}
              handleSubmitProgress={handleSubmitProgress}
              deviceData={gameData?.devices}
              handleHoursChange={handleHoursChange}
              currentItem={currentItem}
              setCurrentItem={setCurrentItem}
              handleEditClick={handleEditClick}
            />{" "}
          </>
        )}
      </div>

      {/* Ratings */}
      {!isGreater && (
        <Ratings
          fetchLikeCountsAndReports={fetchLikeCountsAndReports}
          gameSlug={gameSlug}
          gameData={gameData}
          userId={userId}
        />
      )}

      {/* Play Ranking Section */}
      {!isGreater && (
        <PlayRanking
          analytics={analytics}
          game={gameData}
          gameSlug={gameSlug}
        />
      )}

      {/* Progress Section */}
      <ProgessScrore analytics={analyticsHours} />

      {/* Links Section */}
      <LinksSection linksData={gameData?.website_links} />
      <div className="flex items-center justify-center mt-2 max-w-[350px] ">
        <Image src={Divider} alt="connector" className="" />
        <span className="mx-2 text-lg font-primary font-normal text-[#00ADFF] hover:text-[#00ADFF]">
          More Details On{" "}
          <Link
            href={`${gameData?.site_url}`}
            target="_blank"
            className="text-[#00ADFF] font-bold hover:text-[#A2A6B8]"
          >
            IGDB
          </Link>
        </span>
        <Image src={Divider} alt="connector" className="rotate-180" />
      </div>
    </div>
  );
};

export default NewGameDetailsRight;

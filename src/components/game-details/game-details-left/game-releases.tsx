import { ReleaseByPlatforms } from "@/types/game";
import moment from "moment";

const GameReleases = ({
  releaseByPlatforms,
}: {
  releaseByPlatforms: ReleaseByPlatforms;
}) => {
  const { release } = releaseByPlatforms;
  return (
    <div className="max-w-full">
      <h3 className="mb-[11px]">Release Dates</h3>
      {release.length > 0 ? (
        release.map((release: any) => (
          <div key={release.id} className="grid grid-cols-2">
            {release.device?.data &&
              release.device?.data?.attributes.name &&
              release.releaseDate && (
                <>
                  <h4 className="mr-5 opacity-60">
                    {release.device?.data?.attributes.name}
                  </h4>
                  <p className="font-normal opacity-60 text-base">
                    {moment(release.releaseDate).format("MM/DD/YYYY")}
                  </p>
                </>
              )}
          </div>
        ))
      ) : (
        <p className="font-normal opacity-60	 text-base">N/A</p>
      )}
    </div>
  );
};

export default GameReleases;

import { Developer } from "@/types/developers";
import { Publisher } from "@/types/game";

const GameDevAndPublisher = ({
  developer,
  publisher,
}: {
  developer: Developer | undefined;
  publisher: Publisher | undefined;
}) => {
  const developerName = developer?.attributes.Name;
  const publisherName = publisher?.attributes.Name;

  return (
    <div className="grid gap-4 justify-start	">
      <div className="grid gap-[7px]">
        <h3>Developer</h3>
        <p className="font-normal opacity-60	 text-base">
          {developerName !== undefined ? (
            developerName
          ) : (
            <p className="font-normal opacity-60	 text-base">N/A</p>
          )}
        </p>
      </div>

      <div className="grid gap-[7px]">
        <h3>Publisher</h3>

        <p className="font-normal opacity-60	 text-base">
          {publisherName ? (
            publisherName
          ) : (
            <p className="font-normal opacity-60	 text-base">N/A</p>
          )}
        </p>
      </div>
    </div>
  );
};

export default GameDevAndPublisher;

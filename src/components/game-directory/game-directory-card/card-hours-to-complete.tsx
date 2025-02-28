import Image from "next/image";

export const CardHoursToComplete = ({
  hoursToComplete,
}: {
  hoursToComplete?: number;
}) => {
  return (
    <div className="w-full flex text-xl md:text-xl text-cWhite-light font-regular capitalize">
      {hoursToComplete ? (
        <>
          <Image
            alt="clock"
            title="clock"
            src="/clock.svg"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-[14px] min-[320px]:text-base md:text-lg">
            {`${hoursToComplete} Hr Avg.`}
          </span>
        </>
      ) : null}
    </div>
  );
};

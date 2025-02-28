import React from "react";
import { formatReleaseTimePeriod } from "../utills/formatted-date";

interface TimeProps {
  exactDate: string; // assuming it's a date string
}
const QuterTimer: React.FC<TimeProps> = ({ exactDate }) => {
  const exactDateWithDash = formatReleaseTimePeriod(exactDate);
  return (
    <div className="flex justify-center items-center mb-3 max-w-[350px] pr-3 sm:pr-0">
      <div className="flex flex-col justify-center items-center bg-transparent border border-[#fff] rounded-[6px] sm:rounded-14px px-4 py-[10px] sm:px-8 sm:py-[19px] min-w-44">
        <div className="flex items-start gap-3 text-white text-4xl font-bold">
          <>
            <div className="text-center  font-semibold sm:font-normal flex gap-2 items-center">
              <span className="text-xl sm:text-2xl font-normal sm:font-medium block italic">
                {exactDateWithDash}
              </span>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default QuterTimer;

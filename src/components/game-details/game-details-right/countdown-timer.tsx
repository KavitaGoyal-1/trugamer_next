import React, { useState, useEffect } from "react";

// Define a type for the time left object, including years and months
interface TimeLeft {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CardProps {
  latestReleaseDate: string; // assuming it's a date string
}

const CountdownTimer: React.FC<CardProps> = ({ latestReleaseDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const targetDate = new Date(latestReleaseDate);
    const difference = +targetDate - +now;

    let timeLeft: TimeLeft = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      // Calculate years
      timeLeft.years = targetDate.getFullYear() - now.getFullYear();

      // Calculate months
      timeLeft.months = targetDate.getMonth() - now.getMonth();
      if (timeLeft.months < 0) {
        timeLeft.years -= 1;
        timeLeft.months += 12;
      }

      // Calculate days, hours, minutes, and seconds from remaining difference
      const remainingAfterMonths =
        difference -
        timeLeft.years * 365 * 24 * 60 * 60 * 1000 -
        timeLeft.months * 30 * 24 * 60 * 60 * 1000;

      timeLeft.days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
      timeLeft.hours = Math.floor(
        (remainingAfterMonths / (1000 * 60 * 60)) % 24
      );
      timeLeft.minutes = Math.floor((remainingAfterMonths / (1000 * 60)) % 60);
      timeLeft.seconds = Math.floor((remainingAfterMonths / 1000) % 60);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);
  if (
    timeLeft.years === 0 &&
    timeLeft.months === 0 &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return null; // Don't render anything
  }
  return (
    <div className="flex justify-center items-center mb-3 max-w-[350px] pr-3 sm:pr-0">
      <div className="flex flex-col justify-center items-center bg-transparent border border-[#fff] rounded-[6px] sm:rounded-14px px-4 py-[10px] sm:px-8 sm:py-[19px] min-w-44">
        <div className="flex items-start gap-3 text-white text-4xl font-bold">
          {timeLeft.years > 0 && (
            <>
              <div className="text-center text-xl sm:text-3xl font-semibold sm:font-normal">
                {timeLeft.years}
                <span className="text-xs sm:text-sm font-normal sm:font-medium block italic">
                  {timeLeft.years > 1 ? "Years" : "Year"}
                </span>
              </div>

              <div className="text-2xl">:</div>
              {timeLeft.months > 0 && <div className="text-2xl">:</div>}
            </>
          )}
          {timeLeft.months > 0 && (
            <>
              <div className="text-center text-xl sm:text-3xl font-semibold sm:font-normal ">
                {timeLeft.months}
                <span className="text-xs sm:text-sm font-normal sm:font-medium block italic">
                  {timeLeft.months > 1 ? "Months" : "Month"}
                </span>
              </div>
              {timeLeft.days > 0 && <div className="text-2xl">:</div>}
            </>
          )}

          {timeLeft.days > 0 && (
            <>
              <div className="text-center text-xl sm:text-3xl font-semibold sm:font-normal">
                {timeLeft.days}
                <span className="text-xs sm:text-sm font-normal sm:font-medium block italic">
                  {timeLeft.days > 1 ? "Days" : "Day"}
                </span>
              </div>
              {timeLeft.hours > 0 && <div className="text-2xl">:</div>}
            </>
          )}

          {timeLeft.hours > 0 && (
            <div className="text-center text-xl sm:text-3xl font-semibold sm:font-normal">
              {timeLeft.hours.toString().padStart(2, "0")}
              <span className="text-xs sm:text-sm font-normal sm:font-medium block italic">
                {timeLeft.hours > 1 ? "Hours" : "Hour"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

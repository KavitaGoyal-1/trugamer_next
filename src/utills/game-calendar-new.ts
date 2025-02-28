import { toast } from "react-toastify";
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parse,
  isValid,
  differenceInMilliseconds,
  format,
  parseISO,
} from "date-fns";
import {
  setGameCalendarNewApiResponseLoading,
  setGameCalendarNewApiResponse,
} from "@/store/slices/game-calendar-new-reducer";
import { getCalendarGames } from "@/api/games-api";

interface Release {
  releaseDate: string;
}

interface ReleaseData {
  releaseByPlatforms: {
    release: Release[];
  };
}

type Timeframe = {
  frame: "daily" | "monthly" | "weekly";
  range: string;
};

export const gameCalendarFormatTimeframe = (
  frame: Timeframe["frame"],
  dateInput: Date
): string => {
  const date = new Date(dateInput);
  switch (frame) {
    case "daily":
      return `${format(date, "MMM/dd/yyyy")}`;
    case "monthly":
      return `${format(date, "MMMM-yyyy")}`;
    case "weekly":
      const startOfWeek = format(subDays(date, date.getDay()), "MMM/dd/yyyy");
      const endOfWeek = format(addDays(date, 6 - date.getDay()), "MMM/dd/yyyy");
      return `${startOfWeek} - ${endOfWeek}`;
  }
};

export const updateGameCalendarApiCall = async (
  dispatch: any,
  updatedFilters: any
): Promise<void> => {
  try {
    dispatch(setGameCalendarNewApiResponseLoading(true));
    const response = await getCalendarGames(updatedFilters);

    if (response?.status !== 200) {
      toast.error(
        "Unable to fetch calendar games at the moment. Please try again later.",
        {
          toastId:
            "Unable to fetch calendar games at the moment. Please try again later.",
        }
      );
      return;
    }

    console.log(response, "response MM");
    if (response?.status === 200)
      dispatch(setGameCalendarNewApiResponseLoading(false));

    dispatch(setGameCalendarNewApiResponse([response.data]));
    dispatch(setGameCalendarNewApiResponseLoading(false));
  } catch (error) {
    toast.error(
      "An unexpected error occurred while fetching calendar games. Please try again later.",
      {
        toastId:
          "An unexpected error occurred while fetching calendar games. Please try again later.",
      }
    );
  }
};

export const debounceForGameCalendar = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Returns the next date based on the provided time frame.
 * @param currentDate - The current date as a string (YYYY-MM-DD).
 * @param frame - The time frame ("daily", "weekly", "monthly").
 * @returns The next date as a string (YYYY-MM-DD).
 */
export const getNextDate = (currentDate: string, frame: string): string => {
  const parsedDate = parseISO(currentDate); // Ensures correct parsing

  let newDate;
  if (frame === "daily") {
    newDate = addDays(parsedDate, 1);
  } else if (frame === "weekly") {
    newDate = addWeeks(parsedDate, 1);
  } else if (frame === "monthly") {
    newDate = addMonths(parsedDate, 1);
  } else {
    return currentDate; // Return the same date if frame is invalid
  }

  return format(newDate, "yyyy-MM-dd"); // Format to keep output consistent
};

/**
 * Returns the previous date based on the provided time frame.
 * @param currentDate - The current date as a string (YYYY-MM-DD).
 * @param frame - The time frame ("daily", "weekly", "monthly").
 * @returns The previous date as a string (YYYY-MM-DD).
 */
export const getPreviousDate = (currentDate: string, frame: string): string => {
  const parsedDate = parseISO(currentDate);

  let newDate;
  if (frame === "daily") {
    newDate = subDays(parsedDate, 1);
  } else if (frame === "weekly") {
    newDate = subWeeks(parsedDate, 1);
  } else if (frame === "monthly") {
    newDate = subMonths(parsedDate, 1);
  } else {
    return currentDate;
  }

  return format(newDate, "yyyy-MM-dd");
};

// export const getClosestReleaseDate2 = (
//   game: { releaseByPlatforms: { release: { releaseDate: string }[] } },
//   timeframe: string
// ): string => {
//   const releases = game?.releaseByPlatforms?.release || [];

//   console.log(timeframe,"timeframe?.length 1 -----------", releases?.length, " this is length ");
//   if (!releases?.length) return "";

//   const [startStr, endStr] = timeframe?.split(" - ");
//   const startDate = parse(startStr, "MMM/dd/yyyy", new Date());
//   const endDate = endStr ? parse(endStr, "MMM/dd/yyyy", new Date()) : startDate;

//   if (!isValid(startDate)) return "";
//   console.log( timeframe,  "startDate   ?.length 3 ------------", releases?.length, " this is length ");
//   const validDates = releases
//     ?.map(({ releaseDate }) => parse(releaseDate, "yyyy-MM-dd", new Date()))
//     .filter(isValid);
//     console.log( timeframe, "startDate   ?.length 4", releases?.length, " this is length ");
//   const closestDate =
//     validDates
//       .filter((date:any) => !endDate || (date >= startDate && date <= endDate))
//       .sort(
//         (a, b) =>
//           Math.abs(differenceInMilliseconds(a, startDate)) -
//           Math.abs(differenceInMilliseconds(b, startDate))
//       )
//       .shift() ||
//     validDates
//       .sort(
//         (a, b) =>
//           Math.abs(differenceInMilliseconds(a, startDate)) -
//           Math.abs(differenceInMilliseconds(b, startDate))
//       )
//       .shift();

//   return closestDate ? format(closestDate, "MM-dd-yyyy") : "";
// };

// export const getClosestReleaseDate3 = (
//   game: { releaseByPlatforms: { release: { releaseDate: string }[] } },
//   timeframe: string
// ): string => {
//   const releases = game?.releaseByPlatforms?.release || [];
//   if (!releases?.length) return "";

//   // Parse timeframe to determine start and end dates
//   let startDate: Date | undefined;
//   let endDate: Date | undefined;
//   if (timeframe.includes(" - ")) {
//     // Weekly format: Jan/12/2025 - Jan/18/2025
//     const [startStr, endStr] = timeframe.split(" - ");
//     startDate = parse(startStr, "MMM/dd/yyyy", new Date());
//     endDate = parse(endStr, "MMM/dd/yyyy", new Date());
//   } else if (timeframe.includes("-")) {
//     // Monthly format: March-2025
//     startDate = parse(`1 ${timeframe}`, "d MMMM-yyyy", new Date());
//     endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of the month
//   } else {
//     // Daily format: Jan/20/2025
//     startDate = parse(timeframe, "MMM/dd/yyyy", new Date());
//     endDate = startDate;
//   }

//   if (!isValid(startDate)) return "";

//   // Parse release dates
//   const validDates = releases
//     ?.map(({ releaseDate }) => parse(releaseDate, "yyyy-MM-dd", new Date()))
//     .filter(isValid);

//   // Find the closest date within the range or overall
//   const closestDate =
//     validDates
//       .filter((date) => !endDate || (date >= startDate && date <= endDate))
//       .sort(
//         (a, b) =>
//           Math.abs(differenceInMilliseconds(a, startDate)) -
//           Math.abs(differenceInMilliseconds(b, startDate))
//       )
//       .shift() ||
//     validDates
//       .sort(
//         (a, b) =>
//           Math.abs(differenceInMilliseconds(a, startDate)) -
//           Math.abs(differenceInMilliseconds(b, startDate))
//       )
//       .shift();

//   return closestDate ? format(closestDate, "MM-dd-yyyy") : "";
// };

export const getClosestReleaseDate = (
  game: { releaseByPlatforms: { release: { releaseDate: any }[] } },
  timeframe: any
): string => {
  const releases = game?.releaseByPlatforms?.release || [];
  if (!releases?.length) return "";
  // Parse timeframe to determine start and end dates
  let startDate: any, endDate: any;
  if (timeframe.includes(" - ")) {
    // Weekly format: Jan/12/2025 - Jan/18/2025
    const [startStr, endStr] = timeframe.split(" - ");
    startDate = parse(startStr, "MMM/dd/yyyy", new Date());
    endDate = parse(endStr, "MMM/dd/yyyy", new Date());
  } else if (timeframe.includes("-")) {
    // Monthly format: March-2025
    startDate = parse(`1 ${timeframe}`, "d MMMM-yyyy", new Date());
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of the month
  } else {
    // Daily format: Jan/20/2025
    startDate = parse(timeframe, "MMM/dd/yyyy", new Date());
    endDate = startDate;
  }

  if (!startDate || !isValid(startDate)) return "";

  // Parse release dates

  const validDates = releases
    .map(({ releaseDate }) => parse(releaseDate, "yyyy-MM-dd", new Date()))
    .filter(isValid);

  // Use non-null assertion `startDate!` or ensure `startDate` is defined before calculations
  const closestDate =
    validDates
      .filter(
        (date) =>
          startDate && (!endDate || (date >= startDate && date <= endDate))
      )
      .sort((a, b) => {
        if (!startDate) return 0; // Fallback, but should not occur due to earlier checks
        return (
          Math.abs(differenceInMilliseconds(a, startDate)) -
          Math.abs(differenceInMilliseconds(b, startDate))
        );
      })
      .shift() ||
    validDates
      .sort((a, b) => {
        if (!startDate) return 0;
        return (
          Math.abs(differenceInMilliseconds(a, startDate)) -
          Math.abs(differenceInMilliseconds(b, startDate))
        );
      })
      .shift();

  return closestDate ? format(closestDate, "MM-dd-yyyy") : "";
};

/* This fucntion ensures games are shown only if their release date falls within time frame   */
export const filterGamesByTimeframe = (
  game: { releaseByPlatforms: { release: { releaseDate: string }[] } },
  timeframe: string
): boolean => {
  const releases = game?.releaseByPlatforms?.release || [];
  if (!releases.length) return false;

  // Parse timeframe to determine start and end dates
  let startDate: Date | undefined, endDate: Date | undefined;
  if (timeframe.includes(" - ")) {
    // Weekly format: Jan/12/2025 - Jan/18/2025
    const [startStr, endStr] = timeframe.split(" - ");
    startDate = parse(startStr, "MMM/dd/yyyy", new Date());
    endDate = parse(endStr, "MMM/dd/yyyy", new Date());
  } else if (timeframe.includes("-")) {
    // Monthly format: March-2025
    startDate = parse(`1 ${timeframe}`, "d MMMM-yyyy", new Date());
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  } else {
    startDate = parse(timeframe, "MMM/dd/yyyy", new Date());
    endDate = startDate;
  }

  if (!isValid(startDate) || !isValid(endDate)) return false;

  const isInTimeframe = releases.some(({ releaseDate }) => {
    const parsedDate = parse(releaseDate, "yyyy-MM-dd", new Date());
    return (
      isValid(parsedDate) && parsedDate >= startDate! && parsedDate <= endDate!
    );
  });

  return isInTimeframe;
};

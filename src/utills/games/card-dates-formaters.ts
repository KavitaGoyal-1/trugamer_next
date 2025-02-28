import { Release } from "@/types/game";
import moment from "moment";

//This function is required because a game can cave different release dates
export const findClosestFutureDate = (
  datesArray: Release[]
): string | undefined | null => {
  if (datesArray === undefined || datesArray === null) return null;
  const currentDate = moment();
  let closestDate;
  let smallestDiff = Infinity;
  for (let i = 0; i < datesArray?.length; i++) {
    if (datesArray[i].releaseDate === undefined) return null;
    const date = moment(datesArray[i].releaseDate);
    if (date.isAfter(currentDate)) {
      const diff = Math.abs(currentDate.diff(date));
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestDate = date;
      }
    }
  }
  if (closestDate === undefined) return null;
  return closestDate.format("YYYY-MM-DD");
};

export const findClosestRelease = (
  datesArray: Release[]
): null | undefined | string => {
  let closesFutureDate = findClosestFutureDate(datesArray);
  if (closesFutureDate === undefined || closesFutureDate === null) return null;
  const date = moment(closesFutureDate, "YYYY-MM-DD");
  const result = date.format("DD MMM");
  return result;
};

export const formatReleaseDate = (releaseDate: string) => {
  const date = moment(releaseDate, "YYYY-MM-DD");
  const result = date.format("MM/DD/YYYY");
  return result;
};

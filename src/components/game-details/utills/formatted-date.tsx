export const formatReleaseTimePeriod = (timePeriod: unknown): string => {
  if (typeof timePeriod === "string" && timePeriod.includes("Q")) {
    return timePeriod.replace(/\s+/g, "-");
  }
  return timePeriod as string;
};

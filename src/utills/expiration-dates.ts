import Cookies from "js-cookie";

export const expireInTwentySeconds = (): Date => {
  let currentTime = Date.now();
  let expireIn10Seconds = new Date(currentTime + 20000); //The current time + 20 seconds as Date()
  return expireIn10Seconds;
};

export const expireInOneHour = (): Date => {
  let currentTime = Date.now();
  let expireInOneOurResult = new Date(currentTime + 3600000);
  return expireInOneOurResult;
};

export const expireInThirtyDays = (): Date => {
  let currentTime = Date.now();
  let futureAsNumber = currentTime + 30 * 24 * 60 * 60 * 1000; // The current time + 30 days
  let futureAsDate = new Date(futureAsNumber); // Convert to Date object
  return futureAsDate;
};

export const setTokenWithExpiration = (
  longTime: boolean,
  jwt: string
): void => {
  // const cookies = new Cookies();
  if (longTime) {
    Cookies.set("JWT", jwt, {
      expires: expireInThirtyDays(), //If user check remember the token is store for 30 days
    });
  } else {
    Cookies.set("JWT", jwt, {
      expires: expireInThirtyDays(), //Is user don't check remember store the toke for 10 seconds FOR NOW
    });
  }
};

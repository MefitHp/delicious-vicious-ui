import dayjs from "dayjs";

export const convertStringToUTCDate = (date: string) => {
  // Get user's current timezone offset
  const userOffsetHours = new Date().getTimezoneOffset() / 60;
  const userTimeZone = dayjs.tz.guess();

  return dayjs.utc(date).tz(userTimeZone).add(userOffsetHours, "hour").toDate();
};

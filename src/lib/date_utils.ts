import dayjs from "dayjs";

export function getDay(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function startOfWeek(date: Date): Date {
  // Convert the JavaScript Date to a Day.js object and apply timezone
  const dayjsDate = dayjs(date).tz();

  // Calculate the day of the week, adjusting to make Monday = 0
  const dayOfWeek = (dayjsDate.day() + 6) % 7;

  // Subtract the adjusted day of the week to get the date of the Monday of that week
  const startOfWeekDate = dayjsDate.subtract(dayOfWeek, "day");

  // Return the result as a JavaScript Date object with the correct timezone applied
  return startOfWeekDate.toDate();
}

export function endOfWeek(date: Date) {
  return dayjs(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (4 - getDay(date))
    )
  )
    .endOf("date")
    .subtract(6, "hour")
    .toDate();
}

export function isInWeekRange(date: Date, value: Date | null) {
  return value
    ? dayjs(date).tz().isBefore(endOfWeek(value)) &&
        (dayjs(date).tz().isAfter(startOfWeek(value)) ||
          dayjs(date).tz().isSame(startOfWeek(value)))
    : false;
}

export const isDayDisabled = (day: dayjs.Dayjs) => {
  const now = dayjs().tz();
  const isPastDay = dayjs(day).isBefore(now.startOf("day"), "day");
  const isSameDay = dayjs(day).isSame(now.startOf("day"), "day");
  const isNextDay =
    dayjs(day).isAfter(now.startOf("day")) &&
    dayjs(day).isBefore(now.add(2, "day").startOf("day"));
  const isAfterHours = isNextDay && now.hour() >= 18;

  return isPastDay || isSameDay || isAfterHours;
};

export const days: { [key: string]: dayjs.Dayjs } = {
  tuesday: dayjs().tz().day(2).startOf("day"),
  wednesday: dayjs().tz().day(3).startOf("day"),
  thursday: dayjs().tz().day(4).startOf("day"),
  friday: dayjs().tz().day(5).startOf("day"),
  saturdat: dayjs().tz().day(6).startOf("day"),
};

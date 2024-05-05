import dayjs from "dayjs";

export function getDay(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function startOfStockValidity(date: Date, isForDateRange = false) {
  const noOfSubtractDays = isForDateRange ? 0 : 1;
  return dayjs(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - getDay(date) - noOfSubtractDays
    )
  )
    .utc()
    .startOf("date")
    .toDate();
}

export function endOfStockValidity(date: Date) {
  return dayjs(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (2 - getDay(date))
    )
  )
    .utc()
    .endOf("date")
    .toDate();
}

export function startOfSale(endOfStockValidityDate: Date) {
  return dayjs(
    new Date(
      endOfStockValidityDate.getFullYear(),
      endOfStockValidityDate.getMonth(),
      endOfStockValidityDate.getDate() + (2 - getDay(endOfStockValidityDate))
    )
  )
    .utc()
    .startOf("date")
    .toDate();
}
export function endOfSale(endOfStockValidityDate: Date) {
  return dayjs(
    new Date(
      endOfStockValidityDate.getFullYear(),
      endOfStockValidityDate.getMonth(),
      endOfStockValidityDate.getDate() + (5 - getDay(endOfStockValidityDate))
    )
  )
    .utc()
    .endOf("date")
    .toDate();
}

export function isInWeekRange(date: Date, value: Date | null) {
  return value
    ? dayjs(date).utc().isBefore(endOfStockValidity(value)) &&
        dayjs(date).utc().isAfter(startOfStockValidity(value))
    : false;
}

export function isInSaleRange(date: Date, value: Date | null) {
  return value
    ? dayjs(date).utc().isBefore(endOfSale(value)) &&
        dayjs(date).utc().isAfter(startOfSale(value))
    : false;
}

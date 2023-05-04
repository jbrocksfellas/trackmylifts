const { dayjs } = require("./date.util");

function getTrainingSessionDates(date = new Date(), timezone = "Asia/Calcutta") {
  const currentUtcTime = date;
  const userLocalTime = dayjs(currentUtcTime).tz(timezone);

  const startDate = dayjs.tz(dayjs(userLocalTime).format("YYYY-MM-DD"), timezone).startOf("day");
  const endDate = startDate.add(1, "day");

  console.log(startDate.format(), endDate.format())

  return { startDate: startDate, endDate };
}

module.exports = { getTrainingSessionDates };

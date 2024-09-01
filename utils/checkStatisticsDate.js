function getGmt5Plus() {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  return gmtPlus5Date;
}

function oneDayStartToEnd(date) {
  if (!date) {
    const currentDate = new Date();

    const todayStartLocal = new Date(currentDate.setHours(0, 0, 0, 0)); // Kunning boshini olish
    const todayEndLocal = new Date(currentDate.setHours(23, 59, 59, 999));

    const gmtOffset = 5 * 60 * 60 * 1000;

    const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
    const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

    return { todayStart, todayEnd };
  } else {
    const currentDate = new Date(date);
    const todayStartLocal = new Date(currentDate.setHours(0, 0, 0, 0)); // Kunning boshini olish
    const todayEndLocal = new Date(currentDate.setHours(23, 59, 59, 999));

    const gmtOffset = 5 * 60 * 60 * 1000;

    const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
    const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

    console.log(todayStart, todayEnd);

    return { todayStart, todayEnd };
  }
}

function oneMonthStartToEnd() {
  const gmtPlus5Date = getGmt5Plus();
  const todayStartLocal = new Date(
    gmtPlus5Date.getFullYear(),
    gmtPlus5Date.getMonth(),
    1
  ); // Oyning boshini olish
  const todayEndLocal = new Date(
    gmtPlus5Date.getFullYear(),
    gmtPlus5Date.getMonth() + 1,
    0
  ); // Oyning tugashli

  const gmtOffset = 5 * 60 * 60 * 1000;

  const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
  const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

  return { todayStart, todayEnd };
}

function oneYearStartToEnd() {
  const gmtPlus5Date = getGmt5Plus();
  const todayStartLocal = new Date(gmtPlus5Date.getFullYear(), 0, 1); // Yil boshini olish
  const todayEndLocal = new Date(gmtPlus5Date.getFullYear() + 1, 0, 0); // Yil tugashli

  const gmtOffset = 5 * 60 * 60 * 1000;

  const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
  const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

  return { todayStart, todayEnd };
}

function checkStatisticsDate(date, dateType) {
  if (date) {
    return oneDayStartToEnd(date);
  }

  if (dateType === "day") {
    return oneDayStartToEnd();
  }

  if (dateType === "month") {
    return oneMonthStartToEnd();
  }

  if (dateType === "year") {
    return oneYearStartToEnd();
  }
}

module.exports = { getGmt5Plus, checkStatisticsDate, oneDayStartToEnd };

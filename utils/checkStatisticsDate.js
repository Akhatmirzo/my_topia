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

    console.log(todayStart, todayEnd);

    return { todayStart, todayEnd };
  } else {
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));

    return { todayStart, todayEnd };
  }
}

function oneMonthStartToEnd(date) {
  if (!date) {
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

    console.log(todayStart, todayEnd);

    return { todayStart, todayEnd };
  } else {
    const todayStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const todayEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return { todayStart, todayEnd };
  }
}

function oneYearStartToEnd(date) {
  if (!date) {
    const gmtPlus5Date = getGmt5Plus();
    const todayStartLocal = new Date(gmtPlus5Date.getFullYear(), 0, 1); // Yil boshini olish
    const todayEndLocal = new Date(gmtPlus5Date.getFullYear() + 1, 0, 0); // Yil tugashli

    const gmtOffset = 5 * 60 * 60 * 1000;

    const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
    const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

    return { todayStart, todayEnd };
  } else {
    const todayStartLocal = new Date(date.getFullYear(), 0, 1); // Yil boshini olish
    const todayEndLocal = new Date(date.getFullYear() + 1, 0, 0); // Yil tugashli

    const gmtOffset = 5 * 60 * 60 * 1000;

    const todayStart = new Date(todayStartLocal.getTime() + gmtOffset);
    const todayEnd = new Date(todayEndLocal.getTime() + gmtOffset);

    return { todayStart, todayEnd };
  }
}

function checkStatisticsDate(date, dateType) {
  if (dateType === "day") {
    return oneDayStartToEnd(date);
  }

  if (dateType === "month") {
    return oneMonthStartToEnd(date);
  }

  if (dateType === "year") {
    return oneYearStartToEnd(date);
  }
}

module.exports = { getGmt5Plus, checkStatisticsDate, oneDayStartToEnd };

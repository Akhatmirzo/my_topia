const Order = require("../model/OrderModel");
const { checkStatisticsDate } = require("../utils/checkStatisticsDate");

exports.getStatistics = async (req, res) => {
  const { date, dateType } = req.query;

  if (!dateType) {
    return res.status(400).send({
      success: false,
      message: "dateType is required and enum invalid",
    });
  }

  const DateTime = checkStatisticsDate(date, dateType);
  let createdAt = { $gte: DateTime.todayStart, $lte: DateTime.todayEnd };

  let aggregateDateSchema = {};

  if (dateType === "day") {
    aggregateDateSchema = { $hour: "$createdAt" };
  }

  if (dateType === "month") {
    aggregateDateSchema = {
      $dateToString: {
        format: "%Y-%m-%d",
        date: "$createdAt",
      },
    };
  }

  if (dateType === "year") {
    aggregateDateSchema = {
      $dateToString: {
        format: "%Y-%m",
        date: "$createdAt",
      },
    };
  }

  if (date) {
    aggregateDateSchema = { $hour: "$createdAt" };
  }

  const Statistics = await Order.aggregate([
    {
      $match: {
        status: "paid",
        createdAt,
      },
    },
    {
      $group: {
        _id: aggregateDateSchema, // createdAt maydonidan soatni oladi
        totalOrders: { $sum: 1 }, // Har bir soat uchun buyurtmalar soni
        totalRevenue: { $sum: "$total_price" }, // Har bir soat uchun umumiy daromad (optional)
      },
    },
    {
      $sort: { _id: 1 }, // Soatlar bo'yicha tartiblash (0 dan 23 gacha)
    },
  ]);

  return res.status(200).send({
    success: true,
    message: dateType + " statistics fetched successfully",
    statistics: Statistics,
  });
};

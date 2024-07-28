const moment = require('moment')

async function getLast12MonthsData(modelName) {
  try {
    const endDate = moment().endOf('month').toDate();
    const startDate = moment().subtract(12, 'months').startOf('month').toDate();

    const data = await modelName.aggregate([
      {
        $match: {
          created_at: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1
        }
      },
      {
        $sort: { "year": 1, "month": 1 }
      }
    ]);

    const allMonths = [];
    let currentDate = moment(startDate).startOf('month');
    while (currentDate <= endDate) {
      allMonths.push({
        year: currentDate.year(),
        month: currentDate.month() + 1,
        count: 0
      });
      currentDate.add(1, 'month');
    }

    const result = allMonths.map(month => {
      const dataForMonth = data.find(d => d.year === month.year && d.month === month.month);
      return {
        date: moment({ year: month.year, month: month.month - 1 }).format('YYYY-MM-01'),
        count: dataForMonth ? dataForMonth.count : 0
      };
    });

    return result;

  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
}

module.exports = getLast12MonthsData;

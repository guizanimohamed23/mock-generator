const Book = require('../models/Book');
const Mock = require('../models/Mock');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { asyncHandler } = require('../utils/asyncHandler');

const overview = asyncHandler(async (req, res) => {
  const [totalEndpoints, mockedEndpoints, usersCount, booksCount] = await Promise.all([
    Promise.resolve(6), // rough count of example endpoints
    Mock.countDocuments({ enabled: true }),
    User.countDocuments(),
    Book.countDocuments(),
  ]);

  res.json({ totalEndpoints, mockedEndpoints, usersCount, booksCount });
});

const activityOverTime = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const rows = await Activity.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(rows.map((r) => ({ date: r._id, count: r.count })));
});

module.exports = { overview, activityOverTime };



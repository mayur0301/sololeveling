const HabitLog = require('../models/HabitLog')
const Task = require('../models/Task')
const DailyLog = require('../models/DailyLog')

/**
 * @desc Analytics Overview
 * @route GET /api/analytics/overview
 */
exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const userId = req.user._id

    // Date ranges
    const today = new Date()
    const monthAgo = new Date()
    monthAgo.setDate(today.getDate() - 30)

    // ----------------
    // HABIT COMPLETION %
    // ----------------
    const totalHabitLogs = await HabitLog.countDocuments({
      user: userId,
      date: { $gte: monthAgo }
    })

    const completedHabitLogs = await HabitLog.countDocuments({
      user: userId,
      date: { $gte: monthAgo },
      completed: true
    })

    const habitCompletionRate = totalHabitLogs
      ? Math.round((completedHabitLogs / totalHabitLogs) * 100)
      : 0

    // ----------------
    // TASK COMPLETION %
    // ----------------
    const totalTasks = await Task.countDocuments({ user: userId })
    const completedTasks = await Task.countDocuments({
      user: userId,
      completed: true
    })

    const taskCompletionRate = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // ----------------
    // PRODUCTIVITY AVG
    // ----------------
    const productivityLogs = await DailyLog.find({
      user: userId,
      date: { $gte: monthAgo }
    })

    let avgProductivity = 0

    if (productivityLogs.length) {
      const total = productivityLogs.reduce(
        (sum, log) => sum + log.productivityScore,
        0
      )
      avgProductivity = Math.round(total / productivityLogs.length)
    }

    res.json({
      success: true,
      data: {
        habitCompletionRate,
        taskCompletionRate,
        avgProductivityLast30Days: avgProductivity
      }
    })
  } catch (error) {
    next(error)
  }
}

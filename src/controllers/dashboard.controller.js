const Habit = require('../models/Habit')
const HabitLog = require('../models/HabitLog')
const Task = require('../models/Task')
const DailyLog = require('../models/DailyLog')

/**
 * @desc Dashboard Summary
 * @route GET /api/dashboard/summary
 */
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id

    // Today Date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Total Active Habits
    const totalHabits = await Habit.countDocuments({
      user: userId,
      isActive: true
    })

    // Completed Today
    const completedToday = await HabitLog.countDocuments({
      user: userId,
      date: today,
      completed: true
    })

    // Pending Tasks
    const pendingTasks = await Task.countDocuments({
      user: userId,
      completed: false
    })

    // Productivity Today
    const todayLog = await DailyLog.findOne({
      user: userId,
      date: today
    })

    res.json({
      success: true,
      data: {
        habitsTodayCompleted: completedToday,
        habitsTodayTotal: totalHabits,
        pendingTasks,
        productivityScoreToday: todayLog?.productivityScore || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

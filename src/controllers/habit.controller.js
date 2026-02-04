const Habit = require('../models/Habit')
const HabitLog = require('../models/HabitLog')

/**
 * @desc Create Habit
 * @route POST /api/habits
 */
exports.createHabit = async (req, res, next) => {
  try {
    const { title, color } = req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Habit title required'
      })
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      color
    })

    res.status(201).json({
      success: true,
      data: habit
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc Get All Habits
 * @route GET /api/habits
 */
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      isActive: true
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: habits
    })
  } catch (error) {
    next(error)
  }
}


/**
 * @desc Log Habit Completion
 * @route POST /api/habits/:id/log
 */
exports.logHabit = async (req, res, next) => {
  try {
    const habitId = req.params.id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const log = await HabitLog.findOneAndUpdate(
      {
        habit: habitId,
        user: req.user._id,
        date: today
      },
      {
        completed: true
      },
      {
        new: true,
        upsert: true
      }
    )

    res.json({
      success: true,
      data: log
    })
  } catch (error) {
    next(error)
  }
}


/**
 * @desc Get Habit Logs By Month
 * @route GET /api/habits/:id/logs
 */
exports.getHabitLogsByMonth = async (req, res, next) => {
  try {
    const habitId = req.params.id
    const { month } = req.query // format YYYY-MM

    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month query required (YYYY-MM)'
      })
    }

    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const logs = await HabitLog.find({
      habit: habitId,
      user: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ date: 1 })

    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    next(error)
  }
}

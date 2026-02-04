const DailyLog = require('../models/DailyLog')

/**
 * @desc Create / Update Daily Log
 * @route POST /api/lifelog
 */
exports.saveDailyLog = async (req, res, next) => {
  try {
    const { mood, sleepHours, productivityScore, notes } = req.body

    if (!mood || sleepHours === undefined || productivityScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const log = await DailyLog.findOneAndUpdate(
      {
        user: req.user._id,
        date: today
      },
      {
        mood,
        sleepHours,
        productivityScore,
        notes
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
 * @desc Get Log By Date
 * @route GET /api/lifelog/:date
 */
exports.getLogByDate = async (req, res, next) => {
  try {
    const date = new Date(req.params.date)
    date.setHours(0, 0, 0, 0)

    const log = await DailyLog.findOne({
      user: req.user._id,
      date
    })

    res.json({
      success: true,
      data: log
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc Get Recent Logs
 * @route GET /api/lifelog/recent
 */
exports.getRecentLogs = async (req, res, next) => {
  try {
    const logs = await DailyLog.find({
      user: req.user._id
    })
      .sort({ date: -1 })
      .limit(7)

    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    next(error)
  }
}

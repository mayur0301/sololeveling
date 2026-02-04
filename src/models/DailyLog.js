const mongoose = require('mongoose')

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    mood: {
      type: String,
      enum: ['terrible', 'neutral', 'great'],
      required: true
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      required: true
    },

    productivityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },

    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

// One log per day per user
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('DailyLog', dailyLogSchema)

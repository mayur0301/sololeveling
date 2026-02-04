const mongoose = require('mongoose')

const habitLogSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true
    },

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

    completed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Prevent duplicate logs same day
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('HabitLog', habitLogSchema)

const mongoose = require('mongoose')

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    color: {
      type: String,
      default: '#3B82F6'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Habit', habitSchema)

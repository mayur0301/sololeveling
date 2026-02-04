const express = require('express')
const router = express.Router()

const {
  createHabit,
  getHabits,
  logHabit,
  getHabitLogsByMonth
} = require('../controllers/habit.controller')

const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

router.route('/')
  .post(createHabit)
  .get(getHabits)

router.post('/:id/log', logHabit)

router.get('/:id/logs', getHabitLogsByMonth)


module.exports = router

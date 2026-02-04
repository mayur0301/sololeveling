const express = require('express')
const router = express.Router()

const {
  createTask,
  getTasks,
  toggleTask
} = require('../controllers/task.controller')

const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

router.route('/')
  .post(createTask)
  .get(getTasks)

router.patch('/:id/toggle', toggleTask)

module.exports = router

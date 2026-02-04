const express = require('express')
const router = express.Router()

const {
  saveDailyLog,
  getLogByDate,
  getRecentLogs
} = require('../controllers/lifelog.controller')

const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

router.post('/', saveDailyLog)
router.get('/recent', getRecentLogs)
router.get('/:date', getLogByDate)

module.exports = router

const express = require('express')
const router = express.Router()

const { getDashboardSummary } = require('../controllers/dashboard.controller')
const { protect } = require('../middlewares/auth.middleware')

router.use(protect)

router.get('/summary', getDashboardSummary)

module.exports = router

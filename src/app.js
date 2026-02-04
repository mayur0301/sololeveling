const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/auth.routes')
const habitRoutes = require('./routes/habit.routes')
const taskRoutes = require('./routes/task.routes')
const lifeLogRoutes = require('./routes/lifelog.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const analyticsRoutes = require('./routes/analytics.routes')
const app = express()

// Security
app.use(helmet())

// CORS
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }))
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ['Authorization']

}))
// Body parser
app.use(express.json())

// Logging
app.use(morgan('dev'))

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
})

app.use(limiter)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Life Tracker API Running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/lifelog', lifeLogRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/analytics', analyticsRoutes)

module.exports = app

//1xb06POOKcH1VQNm
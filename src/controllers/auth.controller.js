const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

/**
 * @desc Register User
 * @route POST /api/auth/register
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Check existing user
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc Login User
 * @route POST /api/auth/login
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    next(error)
  }
}


/**
 * @desc Get current user
 * @route GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user
    })
  } catch (error) {
    next(error)
  }
}


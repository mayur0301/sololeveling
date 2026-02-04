const Task = require('../models/Task')

/**
 * @desc Create Task
 * @route POST /api/tasks
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title required'
      })
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate
    })

    res.status(201).json({
      success: true,
      data: task
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc Get Tasks (Filter Supported)
 * @route GET /api/tasks
 */
exports.getTasks = async (req, res, next) => {
  try {
    const { status } = req.query

    let filter = { user: req.user._id }

    if (status === 'active') filter.completed = false
    if (status === 'completed') filter.completed = true

    const tasks = await Task.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: tasks
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc Toggle Complete
 * @route PATCH /api/tasks/:id/toggle
 */
exports.toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    task.completed = !task.completed
    await task.save()

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    next(error)
  }
}

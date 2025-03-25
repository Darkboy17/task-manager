import Task from '../models/Task.js';
import { Types } from 'mongoose';
import { createHash } from 'crypto';


// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public

/* Error handling for getTasks:

  Handles:

  500 Internal Server Error (Database failures)
*/
export async function getTasks(req, res, next) {
  try {
    
  /* Fetch all tasks from the database and sort them by creation date so that the newest 
      tasks are at the top of the list */
  const tasks = await Task.find()
  .sort({ createdAt: -1 })  // -1 for descending (newest first)
      .exec();
  
  // Respond with the list of tasks
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
  } catch (err) {
  // Handle any server errors
  res.status(500).json({
    success: false,
    error: {
    message: 'Server Error',
    code: 'SERVER_ERROR'
    }
  });
  }
}

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public

/* Error handling for getTask:
  
  Handles:

  400 Bad Request (Invalid ID format)

  404 Not Found (Task doesn't exist)

  500 Internal Server Error (Database failures)
*/
export async function getTask(req, res, next) {

  try {

    // Validate ID format
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    // Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Respond with the task data
    res.status(200).json({ success: true, data: task });

  } catch (err) {

    // Handle any server errors
    res.status(500).json({
      success: false,
      error: {
        message: 'Server Error',
        code: 'SERVER_ERROR'
      }
    });

  }
}

// @desc    Create a task
// @route   POST /api/tasks
// @access  Public

/* Error handling for createTask:

    Handles:

    400 Bad Request (Missing title, validation errors)

    409 Conflict (Duplicate task)

    500 Internal Server Error (Database failures)
 */
export async function createTask(req, res, next) {

  try {
    const { title } = req.body;

    // Validate that the title is provided
    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Title is required and cannot be empty',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check for duplicate task title
    const existingTask = await Task.checkDuplicate(title);
    if (existingTask) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Task with this title already exists',
          code: 'DUPLICATE_TASK',
          existingTaskId: existingTask._id
        }
      });
    }

    // Create a new task
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });

  } catch (err) {

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages[0], // First validation error as primary message
          details: messages,    // All validation errors
          code: 'VALIDATION_ERROR'
        }
      });
    } else if (err.code === 11000) {

      // Handle duplicate key error
      return res.status(409).json({
        success: false,
        error: {
          message: 'Duplicate task detected',
          code: 'DUPLICATE_TASK'
        }
      });
    }

    // Handle any server errors
    res.status(500).json({
      success: false,
      error: {
        message: 'Server Error',
        code: 'SERVER_ERROR'
      }
    });

  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public

/* Error handling for updateTask:

    Handles:

    400 Bad Request (Invalid ID, validation errors)

    404 Not Found (Task doesn't exist)

    409 Conflict (Duplicate title)

    500 Internal Server Error (Database failures)
 */
export async function updateTask(req, res) {

  try {

    // Extract title and task ID from the request
    const { title } = req.body;
    const taskId = req.params.id;

    // Validate ID format
    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    // Find the existing task
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Only validate title if it's being modified
    if (title !== undefined) {
      if (!title) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Title is required and cannot be empty',
            code: 'VALIDATION_ERROR'
          }
        });
      }

      // Check for duplicate title if title is being changed
      if (title !== existingTask.title) {
        const newTitleHash = createHash('sha256').update(title).digest('hex');
        const duplicateTask = await Task.findOne({
          titleHash: newTitleHash,
          _id: { $ne: taskId }
        });

        if (duplicateTask) {
          return res.status(409).json({
            success: false,
            error: {
              message: 'Task with this title already exists',
              code: 'DUPLICATE_TASK',
              existingTaskId: duplicateTask._id
            }
          });
        }
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      ...(title && {
        titleHash: createHash('sha256').update(title).digest('hex') // Update title hash if title is being changed
      })
    };

    // Perform the update
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      {
        new: true, // Return the updated task
        runValidators: true // Run model validations on update
      }
    );

    // Respond with the updated task
    res.status(200).json({
      success: true,
      data: updatedTask
    });

  } catch (err) {

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages[0], // First validation error as primary message
          details: messages,    // All validation errors
          code: 'VALIDATION_ERROR'
        }
      });
    } else if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Task with this title already exists',
          code: 'DUPLICATE_TASK'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    });

  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public

/* Error handling for deleteTask:

    Handles:

    400 Bad Request (Invalid ID format)

    404 Not Found (Task doesn't exist)

    500 Internal Server Error (Database failures)
 */
export async function deleteTask(req, res, next) {

  try {

    // Validate ID format
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid task ID format',
          code: 'INVALID_ID'
        }
      });
    }

    // Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND'
        }
      });
    }

    // Delete the task
    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {

    // Handle any server errors
    res.status(500).json({
      success: false,
      error: {
        message: 'Server Error',
        code: 'SERVER_ERROR'
      }
    });
  }
}
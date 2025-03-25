import mongoose from 'mongoose';
import crypto from 'crypto';

// Define the schema for the Task model

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minLength: [5, 'Title needs to be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  titleHash: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Pre-save hook to generate title hash
taskSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.titleHash = crypto
      .createHash('sha256')
      .update(this.title)
      .digest('hex');
  }
  next();
});

// Static method to check for duplicate entries
taskSchema.statics.checkDuplicate = async function (title) {
  const titleHash = crypto
    .createHash('sha256')
    .update(title)
    .digest('hex');

  return await this.findOne({ titleHash });
};

//  Create the Task model
const Task = mongoose.model('Task', taskSchema);

export default Task;
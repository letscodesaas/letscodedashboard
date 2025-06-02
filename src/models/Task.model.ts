import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requried: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    assignTo: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    experience: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
  },
  { timestamps: true }
);

export const Jobs = mongoose.models.Job || mongoose.model('Job', JobSchema);

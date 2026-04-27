import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'QUEUED',
    },
    submissionStatus: {
      type: String,
    },
    output: {
      type: String,
    },
    expectedOutput: {
      type: String,
    },
    stdErr: {
      type: String,
    },
    pScore: {
      type: String,
      default: '0',
    },
  },
  { timestamps: true }
);

export const Submission =
  mongoose.models.submission || mongoose.model('submission', submissionSchema);

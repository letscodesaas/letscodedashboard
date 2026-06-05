import mongoose from 'mongoose';

const toolUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    tool: {
      type: String,
      enum: [
        'resume_optimizer',
        'cover_letter',
        'job_finder',
        'linkedin_optimizer',
        'job_ready_score',
        'mock_test',
        'resume_builder',
        'job_tracker',
      ],
      required: true,
    },
    action: {
      type: String,
      enum: [
        'ats_check',
        'optimize',
        'ai_improve',
        'generate',
        'find_jobs',
        'should_apply',
        'analyze',
        'score',
        'open',
        'download',
        'save',
        'update',
        'job_added',
        'status_changed',
        'job_edited',
        'job_deleted',
      ],
      required: true,
    },
    success: {
      type: Boolean,
      default: true,
    },
    responseTimeMs: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ToolUsage =
  mongoose.models.ToolUsage || mongoose.model('ToolUsage', toolUsageSchema);

import mongoose from 'mongoose';

const FeedPostSchema = new mongoose.Schema(
  {
    userId: { type: String },
    userName: { type: String },
    userImage: { type: String },
    content: { type: String },
    text: { type: String },
    body: { type: String },
    images: [{ type: String }],
    mediaUrls: [{ type: String }],
    likes: [{ type: String }],
    reports: [
      {
        userId: String,
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isApproved: { type: Boolean, default: false },
    reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
    isHidden: { type: Boolean, default: false },
    hiddenReason: { type: String },
    hiddenAt: { type: Date },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FeedPost =
  mongoose.models.FeedPost || mongoose.model('FeedPost', FeedPostSchema);

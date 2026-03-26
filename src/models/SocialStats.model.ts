import mongoose from 'mongoose';

const SocialStatsSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    label: { type: String, default: 'followers' },
  },
  { timestamps: true }
);

export const SocialStats =
  mongoose.models.SocialStats ||
  mongoose.model('SocialStats', SocialStatsSchema);

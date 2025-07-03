import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);



export const Subscriber =
  mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

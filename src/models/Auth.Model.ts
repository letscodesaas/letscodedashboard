import mongoose from 'mongoose';

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  policy: [
    {
      title: String,
      access: Boolean,
      resources: [String],
      link: [String],
    },
  ],
});

export const Auth = mongoose.models.Auth || mongoose.model('Auth', AuthSchema);

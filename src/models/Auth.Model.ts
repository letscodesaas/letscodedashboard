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
});

export const Auth = mongoose.models.Auth || mongoose.model('Auth', AuthSchema);

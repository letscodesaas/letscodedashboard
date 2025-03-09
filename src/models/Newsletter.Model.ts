import mongoose from 'mongoose';

const NewsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscribe: {
    type: String,
    default: true,
  },
});

export const NewsLetter =
  mongoose.models.AutNewsLetter ||
  mongoose.model('NewsLetter', NewsLetterSchema);

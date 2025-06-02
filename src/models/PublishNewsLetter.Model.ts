import mongoose from 'mongoose';

const PublishNewsLetterSchema = new mongoose.Schema(
  {
    to: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    typeofPublish: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PublishNewsLetter =
  mongoose.models.PublishNewsLetter ||
  mongoose.model('PublishNewsLetter', PublishNewsLetterSchema);

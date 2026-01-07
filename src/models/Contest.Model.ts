import mongoose from 'mongoose';

const contestRegistationSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ContestRegister =
  mongoose.models.contestregister ||
  mongoose.model('contentregister', contestRegistationSchema);

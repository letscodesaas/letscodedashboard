import mongoose from 'mongoose';

export const connectNewsletterDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('connected');
  } catch (error) {
    console.log(error);
    throw new Error('Database connection error');
  }
};

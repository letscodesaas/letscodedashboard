import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    default: 'FREE',
    required: true,
  },
  exceptedInput: {
    type: String,
    required: true,
  },
  exceptedOutput: {
    type: String,
    required: true,
  },
  testInput: {
    type: String,
    required: true,
  },
  testOutput: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

export const Questions =
  mongoose.models.questions || mongoose.model('question', questionSchema);

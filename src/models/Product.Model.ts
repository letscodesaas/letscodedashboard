import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productLink: {
      type: String,
      requried: true,
    },
    imageLink: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

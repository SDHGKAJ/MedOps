import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Please provide manufacturer name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);

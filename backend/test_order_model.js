import mongoose from 'mongoose';
import Order from './src/models/Order.js';

const order = new Order({
  customerId: new mongoose.Types.ObjectId(),
  totalPrice: 100,
  medicines: [
    {
      medicineId: new mongoose.Types.ObjectId(),
      quantity: 2,
      price: 50
    }
  ]
});

const error = order.validateSync();
if (error) {
  console.log("Validation error:", error);
} else {
  console.log("Validation passed on the processed medicines shape.");
}

const originalOrder = new Order({
  customerId: new mongoose.Types.ObjectId(),
  totalPrice: 100,
  medicines: [
    {
      medicineId: new mongoose.Types.ObjectId(),
      quantity: 2
    }
  ]
});

const error2 = originalOrder.validateSync();
if (error2) {
  console.log("Original shape failed as expected:", error2.message);
}

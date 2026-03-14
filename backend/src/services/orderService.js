import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';

class OrderService {
  async createOrder(customerId, medicines) {
    // Calculate total price and verify availability
    let totalPrice = 0;

    for (const item of medicines) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicineId} not found`);
      }

      if (medicine.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}`
        );
      }

      totalPrice += medicine.price * item.quantity;
    }

    const order = new Order({
      customerId,
      medicines,
      totalPrice,
    });

    await order.save();

    // Reduce medicine quantity
    for (const item of medicines) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { quantity: -item.quantity },
      });
    }

    return order;
  }

  async getOrderById(orderId) {
    return await Order.findById(orderId)
      .populate('customerId')
      .populate('medicines.medicineId');
  }

  async getCustomerOrders(customerId) {
    return await Order.find({ customerId })
      .populate('customerId')
      .populate('medicines.medicineId')
      .sort({ createdAt: -1 });
  }

  async getAllOrders() {
    return await Order.find()
      .populate('customerId')
      .populate('medicines.medicineId')
      .sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId, newStatus) {
    const validStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    ).populate('customerId');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'placed') {
      throw new Error('Can only cancel orders with status "placed"');
    }

    // Restore medicine quantities
    for (const item of order.medicines) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { quantity: item.quantity },
      });
    }

    order.status = 'cancelled';
    await order.save();

    return order;
  }
}

export default new OrderService();

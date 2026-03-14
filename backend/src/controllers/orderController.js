import orderService from '../services/orderService.js';

class OrderController {
  async placeOrder(req, res, next) {
    try {
      const { medicines } = req.body;
      const customerId = req.user.userId;

      // Validate input
      if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Medicines array is required and must not be empty',
        });
      }

      for (const item of medicines) {
        if (!item.medicineId || item.quantity === undefined) {
          return res.status(400).json({
            success: false,
            message: 'Each medicine must have medicineId and quantity',
          });
        }
      }

      const order = await orderService.createOrder(customerId, medicines);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const customerId = req.user.userId;

      const orders = await orderService.getCustomerOrders(customerId);

      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();

      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;

      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const order = await orderService.updateOrderStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;

      const order = await orderService.cancelOrder(id);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new OrderController();

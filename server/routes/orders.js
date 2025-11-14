const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create', protect, async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, currency = 'USD' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${item.product.name}`,
        });
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        currency: item.product.baseCurrency,
      });

      totalAmount += item.product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        ...shippingAddress,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      totalAmount,
      currency,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/payment', protect, async (req, res, next) => {
  try {
    const { token } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    try {
      const charge = await stripe.charges.create({
        amount: Math.round(order.totalAmount * 100),
        currency: order.currency.toLowerCase(),
        source: token,
        description: `Order ${order.orderNumber}`,
      });

      order.paymentStatus = 'completed';
      order.paymentId = charge.id;
      order.status = 'confirmed';
      await order.save();

      res.json({ success: true, order, message: 'Payment successful' });
    } catch (stripeError) {
      order.paymentStatus = 'failed';
      await order.save();
      throw stripeError;
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', protect, authorize('admin', 'seller'), async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.json({ success: true, order, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, order, message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

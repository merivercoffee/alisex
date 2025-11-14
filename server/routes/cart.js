const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id });
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity, currency } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, selectedCurrency: currency }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, selectedCurrency: currency });
      }
      await cart.save();
    }

    cart.calculateTotal();
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.put('/update/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/remove/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.id(req.params.itemId).remove();
    cart.calculateTotal();
    await cart.save();

    res.json({ success: true, cart, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
});

router.delete('/clear', protect, async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalItems: 0 });

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

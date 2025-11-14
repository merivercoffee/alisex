const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const currencyConverter = require('../utils/currencyConverter');

router.get('/', async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 12, currency = 'USD' } = req.query;

    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('seller', 'firstName lastName');

    const total = await Product.countDocuments(filter);

    const productsWithConvertedPrices = await Promise.all(
      products.map(async (product) => {
        const convertedPrice = await currencyConverter.convertWithUpdate(
          product.price,
          product.baseCurrency,
          currency
        );
        return {
          ...product.toObject(),
          displayPrice: convertedPrice,
          displayCurrency: currency,
        };
      })
    );

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      products: productsWithConvertedPrices,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { currency = 'USD' } = req.query;
    const product = await Product.findById(req.params.id)
      .populate('seller', 'firstName lastName country')
      .populate('reviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const convertedPrice = await currencyConverter.convertWithUpdate(
      product.price,
      product.baseCurrency,
      currency
    );

    const productData = {
      ...product.toObject(),
      displayPrice: convertedPrice,
      displayCurrency: currency,
    };

    res.json({ success: true, product: productData });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      baseCurrency,
      category,
      images,
      stock,
      tags,
      weight,
      dimensions,
      processing_time,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      baseCurrency,
      category,
      images,
      stock,
      tags,
      seller: req.user._id,
      seller_info: {
        seller_name: `${req.user.firstName} ${req.user.lastName}`,
        seller_country: req.user.country,
      },
      shipping_info: {
        weight,
        dimensions,
        processing_time,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = {
      user: req.user._id,
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings.average = Math.round((totalRating / product.reviews.length) * 10) / 10;
    product.ratings.count = product.reviews.length;

    await product.save();

    res.status(201).json({ success: true, review, product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

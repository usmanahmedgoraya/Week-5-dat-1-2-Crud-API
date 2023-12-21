const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const Product = require('../Models/Products.models');
const { CreateProduct, updateProduct } = require('../Middleware/Product.middleware');

// Create Product
router.post('/add-product', CreateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc, price, category, features } = req.body;
    const product = new Product({ title, desc, price, category, features });
    await product.save();
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Product
router.get('/get-all-product', async (req, res) => {
  try {
    const product = await Product.find();
    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Products not found' });
    }
    res.status(200).json({ product,data });
  } catch (error) {
    res.status(500).json({ message: 'Error getting products', error: error.message });
  }
});

// Update Product
router.put('/update-product/:id', updateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { title, desc, price, category, features } = req.body;
    const productUpdate = await Product.findByIdAndUpdate(id, { title, desc, price, category, features }, { new: true });
    res.status(200).json(productUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Product
router.delete('/delete-product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

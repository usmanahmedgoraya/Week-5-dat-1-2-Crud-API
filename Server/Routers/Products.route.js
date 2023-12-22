require('dotenv').config();
const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const Product = require('../Models/Products.models');
const { CreateProduct, updateProduct } = require('../Middleware/Product.middleware');
const { upload } = require('../Middleware/Multer.middleware');
const cloudinary = require("cloudinary").v2



// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// * Upload Documents To Cloudinary
const uploadToCloudinary = (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.log(error);
            reject(new Error('Failed to upload file to Cloudinary'));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.log('error inside uploadation' + error);
  }
};

// Create Product
router.post('/add-product', upload.single("image"), CreateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the Request Data
    const { title, desc, price, category, features } = req.body;
    // Create a readable stream from the buffer
    const uploadImage = await uploadToCloudinary(req.file.buffer)
    // Create the Document in MongoDB collection
    const product = new Product({ title, desc, price, category, features, image: uploadImage.secure_url });
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Something went wrong" });
  }
});

// Get all Product
router.get('/get-all-product', async (req, res) => {
  try {
    const product = await Product.find();
    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Products not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error getting products', error: error.message });
  }
});

// Update Product
router.put('/update-product/:id', updateProduct, async (req, res) => {
  try {

    // Get the Express-Validator result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { title, desc, price, category, features } = req.body;
    const uploadImage = await uploadToCloudinary(req.file.buffer)
    const productUpdate = await Product.findByIdAndUpdate(id, { title, desc, price, category, features, image: uploadImage.secure_url }, { new: true });
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

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

    let uploadImage;
    // Destructure the Request Data
    const { title, desc, price, category, features } = req.body;
    if (req.file) {
      // Create a readable stream from the buffer
      uploadImage = await uploadToCloudinary(req.file.buffer)
    }
    // Create the Document in MongoDB collection
    const product = new Product({ title, desc, price, category, features, image: [{ url: uploadImage.secure_url, public_id: uploadImage.public_id }] });
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
router.put('/update-product/:id', upload.single("image"), updateProduct, async (req, res) => {
  try {
    // Get the Express-Validator result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, desc, price, category, features, image } = req.body;
    let uploadImage;
    // Find the product
    const product = await Product.findById(id);

    if (req.file) {
      if (!product) {
        res.status(400).json({ error: "You provided incorrect Id." });
        // Ensure you return after sending the response
        return;
      }

      if (product.image && product.image[0]) {
        // Delete the image
        cloudinary.uploader.destroy(product.image[0].public_id, (error, result) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`Image deleted successfully: ${result.result}`);
          }
        });
      }

      uploadImage = await uploadToCloudinary(req.file.buffer);

      if (!uploadImage) {
        res.status(500).json({ error: "Failed to upload image to Cloudinary." });
        return; // Ensure you return after sending the response
      }
    }

    const productUpdate = await Product.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        price,
        category,
        features,
        image: uploadImage
          ? [{ url: uploadImage.secure_url, public_id: uploadImage.public_id }]
          : undefined,
      },
      { new: true }
    );

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

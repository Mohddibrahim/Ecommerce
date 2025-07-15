// controllers/productController.js
import Product from '../models/Product.js';
import Review from '../models/Review.js';

// Add product
export const addProduct = async (req, res) => {
  const { title, description, quantity, category, price } = req.body;
  const image = req.file?.filename;

  try {
    const product = new Product({
      title,
      description,
      quantity,
      image,
      category,
      price,
      seller: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name createdAt ratingMetrics');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get products by category
export const getByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get logged-in seller's products
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to update this product' });
    }

    const { quantity, price, category } = req.body;
    if (quantity !== undefined) product.quantity = quantity;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

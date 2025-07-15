// server/controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// User files a complaint
export const fileComplaint = async (req, res) => {
  try {
    const { seller, product, message } = req.body;

    if (!seller || !product || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newComplaint = new Complaint({
      user: req.user._id,
      seller,
      product,
      message,
    });

    await newComplaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: newComplaint,
    });
  } catch (err) {
    console.error('Error submitting complaint:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin can view all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title');

    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('product', 'title')
      .populate('seller', 'email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('product', 'title')
      .populate('seller', 'email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

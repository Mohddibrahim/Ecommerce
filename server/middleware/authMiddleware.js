// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect private routes
export const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // If seller is blocked
    if (user.role === 'seller' && user.blocked) {
      return res.status(403).json({ msg: 'Account blocked. Contact admin.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Protect Middleware Error:', err.message);
    res.status(401).json({ msg: 'Unauthorized' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }
  next();
};

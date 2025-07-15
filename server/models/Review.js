// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: String,
  rating: Number,
  media: String,
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.Mixed, // allow object or string
      default: 'N/A',
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

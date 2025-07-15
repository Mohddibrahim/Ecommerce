// controllers/paymentController.js
import { razorpay } from '../config/razorpay.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paisa
      currency: 'INR',
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

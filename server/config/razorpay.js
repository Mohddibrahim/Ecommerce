// server/config/razorpay.js
import './loadEnv.js'; // 👈 Must be here first to load env vars
import Razorpay from 'razorpay';

const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
  throw new Error("❌ Missing Razorpay credentials in .env");
}

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

console.log("✅ Razorpay instance created");

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [String],
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

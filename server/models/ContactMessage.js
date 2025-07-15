import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    replied: { type: Boolean, default: false },
    reply: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);

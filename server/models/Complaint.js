import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
  type: String,
  default: '',
},
replied: {
  type: Boolean,
  default: false,
}

}, {
  timestamps: true,
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;

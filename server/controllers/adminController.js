import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// ✅ Get all complaints
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title');

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Block seller
export const blockSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ msg: 'Seller not found' });
    }
    seller.blocked = true;
    await seller.save();
    res.json({ msg: 'Seller blocked successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Unblock seller
export const unblockSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ msg: 'Seller not found' });
    }
    seller.blocked = false;
    await seller.save();
    res.json({ msg: 'Seller unblocked successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Delete seller
export const deleteSeller = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Seller deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

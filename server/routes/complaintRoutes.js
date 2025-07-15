import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import Complaint from '../models/Complaint.js'; // ✅ This must be imported
import {
  fileComplaint,
  getAllComplaints,
  getUserComplaints
} from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', protect, fileComplaint);
// ✅ Admin: View all user complaints
router.get('/complaints', protect, isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error('Admin complaint fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});
router.get('/mine', protect, getUserComplaints);

// ✅ Add this working delete route
router.delete('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensures only user can delete their own complaint
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('❌ Complaint delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete complaint' });
  }
});
// 👇 ADD THIS AT THE BOTTOM (before export)
router.post('/:id/reply', protect, isAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.reply = reply;
    complaint.replied = true;
    await complaint.save();

    res.json({ message: 'Reply sent to user complaint' });
  } catch (err) {
    console.error('❌ Reply to complaint error:', err.message);
    res.status(500).json({ message: 'Failed to reply' });
  }
});


export default router;

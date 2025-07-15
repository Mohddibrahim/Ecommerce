import express from 'express';
import {
  getAllContacts,
  deleteContact,
  replyToContact,
  submitContactMessage,
} from '../controllers/contactController.js';

import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import ContactMessage from '../models/ContactMessage.js'; // ✅ Needed for /my route

const router = express.Router();
router.post('/', submitContactMessage);                  // POST /api/contact-messages
router.get('/my', protect, async (req, res) => {         // ✅ place /my BEFORE /
  try {
    const messages = await ContactMessage.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch your contact messages' });
  }
});

router.get('/', protect, isAdmin, getAllContacts);       // GET all messages (admin)
router.post('/reply', protect, isAdmin, replyToContact); // Reply to message
router.delete('/:id', protect, isAdmin, deleteContact);  // Delete by ID
router.delete('/my/:id', protect, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    if (message.email !== req.user.email) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
export default router;
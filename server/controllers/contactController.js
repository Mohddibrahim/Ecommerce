import ContactMessage from '../models/ContactMessage.js';

// Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch messages' });
  }
};

// Delete a contact message by ID
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndDelete(id);
    res.json({ msg: 'Contact message deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reply to a contact message
export const replyToContact = async (req, res) => {
  try {
    const { id, reply } = req.body;

    const message = await ContactMessage.findById(id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    message.replied = true;
    message.reply = reply;
    await message.save();

    res.json({ msg: 'Reply saved', data: message });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(201).json({ msg: 'Message submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Failed to submit message' });
  }
};
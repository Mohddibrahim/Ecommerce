// src/pages/Contact.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [myMessages, setMyMessages] = useState([]);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact-messages', form);
      alert('📨 Message sent!');
      setForm({ name: '', email: '', message: '' });
      fetchMyContactMessages();
    } catch (err) {
      alert('❌ Failed to send message');
    }
  };

  const fetchMyContactMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contact-messages/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyMessages(res.data);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyContactMessages();
    }
  }, [token]);

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3">📬 Contact Us</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  placeholder="Write your message..."
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>

        {/* Previous Messages */}
        {token && (
          <div className="col-md-6 mt-4 mt-md-0">
            <div className="card shadow-sm p-4">
              <h4 className="mb-3">🗂️ Your Previous Messages</h4>
              {myMessages.length === 0 ? (
                <p className="text-muted">You have not submitted any messages yet.</p>
              ) : (
                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                  {myMessages.map((msg) => (
                    <div key={msg._id} className="card mb-3">
                      <div className="card-body">
                        <p className="mb-2">
                          <strong>Your Message:</strong><br />
                          {msg.message}
                        </p>

                        {msg.replied ? (
                          <div className="alert alert-success py-2 mb-2">
                            <strong>Admin Reply:</strong> {msg.reply}
                          </div>
                        ) : (
                          <span className="badge bg-warning text-dark mb-2">⏳ Awaiting admin reply...</span>
                        )}

                        <p className="text-muted small mb-2">
                          Sent on: {new Date(msg.createdAt).toLocaleString()}
                        </p>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this message?')) {
                              try {
                                await axios.delete(
                                  `http://localhost:5000/api/contact-messages/my/${msg._id}`,
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                alert('Message deleted');
                                fetchMyContactMessages();
                              } catch (err) {
                                alert('Failed to delete message');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

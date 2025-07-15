// src/pages/Contact.jsx
import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('📨 Your message has been sent!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mt-5">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Message</label>
          <textarea name="message" className="form-control" rows="4" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;

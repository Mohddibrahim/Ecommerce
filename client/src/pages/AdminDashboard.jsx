import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [activeTab, setActiveTab] = useState('complaints');
  const { token } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [complaintRes, sellerRes, contactRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/users/sellers', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/contact-messages', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      setComplaints(complaintRes.data);
      setSellers(sellerRes.data);
      setContactMessages(contactRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contact-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Message deleted");
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleReply = async (id) => {
    const reply = replyText[id];
    if (!reply) return alert("Please enter a reply message");
    try {
      await axios.post(`http://localhost:5000/api/contact-messages/reply`, { id, reply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Reply sent");
      setReplyText((prev) => ({ ...prev, [id]: '' }));
      fetchData();
    } catch (err) {
      alert("Reply failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/seller/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Seller deleted");
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm("Block this seller? They won’t be able to sell again.")) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/seller/block/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Seller blocked");
      fetchData();
    } catch (err) {
      alert("Block failed");
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm("Unblock this seller?")) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/seller/unblock/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Seller unblocked");
      fetchData();
    } catch (err) {
      alert("Unblock failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛡️ Admin Dashboard</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            📢 Complaints
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('sellers')}
          >
            🧑‍💼 Sellers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            📩 Contact Messages
          </button>
        </li>
      </ul>

      {/* Complaints */}
      {activeTab === 'complaints' && (
        <div className="mb-5">
          {complaints.length === 0 ? <p>No complaints submitted.</p> :
            <div className="list-group">
              {complaints.map((c, i) => (
                <div className="list-group-item" key={i}>
                  <p><strong>User:</strong> {c.user?.name}</p>
                  <p><strong>Product:</strong> {c.product?.title}</p>
                  <p><strong>Message:</strong> {c.message}</p>

                  {c.replied ? (
                    <p className="text-success"><strong>✅ Replied:</strong> {c.reply}</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Type reply to complaint"
                        value={replyText[c._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [c._id]: e.target.value })}
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                          try {
                            await axios.post(
                              `http://localhost:5000/api/complaints/${c._id}/reply`,
                              { reply: replyText[c._id] },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            alert("Reply sent");
                            fetchData();
                          } catch (err) {
                            alert("Reply failed");
                          }
                        }}
                      >
                        Reply
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* Sellers */}
      {activeTab === 'sellers' && (
        <div className="mb-5">
          {sellers.length === 0 ? <p>No sellers found.</p> :
            <ul className="list-group">
              {sellers.map((s) => (
                <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{s.name}</strong> <span className="text-muted">({s.email})</span>
                    {s.blocked ? <span className="badge bg-danger ms-2">Blocked</span> : <span className="badge bg-success ms-2">Active</span>}
                  </div>
                  <div>
                    {!s.blocked ? (
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleBlock(s._id)}>Block</button>
                    ) : (
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleUnblock(s._id)}>Unblock</button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      )}

      {/* Contact Messages */}
      {activeTab === 'contact' && (
        <div className="mb-5">
          {contactMessages.length === 0 ? (
            <p>No messages submitted via contact form.</p>
          ) : (
            <div className="list-group">
              {contactMessages.map((msg) => (
                <div key={msg._id} className="list-group-item">
                  <p><strong>Name:</strong> {msg.name}</p>
                  <p><strong>Email:</strong> {msg.email}</p>
                  <p><strong>Message:</strong> {msg.message}</p>
                  <p className="text-muted small">Submitted: {new Date(msg.createdAt).toLocaleString()}</p>

                  {msg.replied && <p className="text-success"><strong>✅ Replied:</strong> {msg.reply}</p>}

                  <div className="mt-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Type reply message"
                      value={replyText[msg._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                    />
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleReply(msg._id)}>Reply</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

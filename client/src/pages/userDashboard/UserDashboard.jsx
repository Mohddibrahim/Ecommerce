import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editAddresses, setEditAddresses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
 const [complaintData, setComplaintData] = useState({
  seller: '',
  sellerEmail: '',
  product: '',
  message: '',
});
const [myComplaints, setMyComplaints] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get('http://localhost:5000/api/users/profile', { headers })
      .then(res => setProfile(res.data)).catch(console.error);

    axios.get('http://localhost:5000/api/orders/mine', { headers })
      .then(res => setOrders(res.data)).catch(console.error);

    axios.get('http://localhost:5000/api/users/addresses', { headers })
      .then(res => {
        setAddresses(res.data);
        setEditAddresses(res.data);
      }).catch(console.error);
      axios.get('http://localhost:5000/api/complaints/mine', { headers })
  .then(res => setMyComplaints(res.data))
  .catch(console.error);


    axios.get('http://localhost:5000/api/users/reviews/mine', { headers })
      .then(res => {
        const editableReviews = res.data.map(r => ({ ...r, editing: false, newMedia: null }));
        setReviews(editableReviews);
      }).catch(console.error);

    setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
  }, [token, user, navigate]);

  const handleCancelOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(o => o._id !== id));
    } catch {
      alert('Cancel failed');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete review');
    }
  };

  const handleBuyNow = (item) => {
    localStorage.setItem('checkoutItem', JSON.stringify(item));
    navigate('/checkout');
  };

  const handleProfileSave = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEditMode(false);
      alert('Profile updated');
    } catch {
      alert('Update failed');
    }
  };

  const handleAddressChange = (index, value) => {
    const updated = [...editAddresses];
    updated[index] = value;
    setEditAddresses(updated);
  };

  const handleDeleteAddress = (index) => {
    const updated = [...editAddresses];
    updated.splice(index, 1);
    setEditAddresses(updated);
  };

  const handleSaveAddresses = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/users/addresses', {
        addresses: editAddresses
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
      alert('Addresses updated');
    } catch {
      alert('Failed to save addresses');
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    if (!complaintData.message.trim() || !complaintData.product || !complaintData.seller) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/complaints',
        {
          seller: complaintData.seller,
          product: complaintData.product,
          message: complaintData.message.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Complaint filed:', response.data);
      alert('Complaint submitted successfully!');
      setComplaintData({ seller: '', product: '', message: '' });
    } catch (err) {
      console.error('Error submitting complaint:', err.response?.data || err.message);
      alert('Failed to submit complaint');
    }
  };


const handleDeleteComplaint = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyComplaints(myComplaints.filter((c) => c._id !== id));
    alert('Complaint deleted');
  } catch (err) {
    console.error('Delete complaint error:', err.response?.data || err.message);
    alert('Failed to delete complaint');
  }
};



  return (
    <div className="container-fluid mt-4 user-dashboard">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4 pe-md-3">
          <div className="sidebar shadow-sm">
            <div className="list-group">
              {['profile', 'orders', 'addresses', 'reviews', 'wishlist', 'complaint'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`list-group-item list-group-item-action ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab === 'profile' && '👤 Profile'}
                  {tab === 'orders' && '🛒 Orders'}
                  {tab === 'addresses' && '🏠 Addresses'}
                  {tab === 'reviews' && '⭐ Reviews'}
                  {tab === 'wishlist' && '💖 Wishlist'}
                  {tab === 'complaint' && '📝 Complaint'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-9 ps-md-4">
          <h4 className="mb-4">Welcome, {profile.name}</h4>

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">👤 Profile</div>
              <div className="card-body">
                {editMode ? (
                  <>
                    {['name', 'email', 'phone', 'age'].map(field => (
                      <div key={field} className="mb-3">
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type={field === 'age' ? 'number' : 'text'}
                          className="form-control"
                          value={profile[field] || ''}
                          onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                    <button className="btn btn-success me-2" onClick={handleProfileSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                    <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
                    <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="card">
              <div className="card-header">🛒 Your Orders</div>
              <ul className="list-group list-group-flush">
                {orders.length === 0 ? (
                  <li className="list-group-item">No orders yet</li>
                ) : orders.map(order => (
                  <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{order.products?.[0]?.title || 'Item'} - ₹{order.total || 'N/A'}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                🏠 Saved Addresses
                <button className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditAddresses([...editAddresses, ''])}>
                  ➕ Add Address
                </button>
              </div>
              <ul className="list-group list-group-flush">
                {editAddresses.length === 0 ? (
                  <li className="list-group-item">No addresses saved</li>
                ) : (
                  editAddresses.map((addr, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <input
                        className="form-control me-2"
                        value={addr}
                        placeholder="Enter address..."
                        onChange={(e) => handleAddressChange(i, e.target.value)}
                      />
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteAddress(i)}>
                        🗑️
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <div className="card-footer text-end">
                <button className="btn btn-success btn-sm" onClick={handleSaveAddresses}>
                  💾 Save Addresses
                </button>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="card">
              <div className="card-header">⭐ Your Reviews</div>
              <ul className="list-group list-group-flush">
                {reviews.length === 0 ? (
                  <li className="list-group-item">No reviews yet</li>
                ) : reviews.map((r, i) => (
                  <li key={r._id} className="list-group-item review-item">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                      <div className="mb-2 mb-md-0" style={{ flex: 1 }}>
                        {r.editing ? (
                          <>
                            <input
                              className="form-control mb-2"
                              value={r.comment || ''}
                              onChange={(e) =>
                                setReviews(reviews.map((rev, idx) =>
                                  idx === i ? { ...rev, comment: e.target.value } : rev
                                ))
                              }
                            />
                            <input
                              type="number"
                              className="form-control mb-2"
                              min="1"
                              max="5"
                              value={r.rating || 1}
                              onChange={(e) =>
                                setReviews(reviews.map((rev, idx) =>
                                  idx === i ? { ...rev, rating: Number(e.target.value) } : rev
                                ))
                              }
                            />
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) =>
                                setReviews(reviews.map((rev, idx) =>
                                  idx === i ? { ...rev, newMedia: e.target.files[0] } : rev
                                ))
                              }
                            />
                          </>
                        ) : (
                          <>
                            <strong>{r.comment}</strong> ({r.rating}/5)
                            {r.media && (
                              r.media.endsWith('.mp4') ? (
                                <video width="150" controls src={`http://localhost:5000/${r.media}`} />
                              ) : (
                                <img src={`http://localhost:5000/${r.media}`} alt="media" width="100" />
                              )
                            )}
                          </>
                        )}
                      </div>

                      <div className="d-flex gap-2">
                        {r.editing ? (
                          <>
                            <button className="btn btn-sm btn-success" onClick={async () => {
                              try {
                                const formData = new FormData();
                                formData.append('comment', r.comment);
                                formData.append('rating', r.rating);
                                if (r.newMedia) formData.append('media', r.newMedia);

                                await axios.put(`http://localhost:5000/api/reviews/${r._id}`, formData, {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data',
                                  },
                                });

                                const updated = [...reviews];
                                updated[i].editing = false;
                                updated[i].newMedia = null;
                                setReviews(updated);
                                alert('Review updated!');
                              } catch {
                                alert('Failed to update review');
                              }
                            }}>
                              Save
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={() => {
                              const updated = [...reviews];
                              updated[i].editing = false;
                              setReviews(updated);
                            }}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {/* You can enable editing if needed */}
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteReview(r._id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="card">
              <div className="card-header fw-bold text-info">💖 Wishlist</div>
              <div className="card-body">
                {wishlist.length === 0 ? (
                  <div className="alert alert-info text-center">No items in wishlist.</div>
                ) : (
                  <div className="row g-4">
                    {wishlist.map((item, idx) => (
                      <div className="col-md-6 col-lg-4" key={idx}>
                        <div className="card h-100 shadow-sm">
                          <img
                            src={`http://localhost:5000/uploads/${item.image}`}
                            className="card-img-top p-2"
                            alt={item.title}
                            style={{ height: '180px', objectFit: 'contain' }}
                          />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="text-muted small">{item.description?.slice(0, 60)}...</p>
                            <p className="fw-bold text-success mb-2">₹{item.price}</p>

                            <div className="mt-auto d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm w-100"
                                onClick={() => {
                                  const cart = JSON.parse(localStorage.getItem('cart')) || [];
                                  const exists = cart.some(p => p._id === item._id);
                                  if (!exists) {
                                    item.quantity = item.quantity || 1;
                                    cart.push(item);
                                    localStorage.setItem('cart', JSON.stringify(cart));
                                  }
                                  const updated = wishlist.filter((_, i) => i !== idx);
                                  setWishlist(updated);
                                  localStorage.setItem('wishlist', JSON.stringify(updated));
                                }}
                              >
                                🛒 Move to Cart
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm w-100"
                                onClick={() => {
                                  const updated = wishlist.filter((_, i) => i !== idx);
                                  setWishlist(updated);
                                  localStorage.setItem('wishlist', JSON.stringify(updated));
                                }}
                              >
                                ❌ Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
{/* Complaint Tab */}
{activeTab === 'complaint' && (
  <div className="card">
    <div className="card-header">📝 Submit Complaint</div>
    <div className="card-body">
      <form onSubmit={handleSubmitComplaint}>
        {/* Product Selector */}
        <div className="mb-3">
          <label htmlFor="productSelect">Select Product</label>
          <select
            id="productSelect"
            className="form-control"
            value={complaintData.product}
            onChange={(e) => {
              const selectedProductId = e.target.value;

              let foundSellerId = '';
              let foundSellerEmail = '';

              for (const order of orders) {
                const product = order.products?.find(
                  (p) => p._id === selectedProductId || p.productId === selectedProductId
                );
                if (product && product.seller && product.seller.email) {
                  foundSellerId = product.seller._id;
                  foundSellerEmail = product.seller.email;
                  break;
                }
              }

              setComplaintData((prev) => ({
                ...prev,
                product: selectedProductId,
                seller: foundSellerId, // needed for POST
                sellerEmail: foundSellerEmail, // for display only
              }));
            }}
            required
          >
            <option value="">-- Select a product you ordered --</option>
            {orders.flatMap((order) =>
              order.products?.map((p) => (
                <option key={`${p._id}-${order._id}`} value={p._id}>
                  {p.title} (₹{p.price})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Auto-filled Seller Email (read-only) */}
        <div className="mb-3">
          <label>Seller Email</label>
          <input
            className="form-control"
            value={complaintData.sellerEmail || ''}
            readOnly
            placeholder="Auto-filled from selected product"
          />
        </div>

        {/* Complaint Message */}
        <div className="mb-3">
          <label htmlFor="message">Complaint Message</label>
          <textarea
            id="message"
            className="form-control"
            value={complaintData.message}
            onChange={(e) =>
              setComplaintData({ ...complaintData, message: e.target.value })
            }
            required
          />
        </div>

        <button className="btn btn-danger" type="submit">
          Submit Complaint
        </button>
        
      </form>
      <hr className="my-4" />
<h5>📋 Your Submitted Complaints</h5>
{myComplaints.length === 0 ? (
  <p className="text-muted">No complaints submitted yet.</p>
) : (
 <ul className="list-group">
  {myComplaints.map((comp) => (
    <li key={comp._id} className="list-group-item">
      <strong>Product:</strong> {comp.product?.title || 'N/A'}<br />
      <strong>Seller Email:</strong> {comp.seller?.email || 'N/A'}<br />
      <strong>Message:</strong> {comp.message}<br />
      {comp.reply && (
        <p className="text-success mt-1">
          <strong>Admin Reply:</strong> {comp.reply}
        </p>
      )}
      <small className="text-muted">
        Replied on: {new Date(comp.createdAt).toLocaleString()}
      </small>
      <div className="text-end mt-2">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => handleDeleteComplaint(comp._id)}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

)}

    </div>
  </div>
)}


         </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching seller products', err);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      setReviews((prev) => ({ ...prev, [productId]: res.data }));
    } catch (err) {
      console.error('Error fetching reviews', err);
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.address) {
        setAddress(res.data.address);
      }
    } catch (err) {
      console.error('Error fetching address', err);
    }
  };

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchSellerProducts();
    fetchAddress();
    const interval = setInterval(fetchSellerProducts, 3000);
    return () => clearInterval(interval);
  }, [token, user, navigate]);

  const handleEdit = (productId) => {
    navigate(`/manage-products`);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        'http://localhost:5000/api/users/seller/address',
        address,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Address updated successfully!');
    } catch (err) {
      console.error('Failed to update address:', err);
      alert('❌ Failed to update address');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 My Listed Products</h2>

      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3 mb-4" key={product._id}>
              <div className="card h-100 shadow">
                {product.image && (
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p>{product.description}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Price:</strong> ₹{product.price}</p>
                  <p><strong>Stock:</strong> {product.quantity}</p>

                  <button
                    className="btn btn-outline-info btn-sm me-2"
                    onClick={() => fetchReviews(product._id)}
                    data-bs-toggle="collapse"
                    data-bs-target={`#reviews-${product._id}`}
                    aria-expanded="false"
                    aria-controls={`reviews-${product._id}`}
                  >
                    View Feedback
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(product._id)}
                  >
                    Update
                  </button>
                </div>

                {/* Customer Reviews Section */}
                <div className="collapse" id={`reviews-${product._id}`}>
                  <div className="card card-body bg-light">
                    {reviews[product._id]?.length > 0 ? (
                      reviews[product._id].map((r, i) => (
                        <div key={i} className="border-bottom pb-2 mb-2">
                          <strong>{r.userId?.name || 'Anonymous'}</strong>
                          <p className="mb-1">⭐ {r.rating}/5</p>
                          <p className="mb-1">{r.comment}</p>
                          {r.media && (
                            r.media.endsWith('.mp4') ? (
                              <video width="150" controls>
                                <source src={`http://localhost:5000/${r.media}`} type="video/mp4" />
                              </video>
                            ) : (
                              <img src={`http://localhost:5000/${r.media}`} alt="review media" style={{ width: '100px' }} />
                            )
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Seller Address Upload Section */}
      <div className="mt-5">
        <h4>📮 My Shipping Address</h4>
        <form onSubmit={handleAddressSubmit} className="mt-3">
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Street"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerDashboard;

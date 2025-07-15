import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0);
  const [newAddress, setNewAddress] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity + delta);
    updateLocalStorage(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateLocalStorage(updatedCart);
  };

  const moveToWishlist = (index) => {
    const item = cart[index];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.some(w => w._id === item._id)) {
      wishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    const updatedCart = cart.filter((_, i) => i !== index);
    updateLocalStorage(updatedCart);
  };

  const handleAddAddress = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/addresses', { address: newAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAddress('');
      await fetchUserAddresses();
      document.getElementById('closeModal').click();
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString();

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-primary">🛒 Your Cart</h3>

      {cart.length === 0 ? (
        <div className="alert alert-warning text-center">Your cart is empty.</div>
      ) : (
        <>
          <div className="row g-4">
            {cart.map((item, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="zoom-container">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      className="card-img-top p-3 zoom-img"
                      alt={item.title}
                      style={{ height: '180px', objectFit: 'contain', transition: 'transform 0.3s ease-in-out' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="text-muted small">{item.description?.slice(0, 60)}...</p>
                    <p className="fw-bold text-success mb-1">₹{item.price}</p>
                    <p className="text-muted small">Expected Delivery: <strong>{formattedDelivery}</strong></p>

                    <div className="d-flex align-items-center mb-3">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(idx, -1)}>-</button>
                      <span className="mx-3">{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(idx, 1)}>+</button>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-outline-danger btn-sm w-100" onClick={() => removeItem(idx)}>❌ Remove</button>
                      <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => moveToWishlist(idx)}>🤍 Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Address + Total */}
          <div className="mt-5">
            <div className="card bg-light border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-2 text-dark">📍 Delivery Address</h5>
                    {addresses.length > 0 ? (
                      <>
                        <select
                          className="form-select"
                          value={defaultAddressIndex}
                          onChange={(e) => setDefaultAddressIndex(e.target.value)}
                        >
                          {addresses.map((addr, i) => (
                            <option key={i} value={i}>{addr}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <p className="text-muted">No address saved.</p>
                    )}
                  </div>
                  <button className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addAddressModal">
                    ➕ Add Address
                  </button>
                </div>
              </div>
            </div>

            <div className="text-end pe-md-3">
              <h4 className="fw-bold text-dark">Total: ₹{calculateTotal()}</h4>
              <p className="text-muted mb-3">Includes all taxes & delivery</p>
              <button className="btn btn-success px-5 py-2 rounded-3 fw-semibold" onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal for Add Address */}
      <div className="modal fade" id="addAddressModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Address</h5>
              <button id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter new address..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={handleAddAddress}>Save Address</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .zoom-container:hover .zoom-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Cart;

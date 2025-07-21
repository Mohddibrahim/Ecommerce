// src/pages/Checkout.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadRazorpay } from '../../utils/razorpay'; // ✅ Add this
import './Checkout.css';

const Checkout = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    const withQty = stored.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCartItems(withQty);
  }, []);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const calcTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(calcTotal);
    }
  }, [cartItems]);

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch user addresses:', err);
    }
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...cartItems];
    updated[index].quantity = qty > 0 ? qty : 1;
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty.");
    if (addresses.length === 0) return alert("Please add a delivery address before placing an order.");

    const res = await loadRazorpay();
    if (!res) return alert('Razorpay SDK failed to load.');

    try {
      const { data: order } = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_test_Lfnn1zH4dEGghy', // ✅ Razorpay Key ID (keep secret key in backend only)
        amount: order.amount,
        currency: 'INR',
        name: 'Your Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          alert('✅ Payment Successful!');

          try {
            const orderData = {
              items: cartItems.map(item => ({
                _id: item._id,
                quantity: item.quantity
              })),
              address: addresses[selectedAddressIndex] || 'No address',
              paymentId: response.razorpay_payment_id
            };

            await axios.post('http://localhost:5000/api/orders', orderData, {
              headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem('cart');
            navigate('/thank-you');
          } catch (error) {
            console.error("❌ Order failed after payment", error);
            alert('Order saving failed: ' + (error.response?.data?.message || 'Unexpected error'));
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#3399cc' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("❌ Payment failed", err);
      alert('Payment error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div className="container mt-4 checkout-page">
      <div className="row">
        <div className="col-md-8">
          {/* LOGIN */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-bold">1. LOGIN</div>
            <div className="card-body">
              <p className="mb-0">{user?.name} <br /> {user?.phone || user?.email}</p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-bold">2. DELIVERY ADDRESS</div>
            <div className="card-body">
              {addresses.length > 0 ? (
                <>
                  <label className="form-label fw-semibold">Select Address</label>
                  <select
                    className="form-select"
                    value={selectedAddressIndex}
                    onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
                  >
                    {addresses.map((addr, idx) => (
                      <option key={idx} value={idx}>
                        {addr.length > 70 ? addr.slice(0, 70) + '...' : addr}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <p className="text-muted">No address saved. Please add one from the Cart or Profile page.</p>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white fw-bold">3. ORDER SUMMARY</div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <table className="table table-hover align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <img
                            src={`http://localhost:5000/uploads/${item.image}`}
                            alt={item.title}
                            width="60"
                            height="60"
                            style={{ objectFit: 'contain' }}
                          />
                        </td>
                        <td>{item.title}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            className="form-control form-control-sm w-50 mx-auto"
                            onChange={(e) => handleQuantityChange(i, parseInt(e.target.value))}
                          />
                        </td>
                        <td className="fw-semibold">₹{item.price * item.quantity}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(i)}>
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* PRICE DETAILS */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">PRICE DETAILS</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{total}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Delivery</span>
                <span className="text-success">FREE</span>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </li>
            </ul>
            <div className="card-footer text-center">
              <button className="btn btn-success w-100" onClick={handlePlaceOrder}>
                Pay ₹{total} Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

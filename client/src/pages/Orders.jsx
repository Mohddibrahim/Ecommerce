import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setOrders(res.data);
        setError('');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError('Failed to fetch orders');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel order');
    }
  };

  const handleRepeatOrder = async (products) => {
    try {
      const repeatItems = products
        .map((item) => {
          const productId =
            item.productId || // new format
            (item.product && item.product._id) || // populated ref
            item.product || // fallback
            item._id;

          if (!productId || typeof productId !== 'string') return null;

          return {
            productId,
            quantity: item.quantity || 1,
          };
        })
        .filter((item) => item !== null);

      console.log("🔁 Valid repeat items to send:", repeatItems);

      if (repeatItems.length === 0) {
        alert('❌ No valid products found to repeat.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: repeatItems,
          address: 'Repeat Order (using saved address)',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Order repeated successfully!');
      fetchOrders();
    } catch (err) {
      console.error('❌ Repeat error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Repeat order failed');
    }
  };

  const handleInvoice = (order) => {
    const doc = new jsPDF();
    const gstRate = 0.18;

    const subtotal = order.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    doc.setFontSize(16);
    doc.text('🛒 YourStore Pvt. Ltd.', 14, 15);
    doc.setFontSize(11);
    doc.text('GSTIN: 22ABCDE1234F1Z5', 14, 21); // sample GST number

    doc.setFontSize(12);
    doc.text(`🧾 Invoice`, 14, 30);
    doc.text(`Invoice ID: #INV-${Date.now().toString().slice(-6)}`, 14, 38);
    doc.text(`Order ID: ${order._id}`, 14, 44);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 51);
    doc.text(`Customer: ${user?.name || ''}`, 14, 58);
    doc.text(`Email: ${user?.email || ''}`, 14, 65);
    doc.text(`Phone: ${user?.phone || 'N/A'}`, 14, 72);

    const addr = order.shippingAddress;
    if (typeof addr === 'string') {
      doc.text(`Address: ${addr}`, 14, 79);
    } else if (typeof addr === 'object' && addr !== null) {
      doc.text(`Address: ${addr.street || ''}, ${addr.city || ''}`, 14, 79);
      doc.text(`${addr.state || ''}, ${addr.pincode || ''}`, 14, 86);
    }

    const tableRows = order.products.map((item, i) => [
      i + 1,
      item.title || 'Product',
      item.quantity,
      `₹${item.price}`,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
      body: tableRows,
    });

    const afterTableY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, afterTableY);
    doc.text(`GST (18%): ₹${gstAmount.toFixed(2)}`, 14, afterTableY + 7);
    doc.text(`Total: ₹${totalAmount.toFixed(2)}`, 14, afterTableY + 14);

    // Optional: Add payment message
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for shopping with YourStore! For any queries, contact support@yourstore.com', 14, afterTableY + 24);

    doc.save(`invoice_${order._id}.pdf`);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const filteredOrders = orders.filter((order) =>
    filterStatus === 'All' ? true : order.status === filterStatus
  );

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">📦 Your Orders</h3>

      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filteredOrders.length === 0 ? (
        <div className="alert alert-warning text-center">You have no orders.</div>
      ) : (
        <div className="row g-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title mb-2">
                    <span className="text-secondary">Order</span> #{order._id.slice(-6)}
                  </h5>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <span className={`text-${order.status === 'Delivered' ? 'success' : 'primary'}`}>
                      {order.status}
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </p>
                  <p className="mb-2">
                    <strong>Total Items:</strong> {order.products?.length || 0}
                  </p>

                  <div className="progress mb-2" style={{ height: '6px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: order.status === 'Delivered' ? '100%' : '40%' }}
                      aria-valuenow={order.status === 'Delivered' ? 100 : 40}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p className="text-muted small mb-2">
                    {order.status === 'Delivered' ? 'Delivered successfully' : 'In transit...'}
                  </p>

                  <p className="fw-bold">📦 Products:</p>
                  {order.products?.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-3">
                      <img
                        src={
                          item.image
                            ? `http://localhost:5000/uploads/${item.image}`
                            : '/default-image.png'
                        }
                        alt={item.title || 'Product'}
                        className="me-3 rounded border"
                        style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                        onError={(e) => (e.target.src = '/default-image.png')}
                      />

                      <div>
                        <p className="mb-0 fw-semibold">{item.title}</p>
                        <small>Qty: {item.quantity}</small>
                        <br />
                        <small className="text-success">₹{item.price}</small>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      ❌ Cancel
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleInvoice(order)}
                    >
                      🧾 Invoice
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleRepeatOrder(order.products || [])}
                    >
                      🔁 Repeat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

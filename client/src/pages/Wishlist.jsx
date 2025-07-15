import { useEffect, useState } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(stored);
  }, []);

  const updateWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const moveToCart = (index) => {
    const item = wishlist[index];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const exists = cart.some(p => p._id === item._id);
    if (!exists) {
      item.quantity = item.quantity || 1;
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    const updatedWishlist = wishlist.filter((_, i) => i !== index);
    updateWishlist(updatedWishlist);
  };

  const removeItem = (index) => {
    const updated = wishlist.filter((_, i) => i !== index);
    updateWishlist(updated);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-info">🤍 Your Wishlist</h3>
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
                    <button className="btn btn-outline-primary btn-sm w-100" onClick={() => moveToCart(idx)}>🛒 Move to Cart</button>
                    <button className="btn btn-outline-danger btn-sm w-100" onClick={() => removeItem(idx)}>❌ Remove</button>
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

export default Wishlist;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Custom styling

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card product-card shadow-sm">
      <div className="product-img-wrapper p-3">
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.title}
          className="card-img-top product-img"
        />
      </div>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h6 className="fw-bold mb-1">{product.title}</h6>
          <p className="text-muted small mb-2">
            {product.description.slice(0, 40)}...
          </p>
          <p className="mb-1 text-success fw-semibold">₹{product.price}</p>
          <p className="text-muted small">Stock: {product.quantity}</p>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-primary">
            🔍 View
          </Link>
          <button
            className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? '✅ Added' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

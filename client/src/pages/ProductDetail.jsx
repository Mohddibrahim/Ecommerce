import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [media, setMedia] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews([]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productId', id);
    formData.append('comment', comment);
    formData.append('rating', rating);
    if (media) {
      formData.append('media', media);
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setComment('');
      setRating(0);
      setMedia(null);
      fetchReviews();
    } catch (err) {
      console.error('Review submit failed:', err);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  // ✅ New: Add to Cart
  const addToCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = storedCart.find(item => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    alert('🛒 Product added to cart!');
  };

  // ✅ New: Buy Now
  const buyNow = () => {
    localStorage.setItem('cart', JSON.stringify([{ ...product, quantity: 1 }]));
    alert('⚡ Redirecting to checkout...');
    navigate('/checkout');
  };

  return (
    <div className="container mt-5">
      {product && (
        <div className="row">
          <div className="col-md-5">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.title}
              className="img-fluid"
            />
          </div>

          <div className="col-md-7">
            <h3>{product.title}</h3>
            <p className="text-muted">₹ {product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>In Stock:</strong> {product.countInStock}</p>

            {averageRating && (
              <p><strong>Average Rating:</strong> ⭐ {averageRating}/5</p>
            )}

            {/* ✅ Updated buttons */}
            <button className="btn btn-success me-2" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="btn btn-warning" onClick={buyNow}>
              Buy Now
            </button>

            {/* ✅ Seller Info Section */}
            {product.seller && (
              <div className="mt-4 border-top pt-3 bg-light p-3 rounded shadow-sm">
                <h5 className="mb-3">🧑‍💼 Seller Information</h5>
                <h6>{product.seller.name}</h6>

                <div className="d-flex gap-4 mt-2">
                  <div>
                    <p className="mb-1"><strong>Product Quality</strong></p>
                    <div className="rating-circle bg-success text-white">
                      {product.seller?.ratingMetrics?.productQuality?.toFixed(1) || "4.2"}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1"><strong>Service Quality</strong></p>
                    <div className="rating-circle bg-info text-white">
                      {product.seller?.ratingMetrics?.serviceQuality?.toFixed(1) || "4.0"}
                    </div>
                  </div>
                </div>

                <p className="mt-3">
                  <strong>Seller since:</strong>{" "}
                  {new Date(product.seller.createdAt).toLocaleDateString()}
                </p>

                <button className="btn btn-outline-primary btn-sm mt-2">
                  📞 Contact Seller
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-5">
        <h4>Ratings & Reviews</h4>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border p-3 my-2 rounded">
              <p><strong>👤 User:</strong> {review.userId?.name || 'Anonymous'}</p>
              <p>⭐ {review.rating}/5</p>
              <p>{review.comment}</p>
              {review.media && (
                <>
                  {review.media.endsWith('.mp4') ? (
                    <video
                      src={`http://localhost:5000/uploads/${review.media}`}
                      controls
                      width="250"
                    />
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/${review.media}`}
                      alt="review"
                      width="150"
                    />
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mt-4">
            <h5>Write a Review</h5>
            <textarea
              className="form-control mb-2"
              placeholder="Share your thoughts"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) => setMedia(e.target.files[0])}
              accept="image/*,video/*"
            />
            <button className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Review = () => {
  const { productId } = useParams();
  const [comment, setComment] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/reviews/${productId}`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Review submitted");
    } catch (err) {
      alert("Error submitting review");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Review;

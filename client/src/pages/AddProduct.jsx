// src/pages/AddProduct.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(''); // ✅ new

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('category', category); // ✅ new
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product added');
      navigate('/');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="mb-3">
          <label>Price:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label>Category:</label> {/* ✅ added */}
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

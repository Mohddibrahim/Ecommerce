// src/pages/ManageProducts.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({ quantity: 1, price: 0, category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete the product');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.map((p) => (p._id === id ? { ...p, ...updatedFields } : p)));
      setEditingId(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update the product');
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Manage My Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {product.image && (
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>

                  <div className="mb-2">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingId === product._id ? updatedFields.quantity : product.quantity}
                      disabled={editingId !== product._id}
                      onChange={(e) =>
                        setUpdatedFields({ ...updatedFields, quantity: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label>Price:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingId === product._id ? updatedFields.price : product.price || 0}
                      disabled={editingId !== product._id}
                      onChange={(e) =>
                        setUpdatedFields({ ...updatedFields, price: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label>Category:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingId === product._id ? updatedFields.category : product.category || ''}
                      disabled={editingId !== product._id}
                      onChange={(e) =>
                        setUpdatedFields({ ...updatedFields, category: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="card-footer text-end">
                  {editingId === product._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUpdate(product._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditingId(product._id);
                          setUpdatedFields({
                            quantity: product.quantity,
                            price: product.price || 0,
                            category: product.category || '',
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

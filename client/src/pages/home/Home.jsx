import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ProductCard from '../../components/productcard/ProductCard';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (!user || user.role === 'user') {
      fetchProducts();
      const interval = setInterval(fetchProducts, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // ⛔ Do not render anything if admin or seller
  if (user?.role === 'admin' || user?.role === 'seller') {
    return null;
  }

  const processedProducts = products
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => (filteredCategory ? p.category === filteredCategory : true))
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className={`container-fluid py-4 px-md-5 home-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛍️ Featured Products</h2>
        <button className="btn btn-sm btn-outline-dark" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4 filter-bar">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" onChange={(e) => setFilteredCategory(e.target.value)}>
            <option value="">📦 All Categories</option>
            {[...new Set(products.map(p => p.category))].map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
            <option value="">🔃 Sort by</option>
            <option value="priceLow">💸 Price: Low to High</option>
            <option value="priceHigh">💰 Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {paginatedProducts.length === 0 ? (
          <p className="text-center">❌ No matching products found.</p>
        ) : (
          paginatedProducts.map(product => (
            <div key={product._id} className="col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 my-5">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          ← Prev
        </button>
        <span className="fw-semibold">Page {page} of {totalPages}</span>
        <button
          className="btn btn-outline-primary"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Home;

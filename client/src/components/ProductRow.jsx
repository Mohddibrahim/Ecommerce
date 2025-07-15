import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductRow = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/category/${category}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, [category]);

  if (products.length === 0) return null;

  return (
    <div className="d-flex overflow-auto p-2">
      {products.map(product => (
        <div key={product._id} className="me-3">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductRow;

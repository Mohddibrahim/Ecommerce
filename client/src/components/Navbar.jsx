import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-2 sticky-top">
      <Link className="navbar-brand fw-bold" to="/">MyShop</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto gap-2">
          {/* Customer Routes */}
          {user?.role !== 'seller' && user?.role !== 'admin' && (
            <>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/cart')}`} to="/cart">Cart</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/orders')}`} to="/orders">Orders</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/wishlist')}`} to="/wishlist">Wishlist</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/user-dashboard')}`} to="/user-dashboard">User Dashboard</Link>
              </li>
            </>
          )}

          {/* Seller Routes */}
          {user?.role === 'seller' && (
            <>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/seller-dashboard')}`} to="/seller-dashboard">All Products</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/manage-products')}`} to="/manage-products">Manage Products</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/add-product')}`} to="/add-product">Add Product</Link>
              </li>
            </>
          )}

          {/* Admin Route */}
          {user?.role === 'admin' && (
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin-dashboard')}`} to="/admin-dashboard">Admin</Link>
            </li>
          )}

          {/* Common Static Pages */}
         
        </ul>

        {/* Auth Actions */}
        <ul className="navbar-nav ms-auto gap-2">
          {user ? (
            <li className="nav-item dropdown">
              <button
                className="btn btn-sm btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.name || 'Profile'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">View Profile</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="btn btn-sm btn-outline-light" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-sm btn-outline-light" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

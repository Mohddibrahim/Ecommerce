import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer/Footer'; // ✅ Make sure this exists

// Pages
import Home from './pages/home/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Checkout from './pages/checkout/Checkout';
import ThankYou from './pages/Thankyou';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Review from './pages/Review';
import Complaints from './pages/Complaints';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import ManageProducts from './pages/ManageProducts';
import ProductDetail from './pages/ProductDetail';
import UserDashboard from './pages/userDashboard/UserDashboard';

import './App.css'; // ✅ We'll add flex rules here
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpCenter from './pages/HelpCenter';





function App() {
  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <Navbar />

      {/* Main content fills available space */}
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/review/:productId" element={<Review />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/manage-products/:productId" element={<ManageProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
           <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

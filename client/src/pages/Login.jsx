import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './auth.css'; // import your custom css

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);

      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center text-muted">Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;

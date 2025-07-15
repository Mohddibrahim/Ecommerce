import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css'; // import your custom css

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input type="text" className="form-control" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input type="password" className="form-control" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p className="mt-3 text-center text-muted">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;

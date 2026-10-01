import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import "./Register.css"; // ✅ Import CSS

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      navigate('/login'); // ✅ safer redirect after register
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />

        <label>Email Address</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

        <label>Password</label>
        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        {/* Hidden role field */}
        <input type="hidden" value={formData.role} />

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
};

export default Register;

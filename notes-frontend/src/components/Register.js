import React, { useState } from 'react';
import API from './utils/api'; // ✅ Import centralized API

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/auth/register', formData); // ✅ Use API instance

      setMessage(res.data.message || 'Registration successful');
      setTimeout(() => {
        onRegister(); // ✅ switch to login form after success
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.toLowerCase().includes('success') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error as user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    try {
      const res = await axios.post('https://notes-backend-doza.onrender.com/api/auth/register', formData);

      setMessage(res.data.message);
      if (onRegister) onRegister();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;

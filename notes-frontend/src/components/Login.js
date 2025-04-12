import React, { useState } from 'react';
import API from '../utils/api'; // ✅ Using our custom axios instance

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

if (token && user) {
  onLogin(token, user); // 🎯 Pass the whole user object
}

    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;

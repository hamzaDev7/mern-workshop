import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const { data } = await api.post("/auth/forgotpassword", { email });
      setMsg(data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <h2>MediTrack</h2>
        <nav>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <div className="card auth-card">
        <h2>Forgot Password</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Enter your email and check the server console for the reset link!
        </p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="ayesha@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            Send Reset Link
          </button>
        </form>
        {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
        {msg && <p style={{ color: '#166534', marginTop: '1rem', background: '#dcfce7', padding: '10px', borderRadius: '8px' }}>{msg}</p>}
        <div style={{ fontSize: '0.875rem', marginTop: '1.5rem', color: 'var(--primary-color)' }}>
          <p><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Back to Sign in</Link></p>
        </div>
      </div>
    </>
  );
}

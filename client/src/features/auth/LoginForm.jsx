import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate("/dashboard");
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        <h2>Sign in to MediTrack</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="ayesha@example.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        <div style={{ fontSize: '0.875rem', marginTop: '1.5rem', color: 'var(--primary-color)' }}>
          <p style={{ marginBottom: '0.5rem' }}><Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>New patient? Create an account</Link></p>
          <p><Link to="/forgotpassword" style={{ color: 'inherit', textDecoration: 'none' }}>Forgot your password?</Link></p>
        </div>
      </div>
    </>
  );
}

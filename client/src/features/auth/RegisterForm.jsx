import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate("/dashboard");
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
        <h2>Create an account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" placeholder="Ayesha Khan" value={form.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="ayesha@example.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            Register
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        <div style={{ fontSize: '0.875rem', marginTop: '1.5rem', color: 'var(--primary-color)' }}>
          <p><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Already have an account? Sign in</Link></p>
        </div>
      </div>
    </>
  );
}

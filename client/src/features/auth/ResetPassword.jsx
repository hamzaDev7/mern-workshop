import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from './authSlice';
import api from '../../api/axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      await dispatch(fetchMe()); // update redux state with new session
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired token");
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
        </nav>
      </header>

      <div className="card auth-card">
        <h2>Reset Password</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            Set New Password
          </button>
        </form>
        {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
      </div>
    </>
  );
}

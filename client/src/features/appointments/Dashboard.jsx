import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, bookAppointment, cancelAppointment } from './appointmentsSlice';
import { logoutUser } from '../auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { list, loading } = useSelector(s => s.appointments);
  
  const [form, setForm] = useState({ doctor: '', reason: '', scheduledFor: '' });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const onLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(bookAppointment(form));
    setForm({ doctor: '', reason: '', scheduledFor: '' });
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${day} ${month}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <>
      <header className="header">
        <h2>MediTrack</h2>
        <nav>
          <span>My appointments</span>
          {user?.role === 'staff' && (
            <Link to="/staff" style={{ color: 'white', textDecoration: 'none' }}>Clinic schedule</Link>
          )}
          <button onClick={onLogout}>Log out</button>
        </nav>
      </header>
      
      <div className="container">
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome back, {user?.name}</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Your upcoming appointment requests.</p>
        
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Book a new appointment</h4>
          <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Doctor</label>
              <input placeholder="Dr. Imran Malik" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Reason</label>
              <input placeholder="Follow-up on blood test" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Date and time</label>
              <input type="datetime-local" value={form.scheduledFor} onChange={e => setForm({...form, scheduledFor: e.target.value})} required />
            </div>
            <div>
              <button type="submit" className="btn-primary">Request appointment</button>
            </div>
          </form>
        </div>

        {loading ? <p>Loading appointments...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>When</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.doctor}</td>
                    <td>{app.reason}</td>
                    <td>{formatDate(app.scheduledFor)}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td>
                      {app.status !== 'cancelled' ? (
                        <button className="action-btn cancel" onClick={() => dispatch(cancelAppointment(app._id))}>Cancel</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                      No appointments found. Book one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function StaffPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/staff/appointments")
      .then(res => setAppointments(res.data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/staff/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? res.data.appointment : a));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <>
      <header className="header">
        <h2>MediTrack</h2>
        <nav>
          <Link to="/dashboard">My appointments</Link>
          <span>Clinic schedule</span>
          <button onClick={onLogout}>Log out</button>
        </nav>
      </header>
      
      <div className="container">
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Clinic schedule (staff only)</h3>
        
        {!loading && (
          <div className="stats-grid">
            <div className="stat-card blue">
              <span className="stat-label">Total Requests</span>
              <span className="stat-value">{appointments.length}</span>
            </div>
            <div className="stat-card green">
              <span className="stat-label">Confirmed</span>
              <span className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</span>
            </div>
            <div className="stat-card red">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value">{appointments.filter(a => a.status === 'cancelled').length}</span>
            </div>
          </div>
        )}

        {loading ? <p>Loading appointments...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>When</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>{app.owner?.name || "Unknown"}</td>
                    <td>{app.doctor}</td>
                    <td>{formatDate(app.scheduledFor)}</td>
                    <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      {app.status !== 'confirmed' && (
                        <button className="action-btn confirm" onClick={() => updateStatus(app._id, 'confirmed')}>Confirm</button>
                      )}
                      {app.status !== 'cancelled' && (
                        <button className="action-btn cancel" onClick={() => updateStatus(app._id, 'cancelled')}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                      No appointments found in the system.
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

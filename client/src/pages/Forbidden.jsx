import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#196b61', color: 'white' }}>
        <h2>MediTrack</h2>
        <div>
          <button onClick={onLogout} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>Log out</button>
        </div>
      </header>
      <div style={{ padding: '40px' }}>
        <h3>403 — you do not have access to this page.</h3>
        <p>A patient opened /staff directly. RoleRoute sent them here.</p>
      </div>
    </div>
  );
}

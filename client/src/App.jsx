import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';

import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import Dashboard from './features/appointments/Dashboard';
import StaffPanel from './features/appointments/StaffPanel';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import Forbidden from './pages/Forbidden';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe()); // the cookie decides
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<RoleRoute allow={["staff"]} />}>
          <Route path="/staff" element={<StaffPanel />} />
        </Route>
        
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

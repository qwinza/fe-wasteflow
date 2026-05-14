import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AddDeposit from './pages/AddDeposit';
import ManageCategories from './pages/ManageCategories';
import ManageLocations from './pages/ManageLocations';
import Login from './pages/Login';
import Register from './pages/Register';
import RedeemPoints from './pages/RedeemPoints';
import ManageRewards from './pages/ManageRewards';
import authService from './services/auth.service';
import './index.css';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const navigate = useNavigate();

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
    navigate('/login');
  };

  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ROLE_ADMIN');

  return (
    <div className="App">
      {!currentUser ? (
        // Guest Layout (Login/Register)
        <>
          <nav className="navbar" style={{ justifyContent: 'center' }}>
            <Link to="/" className="navbar-brand">
              <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '0.75rem', display: 'flex' }}>
                <Leaf size={24} />
              </div>
              <span style={{ letterSpacing: '-0.02em' }}>WasteFlow</span>
            </Link>
          </nav>
          <main className="fade-in">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </>
      ) : (
        // Authenticated Dashboard Layout
        <div className="dashboard-layout">
          <Sidebar user={currentUser} logOut={logOut} />
          
          <main className="main-content fade-in">
            <Routes>
              <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <Navigate to="/warga" />} />
              <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
              <Route path="/warga" element={!isAdmin ? <UserDashboard /> : <Navigate to="/admin" />} />
              <Route path="/setor" element={!isAdmin ? <AddDeposit /> : <Navigate to="/admin" />} />
              <Route path="/manage-categories" element={isAdmin ? <ManageCategories /> : <Navigate to="/admin" />} />
              <Route path="/manage-locations" element={isAdmin ? <ManageLocations /> : <Navigate to="/admin" />} />
              <Route path="/manage-rewards" element={isAdmin ? <ManageRewards /> : <Navigate to="/admin" />} />
              <Route path="/tukar-poin" element={!isAdmin ? <RedeemPoints /> : <Navigate to="/admin" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <footer style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'auto' }}>
              &copy; 2026 WasteFlow Team. All rights reserved.
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

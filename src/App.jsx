import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, LayoutDashboard, User as UserIcon, PlusCircle, Settings, MapPin, MessageSquare, Award, Gift } from 'lucide-react';
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
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '0.75rem', display: 'flex' }}>
            <Leaf size={24} />
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>WasteFlow</span>
        </Link>

        <div className="nav-links">
          {!currentUser ? (
            <>
              <Link to="/login" className="nav-link">Masuk</Link>
              <Link to="/register" className="nav-link btn btn-outline" style={{ padding: '0.5rem 1.25rem', border: '1px solid var(--primary)' }}>Daftar</Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
                  <Link to="/manage-categories" className="nav-link"><Settings size={18} /> Kategori</Link>
                  <Link to="/manage-locations" className="nav-link"><MapPin size={18} /> Lokasi</Link>
                  <Link to="/manage-rewards" className="nav-link"><Gift size={18} /> Reward</Link>
                </>
              ) : (
                <>
                  <Link to="/warga" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
                  <Link to="/setor" className="nav-link"><PlusCircle size={18} /> Setor Sampah</Link>
                </>
              )}
              <button onClick={logOut} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                <LogOut size={18} /> Keluar
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="fade-in">
        <Routes>
          <Route path="/" element={currentUser ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/warga" />) : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/warga" element={currentUser ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/setor" element={currentUser ? <AddDeposit /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/manage-categories" element={isAdmin ? <ManageCategories /> : <Navigate to="/login" />} />
          <Route path="/manage-locations" element={isAdmin ? <ManageLocations /> : <Navigate to="/login" />} />
          <Route path="/manage-rewards" element={isAdmin ? <ManageRewards /> : <Navigate to="/login" />} />

          {/* Add more routes here later */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 WasteFlow Team. All rights reserved.
      </footer>
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

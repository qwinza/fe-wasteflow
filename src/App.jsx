import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>WF</div>
            WasteFlow
          </Link>
          <div className="nav-links">
            <Link to="/warga" className="nav-link">Portal Warga</Link>
            <Link to="/admin" className="nav-link">Portal Admin</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/warga" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

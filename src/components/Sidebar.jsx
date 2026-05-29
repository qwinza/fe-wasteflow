import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  MapPin, 
  Gift, 
  LogOut, 
  Leaf, 
  ChevronRight,
  History,
  MessageSquare
} from 'lucide-react';

const Sidebar = ({ user, logOut }) => {
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');

  const adminLinks = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/manage-categories", icon: <Settings size={20} />, label: "Kategori" },
    { to: "/manage-locations", icon: <MapPin size={20} />, label: "Lokasi TPS" },
    { to: "/manage-rewards", icon: <Gift size={20} />, label: "Katalog Reward" },
    { to: "/admin/reviews", icon: <MessageSquare size={20} />, label: "Review User" },
  ];

  const userLinks = [
    { to: "/warga", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/setor", icon: <Leaf size={20} />, label: "Setor Sampah" },
    { to: "/tukar-poin", icon: <Gift size={20} />, label: "Tukar Poin" },
    { to: "/history-redeem", icon: <History size={20} />, label: "History Redeem" },
  ];

  const activeLinks = isAdmin ? adminLinks : userLinks;

  return (
    <div className="sidebar">
      {/* Brand Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '12px', display: 'flex' }}>
          <Leaf size={24} />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>WasteFlow</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', padding: '0 0.75rem' }}>
          Menu Utama
        </p>
        
        {activeLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'var(--primary)' : 'transparent',
              transition: 'all 0.2s ease',
              fontWeight: isActive ? '700' : '500',
              boxShadow: isActive ? '0 8px 20px rgba(16, 185, 129, 0.25)' : 'none'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {link.icon}
              <span>{link.label}</span>
            </div>
            {({ isActive }) => isActive && <ChevronRight size={16} />}
          </NavLink>
        ))}
      </div>

      {/* User Info & Logout Section */}
      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '1rem', 
          background: 'var(--background)', 
          borderRadius: '16px',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary-dark)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: '700'
          }}>
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nama}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isAdmin ? 'Administrator' : 'Warga'}</p>
          </div>
        </div>

        <button 
          onClick={logOut}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1rem', 
            borderRadius: '14px',
            border: 'none',
            background: 'transparent',
            color: 'var(--danger)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

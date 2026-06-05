import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Leaf, ArrowRight } from 'lucide-react';
import authService from '../services/auth.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/warga';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)'
      }} className="fade-in">
        
        {/* Left Side - Visual */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }} className="login-visual-panel">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'inline-flex', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '16px', 
              backdropFilter: 'blur(10px)',
              marginBottom: '2rem'
            }}>
              <Leaf size={48} color="white" />
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', lineHeight: 1.2 }}>
              Ubah Sampah<br/>Menjadi Berkah
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
              Bergabunglah dengan WasteFlow dan mulai perjalanan Anda dalam mengelola sampah dengan lebih cerdas dan menguntungkan.
            </p>
          </div>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: '1',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }} className="form-panel">
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>Selamat Datang Kembali</h2>
            <p style={{ color: 'var(--text-muted)' }}>Silakan masuk ke akun WasteFlow Anda</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fee2e2', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border)',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    fontFamily: 'inherit'
                  }}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.backgroundColor = '#f8fafc'; }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    borderRadius: '12px',
                    border: '2px solid var(--border)',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    fontFamily: 'inherit'
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.backgroundColor = '#f8fafc'; }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--primary)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              disabled={loading}
            >
              {loading ? 'Memproses...' : (
                <>
                  Masuk <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
            Belum punya akun? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .login-visual-panel {
            display: none !important;
          }
          .form-panel {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;


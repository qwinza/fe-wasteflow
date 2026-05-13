import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, MapPin, AlertCircle, CheckCircle, Leaf, ArrowRight } from 'lucide-react';
import authService from '../services/auth.service';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    alamat: '',
    role: 'WARGA'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signup(
        formData.nama,
        formData.email,
        formData.password,
        formData.alamat,
        formData.role
      );
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    borderRadius: '12px',
    border: '2px solid var(--border)',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#f8fafc',
    fontFamily: 'inherit'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.backgroundColor = '#ffffff';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.backgroundColor = '#f8fafc';
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
        }} className="register-visual-panel">
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
              Mulai Langkah<br/>Hijau Anda
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
              Daftar sekarang untuk ikut serta dalam gerakan WasteFlow dan berikan dampak positif bagi lingkungan di sekitar Anda.
            </p>
          </div>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: '1',
          padding: '3rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto'
        }} className="form-panel">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>Daftar Akun</h2>
            <p style={{ color: 'var(--text-muted)' }}>Bergabunglah dengan gerakan WasteFlow</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fee2e2', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--primary)' }}>
              <CheckCircle size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Registrasi berhasil! Mengalihkan ke halaman login...</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="nama"
                  style={inputStyle}
                  placeholder="Nama Lengkap Anda"
                  value={formData.nama}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  style={inputStyle}
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="password"
                  style={inputStyle}
                  placeholder="Min. 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Alamat</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="alamat"
                  style={inputStyle}
                  placeholder="Jl. Merdeka No. 123"
                  value={formData.alamat}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>Daftar Sebagai</label>
              <select 
                name="role" 
                style={{
                  ...inputStyle,
                  paddingLeft: '1rem',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem top 50%',
                  backgroundSize: '0.65rem auto'
                }} 
                value={formData.role} 
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="WARGA">Warga (Penyetor Sampah)</option>
                <option value="ADMIN">Admin (Pengelola TPS)</option>
              </select>
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
                cursor: loading || success ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                fontFamily: 'inherit',
                opacity: loading || success ? 0.7 : 1
              }}
              onMouseOver={(e) => { if(!loading && !success) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={(e) => { if(!loading && !success) e.currentTarget.style.transform = 'translateY(0)' }}
              disabled={loading || success}
            >
              {loading ? 'Memproses...' : (
                <>
                  Daftar Sekarang <UserPlus size={20} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
            Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .register-visual-panel {
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

export default Register;

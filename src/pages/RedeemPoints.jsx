import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle, TrendingUp, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import wasteService from '../services/waste.service';

const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [message, setMessage] = useState(null);
  const currentUser = authService.getCurrentUser();

  // Placeholder rewards data
  const rewards = [
    {
      id: 1,
      name: 'Voucher Listrik Rp 50.000',
      points: 5000,
      category: 'Utilitas',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=300',
      description: 'Token listrik prabayar untuk kebutuhan TPS/Warga.'
    },
    {
      id: 2,
      name: 'Paket Sembako Premium',
      points: 7500,
      category: 'Logistik',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
      description: 'Beras 5kg, Minyak 2L, dan Gula 1kg.'
    },
    {
      id: 3,
      name: 'Alat Kebersihan Baru',
      points: 3000,
      category: 'Peralatan',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300',
      description: 'Satu set sapu, pengki, dan tempat sampah pilah.'
    },
    {
      id: 4,
      name: 'Pupuk Kompos Organik (10kg)',
      points: 2000,
      category: 'Pertanian',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=300',
      description: 'Pupuk berkualitas hasil olahan sampah organik.'
    },
    {
      id: 5,
      name: 'Voucher Belanja Rp 100.000',
      points: 9000,
      category: 'Voucher',
      image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=300',
      description: 'Dapat digunakan di minimarket rekanan WasteFlow.'
    },
    {
      id: 6,
      name: 'Tong Sampah Bio-Degradable',
      points: 4500,
      category: 'Peralatan',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300',
      description: 'Tempat sampah modern untuk mempermudah pemilahan.'
    }
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await wasteService.getDepositsByUser(currentUser.id);
        const total = res.data.reduce((acc, curr) => acc + (curr.points || 0), 0);
        setPoints(total);
      } catch (e) {
        console.error("Error fetching points", e);
        setPoints(12500); // Demo fallback
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchPoints();
    }
  }, [currentUser]);

  const handleRedeem = (reward) => {
    if (points < reward.points) {
      setMessage({ type: 'error', text: 'Poin TPS Anda tidak cukup untuk menukarkan reward ini.' });
      return;
    }

    setRedeeming(reward.id);
    
    // Simulate API call
    setTimeout(() => {
      setPoints(prev => prev - reward.points);
      setMessage({ type: 'success', text: `Berhasil! ${reward.name} telah diproses untuk TPS Anda.` });
      setRedeeming(null);
      
      // Clear message after 3s
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p>Memuat Katalog Reward...</p>
      </div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/warga" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Award size={20} color="var(--primary)" />
          <span style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Saldo Poin TPS: {points.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)' }}>
          Penukaran Reward <span style={{ color: 'var(--primary)' }}>TPS</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tukarkan poin hasil pengelolaan sampah TPS Anda dengan berbagai reward menarik.</p>
      </div>

      {message && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.25rem', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <span style={{ fontWeight: '600' }}>{message.text}</span>
          <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}

      {/* Rewards Grid */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShoppingBag color="var(--primary)" /> Katalog Reward Tersedia
      </h3>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {rewards.map(reward => (
          <div key={reward.id} className="card" style={{ 
            padding: '0', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }} onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
          }}>
            <div style={{ height: '180px', width: '100%', position: 'relative' }}>
              <img src={reward.image} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'rgba(255,255,255,0.9)', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '99px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                color: 'var(--text)',
                backdropFilter: 'blur(4px)'
              }}>
                {reward.category}
              </div>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text)' }}>{reward.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{reward.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Biaya</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{reward.points.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Poin</span></span>
                </div>
                
                <button 
                  onClick={() => handleRedeem(reward)}
                  disabled={redeeming === reward.id || points < reward.points}
                  style={{ 
                    padding: '0.7rem 1.2rem', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: points < reward.points ? '#f1f5f9' : 'var(--primary)', 
                    color: points < reward.points ? '#94a3b8' : 'white',
                    fontWeight: '700',
                    cursor: points < reward.points ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {redeeming === reward.id ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                      Proses...
                    </>
                  ) : points < reward.points ? 'Poin Kurang' : 'Tukarkan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RedeemPoints;

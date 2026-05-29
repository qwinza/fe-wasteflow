import React, { useState, useEffect } from 'react';
import {
  History,
  Gift,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ticket,
  CalendarDays,
  Coins,
  Search,
  Wallet,
  ShieldCheck,
  Info,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import rewardService from '../services/reward.service';
import wasteService from '../services/waste.service';
import authService from '../services/auth.service';

// Helper: render status badge
const StatusBadge = ({ status }) => {
  const config = {
    SUCCESS: {
      label: 'Success',
      bg: '#ecfdf5',
      color: '#065f46',
      border: '#6ee7b7',
      icon: <CheckCircle2 size={13} />,
    },
    PENDING: {
      label: 'Pending',
      bg: '#fffbeb',
      color: '#92400e',
      border: '#fcd34d',
      icon: <Clock size={13} />,
    },
    USED: {
      label: 'Used',
      bg: '#eff6ff',
      color: '#1e40af',
      border: '#93c5fd',
      icon: <CheckCircle2 size={13} />,
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: '#fef2f2',
      color: '#991b1b',
      border: '#fca5a5',
      icon: <XCircle size={13} />,
    },
  };
  const key = (status || 'SUCCESS').toUpperCase();
  const c = config[key] || config.SUCCESS;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.35rem 0.8rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {c.icon}
      {c.label}
    </span>
  );
};

const RedeemHistory = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch User Deposits (Earned Points)
        const resDeposits = await wasteService.getDepositsByUser(userId);
        const depositData = Array.isArray(resDeposits.data) ? resDeposits.data : [];
        const totalEarned = depositData.reduce((acc, curr) => acc + (curr.points || 0), 0);

        // Fetch User Redemptions (Spent Points)
        const resRedemptions = await rewardService.getUserRedemptions(userId);
        const redemptionData = Array.isArray(resRedemptions.data) ? resRedemptions.data : [];
        
        // Sort newest first
        redemptionData.sort((a, b) => new Date(b.redemptionDate) - new Date(a.redemptionDate));
        
        const totalSpent = redemptionData.reduce((acc, curr) => acc + (curr.pointsUsed || 0), 0);

        setPoints(totalEarned - totalSpent);
        setRedemptions(redemptionData);
      } catch (err) {
        console.error('Error fetching redemption history:', err);
        setError('Gagal memuat riwayat penukaran. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const filtered = redemptions.filter((r) => {
    const rewardName = r.reward?.name || '';
    return rewardName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalSpent = redemptions.reduce((acc, r) => acc + (r.pointsUsed || 0), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--primary-light)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto',
            }}
          />
          <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Memuat riwayat penukaran...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingBottom: '5rem', maxWidth: '1200px' }}>
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '3rem',
        padding: '1rem 0.5rem 0 0.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
              <History size={20} />
            </div>
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layanan Penukaran
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            History <span style={{ color: 'var(--primary)' }}>Redeem</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Daftar kupon dan riwayat transaksi penukaran poin Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/tukar-poin" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            textDecoration: 'none', 
            color: 'var(--primary)', 
            fontWeight: '700',
            padding: '0.8rem 1.2rem',
            borderRadius: '14px',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Gift size={18} /> Katalog Reward
          </Link>
          <Link to="/warga" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            textDecoration: 'none', 
            color: 'var(--text-muted)', 
            fontWeight: '700',
            padding: '0.8rem 1.2rem',
            borderRadius: '14px',
            background: 'white',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ArrowLeft size={18} /> Kembali
          </Link>
        </div>
      </div>

      {/* Centered Single Column Layout */}
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Error message if any */}
        {error && (
          <div style={{ 
            marginBottom: '2rem', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            background: '#fef2f2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontWeight: '600'
          }}>
            <AlertCircle size={24} />
            {error}
          </div>
        )}

        {/* Search bar matching RedeemPoints style */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari nama reward yang telah ditukarkan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem 0.8rem 3rem', 
                borderRadius: '12px', 
                border: '1px solid var(--border)', 
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.id} style={{ 
                background: 'white',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                height: item.reward?.imageUrl ? '180px' : 'auto',
                minHeight: item.reward?.imageUrl ? '180px' : '140px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
              >
                {/* Reward Image or standard Icon Box */}
                {item.reward?.imageUrl ? (
                  <div style={{ width: '240px', position: 'relative', flexShrink: 0 }}>
                    <img src={item.reward.imageUrl} alt={item.reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>
                      {item.reward.category}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '120px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Gift size={36} color="var(--primary)" />
                  </div>
                )}

                {/* Body Content */}
                <div style={{ padding: '1.25rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  {/* Top Row: Name and Points */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {(!item.reward?.imageUrl || !item.reward) && (
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', marginBottom: '0.5rem' }}>
                          {item.reward?.category || 'Umum'}
                        </span>
                      )}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', lineHeight: '1.2' }}>{item.reward?.name || '—'}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        <CalendarDays size={13} />
                        <span>
                          Redeem: {item.redemptionDate
                            ? new Date(item.redemptionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--danger)' }}>-{item.pointsUsed?.toLocaleString()}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>PTS</span>
                    </div>
                  </div>

                  {/* Middle: Short Description or Voucher details */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 0.85rem 0', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                    {item.reward?.description || 'Tunjukkan kupon ini ke petugas TPS terdekat untuk mengklaim hadiah Anda.'}
                  </p>

                  {/* Bottom Row: Coupon Code Ticket and Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '0.75rem' }}>
                    {/* Ticket Badge */}
                    {item.couponCode || item.kodeKupon ? (
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        background: '#eff6ff', 
                        color: '#1d4ed8',
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '10px',
                        fontSize: '0.8rem', 
                        fontWeight: '800', 
                        letterSpacing: '0.05em',
                        border: '1px dashed #93c5fd',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(item.couponCode || item.kodeKupon);
                        alert('Kode kupon berhasil disalin!');
                      }}
                      title="Klik untuk menyalin"
                      >
                        <Ticket size={14} />
                        <span>{(item.couponCode || item.kodeKupon).toUpperCase()}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}

                    {/* Status */}
                    <StatusBadge status={item.status || 'SUCCESS'} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <History size={48} style={{ opacity: 0.15, color: 'var(--text)' }} />
                <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.05rem' }}>
                  {searchTerm ? 'Tidak ada riwayat penukaran yang cocok.' : 'Belum ada riwayat penukaran reward.'}
                </p>
                {!searchTerm && (
                  <Link to="/tukar-poin" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
                      Tukar Poin Sekarang <ChevronRight size={16} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemHistory;

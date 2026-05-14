import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Gift, 
  Wallet, 
  Info,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import rewardService from '../services/reward.service';
import wasteService from '../services/waste.service';
import authService from '../services/auth.service';

const RedeemPoints = () => {
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [message, setMessage] = useState(null);
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch User Deposits (Earned Points)
        const resDeposits = await wasteService.getDepositsByUser(userId);
        const depositData = Array.isArray(resDeposits.data) ? resDeposits.data : [];
        const totalEarned = depositData.reduce((acc, curr) => acc + (curr.points || 0), 0);

        // Fetch User Redemptions (Spent Points)
        const resRedemptions = await rewardService.getUserRedemptions(userId);
        const redemptionData = Array.isArray(resRedemptions.data) ? resRedemptions.data : [];
        const totalSpent = redemptionData.reduce((acc, curr) => acc + (curr.pointsUsed || 0), 0);

        setPoints(totalEarned - totalSpent);

        // Fetch Rewards
        const resRewards = await rewardService.getRewards();
        setRewards(Array.isArray(resRewards.data) ? resRewards.data : []);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [userId]);

  const handleRedeem = async (reward) => {
    if (points < reward.points) {
      setMessage({ type: 'error', text: 'Poin Anda tidak cukup untuk menukarkan reward ini.' });
      return;
    }
    
    setRedeeming(reward.id);
    try {
      await rewardService.redeemReward(reward.id, userId);
      
      setMessage({ 
        type: 'success', 
        text: `Berhasil! ${reward.name} telah berhasil ditukarkan. Silakan hubungi petugas TPS untuk pengambilan.` 
      });
      
      setPoints(prev => prev - reward.points);
      setRewards(prev => prev.map(r => 
        r.id === reward.id ? { ...r, stock: r.stock - 1 } : r
      ));
    } catch (err) {
      console.error("Redemption failed", err);
      setMessage({ type: 'error', text: 'Gagal melakukan penukaran. Silakan coba lagi nanti.' });
    } finally {
      setRedeeming(null);
    }
  };

  const getDefaultImage = (category) => {
    switch (category) {
      case 'Voucher': return 'https://images.unsplash.com/photo-1626000289354-944415891398?w=500'; // Voucher/Coupon
      case 'Logistik': return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'; // Logistics/Rice
      case 'Peralatan': return 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500'; // Tools
      case 'Pertanian': return 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'; // Fertilizer
      default: return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500'; // Generic
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
       <div className="spinner"></div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ paddingBottom: '5rem', maxWidth: '1200px' }}>
      
      {/* Admin-style Header Section */}
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
              <ShoppingBag size={20} />
            </div>
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layanan Penukaran
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Katalog <span style={{ color: 'var(--primary)' }}>Reward</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Tukarkan poin hasil pengelolaan sampah dengan hadiah menarik.</p>
        </div>

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

      <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem' }}>
        
        {/* Left Column: Info & Stats */}
        <aside>
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border)', background: '#fff' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px' }}>Informasi Poin Anda</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '16px' }}>
                <Wallet size={32} />
              </div>
              <div>
                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text)' }}>{points.toLocaleString()}</span>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginLeft: '0.5rem' }}>PTS</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '16px', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={20} />
                <span style={{ fontWeight: '700' }}>Status: Warga Aktif</span>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Anda memenuhi syarat untuk menukarkan poin dengan reward apa pun di katalog.</p>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', background: '#f8fafc', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Info size={20} color="var(--primary)" /> Panduan Penukaran
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                'Pilih barang yang tersedia di katalog.',
                'Pastikan saldo poin mencukupi biaya penukaran.',
                'Klik "Tukar Sekarang" dan konfirmasi.',
                'Tunjukkan bukti penukaran ke petugas TPS terdekat.',
                'Ambil barang reward Anda di lokasi.'
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '24px', height: '24px', background: 'white', border: '2px solid var(--primary)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Catalog List */}
        <div>
          {message && (
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1.5rem', 
              borderRadius: '16px', 
              background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: message.type === 'success' ? '#065f46' : '#991b1b',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontWeight: '600'
            }}>
              {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rewards.map(reward => (
              <div key={reward.id} style={{ 
                background: 'white',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                height: reward.imageUrl ? '180px' : 'auto',
                minHeight: reward.imageUrl ? '180px' : '140px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                {reward.imageUrl && (
                  <div style={{ width: '240px', position: 'relative', flexShrink: 0 }}>
                    <img src={reward.imageUrl} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>
                      {reward.category}
                    </div>
                  </div>
                )}

                <div style={{ padding: reward.imageUrl ? '1.5rem 2.5rem' : '2rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      {!reward.imageUrl && (
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', marginBottom: '0.5rem' }}>
                          {reward.category}
                        </span>
                      )}
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)' }}>{reward.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>{reward.points?.toLocaleString()}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>PTS</span>
                    </div>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                    {reward.description || 'Barang reward resmi dari pengelola TPS Wilayah.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Stok: <span style={{ color: reward.stock > 0 ? 'var(--text)' : 'var(--danger)' }}>{reward.stock} unit tersedia</span>
                    </div>
                    <button 
                      onClick={() => handleRedeem(reward)}
                      disabled={points < reward.points || reward.stock <= 0}
                      style={{ 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '12px', 
                        border: 'none', 
                        background: points >= reward.points && reward.stock > 0 ? 'var(--primary)' : '#f1f5f9',
                        color: points >= reward.points && reward.stock > 0 ? 'white' : '#94a3b8',
                        fontWeight: '800',
                        cursor: points >= reward.points && reward.stock > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {redeeming === reward.id ? 'Memproses...' : 'Tukar Sekarang'} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {rewards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed var(--border)' }}>
              <Gift size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Belum ada reward tersedia saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;

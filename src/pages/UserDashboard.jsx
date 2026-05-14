import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Activity, 
  Sparkles, 
  Leaf, 
  ArrowRight,
  Gift,
  CheckCircle,
  PlusCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';
import wasteService from '../services/waste.service';
import authService from '../services/auth.service';
import rewardService from '../services/reward.service';
import { formatCategory } from '../utils/formatters';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedTpsId, setSelectedTpsId] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [globalPoints, setGlobalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const resLoc = await wasteService.getLocations();
        const locs = resLoc.data || [];
        setLocations(locs);
        
        if (locs.length > 0 && !selectedTpsId) {
          setSelectedTpsId(locs[0].id.toString());
        }

        // Fetch Global Points (Deposits - Redemptions)
        const resDeposits = await wasteService.getDepositsByUser(userId);
        const depositData = Array.isArray(resDeposits.data) ? resDeposits.data : [];
        setHistory(depositData);
        
        const totalEarned = depositData.length > 0 
          ? depositData.reduce((acc, curr) => acc + (curr.points || 0), 0)
          : 0;

        const resRedemptions = await rewardService.getUserRedemptions(userId);
        const redemptionData = Array.isArray(resRedemptions.data) ? resRedemptions.data : [];
        const totalSpent = redemptionData.reduce((acc, curr) => acc + (curr.pointsUsed || 0), 0);

        setGlobalPoints(totalEarned - totalSpent);

        // Fetch Real Rewards
        const resRewards = await rewardService.getRewards();
        setRewards(Array.isArray(resRewards.data) ? resRewards.data : []);

        const recRes = await wasteService.getRecommendations(userId);
        setRecommendation(recRes?.data?.recommendation || "Belum ada rekomendasi.");
      } catch (err) {
        console.error("Error fetching initial dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  const totalPoints = globalPoints;
  const currentTps = locations.find(l => l.id.toString() === selectedTpsId.toString());
  const currentTpsName = currentTps?.namaLokasi || 'Wilayah';

  const getDefaultImage = (category) => {
    switch (category) {
      case 'Voucher': return 'https://images.unsplash.com/photo-1626000289354-944415891398?w=500';
      case 'Logistik': return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';
      case 'Peralatan': return 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500';
      case 'Pertanian': return 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500';
      default: return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500';
    }
  };

  if (loading && history.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid var(--primary-light)', 
          borderTop: '5px solid var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          margin: '0 auto 1.5rem auto' 
        }}></div>
        <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Menyiapkan Dashboard Anda...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ padding: '2rem', paddingBottom: '5rem' }}>
      
      {/* Admin-style Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '3.5rem',
        padding: '1rem 0.5rem 0 0.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
              <TrendingUp size={20} />
            </div>
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Warga Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Dashboard <span style={{ color: 'var(--primary)' }}>Warga</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Selamat datang, <b>{currentUser?.namaLengkap}</b>. Pantau kontribusi Anda.</p>
        </div>
      </div>

      {/* Poin & Quick Action Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)', color: 'white', border: 'none', padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Poin Saya</p>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0.5rem 0' }}>{globalPoints.toLocaleString()} <span style={{ fontSize: '1.2rem', fontWeight: '600', opacity: 0.8 }}>PTS</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '10px', display: 'inline-flex' }}>
              <CheckCircle size={18} /> <span>Poin Terverifikasi</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '24px' }}>
            <Award size={48} />
          </div>
        </div>

        <Link to="/setor" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ 
            height: '100%', 
            background: 'white', 
            border: '2px solid var(--primary)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }} onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--primary-light)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
          }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
              <PlusCircle size={24} />
            </div>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem', textAlign: 'center', lineHeight: 1.2 }}>Mulai Setor<br/>Sampah</span>
          </div>
        </Link>
      </div>

      {/* Smaller Insights Area */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid var(--border)', 
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{ background: 'var(--secondary-light)', padding: '0.6rem', borderRadius: '12px', color: 'var(--secondary)' }}>
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wawasan Wilayah</span>
            <p style={{ fontSize: '1.05rem', color: 'var(--text)', fontWeight: '500', marginTop: '0.2rem' }}>
              "{recommendation}"
            </p>
          </div>
          <div style={{ color: 'var(--primary)', opacity: 0.3 }}>
            <Leaf size={32} />
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Gift size={36} color="var(--primary)" /> Katalog Reward Populer
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>Tukarkan poin kolektif warga untuk manfaat bersama</p>
          </div>
          <Link to="/tukar-poin" className="btn btn-outline" style={{ borderRadius: '12px' }}>
            Lihat Semua <ArrowRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {rewards.slice(0, 3).map(reward => (
            <div key={reward.id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
              {reward.imageUrl && (
                <div style={{ position: 'relative' }}>
                  <img src={reward.imageUrl} alt={reward.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {reward.category}
                  </div>
                </div>
              )}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!reward.imageUrl && (
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800', display: 'inline-block', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
                    {reward.category}
                  </span>
                )}
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>{reward.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {reward.description || 'Tukarkan poin Anda dengan reward menarik ini.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>{reward.points}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>PTS</span>
                  </div>
                  <Link to="/tukar-poin">
                    <button className="btn" style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '10px',
                      background: globalPoints >= (reward.points || 0) ? 'var(--primary)' : '#f1f5f9',
                      color: globalPoints >= (reward.points || 0) ? 'white' : '#94a3b8',
                      cursor: globalPoints >= (reward.points || 0) ? 'pointer' : 'not-allowed',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      Tukar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content: History & Feedback */}
      <div className="grid-2" style={{ gap: '3rem', gridTemplateColumns: '1.5fr 1fr' }}>
        
        {/* History Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={28} color="var(--primary)" /> Riwayat Kontribusi
            </h2>
          </div>
          
          <div className="card table-container" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kategori</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Berat</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Poin</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx === history.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="badge badge-primary">{formatCategory(item.category?.namaKategori || 'Umum')}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>{item.berat} kg</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '800', color: 'var(--primary)' }}>+{item.points}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Belum ada riwayat kontribusi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Feedback Section */}
        <section>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Masukan Warga</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Bantu kami meningkatkan layanan TPS Anda.</p>
          </div>
          <FeedbackForm tpsId={selectedTpsId} />
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { Leaf, Award, MessageSquare, History, PlusCircle, ArrowRight, MapPin, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import FeedbackForm from '../components/FeedbackForm';
import wasteService from '../services/waste.service';
import authService from '../services/auth.service';
import { formatCategory } from '../utils/formatters';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [allHistory, setAllHistory] = useState([]); // Store original data
  const [locations, setLocations] = useState([]);
  const [selectedTpsId, setSelectedTpsId] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser() || {};
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Locations
        const locRes = await wasteService.getLocations();
        const locs = Array.isArray(locRes?.data) ? locRes.data : [];
        setLocations(locs);
        if (locs.length > 0 && !selectedTpsId) {
          setSelectedTpsId(currentUser?.locationId || locs[0].id.toString());
        }

        // Fetch Recommendations
        const recRes = await wasteService.getRecommendations(userId);
        setRecommendation(recRes?.data?.recommendation || "Belum ada rekomendasi.");
      } catch (err) {
        console.error("Error fetching initial data", err);
      }
    };

    if (userId) fetchInitialData();
  }, [userId]);

  // Fetch history whenever selectedTpsId changes
  useEffect(() => {
    const fetchTpsData = async () => {
      if (!selectedTpsId) {
        console.log("No TPS ID selected yet.");
        return;
      }

      try {
        console.log("Fetching history for TPS ID:", selectedTpsId);
        setLoading(true);
        const historyRes = await wasteService.getDepositsByLocation(selectedTpsId);
        console.log("History received:", historyRes?.data);
        const data = Array.isArray(historyRes?.data) ? historyRes.data : [];
        setHistory(data);
      } catch (err) {
        console.error("Error fetching TPS history", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTpsData();
  }, [selectedTpsId]);

  const totalPoints = Array.isArray(history) ? history.reduce((acc, curr) => acc + (curr.points || 0), 0) : 0;
  const currentTpsName = locations.find(l => l.id.toString() === selectedTpsId.toString())?.namaLokasi || 'Wilayah';

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p style={{ fontWeight: '500' }}>Memuat Dashboard Warga...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ padding: '2rem' }}>

      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
        color: 'white',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
          <Leaf size={150} color="white" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.2rem', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <MapPin size={40} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.25rem', color: 'white' }}>Panel TPS {currentTpsName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '500' }}>Pilih Wilayah TPS:</span>
              <select
                value={selectedTpsId}
                onChange={(e) => setSelectedTpsId(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} style={{ color: 'black' }}>{loc.namaLokasi}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <Link to="/setor" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.9rem 1.8rem',
              background: 'white',
              color: 'var(--primary)',
              borderRadius: '14px',
              border: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s'
            }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; }}>
              <PlusCircle size={22} /> Setor Sampah
            </button>
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-3" style={{ marginBottom: '3rem', gap: '2rem' }}>
        <div className="card glass-card" style={{
          gridColumn: 'span 2',
          border: '1px solid var(--border)',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
            <span role="img" aria-label="light">💡</span> Rekomendasi Pengelolaan TPS
          </h3>
          <RecommendationCard message={recommendation} />
        </div>

        <div className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Award size={48} color="#fbbf24" />
          </div>
          <h3 style={{ opacity: 0.7, fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo Poin TPS</h3>
          <h1 style={{ color: 'white', fontSize: '4rem', fontWeight: '900', margin: '0.5rem 0', lineHeight: 1 }}>{totalPoints}</h1>
          <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '99px', color: '#34d399', fontWeight: '700', fontSize: '0.9rem' }}>
            Siap Ditukarkan
          </div>
        </div>
      </div>

      {/* Reward Section - The New "Kolom Penukaran" */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: '800' }}>
            <Gift size={32} color="var(--primary)" /> Katalog Reward TPS
          </h2>
          <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Tukarkan poin kolektif warga di sini</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {/* Placeholder Rewards */}
          {[
            { id: 1, name: 'Voucher Listrik 50rb', pts: 5000, img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300' },
            { id: 2, name: 'Paket Sembako Wilayah', pts: 7500, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' },
            { id: 3, name: 'Peralatan Kebersihan', pts: 3000, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300' }
          ].map(reward => (
            <div key={reward.id} className="card" style={{
              padding: '0',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              transition: 'transform 0.3s'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <img src={reward.img} alt={reward.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{reward.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.1rem' }}>{reward.pts} Pts</span>
                  <button style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: totalPoints >= reward.pts ? 'var(--primary)' : '#f1f5f9',
                    color: totalPoints >= reward.pts ? 'white' : '#94a3b8',
                    fontWeight: '700',
                    cursor: totalPoints >= reward.pts ? 'pointer' : 'not-allowed'
                  }}>
                    Tukar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link to="/tukar-poin" style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            borderRadius: '20px',
            border: '2px dashed var(--border)',
            gap: '1rem',
            color: 'var(--text-muted)',
            fontWeight: '600',
            transition: 'all 0.3s'
          }} onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <ArrowRight size={24} color="var(--primary)" />
            </div>
            Lihat Semua Reward
          </Link>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid-2" style={{ gap: '2.5rem' }}>

        {/* Deposit History */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '700' }}>
              <History size={24} color="var(--primary)" /> Riwayat TPS
            </h2>
          </div>
          <div className="card" style={{ padding: '0', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tanggal</th>
                    <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Sampah</th>
                    <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Berat</th>
                    <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? history.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem' }}>{item.namaSampah || 'Tanpa Nama'}</span>
                          <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                            {formatCategory(item.category?.namaKategori) || 'Umum'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', fontWeight: '500' }}>{item.berat} kg</td>
                      <td style={{ padding: '1.2rem 1.5rem', fontWeight: '700', color: 'var(--primary)' }}>+{item.points}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Belum ada setoran wilayah.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
            <MessageSquare size={24} color="var(--primary)" /> Suara Warga TPS
          </h2>
          <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Warga dapat mengirimkan masukan atau keluhan terkait pengelolaan sampah di wilayah TPS ini.
            </p>
            <FeedbackForm userId={currentUser?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

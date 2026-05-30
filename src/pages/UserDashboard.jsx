import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, Award } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import FeedbackForm from '../components/FeedbackForm';

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const USER_ID = 1; // Mock logged in user

  useEffect(() => {
    // Mock Data for User History to demonstrate the UI immediately
    const mockHistory = [
      { id: 1, tanggal: '2026-04-25', category: { namaKategori: 'Anorganik' }, berat: 2.5, points: 50 },
      { id: 2, tanggal: '2026-04-27', category: { namaKategori: 'Organik' }, berat: 5.0, points: 50 },
      { id: 3, tanggal: '2026-04-28', category: { namaKategori: 'Anorganik' }, berat: 1.2, points: 24 }
    ];
    setHistory(mockHistory);

    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(`/api/v1/recommendations/${USER_ID}`);
        setRecommendation(res.data.recommendation);
      } catch (e) {
        setRecommendation("Anda banyak menyetor plastik, coba kurangi penggunaan botol sekali pakai.");
      }
    };
    fetchRecommendation();
  }, []);

  const totalPoints = history.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Leaf color="var(--primary)" size={32} />
        <h1>Warga Dashboard</h1>
      </div>
      
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <RecommendationCard message={recommendation} />
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #34d399 100%)', color: 'white', border: 'none' }}>
          <Award size={48} style={{ marginBottom: '1rem' }} />
          <h3>Total Poin Terkumpul</h3>
          <h1 style={{ color: 'white', margin: 0 }}>{totalPoints}</h1>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <h2>Riwayat Setoran</h2>
          <div className="card table-container">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Berat (kg)</th>
                  <th>Poin</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td>{item.tanggal}</td>
                    <td><span style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', borderRadius: '1rem', fontSize: '0.875rem' }}>{item.category.namaKategori}</span></td>
                    <td>{item.berat}</td>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>+{item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2>Kirim Masukan (Feedback)</h2>
          <div className="card">
            <FeedbackForm userId={USER_ID} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

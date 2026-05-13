import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Trash2, TrendingUp, AlertTriangle, ArrowRight, MapPin, Plus, Settings, Gift } from 'lucide-react';
import OutboundForm from '../components/OutboundForm';
import wasteService from '../services/waste.service';
import { formatCategory } from '../utils/formatters';

const AdminDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [capacityData, setCapacityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await wasteService.getLocations();
        const data = res.data || [];
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]);
        }
      } catch (e) {
        console.error("Error fetching locations", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCapacity = async () => {
      if (!selectedLocation) return;
      try {
        const res = await wasteService.getCapacityReport(selectedLocation.id);
        setCapacityData(res.data);
      } catch (e) {
        console.error("Error fetching capacity data", e);
      }
    };
    fetchCapacity();
  }, [selectedLocation]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p style={{ fontWeight: '500' }}>Memuat Dashboard Admin...</p>
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
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text)' }}>
            Dashboard Admin
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Monitor operasional dan kapasitas TPS secara real-time.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <select 
                style={{ 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  minWidth: '220px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem top 50%',
                  backgroundSize: '0.65rem auto'
                }}
                value={selectedLocation?.id || ''}
                onChange={(e) => setSelectedLocation(locations.find(l => l.id == e.target.value))}
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.namaLokasi}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
          color: 'white', 
          border: 'none',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          transform: 'translateY(0)',
          transition: 'transform 0.3s'
        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ opacity: 0.9, fontWeight: '500' }}>Total Stok TPS</h3>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
              <Package size={24} color="white" />
            </div>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
            {capacityData?.currentTotalStock || 0} <span style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.9 }}>kg</span>
          </h1>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} /> Berdasarkan seluruh kategori
          </p>
        </div>
        
        {capacityData?.breakdown && Object.entries(capacityData.breakdown).map(([kategori, berat], idx) => (
          <div className="card" key={idx} style={{ 
            border: 'none', 
            borderBottom: `4px solid ${kategori === 'B3' ? 'var(--danger)' : 'var(--secondary)'}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{formatCategory(kategori)}</h3>
              <div style={{ padding: '0.5rem', background: kategori === 'hazardous' || kategori === 'B3' ? '#fee2e2' : '#dbeafe', borderRadius: '10px' }}>
                {kategori === 'hazardous' || kategori === 'B3' ? <AlertTriangle size={24} color="var(--danger)" /> : <Trash2 size={24} color="var(--secondary)" />}
              </div>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text)' }}>
              {berat} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>kg</span>
            </h2>
          </div>
        ))}
        
        {(!capacityData?.breakdown || Object.keys(capacityData.breakdown).length === 0) && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '150px', background: 'var(--surface)', border: '1px dashed var(--border)' }}>
            Belum ada data stok kategori.
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid-2" style={{ gap: '2.5rem' }}>
        
        {/* Outbound Form Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Catat Pengeluaran (Outbound)</h2>
          </div>
          <div className="card" style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <p style={{ marginBottom: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Gunakan formulir ini untuk mencatat sampah yang keluar dari TPS untuk mengurangi stok (misal: dibawa ke TPA, pabrik daur ulang, atau didonasikan).
            </p>
            <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <OutboundForm onOutboundSuccess={() => wasteService.getCapacityReport(selectedLocation.id).then(res => setCapacityData(res.data))} locationId={selectedLocation?.id} />
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Aksi Cepat</h2>
          
          <Link to="/manage-categories" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.2s',
              background: '#ffffff'
            }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px' }}>
                  <Settings size={24} color="var(--primary-dark)" />
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Kelola Kategori Sampah</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tambah, edit, atau hapus jenis sampah</p>
                </div>
              </div>
              <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%' }}>
                <ArrowRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          </Link>
          
          <Link to="/manage-locations" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.2s',
              background: '#ffffff'
            }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '12px' }}>
                  <MapPin size={24} color="var(--secondary)" />
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Kelola Lokasi TPS</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tambah atau edit titik lokasi TPS</p>
                </div>
              </div>
              <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%' }}>
                <ArrowRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          </Link>

          <Link to="/manage-rewards" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.2s',
              background: '#ffffff'
            }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px' }}>
                  <Gift size={24} color="#d97706" />
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Kelola Katalog Reward</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Atur hadiah dan biaya poin untuk TPS</p>
                </div>
              </div>
              <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%' }}>
                <ArrowRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          </Link>

          {/* Additional Info Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            marginTop: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} /> Ringkasan Sistem
            </h4>
            <p style={{ color: '#166534', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Semua operasional sistem berjalan dengan normal. Jangan lupa untuk mencatat pengeluaran sampah setiap harinya untuk menjaga akurasi kapasitas TPS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

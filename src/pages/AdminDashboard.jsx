import React, { useState, useEffect } from 'react';
import { Package, Trash2, TrendingUp, AlertTriangle, MapPin, Database, Activity, Info, Calendar } from 'lucide-react';
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
    <div className="container fade-in">
      
      {/* 1. Header & Location Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '3rem',
        padding: '0 0.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
              <Activity size={20} />
            </div>
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operational Overview
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Dashboard <span style={{ color: 'var(--primary)' }}>Admin</span>
          </h1>
        </div>
        
        <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: '10px', color: 'var(--primary-dark)' }}>
            <MapPin size={20} />
          </div>
          <select 
            style={{ 
              padding: '0.5rem 2rem 0.5rem 0.5rem', 
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              appearance: 'none',
              background: 'transparent',
              color: 'var(--text)'
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

      {/* 2. Main KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Main Capacity Card */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          color: 'white', 
          border: 'none',
          padding: '2rem'
        }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
            <Database size={150} />
          </div>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: '500', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Total Stok Tersimpan</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>{capacityData?.currentTotalStock || 0}</h1>
            <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>kg</span>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} color="var(--primary)" /> Terpantau Real-time
          </div>
        </div>

        {/* Category Breakdown Cards */}
        {capacityData?.breakdown && Object.entries(capacityData.breakdown).map(([kategori, berat], idx) => (
          <div className="card" key={idx} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: kategori === 'B3' ? 'rgba(239, 68, 68, 0.1)' : 'var(--background)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {kategori === 'B3' ? <AlertTriangle size={20} color="var(--danger)" /> : <Package size={20} color="var(--primary)" />}
              </div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>{formatCategory(kategori)}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>{berat}</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Operational Section */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Outbound Record Section */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary-dark)' }}>
              <Trash2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>Catat Pengeluaran</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kurangi stok untuk sampah yang dikirim ke TPA/Daur Ulang</p>
            </div>
          </div>
          
          <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <OutboundForm 
              onOutboundSuccess={() => wasteService.getCapacityReport(selectedLocation.id).then(res => setCapacityData(res.data))} 
              locationId={selectedLocation?.id} 
            />
          </div>
        </div>
        
        {/* Information / Status Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ flex: 1, padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--secondary-light)', padding: '0.6rem', borderRadius: '10px', color: 'var(--secondary)' }}>
                <Info size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text)' }}>Status Kapasitas</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ background: 'var(--background)', padding: '1.2rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Okupansi TPS</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {Math.round(((capacityData?.currentTotalStock || 0) / (selectedLocation?.kapasitasMaksKg || 1000)) * 100)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${((capacityData?.currentTotalStock || 0) / (selectedLocation?.kapasitasMaksKg || 1000)) * 100}%`, 
                    height: '100%', 
                    background: 'var(--primary)',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: 'var(--background)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Kapasitas Maks</p>
                  <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedLocation?.kapasitasMaksKg || 0} kg</p>
                </div>
                <div style={{ flex: 1, background: 'var(--background)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tersisa</p>
                  <p style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--secondary)' }}>
                    {(selectedLocation?.kapasitasMaksKg || 0) - (capacityData?.currentTotalStock || 0)} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help / Info */}
          <div style={{ 
            marginTop: 'auto',
            background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', 
            borderRadius: '20px', 
            padding: '1.5rem', 
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Butuh Bantuan?</h4>
            <p style={{ fontSize: '0.8rem', color: '#15803d', lineHeight: 1.5 }}>
              Pastikan setiap pengeluaran sampah dicatat agar kapasitas TPS tetap akurat. Jika ada kendala sistem, hubungi tim IT pusat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

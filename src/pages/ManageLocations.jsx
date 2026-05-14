import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MapPin, AlertCircle, CheckCircle, Database } from 'lucide-react';
import wasteService from '../services/waste.service';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ namaLokasi: '', koordinat: '', kapasitasMaksKg: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchLocations = async () => {
    try {
      const res = await wasteService.getLocations();
      setLocations(res.data);
    } catch (e) {
      console.error("Error fetching locations", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await wasteService.createLocation({
        namaLokasi: newLocation.namaLokasi,
        koordinat: newLocation.koordinat,
        kapasitasMaksKg: parseFloat(newLocation.kapasitasMaksKg)
      });
      setStatus({ type: 'success', message: 'Lokasi TPS berhasil ditambahkan!' });
      setNewLocation({ namaLokasi: '', koordinat: '', kapasitasMaksKg: '' });
      fetchLocations();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Gagal menambahkan lokasi.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p>Memuat data lokasi...</p>
      </div>
    </div>
  );

  return (
    <div className="container fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '14px' }}>
            <MapPin size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Manajemen Lokasi TPS</h1>
            <p style={{ color: 'var(--text-muted)' }}>Kelola titik penampungan dan kapasitas operasional.</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="card" style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Plus size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Tambah Titik TPS Baru</h2>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 0.8fr auto', gap: '1.5rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Nama Lokasi</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Misal: TPS Merdeka"
              value={newLocation.namaLokasi}
              onChange={(e) => setNewLocation({...newLocation, namaLokasi: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Alamat (Koordinat)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Jl. Merdeka No. 123"
              value={newLocation.koordinat}
              onChange={(e) => setNewLocation({...newLocation, koordinat: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Kapasitas (kg)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="1000"
              value={newLocation.kapasitasMaksKg}
              onChange={(e) => setNewLocation({...newLocation, kapasitasMaksKg: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', height: '45px' }} disabled={loading}>
            {loading ? '...' : 'Simpan Lokasi'}
          </button>
        </form>

        {status.message && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '12px', 
            background: status.type === 'success' ? 'var(--primary-light)' : '#fee2e2',
            color: status.type === 'success' ? 'var(--primary-dark)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Daftar TPS Aktif</h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', background: 'white', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            Total: <strong>{locations.length} Lokasi</strong>
          </div>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TPS / Lokasi</th>
                  <th style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alamat Operasional</th>
                  <th style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kapasitas Maksimal</th>
                  <th style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc, index) => (
                  <tr key={loc.id} style={{ background: index % 2 === 0 ? 'transparent' : 'rgba(248, 250, 252, 0.5)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1rem' }}>{loc.namaLokasi}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <MapPin size={16} style={{ flexShrink: 0 }} />
                        <span>{loc.koordinat}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span className="badge badge-success" style={{ fontWeight: '700', padding: '0.4rem 0.8rem' }}>
                        <Database size={14} style={{ marginRight: '0.4rem' }} /> {loc.kapasitasMaksKg} kg
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      {/* Trash icon remains UI-only as per user request */}
                      <button 
                        className="btn-icon"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: 'var(--danger)',
                          padding: '0.6rem',
                          borderRadius: '10px',
                          opacity: 0.5
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLocations;

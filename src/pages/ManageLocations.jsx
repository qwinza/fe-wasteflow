import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
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
      setLocations(res.data.data);
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
    } catch (err) {
      setStatus({ type: 'error', message: 'Gagal menambahkan lokasi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      try {
        await wasteService.deleteLocation(id);
        setStatus({ type: 'success', message: 'Lokasi berhasil dihapus!' });
        fetchLocations();
      } catch (err) {
        setStatus({ type: 'error', message: 'Gagal menghapus lokasi.' });
      }
    }
  };

  if (fetching) return <div className="container">Memuat data...</div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '1rem' }}>
          <MapPin color="var(--primary)" size={32} />
        </div>
        <div>
          <h1>Manajemen Lokasi TPS</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kelola titik-titik TPS dan kapasitas maksimal penampungan.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Tambah Lokasi TPS</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lokasi / TPS</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Misal: TPS Merdeka"
                value={newLocation.namaLokasi}
                onChange={(e) => setNewLocation({...newLocation, namaLokasi: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alamat / Koordinat</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Jl. Merdeka No. 123 atau koordinat lat,long"
                value={newLocation.koordinat}
                onChange={(e) => setNewLocation({...newLocation, koordinat: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kapasitas Maksimal (kg)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Misal: 1000"
                value={newLocation.kapasitasMaksKg}
                onChange={(e) => setNewLocation({...newLocation, kapasitasMaksKg: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Plus size={18} /> {loading ? 'Menambahkan...' : 'Simpan Lokasi'}
            </button>
          </form>
          {status.message && (
            <div style={{ marginTop: '1rem', color: status.type === 'success' ? 'var(--primary)' : 'var(--danger)', fontSize: '0.875rem' }}>
              {status.message}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Daftar TPS Aktif</h2>
          <div className="card table-container" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Lokasi</th>
                  <th>Alamat / Koordinat</th>
                  <th>Kapasitas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(loc => (
                  <tr key={loc.id}>
                    <td style={{ fontWeight: 500 }}>{loc.namaLokasi}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{loc.koordinat}</td>
                    <td style={{ fontWeight: 600 }}>{loc.kapasitasMaksKg} kg</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(loc.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                      >
                        <Trash2 size={18} />
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

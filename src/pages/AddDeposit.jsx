import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, Trash2, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import wasteService from '../services/waste.service';
import authService from '../services/auth.service';
import { formatCategory } from '../utils/formatters';

const AddDeposit = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    namaSampah: '',
    locationId: '',
    berat: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          wasteService.getCategories(),
          wasteService.getLocations()
        ]);
        console.log("Categories loaded:", catRes.data);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setLocations(Array.isArray(locRes.data) ? locRes.data : []);
      } catch (err) {
        console.error("Failed to load form data", err);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await wasteService.createDeposit(
        currentUser.id,
        parseInt(formData.categoryId),
        parseInt(formData.locationId),
        parseFloat(formData.berat),
        formData.namaSampah
      );
      setStatus({ type: 'success', message: 'Setoran berhasil dicatat!' });
      setTimeout(() => navigate('/warga'), 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Gagal mencatat setoran.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Memuat Formulir...</div>;

  return (
    <div className="container fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary-light)', borderRadius: '1rem', marginBottom: '1rem' }}>
            <PlusCircle size={32} color="var(--primary)" />
          </div>
          <h1>Setor Sampah</h1>
          <p style={{ color: 'var(--text-muted)' }}>Catat setoran sampah Anda dan kumpulkan poin!</p>
        </div>

        <div className="card glass-card">
          {status.message && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              background: status.type === 'success' ? 'var(--primary-light)' : '#fee2e2',
              color: status.type === 'success' ? 'var(--primary-dark)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span style={{ fontWeight: '500' }}>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Jenis Sampah</label>
              <div style={{ position: 'relative' }}>
                <Trash2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select 
                  className="form-control" 
                  style={{ paddingLeft: '3rem' }}
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{formatCategory(cat.namaKategori)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Sampah</label>
              <div style={{ position: 'relative' }}>
                <Trash2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="Contoh: Botol Plastik Bekas, Kardus"
                  value={formData.namaSampah}
                  onChange={(e) => setFormData({...formData, namaSampah: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lokasi TPS</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select 
                  className="form-control" 
                  style={{ paddingLeft: '3rem' }}
                  value={formData.locationId}
                  onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                  required
                >
                  <option value="">Pilih TPS</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.namaLokasi}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Berat Sampah (kg)</label>
              <div style={{ position: 'relative' }}>
                <Scale size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  className="form-control" 
                  style={{ paddingLeft: '3rem' }}
                  placeholder="Contoh: 2.5"
                  value={formData.berat}
                  onChange={(e) => setFormData({...formData, berat: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Memproses...' : 'Catat Setoran'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeposit;

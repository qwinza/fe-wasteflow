import React, { useState, useEffect } from 'react';
import { Send, Trash2, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import wasteService from '../services/waste.service';
import { formatCategory } from '../utils/formatters';

const OutboundForm = ({ onOutboundSuccess, locationId }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    berat: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await wasteService.getCategories();
        setCategories(res.data);
      } catch (e) {
        console.error("Error fetching categories", e);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationId) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await wasteService.createOutbound({
        locationId: parseInt(locationId),
        categoryId: parseInt(formData.categoryId),
        berat: parseFloat(formData.berat),
        tujuanDistribusi: formData.keterangan
      });
      
      setStatus({ type: 'success', message: 'Data pengeluaran berhasil dicatat!' });
      setFormData({ categoryId: '', berat: '', keterangan: '' });
      if (onOutboundSuccess) onOutboundSuccess();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gagal mencatat pengeluaran.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      {status.message && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)', 
          background: status.type === 'success' ? 'var(--primary-light)' : '#fee2e2',
          color: status.type === 'success' ? 'var(--primary-dark)' : 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}

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
        <label className="form-label">Berat Keluar (kg)</label>
        <div style={{ position: 'relative' }}>
          <Scale size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="number" 
            step="0.1"
            className="form-control" 
            style={{ paddingLeft: '3rem' }}
            placeholder="0.0"
            value={formData.berat}
            onChange={(e) => setFormData({...formData, berat: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Keterangan</label>
        <textarea 
          className="form-control" 
          rows="2"
          placeholder="Misal: Dikirim ke TPA Sarimukti"
          value={formData.keterangan}
          onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
          style={{ resize: 'none' }}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        <Send size={18} /> {loading ? 'Memproses...' : 'Catat Pengeluaran'}
      </button>
    </form>
  );
};

export default OutboundForm;

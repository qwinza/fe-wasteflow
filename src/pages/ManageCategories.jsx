import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import wasteService from '../services/waste.service';
import { formatCategory } from '../utils/formatters';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ namaKategori: '', pointMultiplier: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchCategories = async () => {
    try {
      const res = await wasteService.getCategories();
      setCategories(res.data);
    } catch (e) {
      console.error("Error fetching categories", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await wasteService.createCategory({
        namaKategori: newCategory.namaKategori,
        pointMultiplier: parseFloat(newCategory.pointMultiplier)
      });
      setStatus({ type: 'success', message: 'Kategori berhasil ditambahkan!' });
      setNewCategory({ namaKategori: '', pointMultiplier: '' });
      fetchCategories();
    } catch (err) {
      setStatus({ type: 'error', message: 'Gagal menambahkan kategori.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container">Memuat data...</div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '1rem' }}>
          <Settings color="var(--primary)" size={32} />
        </div>
        <div>
          <h1>Manajemen Kategori</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kelola jenis sampah dan nilai poin per kilogram.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Tambah Kategori</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Kategori</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Misal: Plastik HD"
                value={newCategory.namaKategori}
                onChange={(e) => setNewCategory({...newCategory, namaKategori: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Poin per kg</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Misal: 50"
                value={newCategory.pointMultiplier}
                onChange={(e) => setNewCategory({...newCategory, pointMultiplier: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Plus size={18} /> {loading ? 'Menambahkan...' : 'Simpan Kategori'}
            </button>
          </form>
          {status.message && (
            <div style={{ marginTop: '1rem', color: status.type === 'success' ? 'var(--primary)' : 'var(--danger)', fontSize: '0.875rem' }}>
              {status.message}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Daftar Kategori</h2>
          <div className="card table-container" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Kategori</th>
                  <th>Poin/kg</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 500 }}>{formatCategory(cat.namaKategori)}</td>
                    <td><span className="badge badge-success">{cat.pointMultiplier} Poin/kg</span></td>
                    <td>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
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

export default ManageCategories;

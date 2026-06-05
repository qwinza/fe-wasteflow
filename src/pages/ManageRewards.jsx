import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit2, Trash2, Search, ArrowLeft, ShoppingBag, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageRewards = () => {
  const [rewards, setRewards] = useState([
    { id: 1, name: 'Voucher Listrik 50rb', points: 5000, category: 'Utilitas', stock: 50, img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300' },
    { id: 2, name: 'Paket Sembako Wilayah', points: 7500, category: 'Logistik', stock: 20, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' },
    { id: 3, name: 'Peralatan Kebersihan', points: 3000, category: 'Peralatan', stock: 15, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({ name: '', points: '', category: 'Umum', stock: '', img: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (reward = null) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({ ...reward });
    } else {
      setEditingReward(null);
      setFormData({ name: '', points: '', category: 'Umum', stock: '', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReward(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? { ...formData, id: r.id } : r));
    } else {
      setRewards([...rewards, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus reward ini?')) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const filteredRewards = rewards.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container fade-in" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600' }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </Link>
        <button onClick={() => handleOpenModal()} style={{
          padding: '0.8rem 1.5rem',
          background: 'var(--primary)',
          color: 'white',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}>
          <Plus size={20} /> Tambah Reward Baru
        </button>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)' }}>
          Kelola <span style={{ color: 'var(--primary)' }}>Katalog Reward</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Atur daftar hadiah yang dapat ditukarkan oleh TPS dengan poin mereka.</p>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Cari nama reward atau kategori..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.8rem 1rem 0.8rem 3rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Rewards Table/Grid */}
      <div className="card" style={{ padding: '0', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Reward</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Kategori</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Biaya Poin</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Stok</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRewards.length > 0 ? filteredRewards.map(reward => (
                <tr key={reward.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={reward.img} alt="" style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: '700', color: 'var(--text)' }}>{reward.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {reward.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {reward.points.toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Pts</span>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', fontWeight: '600' }}>
                    {reward.stock} unit
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(reward)} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: 'var(--secondary)', cursor: 'pointer' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(reward.id)} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#fef2f2', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Tidak ada reward ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingReward ? 'Edit Reward' : 'Tambah Reward Baru'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Nama Reward</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Biaya Poin</label>
                  <input 
                    type="number" 
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Stok</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                >
                  <option value="Utilitas">Utilitas</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Peralatan">Peralatan</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Voucher">Voucher</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>URL Gambar</label>
                <input 
                  type="text" 
                  value={formData.img}
                  onChange={(e) => setFormData({...formData, img: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', fontWeight: '700', cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Check size={20} /> {editingReward ? 'Simpan Perubahan' : 'Tambah Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRewards;

import React, { useState } from 'react';
import axios from 'axios';

const OutboundForm = ({ onOutboundSuccess, locationId }) => {
  const [formData, setFormData] = useState({
    categoryId: 1,
    berat: '',
    tujuanDistribusi: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const payload = {
        locationId: locationId,
        categoryId: parseInt(formData.categoryId),
        berat: parseFloat(formData.berat),
        tujuanDistribusi: formData.tujuanDistribusi
      };
      // In real scenario, uncomment API call
      // await axios.post('http://localhost:8080/api/v1/outbounds', payload);
      
      // Simulate API call
      setTimeout(() => {
        setStatus('Berhasil dicatat!');
        setFormData({ ...formData, berat: '', tujuanDistribusi: '' });
        if(onOutboundSuccess) onOutboundSuccess();
      }, 800);
      
    } catch (error) {
      setStatus('Gagal mencatat pengeluaran.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Kategori Sampah</label>
        <select name="categoryId" className="form-select" value={formData.categoryId} onChange={handleChange}>
          <option value={1}>Organik</option>
          <option value={2}>Anorganik</option>
          <option value={3}>B3</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Berat (kg)</label>
        <input 
          type="number" 
          step="0.1" 
          name="berat" 
          className="form-input" 
          value={formData.berat} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label">Tujuan Distribusi (Pabrik/Mitra)</label>
        <input 
          type="text" 
          name="tujuanDistribusi" 
          className="form-input" 
          value={formData.tujuanDistribusi} 
          onChange={handleChange} 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Catat Outbound</button>
      {status && <p style={{ marginTop: '1rem', color: status.includes('Berhasil') ? 'var(--primary)' : 'var(--danger)', fontWeight: 500 }}>{status}</p>}
    </form>
  );
};

export default OutboundForm;

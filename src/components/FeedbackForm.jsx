import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ userId }) => {
  const [pesan, setPesan] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Mengirim...');
    try {
      // await axios.post('http://localhost:8080/api/v1/feedbacks', { userId, pesan, rating });
      setTimeout(() => {
        setStatus('Terima kasih atas masukan Anda!');
        setPesan('');
        setRating(5);
      }, 500);
    } catch (e) {
      setStatus('Gagal mengirim masukan.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Penilaian (1-5)</label>
        <input 
          type="number" 
          min="1" max="5" 
          className="form-input" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label">Pesan & Saran</label>
        <textarea 
          className="form-textarea" 
          rows="4" 
          value={pesan} 
          onChange={(e) => setPesan(e.target.value)} 
          placeholder="Tuliskan pengalaman Anda menggunakan TPS..."
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary">Kirim Feedback</button>
      {status && <p style={{ marginTop: '1rem', fontWeight: 500 }}>{status}</p>}
    </form>
  );
};

export default FeedbackForm;

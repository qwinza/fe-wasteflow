import React, { useState } from 'react';
import { Send, Star, CheckCircle } from 'lucide-react';
import wasteService from '../services/waste.service';

const FeedbackForm = ({ userId }) => {
  const [pesan, setPesan] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      await wasteService.createFeedback({ userId, pesan, rating: parseInt(rating) });
      setStatus({ type: 'success', message: 'Terima kasih atas masukan Anda!' });
      setPesan('');
      setRating(5);
    } catch (e) {
      setStatus({ type: 'error', message: 'Gagal mengirim masukan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      <div className="form-group">
        <label className="form-label">Rating Pengalaman</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={24}
              onClick={() => setRating(star)}
              fill={star <= rating ? "var(--accent)" : "none"}
              color={star <= rating ? "var(--accent)" : "var(--text-muted)"}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Pesan & Saran</label>
        <textarea 
          className="form-control" 
          rows="4" 
          value={pesan} 
          onChange={(e) => setPesan(e.target.value)} 
          placeholder="Bagaimana pelayanan di TPS hari ini? Tuliskan saran Anda..."
          required 
          style={{ resize: 'none' }}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Feedback'}
      </button>

      {status.message && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)', 
          background: status.type === 'success' ? 'var(--primary-light)' : '#fee2e2',
          color: status.type === 'success' ? 'var(--primary-dark)' : 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {status.type === 'success' && <CheckCircle size={16} />}
          {status.message}
        </div>
      )}
    </form>
  );
};

export default FeedbackForm;

import React from 'react';
import { Lightbulb } from 'lucide-react';

const RecommendationCard = ({ message }) => {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%', color: '#d97706' }}>
        <Lightbulb size={32} />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Rekomendasi Pintar untuk Anda</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;

import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  MessageSquare,
  User,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  XCircle,
  TrendingUp,
  ThumbsUp,
} from 'lucide-react';
import wasteService from '../services/waste.service';

// Render star rating display
const StarRating = ({ rating }) => {
  const r = parseInt(rating) || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= r ? '#f59e0b' : 'none'}
          color={star <= r ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#92400e', marginLeft: '0.25rem' }}>
        {r}/5
      </span>
    </div>
  );
};

// Rating badge
const RatingBadge = ({ rating }) => {
  const r = parseInt(rating) || 0;
  const colors = {
    5: { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7' },
    4: { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' },
    3: { bg: '#fffbeb', color: '#92400e', border: '#fcd34d' },
    2: { bg: '#fff7ed', color: '#9a3412', border: '#fdba74' },
    1: { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
  };
  const c = colors[r] || colors[3];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
      padding: '0.2rem 0.6rem', borderRadius: '9999px',
      fontSize: '0.7rem', fontWeight: '800',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      width: 'fit-content'
    }}>
      <Star size={10} fill={c.color} color={c.color} /> {r}
    </span>
  );
};

const AdminReviews = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await wasteService.getAllFeedbacks();
      const data = Array.isArray(res.data) ? res.data : [];
      // Sort newest first
      data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Gagal memuat data review. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filtered = feedbacks.filter((f) => {
    const userName = f.user?.nama || '';
    const userEmail = f.user?.email || '';
    const matchUser = userName.toLowerCase().includes(searchUser.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchUser.toLowerCase());

    const matchRating = filterRating === '' || parseInt(f.rating) === parseInt(filterRating);

    const date = f.tanggal ? new Date(f.tanggal) : null;
    const matchFrom = !filterDateFrom || (date && date >= new Date(filterDateFrom));
    const matchTo = !filterDateTo || (date && date <= new Date(filterDateTo + 'T23:59:59'));

    return matchUser && matchRating && matchFrom && matchTo;
  });

  // Stats
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + (parseInt(f.rating) || 0), 0) / feedbacks.length).toFixed(1)
    : '—';

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: feedbacks.filter((f) => parseInt(f.rating) === r).length,
  }));
  const maxCount = Math.max(...ratingCounts.map((r) => r.count), 1);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Memuat data review...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '2rem', paddingBottom: '5rem' }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '1rem' }}>
            <Star color="var(--primary)" size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Review & Feedback Warga</h1>
            <p style={{ color: 'var(--text-muted)' }}>Pantau masukan, penilaian rating, dan kritik saran dari para warga.</p>
          </div>
        </div>

        <button
          onClick={fetchFeedbacks}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            background: 'white',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
        >
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ 
          marginBottom: '2rem', padding: '1rem', borderRadius: '12px', 
          background: '#fee2e2', color: 'var(--danger)', 
          display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' 
        }}>
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {/* Total Reviews */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white', border: 'none', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={20} style={{ opacity: 0.85 }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Review</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{feedbacks.length}</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>feedback masuk dari warga</p>
        </div>

        {/* Average Rating */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={20} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rata-rata Rating</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{avgRating}</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/ 5</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {avgRating !== '—' && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= parseFloat(avgRating) ? '#f59e0b' : 'none'} color={s <= parseFloat(avgRating) ? '#f59e0b' : '#cbd5e1'} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ThumbsUp size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distribusi Rating</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {ratingCounts.map(({ star, count }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', width: '12px', textAlign: 'right' }}>{star}</span>
                <Star size={11} fill="#f59e0b" color="#f59e0b" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fcd34d)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '20px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Filter size={16} color="var(--primary)" />
          <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text)' }}>Filter & Pencarian</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
          {/* Search User */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Cari nama atau email warga..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)', background: 'white', cursor: 'pointer' }}
          >
            <option value="">Semua Rating</option>
            <option value="5">⭐ 5 - Sangat Baik</option>
            <option value="4">⭐ 4 - Baik</option>
            <option value="3">⭐ 3 - Cukup</option>
            <option value="2">⭐ 2 - Kurang</option>
            <option value="1">⭐ 1 - Buruk</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
          />

          {/* Date To */}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
          />
        </div>

        {(searchUser || filterRating || filterDateFrom || filterDateTo) && (
          <button
            onClick={() => { setSearchUser(''); setFilterRating(''); setFilterDateFrom(''); setFilterDateTo(''); }}
            style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--danger)', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <XCircle size={14} /> Reset Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, background: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Warga</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Penilaian</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', width: '45%' }}>Review / Feedback</th>
                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    style={{ borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* User */}
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'var(--primary-light)', color: 'var(--primary-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '0.9rem', flexShrink: 0,
                          border: '1px solid var(--border)'
                        }}>
                          {item.user?.nama?.charAt(0)?.toUpperCase() || <User size={16} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.1rem' }}>
                            {item.user?.nama || 'Anonim'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.user?.email || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <RatingBadge rating={item.rating} />
                        <StarRating rating={item.rating} />
                      </div>
                    </td>

                    {/* Message */}
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      {item.pesan ? (
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '0.6rem 0.9rem',
                          border: '1px solid var(--border)',
                          position: 'relative',
                        }}>
                          <MessageSquare size={12} style={{ position: 'absolute', top: '0.65rem', left: '0.75rem', color: 'var(--text-muted)', opacity: 0.4 }} />
                          <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: '1.5', paddingLeft: '1rem' }}>
                            "{item.pesan}"
                          </p>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CalendarDays size={13} />
                        {item.tanggal
                          ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                          : '—'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <MessageSquare size={48} style={{ opacity: 0.2, color: 'var(--text-muted)' }} />
                      <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.05rem' }}>
                        {error ? 'Data tidak dapat dimuat.' : 'Belum ada review dari warga.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{
            padding: '1.2rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border)',
            fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>Menampilkan {filtered.length} dari {feedbacks.length} review</span>
            {filtered.length !== feedbacks.length && <span style={{ color: 'var(--primary)' }}>Filter aktif</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;

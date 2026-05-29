import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  CalendarDays,
  Gift,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Ticket,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Coins,
  Users,
} from 'lucide-react';
import rewardService from '../services/reward.service';
import wasteService from '../services/waste.service';

// Status badge component
const StatusBadge = ({ status }) => {
  const config = {
    SUCCESS: { label: 'Success', bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7', icon: <CheckCircle2 size={13} /> },
    PENDING: { label: 'Pending', bg: '#fffbeb', color: '#92400e', border: '#fcd34d', icon: <Clock size={13} /> },
    USED: { label: 'Used', bg: '#eff6ff', color: '#1e40af', border: '#93c5fd', icon: <CheckCircle2 size={13} /> },
    CANCELLED: { label: 'Cancelled', bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', icon: <XCircle size={13} /> },
  };
  const key = (status || 'SUCCESS').toUpperCase();
  const c = config[key] || config.SUCCESS;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        padding: '0.3rem 0.75rem', borderRadius: '9999px',
        fontSize: '0.75rem', fontWeight: '700',
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {c.icon}{c.label}
    </span>
  );
};

const AdminRedeemHistory = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    fetchAllRedemptions();
  }, []);

  const fetchAllRedemptions = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * TODO: Replace with a real admin endpoint when available.
       * Expected: GET /api/v1/rewards/redemptions → returns ALL redemptions from all users.
       *
       * Current workaround: fetch all users, then aggregate per-user redemptions.
       * This is a frontend-side workaround and should be replaced with a proper
       * paginated admin endpoint in the backend for performance reasons.
       */
      const usersRes = await wasteService.getAllDeposits(); // just to get users list via deposit pattern
      // Actually, use the users endpoint instead
      let allRedemptions = [];
      try {
        const allRes = await rewardService.getAllRedemptions();
        allRedemptions = Array.isArray(allRes.data) ? allRes.data : [];
      } catch (apiErr) {
        // Fallback: endpoint not yet available
        console.warn('getAllRedemptions endpoint not available yet:', apiErr.message);
        setError(
          'Endpoint untuk semua data redeem belum tersedia di backend. ' +
          'Tambahkan GET /api/v1/rewards/redemptions di RewardController.java untuk mengaktifkan halaman ini.'
        );
        setLoading(false);
        return;
      }

      // Sort newest first
      allRedemptions.sort((a, b) => new Date(b.redemptionDate) - new Date(a.redemptionDate));
      setRedemptions(allRedemptions);
    } catch (err) {
      console.error('Error fetching all redemptions:', err);
      setError('Gagal memuat data redeem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filtered = redemptions.filter((r) => {
    const userName = r.user?.nama || '';
    const userEmail = r.user?.email || '';
    const matchUser = userName.toLowerCase().includes(searchUser.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchUser.toLowerCase());

    const status = (r.status || 'SUCCESS').toUpperCase();
    const matchStatus = filterStatus === '' || status === filterStatus;

    const date = r.redemptionDate ? new Date(r.redemptionDate) : null;
    const matchFrom = !filterDateFrom || (date && date >= new Date(filterDateFrom));
    const matchTo = !filterDateTo || (date && date <= new Date(filterDateTo + 'T23:59:59'));

    return matchUser && matchStatus && matchFrom && matchTo;
  });

  const totalPoints = redemptions.reduce((acc, r) => acc + (r.pointsUsed || 0), 0);
  const uniqueUsers = new Set(redemptions.map((r) => r.user?.id)).size;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }} />
          <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Memuat data redeem...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
            <History size={20} />
          </div>
          <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Admin Panel
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              History <span style={{ color: 'var(--primary)' }}>Redeem</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
              Pantau semua transaksi penukaran reward dari seluruh user.
            </p>
          </div>
          <button
            onClick={fetchAllRedemptions}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'white',
              color: 'var(--text-muted)', fontWeight: '700', cursor: 'pointer',
              fontSize: '0.9rem', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          marginBottom: '2rem', padding: '1.5rem', borderRadius: '16px',
          background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e',
          display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
        }}>
          <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <p style={{ fontWeight: '700', marginBottom: '0.35rem' }}>Endpoint Belum Tersedia</p>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white', border: 'none', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <TrendingUp size={20} style={{ opacity: 0.85 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Transaksi</span>
            </div>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{redemptions.length}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>redeem dilakukan</p>
          </div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Coins size={20} color="var(--accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Poin Dipakai</span>
            </div>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{totalPoints.toLocaleString()}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>poin diredeem</p>
          </div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Users size={20} color="var(--secondary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Aktif Redeem</span>
            </div>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{uniqueUsers}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>user berbeda</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)' }}>
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
              placeholder="Cari nama atau email user..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)', background: 'white', cursor: 'pointer' }}
          >
            <option value="">Semua Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="USED">Used</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
            placeholder="Dari Tanggal"
          />

          {/* Date To */}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
            placeholder="Sampai Tanggal"
          />
        </div>

        {/* Reset Filters */}
        {(searchUser || filterStatus || filterDateFrom || filterDateTo) && (
          <button
            onClick={() => { setSearchUser(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); }}
            style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--danger)', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <XCircle size={14} /> Reset Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, background: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User</th>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reward</th>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Poin</th>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tanggal</th>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                <th style={{ padding: '1.1rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Kode</th>
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
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'var(--primary-light)', color: 'var(--primary-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '0.85rem', flexShrink: 0,
                        }}>
                          {item.user?.nama?.charAt(0)?.toUpperCase() || <User size={16} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.1rem' }}>
                            {item.user?.nama || '—'}
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {item.user?.email || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Reward */}
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '9px',
                          overflow: 'hidden', background: 'var(--primary-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {item.reward?.imageUrl ? (
                            <img src={item.reward.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Gift size={16} color="var(--primary)" />
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem' }}>{item.reward?.name || '—'}</p>
                          {item.reward?.category && (
                            <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '700' }}>
                              {item.reward.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                        {item.pointsUsed?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>PTS</span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CalendarDays size={13} />
                        {item.redemptionDate
                          ? new Date(item.redemptionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      {/*
                        TODO: Backend Redemption entity doesn't have a 'status' field yet.
                        Defaulting to SUCCESS. Update when status field is added.
                      */}
                      <StatusBadge status={item.status || 'SUCCESS'} />
                    </td>

                    {/* Coupon Code */}
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      {item.couponCode || item.kodeKupon ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          background: '#eff6ff', color: '#1d4ed8',
                          padding: '0.25rem 0.65rem', borderRadius: '7px',
                          fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em',
                          border: '1px dashed #93c5fd',
                        }}>
                          <Ticket size={12} />{item.couponCode || item.kodeKupon}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <History size={48} style={{ opacity: 0.2 }} />
                      <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.05rem' }}>
                        {error ? 'Data tidak dapat dimuat.' : 'Belum ada data redeem.'}
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
            padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border)',
            fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>Menampilkan {filtered.length} dari {redemptions.length} data</span>
            {filtered.length !== redemptions.length && (
              <span style={{ color: 'var(--primary)' }}>Filter aktif</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRedeemHistory;

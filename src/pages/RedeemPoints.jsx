import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle, Download, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import wasteService from '../services/waste.service';
import { jsPDF } from 'jspdf';

// ── Voucher PDF Generator ───────────────────────────────────────────────────
function generateVoucherCode() {
  return 'WF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateVoucherPDF(reward, user, voucherCode) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // ── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(16, 185, 129); // primary green
  doc.rect(0, 0, W, H, 'F');

  // ── Decorative circles ────────────────────────────────────────────────────
  doc.setFillColor(5, 150, 105);
  doc.circle(W - 20, -10, 50, 'F');
  doc.setFillColor(4, 120, 87);
  doc.circle(20, H + 10, 40, 'F');

  // ── White card ────────────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 10, W - 20, H - 20, 8, 8, 'F');

  // ── Left accent bar ───────────────────────────────────────────────────────
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(10, 10, 8, H - 20, 8, 8, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(14, 10, 4, H - 20, 'F'); // fix right side of accent

  // ── WasteFlow logo text ───────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text('♻ WasteFlow', 28, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Platform Pengelolaan Sampah Digital', 28, 35);

  // ── VOUCHER badge ─────────────────────────────────────────────────────────
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(W - 65, 15, 52, 14, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105);
  doc.text('VOUCHER REWARD', W - 63, 24);

  // ── Divider ───────────────────────────────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(28, 42, W - 15, 42);

  // ── Reward name ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(reward.name, 28, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const descLines = doc.splitTextToSize(reward.description, W - 55);
  doc.text(descLines, 28, 67);

  // ── Poin used ────────────────────────────────────────────────────────────
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(28, 78, 60, 16, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105);
  doc.text(`${reward.points.toLocaleString('id-ID')} Poin Ditukar`, 35, 88.5);

  // ── Bottom info row ───────────────────────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.line(28, 100, W - 15, 100);

  const issued = new Date();
  const expiry = new Date(issued);
  expiry.setDate(expiry.getDate() + 30);
  const fmt = (d) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const infos = [
    { label: 'Penerima', value: user.nama || user.email },
    { label: 'Lokasi TPS', value: user.locationName || '-' },
    { label: 'Tanggal Terbit', value: fmt(issued) },
    { label: 'Berlaku Hingga', value: fmt(expiry) },
  ];

  const colW = (W - 43) / infos.length;
  infos.forEach((info, i) => {
    const x = 28 + i * colW;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(info.label, x, 108);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const val = doc.splitTextToSize(info.value, colW - 4);
    doc.text(val, x, 114);
  });

  // ── Voucher code bar ─────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(28, H - 30, W - 43, 16, 4, 4, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(voucherCode, (W / 2), H - 19, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Tunjukkan kode ini ke petugas TPS untuk penukaran reward', (W / 2), H - 10, { align: 'center' });

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`voucher-${voucherCode}.pdf`);
}
// ─────────────────────────────────────────────────────────────────────────────

const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [message, setMessage] = useState(null);
  const currentUser = authService.getCurrentUser();

  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('wasteflow_rewards');
    if (stored) {
      setRewards(JSON.parse(stored));
    } else {
      const defaultRewards = [
        { id: 1, name: 'Voucher Listrik Rp 50.000', points: 5000, category: 'Utilitas', stock: 50, img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300', description: 'Token listrik prabayar untuk kebutuhan rumah tangga Anda.' },
        { id: 2, name: 'Paket Sembako Premium', points: 7500, category: 'Logistik', stock: 20, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300', description: 'Beras 5kg, Minyak 2L, dan Gula 1kg.' },
        { id: 3, name: 'Alat Kebersihan Baru', points: 3000, category: 'Peralatan', stock: 15, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300', description: 'Satu set sapu, pengki, dan tempat sampah pilah.' },
        { id: 4, name: 'Pupuk Kompos Organik (10kg)', points: 2000, category: 'Pertanian', stock: 30, img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300', description: 'Pupuk berkualitas hasil olahan sampah organik.' },
        { id: 5, name: 'Voucher Belanja Rp 100.000', points: 9000, category: 'Voucher', stock: 10, img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=300', description: 'Dapat digunakan di minimarket rekanan WasteFlow.' },
        { id: 6, name: 'Tong Sampah Bio-Degradable', points: 4500, category: 'Peralatan', stock: 25, img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300', description: 'Tempat sampah modern untuk mempermudah pemilahan.' }
      ];
      localStorage.setItem('wasteflow_rewards', JSON.stringify(defaultRewards));
      setRewards(defaultRewards);
    }
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await wasteService.getDepositsByUser(currentUser.id);
        const total = Math.round(res.data.reduce((acc, curr) => acc + (curr.points || 0), 0) * 100) / 100;
        const redeemed = Number(localStorage.getItem(`wasteflow_redeemed_points_${currentUser.id}`)) || 0;
        const finalPoints = Math.max(0, Math.round((total - redeemed) * 100) / 100);
        setPoints(finalPoints);
      } catch (e) {
        console.error("Error fetching points", e);
        setPoints(0);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchPoints();
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const handleRedeem = (reward) => {
    const rewardPoints = Number(reward.points) || 0; // coerce string→number from localStorage

    if (points < rewardPoints) {
      setMessage({ type: 'error', text: 'Poin Anda tidak cukup untuk menukarkan reward ini.' });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    setRedeeming(reward.id);
    setMessage({ type: 'loading', text: `Memproses penukaran ${reward.name}...` });

    setTimeout(() => {
      const voucherCode = generateVoucherCode();

      // Deduct points FIRST (before PDF, so it always runs)
      const currentRedeemed = Number(localStorage.getItem(`wasteflow_redeemed_points_${currentUser.id}`)) || 0;
      localStorage.setItem(`wasteflow_redeemed_points_${currentUser.id}`, currentRedeemed + rewardPoints);

      setPoints(prev => Math.max(0, Math.round((prev - rewardPoints) * 100) / 100));
      setRedeeming(null);
      setMessage({
        type: 'success',
        text: `Berhasil! Voucher PDF "${reward.name}" sedang diunduh. Kode: ${voucherCode}`
      });
      setTimeout(() => setMessage(null), 6000);

      // Generate PDF last — wrapped in try/catch so errors don't block the UI
      try {
        generateVoucherPDF({ ...reward, points: rewardPoints }, currentUser, voucherCode);
      } catch (err) {
        console.error('Voucher PDF error:', err);
        // Points are already deducted; inform user PDF failed
        setMessage({
          type: 'success',
          text: `Penukaran berhasil! Kode voucher Anda: ${voucherCode} (PDF gagal dibuat, catat kode ini)`
        });
      }
    }, 1200);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-light)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p>Memuat Katalog Reward...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/warga" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary-light)', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Award size={20} color="var(--primary)" />
          <span style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>
            Poin Saya: {points.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)' }}>
          Penukaran <span style={{ color: 'var(--primary)' }}>Reward</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Tukarkan poin hasil setoran sampah Anda — voucher PDF akan langsung terunduh otomatis.
        </p>
      </div>

      {/* Alert Message */}
      {message && (
        <div style={{
          marginBottom: '2rem',
          padding: '1.25rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          background: message.type === 'success' ? '#ecfdf5' : message.type === 'error' ? '#fef2f2' : '#eff6ff',
          border: `1px solid ${message.type === 'success' ? '#10b981' : message.type === 'error' ? '#ef4444' : '#3b82f6'}`,
          color: message.type === 'success' ? '#065f46' : message.type === 'error' ? '#991b1b' : '#1e40af',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {message.type === 'success'
            ? <CheckCircle size={24} style={{ flexShrink: 0 }} />
            : message.type === 'error'
              ? <AlertCircle size={24} style={{ flexShrink: 0 }} />
              : <div style={{ width: '24px', height: '24px', border: '3px solid currentColor', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}></div>
          }
          <div>
            <span style={{ fontWeight: '700', display: 'block' }}>
              {message.type === 'success' ? 'Penukaran Berhasil!' : message.type === 'error' ? 'Penukaran Gagal' : 'Memproses...'}
            </span>
            <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>{message.text}</span>
          </div>
        </div>
      )}

      {/* Rewards Grid */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShoppingBag color="var(--primary)" /> Katalog Reward Tersedia
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {rewards.map(reward => {
          const canRedeem = points >= Number(reward.points);
          const isProcessing = redeeming === reward.id;
          return (
            <div key={reward.id} className="card" style={{
              padding: '0',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              border: `1px solid ${canRedeem ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              boxShadow: canRedeem ? '0 4px 15px rgba(16,185,129,0.08)' : '0 4px 15px rgba(0,0,0,0.03)',
              opacity: redeeming !== null && !isProcessing ? 0.6 : 1
            }}
              onMouseOver={(e) => { if (!redeeming) { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'; } }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = canRedeem ? '0 4px 15px rgba(16,185,129,0.08)' : '0 4px 15px rgba(0,0,0,0.03)'; }}
            >
              {/* Image */}
              <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                <img src={reward.img || reward.image} alt={reward.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '0.35rem 0.8rem', borderRadius: '99px',
                  fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)',
                  backdropFilter: 'blur(4px)'
                }}>
                  {reward.category}
                </div>
                {canRedeem && (
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    background: 'rgba(16, 185, 129, 0.9)',
                    padding: '0.35rem 0.8rem', borderRadius: '99px',
                    fontSize: '0.7rem', fontWeight: '700', color: 'white',
                    backdropFilter: 'blur(4px)'
                  }}>
                    ✓ Bisa Ditukar
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text)' }}>{reward.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{reward.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Biaya</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {reward.points.toLocaleString('id-ID')} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Poin</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={isProcessing || !!redeeming || !canRedeem}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: !canRedeem ? '#f1f5f9' : isProcessing ? '#6ee7b7' : 'var(--primary)',
                      color: !canRedeem ? '#94a3b8' : 'white',
                      fontWeight: '700',
                      cursor: !canRedeem || !!redeeming ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontSize: '0.9rem'
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                        Proses...
                      </>
                    ) : canRedeem ? (
                      <>
                        <Download size={16} /> Tukarkan
                      </>
                    ) : 'Poin Kurang'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#eff6ff',
        borderRadius: '16px',
        border: '1px solid #bfdbfe',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <Gift size={24} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontWeight: '700', color: '#1e40af', marginBottom: '0.25rem' }}>Cara Kerja Penukaran Voucher</p>
          <p style={{ color: '#3b82f6', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Klik tombol <strong>Tukarkan</strong> — voucher PDF berisi kode unik akan langsung terunduh ke perangkat Anda.
            Tunjukkan file PDF atau kode tersebut kepada petugas di TPS Anda untuk mendapatkan reward fisik.
            Voucher berlaku selama <strong>30 hari</strong> sejak tanggal penukaran.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default RedeemPoints;

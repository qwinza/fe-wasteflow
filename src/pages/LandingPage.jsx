import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Recycle, ArrowRight, ShieldCheck, TrendingUp,
  Users, BarChart3, Gift, MapPin, CheckCircle, ChevronRight
} from 'lucide-react';

/* ─── Animated counter hook ─────────────────────────── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─── Sub-components ─────────────────────────────────── */
function StatCard({ value, suffix, label, color }) {
  const count = useCounter(value);
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, color, lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.375rem', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#fff' : '#f8fafc',
        border: `1px solid ${hovered ? color + '40' : '#e2e8f0'}`,
        borderRadius: '1.25rem',
        padding: '2rem',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? `0 20px 40px ${color}20` : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        animationDelay: delay,
        cursor: 'default',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: '1rem',
        background: color + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem',
        transition: 'transform 0.3s',
        transform: hovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1)',
      }}>
        <Icon size={26} color={color} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.625rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
      <div style={{
        minWidth: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: '1rem',
        boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
        flexShrink: 0,
      }}>
        {num}
      </div>
      <div>
        <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '0.375rem' }}>{title}</h4>
        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    // Trigger hero animation
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Floating Particles Background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(16,185,129,0.12), transparent)'
              : 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
            width: [320, 200, 280, 180, 260, 220][i],
            height: [320, 200, 280, 180, 260, 220][i],
            top: ['5%', '60%', '20%', '75%', '40%', '85%'][i],
            left: ['70%', '5%', '85%', '50%', '-5%', '80%'][i],
            animation: `floatBlob ${[18, 22, 16, 20, 24, 15][i]}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes floatBlob {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '0.5rem', borderRadius: '0.75rem',
                display: 'flex', boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
              }}>
                <Leaf size={22} color="white" />
              </div>
            </div>
            <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
              Waste<span style={{ color: '#10b981' }}>Flow</span>
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/login" style={{
              textDecoration: 'none', color: '#475569', fontWeight: 600,
              padding: '0.5rem 1.125rem', borderRadius: '0.625rem',
              fontSize: '0.9rem', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#10b981'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#475569'; }}
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '8rem', paddingBottom: '5rem', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left: Text */}
            <div style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(40px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '2rem', padding: '0.375rem 0.875rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>
                  Sistem Bank Sampah Digital
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
                fontWeight: 900, lineHeight: 1.12,
                color: '#0f172a', letterSpacing: '-0.03em',
                marginBottom: '1.375rem',
              }}>
                Ubah Sampah Jadi{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Nilai Nyata
                </span>{' '}
                untuk Kawasan Anda
              </h1>

              <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
                Platform manajemen Bank Sampah terintegrasi — catat setoran, lacak poin warga, kelola distribusi, dan pantau kapasitas TPS secara real-time.
              </p>

              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                <Link to="/login" style={{
                  textDecoration: 'none', color: '#fff', fontWeight: 700,
                  padding: '0.875rem 2rem', borderRadius: '0.875rem', fontSize: '1rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.4)'; }}
                >
                  Mulai Sekarang <ArrowRight size={18} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {[
                  { icon: CheckCircle, text: 'Tanpa biaya setup' },
                  { icon: CheckCircle, text: 'Data aman & terenkripsi' },
                  { icon: CheckCircle, text: 'Gratis untuk RT/RW' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Icon size={15} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Dashboard Card */}
            <div style={{
              position: 'relative',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(40px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}>
              {/* Glow behind card */}
              <div style={{
                position: 'absolute', inset: -24,
                background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15), transparent 70%)',
                borderRadius: '50%',
              }} />

              {/* Main card */}
              <div style={{
                background: '#fff', borderRadius: '1.5rem',
                padding: '1.75rem',
                boxShadow: '0 24px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(226,232,240,0.6)',
                position: 'relative',
              }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dashboard Warga</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Halo, Budi! 👋</div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    padding: '0.5rem', borderRadius: '0.75rem',
                  }}>
                    <Leaf size={20} color="white" />
                  </div>
                </div>

                {/* Points big display */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem',
                  border: '1px solid rgba(16,185,129,0.15)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.25rem' }}>Total Poin Terkumpul</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
                    2.840 <span style={{ fontSize: '1rem', fontWeight: 600 }}>pts</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.375rem' }}>
                    ↑ +320 poin bulan ini
                  </div>
                </div>

                {/* Mini stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Setoran', value: '12x', icon: Recycle, color: '#3b82f6' },
                    { label: 'Reward', value: '3', icon: Gift, color: '#f59e0b' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} style={{
                      background: '#f8fafc', borderRadius: '0.875rem', padding: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      border: '1px solid #f1f5f9',
                    }}>
                      <div style={{ background: color + '15', borderRadius: '0.5rem', padding: '0.5rem', display: 'flex' }}>
                        <Icon size={16} color={color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>{label}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Aktivitas Terbaru
                  </div>
                  {[
                    { type: 'Organik', weight: '3.2 kg', pts: '+64 pts', color: '#10b981' },
                    { type: 'Anorganik', weight: '1.8 kg', pts: '+54 pts', color: '#3b82f6' },
                  ].map((item) => (
                    <div key={item.type} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.625rem 0', borderBottom: '1px solid #f1f5f9',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>{item.type}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.weight}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color }}>{item.pts}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge: TPS nearby */}
              <div style={{
                position: 'absolute', bottom: -16, left: -20,
                background: '#fff', borderRadius: '1rem', padding: '0.75rem 1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(226,232,240,0.8)',
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                animation: 'floatBlob 4s ease-in-out infinite alternate',
              }}>
                <div style={{ background: '#fef3c7', padding: '0.375rem', borderRadius: '0.5rem', display: 'flex' }}>
                  <MapPin size={16} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>TPS TERDEKAT</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>TPS RW-04 · 250m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          borderRadius: '1.5rem', padding: '2.5rem 3rem',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        }}>
          <StatCard value={1250} suffix="+" label="Warga Aktif" color="#10b981" />
          <StatCard value={38400} suffix=" kg" label="Sampah Terproses" color="#3b82f6" />
          <StatCard value={96} suffix="%" label="Kepuasan Pengguna" color="#a78bfa" />
          <StatCard value={47} suffix="" label="RT/RW Terdaftar" color="#f59e0b" />
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(16,185,129,0.1)',
              color: '#059669', fontWeight: 700, fontSize: '0.8rem',
              padding: '0.375rem 1rem', borderRadius: '2rem',
              border: '1px solid rgba(16,185,129,0.2)', marginBottom: '1rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Fitur Unggulan
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.875rem' }}>
              Kenapa Memilih WasteFlow?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto' }}>
              Dirancang khusus untuk kebutuhan komunitas RT/RW dengan teknologi modern.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <FeatureCard
              icon={Recycle}
              title="Sortir & Konversi Otomatis"
              desc="Catat setoran sampah organik, anorganik, dan B3 dengan kalkulasi poin otomatis berdasarkan berat dan jenis sampah."
              color="#10b981"
              delay="0s"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Monitoring Kapasitas Real-time"
              desc="Pantau arus masuk (Deposit) dan keluar (Outbound) TPS secara live agar kapasitas selalu terkendali."
              color="#3b82f6"
              delay="0.1s"
            />
            <FeatureCard
              icon={Gift}
              title="Sistem Reward & Poin"
              desc="Tukar poin setoran dengan hadiah menarik. Motivasi warga untuk rutin memilah sampah dari rumah."
              color="#f59e0b"
              delay="0.2s"
            />
            <FeatureCard
              icon={BarChart3}
              title="Laporan & Analitik"
              desc="Dashboard admin dengan grafik setoran, statistik per kategori, dan riwayat lengkap semua transaksi."
              color="#8b5cf6"
              delay="0.3s"
            />
            <FeatureCard
              icon={Users}
              title="Multi-User & Multi-TPS"
              desc="Kelola banyak TPS dan warga dalam satu platform terpusat. Admin dan warga memiliki akses berbeda."
              color="#06b6d4"
              delay="0.4s"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Aman & Terpercaya"
              desc="Autentikasi berbasis JWT, data terenkripsi, dan akses berbasis peran untuk keamanan data komunitas."
              color="#ec4899"
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* Left text */}
          <div>
            <div style={{
              display: 'inline-block', background: 'rgba(99,102,241,0.1)',
              color: '#6366f1', fontWeight: 700, fontSize: '0.8rem',
              padding: '0.375rem 1rem', borderRadius: '2rem',
              border: '1px solid rgba(99,102,241,0.2)', marginBottom: '1.25rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Cara Kerja
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Mulai dalam 3 Langkah Mudah
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Tidak perlu instalasi rumit. Daftar, setor sampah, dan dapatkan poin — semua dari browser kamu.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <StepCard
                num="1"
                title="Daftar & Pilih TPS"
                desc="Buat akun warga dan pilih Tempat Pembuangan Sampah (TPS) terdekat di kawasan RT/RW kamu."
              />
              <StepCard
                num="2"
                title="Setor Sampah & Kumpulkan Poin"
                desc="Pilah sampah di rumah, bawa ke TPS, petugas catat berat & jenis sampah, poin langsung masuk akun."
              />
              <StepCard
                num="3"
                title="Tukar Poin dengan Reward"
                desc="Poin yang terkumpul bisa ditukar dengan hadiah pilihan di halaman Redeem. Makin banyak setor, makin banyak reward!"
              />
            </div>
          </div>

          {/* Right: visual timeline card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)',
              borderRadius: '1.5rem', padding: '2rem',
              border: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                📋 Setoran Hari Ini
              </div>
              {[
                { name: 'Sampah Organik', weight: '5.2 kg', pts: 104, color: '#10b981', pct: 75 },
                { name: 'Anorganik (Plastik)', weight: '2.8 kg', pts: 84, color: '#3b82f6', pct: 55 },
                { name: 'Anorganik (Kertas)', weight: '1.5 kg', pts: 30, color: '#f59e0b', pct: 35 },
                { name: 'B3 (Baterai)', weight: '0.3 kg', pts: 18, color: '#ef4444', pct: 20 },
              ].map(item => (
                <div key={item.name} style={{ marginBottom: '1.125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{item.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>{item.weight}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: item.color }}>+{item.pts} pts</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '99px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: '1.5rem', padding: '1rem',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
                borderRadius: '0.875rem', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Total Poin Diperoleh</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>+236 pts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA SECTION ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}>
        <div style={{
          maxWidth: 860, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
          borderRadius: '2rem', padding: '4rem 3rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(16,185,129,0.12)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(14,165,233,0.1)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '2rem', padding: '0.375rem 1rem', marginBottom: '1.5rem',
            }}>
              <Leaf size={14} color="#10b981" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>
                Bergabung Sekarang · Gratis
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Siap Mengelola Bank Sampah Kawasan Anda?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 2.5rem' }}>
              Daftarkan kawasan RT/RW Anda dan mulai digitalisasi pengelolaan sampah hari ini. Gratis, mudah, dan langsung bisa dipakai.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: '#0f172a', padding: '3rem 1.5rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex' }}>
                <Leaf size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.375rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                Waste<span style={{ color: '#10b981' }}>Flow</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {['Tentang', 'Fitur', 'Kontak'].map(item => (
                <a key={item} href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = '#10b981'; }}
                  onMouseLeave={e => { e.target.style.color = '#64748b'; }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
            © 2026 WasteFlow Enterprise · Dibangun dengan ❤️ untuk komunitas Indonesia yang lebih bersih
          </div>
        </div>
      </footer>
    </div>
  );
}

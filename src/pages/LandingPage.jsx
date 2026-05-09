import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, ArrowRight, ShieldCheck, MapPin, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-eco-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-eco-600 to-teal-600 bg-clip-text text-transparent">
                WasteFlow
              </span>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-600 hover:text-eco-600 font-medium px-4 py-2 transition-colors">
                Masuk
              </Link>
              <Link to="/login" className="bg-eco-600 hover:bg-eco-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-eco-100 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-100 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Ubah Sampah Menjadi <span className="text-eco-600">Nilai Tambah</span> untuk Kawasan Anda
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Sistem Bank Sampah Digital skala enterprise untuk mengelola, melacak, dan mengkonversi setoran sampah kawasan RT/RW Anda secara efisien dan transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-eco-600 hover:bg-eco-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Akses Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Kenapa Memilih WasteFlow?</h2>
            <p className="mt-4 text-slate-500">Platform terintegrasi dengan fitur skala enterprise</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Recycle className="h-7 w-7 text-eco-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sortir & Konversi</h3>
              <p className="text-slate-600">
                Pencatatan jenis sampah organik, anorganik, hingga B3 secara presisi dengan sistem poin otomatis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Laporan Kapasitas</h3>
              <p className="text-slate-600">
                Monitoring *real-time* arus masuk (Deposit) dan keluar (Outbound) agar TPS Anda tidak pernah *overcapacity*.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Representatif Kawasan</h3>
              <p className="text-slate-600">
                Desain sistem yang berpusat pada komunitas (RT/RW), menjadikan pengumpulan poin kolektif lebih efektif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-eco-500" />
          <span className="text-xl font-bold text-white">WasteFlow</span>
        </div>
        <p>&copy; 2026 WasteFlow Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
}

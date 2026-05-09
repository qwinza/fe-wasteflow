import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

export default function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const transactions = [
    { id: 'TRX-001', type: 'Masuk', kawasan: 'RT 01 / RW 05', kategori: 'Organik', berat: '45 kg', poin: 450, tanggal: '2026-05-02' },
    { id: 'TRX-002', type: 'Keluar', tujuan: 'Pabrik Kompos A', kategori: 'Organik', berat: '100 kg', poin: '-', tanggal: '2026-05-01' },
    { id: 'TRX-003', type: 'Masuk', kawasan: 'RT 03 / RW 02', kategori: 'Anorganik', berat: '12 kg', poin: 180, tanggal: '2026-05-01' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari ID, Kawasan, Kategori..."
            className="pl-10 w-full rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-eco-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 font-medium text-slate-700 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-eco-600 text-white rounded-xl hover:bg-eco-700 font-medium transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="p-4 font-semibold">ID Transaksi</th>
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Sumber / Tujuan</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Berat</th>
              <th className="p-4 font-semibold">Poin / Status</th>
              <th className="p-4 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{trx.id}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    trx.type === 'Masuk' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trx.type}
                  </span>
                </td>
                <td className="p-4 text-slate-700">{trx.kawasan || trx.tujuan}</td>
                <td className="p-4 text-slate-700">{trx.kategori}</td>
                <td className="p-4 font-medium">{trx.berat}</td>
                <td className="p-4 font-medium text-eco-600">{trx.poin}</td>
                <td className="p-4 text-slate-500">{trx.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div>Menampilkan 1 hingga 3 dari 3 data</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}

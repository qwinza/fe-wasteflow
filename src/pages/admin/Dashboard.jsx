import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Scale, Recycle, AlertTriangle } from 'lucide-react';

// Mock Data (will be replaced with API later)
const capacityData = [
  { name: 'Senin', masuk: 400, keluar: 240, sisa: 160 },
  { name: 'Selasa', masuk: 300, keluar: 139, sisa: 321 },
  { name: 'Rabu', masuk: 200, keluar: 480, sisa: 41 },
  { name: 'Kamis', masuk: 278, keluar: 390, sisa: 0 },
  { name: 'Jumat', masuk: 189, keluar: 480, sisa: 0 },
  { name: 'Sabtu', masuk: 239, keluar: 380, sisa: 0 },
  { name: 'Minggu', masuk: 349, keluar: 430, sisa: 0 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Deposit Hari Ini" value="1,240 kg" icon={TrendingUp} color="text-blue-600" bgColor="bg-blue-100" />
        <MetricCard title="Sisa Kapasitas TPS" value="450 kg" icon={Scale} color="text-orange-600" bgColor="bg-orange-100" />
        <MetricCard title="Total Organik" value="850 kg" icon={Recycle} color="text-eco-600" bgColor="bg-eco-100" />
        <MetricCard title="Peringatan B3" value="2 Laporan" icon={AlertTriangle} color="text-red-600" bgColor="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Tren Kapasitas Mingguan</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capacityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="masuk" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart composition */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Komposisi Sampah</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'Kategori', Organik: 400, Anorganik: 300, B3: 200}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="Organik" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Anorganik" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="B3" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${bgColor}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

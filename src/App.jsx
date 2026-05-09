import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import TransactionTable from './pages/admin/TransactionTable';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<TransactionTable />} />
          <Route path="users" element={<div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-500">Fitur Kelola Kawasan Sedang Dibangun...</div>} />
          <Route path="locations" element={<div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-500">Fitur Kelola TPS Sedang Dibangun...</div>} />
        </Route>
        
        {/* Warga Routes (Placeholder) */}
        <Route path="/warga/home" element={<div className="min-h-screen flex items-center justify-center bg-eco-50"><h1 className="text-2xl font-bold text-eco-700">Selamat Datang di Portal Kawasan!</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

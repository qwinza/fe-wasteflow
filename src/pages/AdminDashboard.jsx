import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import OutboundForm from '../components/OutboundForm';

const AdminDashboard = () => {
  const [capacityData, setCapacityData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded locationId for demo purposes (e.g. 1 = TPS Pusat)
  const LOCATION_ID = 1;

  const fetchCapacity = async () => {
    try {
      setLoading(true);
      // Fallback data if API is not running
      const fallbackData = {
        locationId: 1,
        currentTotalStock: 450.5,
        breakdown: { "Organik": 200.0, "Anorganik": 200.5, "B3": 50.0 }
      };
      
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/reports/capacity/${LOCATION_ID}`);
        setCapacityData(res.data);
      } catch (e) {
        console.log("Using fallback data for Admin Dashboard", e);
        setCapacityData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching capacity data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacity();
  }, []);

  if (loading) return <div className="container">Loading Dashboard...</div>;

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p className="form-label" style={{marginBottom: '2rem'}}>Monitor sisa kapasitas TPS dan aktivitas distribusi.</p>

      <div className="grid-3">
        <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Stock TPS</h3>
            <Package color="var(--secondary)" />
          </div>
          <h1 style={{ margin: '1rem 0 0', color: 'var(--secondary)' }}>
            {capacityData?.currentTotalStock} kg
          </h1>
        </div>
        
        {capacityData?.breakdown && Object.entries(capacityData.breakdown).map(([kategori, berat], idx) => (
          <div className="card" key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{kategori}</h3>
              {kategori === 'B3' ? <AlertTriangle color="var(--danger)" /> : <Trash2 color="var(--text-muted)" />}
            </div>
            <h2 style={{ margin: '1rem 0 0' }}>{berat} kg</h2>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Catat Pengeluaran (Outbound)</h2>
        <div className="card" style={{ maxWidth: '600px' }}>
          <OutboundForm onOutboundSuccess={fetchCapacity} locationId={LOCATION_ID} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

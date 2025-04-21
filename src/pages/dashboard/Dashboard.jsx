import { FaBoxOpen, FaClipboardList, FaChartLine, FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import RevenueChart from './RevenueChart';
import ManageOrders from './manageOrders/manageOrder';
import "../../Styles/Stylesdashboard.css"

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div dir="ltr" className="dashboard-main">
      {/* 📊 Stats */}
      <section className="dashboard-stats">
        {[
          { icon: <FaUser />, value: data?.totalUsers, label: "Utilisateurs Totals" },
          { icon: <FaBoxOpen />, value: data?.totalProducts, label: "Total des Produits" },
          { icon: <FaChartLine />, value: `${data?.totalSales} USD`, label: "Total des Ventes" },
          { icon: <FaClipboardList />, value: data?.totalOrders, label: "Total des Commandes" },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* 📈 Chart */}
      <section className="dashboard-section">
        <div className="font-semibold mb-4 text-lg">Le nombre de commandes par mois</div>
        <div className="chart-container">
          <RevenueChart />
        </div>
      </section>

      {/* 🧾 Orders */}
      <section className="dashboard-section">
        <ManageOrders />
      </section>
    </div>
  );
};

export default Dashboard;

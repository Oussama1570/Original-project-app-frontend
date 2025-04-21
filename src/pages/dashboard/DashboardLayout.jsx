import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaTools, FaBars, FaSignOutAlt } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import HomeIcone from "../../../src/assets/Logo/Menu Home.svg";
import "../../Styles/StylesDashboardLayout.css"


const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté du panneau d'administration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Déconnectez-moi !",
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      Swal.fire({
        title: "Déconnecté !",
        text: "La session administrateur a été terminée avec succès.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
        timer: 2000,
      });
      navigate("/");
    }
  };

  return (
    <section className="dashboard-layout">
      <Helmet>
        <title>Tableau de Bord</title>
      </Helmet>

      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="home-link">
          <img src={HomeIcone} alt="Home" className="h-8 w-8 object-contain rounded" />
        </Link>

        <Link to="/dashboard" className="active">
          <FaTachometerAlt />
        </Link>
        <Link to="/dashboard/add-new-product">
          <FaPlusCircle />
        </Link>
        <Link to="/dashboard/manage-products">
          <MdProductionQuantityLimits />
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className='Dashboard-Title'>Tableau de Bord</h1>
          <div className="dashboard-header-buttons">
            <Link to="/dashboard/add-new-product">
              <button className="btn blue">
                <FaPlusCircle className="mr-2" /> Ajouter un Produit
              </button>
            </Link>
            <Link to="/dashboard/manage-products">
              <button className="btn green">
                <FaTools className="mr-2" /> Gérer les Produits
              </button>
            </Link>
            <button className="btn red" onClick={handleLogout}>
              <FaSignOutAlt className="mr-2" /> Se Déconnecter
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;

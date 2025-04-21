import { Link } from "react-router-dom";
import { FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesNavbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem("token");

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      <nav className="navbar-content">
        {/* Logo */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-text">Logo Name</span>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FiMenu className="menu-icon" />
        </button>

        {/* Desktop Links */}
        <ul className="nav-links desktop-only">
          <li><Link to="/">{t("home")}</Link></li>
          <li><Link to="/products">{t("products")}</Link></li>
          <li><Link to="/about">{t("about-menu")}</Link></li>
          <li><Link to="/contact">{t("contact-menu")}</Link></li>
        </ul>

        {/* Icons */}
        <div className="nav-icons">
          <Link to="/cart" className="cart-icon">
            <FiShoppingBag className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>

          {currentUser ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-avatar-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FiUser className="user-icon logged-in" />
              </button>
              {isDropdownOpen && (
                <div className="user-dropdown active">
                  <ul>
                    <li><Link to="/user-dashboard">{t("dashboard")}</Link></li>
                    <li><Link to="/orders">{t("orders")}</Link></li>
                    <li><button onClick={logout}>{t("logout")}</button></li>
                  </ul>
                </div>
              )}
            </div>
          ) : token ? (
            <Link to="/dashboard" className={`dashboard-link ${isRTL ? "dashboard-rtl" : "dashboard-ltr"}`}>
              {t("dashboard")}
            </Link>
          ) : (
            <Link to="/login" className="login-icon">
              <FiUser className="icon" />
            </Link>
          )}

          <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-panel">
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FiX />
          </button>
          <ul>
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t("home")}</Link></li>
            <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("products")}</Link></li>
            <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t("about-menu")}</Link></li>
            <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t("contact-menu")}</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;

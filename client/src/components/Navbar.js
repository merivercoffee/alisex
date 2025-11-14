import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

function Navbar({
  isAuthenticated,
  user,
  onLogout,
  currency,
  language,
  onCurrencyChange,
  onLanguageChange,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GlobalShop
        </Link>

        <div className="navbar-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>

          <div className="navbar-selectors">
            <select
              value={currency}
              onChange={(e) => {
                onCurrencyChange(e.target.value);
                setIsMenuOpen(false);
              }}
              className="navbar-select"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
              <option value="INR">INR</option>
            </select>

            <select
              value={language}
              onChange={(e) => {
                onLanguageChange(e.target.value);
                setIsMenuOpen(false);
              }}
              className="navbar-select"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {isAuthenticated ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <FiUser /> {user?.firstName}
              </Link>
              <Link to="/cart" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <FiShoppingCart /> Cart
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar-link navbar-register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

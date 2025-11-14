import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCurrency = localStorage.getItem('currency') || 'USD';
    const storedLanguage = localStorage.getItem('language') || 'en';

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setCurrency(storedCurrency);
    setLanguage(storedLanguage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          currency={currency}
          language={language}
          onCurrencyChange={handleCurrencyChange}
          onLanguageChange={handleLanguageChange}
        />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage currency={currency} />} />
            <Route path="/products" element={<ProductsPage currency={currency} />} />
            <Route path="/products/:id" element={<ProductDetailPage currency={currency} />} />
            <Route
              path="/cart"
              element={<CartPage isAuthenticated={isAuthenticated} currency={currency} />}
            />
            <Route
              path="/checkout"
              element={<CheckoutPage isAuthenticated={isAuthenticated} currency={currency} />}
            />
            <Route
              path="/orders"
              element={<OrdersPage isAuthenticated={isAuthenticated} currency={currency} />}
            />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLogin} />}
            />
            <Route
              path="/register"
              element={<RegisterPage onRegisterSuccess={handleLogin} />}
            />
            <Route
              path="/profile"
              element={<ProfilePage isAuthenticated={isAuthenticated} user={user} />}
            />
          </Routes>
        </main>

        <Footer language={language} />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;

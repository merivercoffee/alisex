import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

function HomePage({ currency }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [currency]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        params: {
          limit: 8,
          currency: currency,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.post(
        '/api/cart/add',
        {
          productId: product._id,
          quantity: 1,
          currency: currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to GlobalShop</h1>
          <p>Your trusted global e-commerce platform</p>
          <Link to="/products" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-item">
          <h3>🌍 Global Products</h3>
          <p>Shop from sellers worldwide</p>
        </div>
        <div className="feature-item">
          <h3>💱 Multi-Currency</h3>
          <p>Pay in your preferred currency</p>
        </div>
        <div className="feature-item">
          <h3>🚚 Fast Shipping</h3>
          <p>Quick international delivery</p>
        </div>
        <div className="feature-item">
          <h3>🛡️ Secure Payment</h3>
          <p>Protected transactions</p>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;

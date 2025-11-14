import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
          alt={product.name}
        />
      </div>

      <div className="product-info">
        <Link to={`/products/${product._id}`} className="product-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <p className="product-seller">
          by {product.seller_info?.seller_name || 'Unknown'}
        </p>

        <div className="product-rating">
          <FiStar className="star" />
          <span>{product.ratings?.average?.toFixed(1) || 'N/A'}</span>
          <span className="rating-count">({product.ratings?.count || 0})</span>
        </div>

        <div className="product-price">
          <span className="price">
            {product.displayCurrency} {product.displayPrice?.toFixed(2) || product.price?.toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <span className="stock available">In Stock</span>
          ) : (
            <span className="stock out-of-stock">Out of Stock</span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
        >
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import '../styles/ProductDetailPage.css';

function ProductDetailPage({ currency }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id, currency]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`, {
        params: { currency },
      });
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Failed to fetch product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        '/api/cart/add',
        {
          productId: product._id,
          quantity,
          currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Product added to cart');
      navigate('/cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    const rating = parseInt(e.target.rating.value);
    const comment = e.target.comment.value;

    try {
      const response = await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(response.data.product);
      e.target.reset();
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
              alt={product.name}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name}-${idx}`} />
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="seller-info">
            <p>Sold by: {product.seller_info?.seller_name}</p>
            <p>From: {product.seller_info?.seller_country}</p>
          </div>

          <div className="rating">
            <FiStar />
            <span>{product.ratings?.average?.toFixed(1) || 'N/A'}</span>
            <span>({product.ratings?.count || 0} reviews)</span>
          </div>

          <div className="price-section">
            <h2 className="price">
              {product.displayCurrency} {product.displayPrice?.toFixed(2)}
            </h2>
            {product.stock > 0 ? (
              <p className="stock available">In Stock</p>
            ) : (
              <p className="stock out-of-stock">Out of Stock</p>
            )}
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.shipping_info && (
            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <p>Processing Time: {product.shipping_info.processing_time}</p>
              <p>Estimated Delivery: {product.shipping_info.estimated_delivery}</p>
              {product.shipping_info.weight && <p>Weight: {product.shipping_info.weight} kg</p>}
            </div>
          )}

          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={idx} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.user?.firstName}</span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>

        <div className="add-review">
          <h3>Add Your Review</h3>
          <form onSubmit={handleAddReview}>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <select id="rating" name="rating" required>
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

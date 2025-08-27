import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import Loading from '../components/ui/Loading';
import { Star, ArrowLeft } from 'react-feather';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.image) {
      setSelectedImage(selectedProduct.image);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      ...selectedProduct, 
      quantity,
      price: selectedProduct.price * quantity
    }));
    // Optional: Show a toast notification here
  };

  const renderRating = (rate) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={20} fill="#ffb400" color="#ffb400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} size={20} fill="#ffb400" color="#ffb400" />);
      } else {
        stars.push(<Star key={i} size={20} color="#ddd" />);
      }
    }
    
    return (
      <div className="rating">
        {stars}
        <span className="rating-count">({selectedProduct?.rating?.count} reviews)</span>
      </div>
    );
  };

  if (status === 'loading' && !selectedProduct) return <Loading />;
  if (status === 'failed') return <div className="error">Error: {error}</div>;
  if (!selectedProduct) return null;

  // Create an array of images (using the main image and additional images if available)
  const images = [
    selectedProduct.image,
    // Add more images here if available in the API response
  ].filter(Boolean);

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        Back to Products
      </Link>
      
      <div className="product-container">
        <div className="gallery">
          <img 
            src={selectedImage || selectedProduct.image} 
            alt={selectedProduct.title} 
            className="main-image" 
          />
          {images.length > 1 && (
            <div className="thumbnail-container">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedProduct.title} - ${index + 1}`}
                  className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <span className="product-category">
            {selectedProduct.category}
          </span>
          <h1 className="product-title">{selectedProduct.title}</h1>
          
          {selectedProduct.rating && renderRating(selectedProduct.rating.rate)}
          
          <p className="product-price">
            ${selectedProduct.price.toFixed(2)}
          </p>
          
          <p className="product-description">
            {selectedProduct.description}
          </p>
          
          <div className="quantity-selector">
            <label className="quantity-label">Quantity:</label>
            <select 
              className="quantity-select"
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

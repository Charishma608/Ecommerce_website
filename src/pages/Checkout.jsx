import { useSelector, useDispatch } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotal } from '../redux/cartSlice';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Loader } from 'react-feather';
import './Checkout.css';

export default function Checkout() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  
  const [errors, setErrors] = useState({});
  const shippingFee = cartTotal > 0 ? 5.99 : 0;
  const tax = (cartTotal * 0.1);
  const grandTotal = (cartTotal + tax + shippingFee).toFixed(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(form.zip)) {
      newErrors.zip = 'Invalid ZIP code';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const orderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Save order to localStorage
      const order = {
        id: orderNum,
        date: new Date().toISOString(),
        items: cartItems,
        total: grandTotal,
        shipping: { ...form }
      };
      
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.unshift(order);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      // Clear cart and show success
      dispatch(clearCart());
      setOrderPlaced(true);
      
    } catch (error) {
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>There are no items in your cart to checkout.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-icon">
          <CheckCircle size={64} />
        </div>
        <h2>Order Confirmed!</h2>
        <p className="confirmation-text">
          Thank you for your purchase! We've sent an order confirmation to <strong>{form.email}</strong>.
        </p>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${grandTotal}</span>
          </div>
        </div>
        <div className="confirmation-actions">
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="cherry@gmail.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                placeholder="183 Ashok nagar"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Mumbai"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleInputChange}
                  className={errors.zip ? 'error' : ''}
                  placeholder="10001"
                />
                {errors.zip && <span className="error-message">{errors.zip}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="form-error">
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="spinner" size={18} />
                  Processing...
                </>
              ) : (
                `Pay $${grandTotal}`
              )}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <div className="item-price">${item.price} x {item.quantity}</div>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

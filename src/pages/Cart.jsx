import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'react-feather';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartItemCount,
  removeFromCart, 
  updateQuantity 
} from '../redux/cartSlice';
import './Cart.css';

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const shippingFee = cartTotal > 0 ? 5.99 : 0; // Example shipping fee
  const tax = (cartTotal * 0.1).toFixed(2); // Example tax 10%
  const grandTotal = (parseFloat(cartTotal) + parseFloat(tax) + parseFloat(shippingFee)).toFixed(2);

  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(updateQuantity({ id: itemId, quantity: Number(newQuantity) }));
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      dispatch(removeFromCart(itemId));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-text">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="cart-empty-link">
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
      </header>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-image-container">
              <img 
                src={item.image} 
                alt={item.title} 
                className="item-image" 
                loading="lazy"
              />
              {item.quantity > 1 && (
                <span className="item-count-badge">{item.quantity}</span>
              )}
            </div>
            <div className="item-details">
              <Link to={`/product/${item.id}`} className="item-title">
                {item.title}
              </Link>
              <span className="item-category">{item.category}</span>
            </div>
            <div className="item-price">${item.price.toFixed(2)}</div>
            <div className="quantity-selector">
              <select
                className="quantity-select"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                aria-label="Select quantity"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              className="remove-btn" 
              onClick={() => handleRemoveItem(item.id)}
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2 className="summary-title">Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>${parseFloat(cartTotal).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>${tax}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>${grandTotal}</span>
        </div>
        
        <Link 
          to="/checkout" 
          className="checkout-btn"
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </Link>
        
        <Link 
          to="/" 
          className="cart-empty-link"
          style={{
            marginTop: '1.5rem',
            width: '100%',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            padding: '0.75rem 1.5rem'
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

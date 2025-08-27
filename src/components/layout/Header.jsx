import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart } from 'react-feather';
import { selectCartItemCount } from '../../redux/cartSlice';
import './styles/Header.css';

/**
 * Header component that displays the site navigation and cart information
 * @returns {JSX.Element} The rendered header with navigation and cart link
 */
export default function Header() {
  const itemCount = useSelector(selectCartItemCount);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">E-Commerce Store</span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="cart-link">
            <ShoppingCart size={20} className="cart-icon" />
            <span className="cart-text">Cart</span>
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

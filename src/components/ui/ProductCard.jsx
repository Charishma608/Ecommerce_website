import { Link } from 'react-router-dom';
import './styles/ProductCard.css';

/**
 * ProductCard component that displays a product's basic information
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object containing product details
 * @param {number} props.product.id - The unique identifier for the product
 * @param {string} props.product.title - The title of the product
 * @param {number} props.product.price - The price of the product
 * @param {string} props.product.image - The URL of the product image
 * @returns {JSX.Element} A card component displaying product information
 */
export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p>${product.price}</p>
      <Link to={`/product/${product.id}`} className="view-link">View</Link>
    </div>
  );
}

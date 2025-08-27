import ProductCard from '../ui/ProductCard';
import './styles/ProductGrid.css';

/**
 * ProductGrid component that displays a grid of ProductCard components
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects to be displayed
 * @returns {JSX.Element} A grid layout of ProductCard components
 */
export default function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

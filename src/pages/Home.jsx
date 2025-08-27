import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchProducts, 
  selectFilteredProducts, 
  setSearchQuery, 
  setSelectedCategory 
} from '../redux/productsSlice';
import ProductGrid from '../components/features/ProductGrid';
import Loading from '../components/ui/Loading';
import './Home.css';

export default function Home() {
  const dispatch = useDispatch();
  const { 
    status, 
    error, 
    searchQuery, 
    categories, 
    selectedCategory 
  } = useSelector(state => state.products);
  
  const filteredProducts = useSelector(selectFilteredProducts);

  useEffect(() => { 
    if (status === 'idle') {
      dispatch(fetchProducts()); 
    }
  }, [dispatch, status]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  if (status === 'loading' && !filteredProducts.length) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container error">
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(fetchProducts())}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search products"
          />
        </div>
        
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
            aria-label="Filter by category"
          >
            {categories?.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === 'loading' && filteredProducts.length > 0 && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}

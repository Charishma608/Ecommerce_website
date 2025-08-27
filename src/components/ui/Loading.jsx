import './styles/Loading.css';

/**
 * Loading component that displays a spinner and loading message
 * @returns {JSX.Element} A loading spinner with text
 */
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loading-text">Loading products...</p>
    </div>
  );
}

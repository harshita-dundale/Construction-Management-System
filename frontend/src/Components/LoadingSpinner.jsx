import Header from "../Components/Header";
import "./LoadingSpinner.css";
const LoadingSpinner = ({
  loading = false,
  error = null,
  message = "Loading...",
  title = "Loading Data...",
  subtitle = "Please wait while we fetch information.",
  size = "medium",
  showHeader = true,
}) => {
  if (loading) {
    return (
      <>
        {showHeader && <Header />}
        <div className="modern-loading-container">
          <div className="loading-content">
            <div className={`modern-spinner ${size}`}>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-pulse"></div>
            </div>
            <div className="loading-text">
              <h3 className="loading-title">{title}</h3>
              <p className="loading-subtitle">{subtitle || message}</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }

  if (error) {
    return (
      <>
        {showHeader && <Header />}
        <div className="modern-error-container">
          <div className="error-content">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="error-title">Oops! Something went wrong</h3>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
          </div>
        </div>
  
      </>
    );
  }

  return null;
};

export default LoadingSpinner;

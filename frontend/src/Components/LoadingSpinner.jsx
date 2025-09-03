const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
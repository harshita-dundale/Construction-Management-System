import React from 'react';

const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium", 
    large: "spinner-large"
  };

  return (
    <div className="loading-container fade-in">
      <div className={`spinner-modern ${sizeClasses[size]}`}></div>
      <p className="loading-message">{message}</p>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          min-height: 200px;
        }
        
        .spinner-modern {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #051821;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }
        
        .spinner-small {
          width: 30px;
          height: 30px;
          border-width: 3px;
        }
        
        .spinner-medium {
          width: 50px;
          height: 50px;
          border-width: 4px;
        }
        
        .spinner-large {
          width: 70px;
          height: 70px;
          border-width: 5px;
        }
        
        .loading-message {
          color: #051821;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .loading-container {
            padding: 2rem;
            min-height: 150px;
          }
          
          .loading-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
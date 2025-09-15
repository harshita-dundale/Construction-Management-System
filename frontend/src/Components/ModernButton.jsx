import React from 'react';

const ModernButton = ({ 
  children, 
  variant = "primary", 
  size = "medium", 
  icon = null,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  ...props 
}) => {
  const variants = {
    primary: "btn-modern-primary",
    secondary: "btn-modern-secondary", 
    success: "btn-modern-success",
    danger: "btn-modern-danger",
    warning: "btn-modern-warning",
    outline: "btn-modern-outline"
  };

  const sizes = {
    small: "btn-sm",
    medium: "btn-md", 
    large: "btn-lg"
  };

  const buttonClass = `btn ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="btn-spinner"></div>
          Loading...
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`}></i>}
          {children}
        </>
      )}
      
      <style jsx>{`
        .btn {
          border-radius: 12px;
          font-weight: 600;
           transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-modern-primary {
          background: linear-gradient(135deg, #051821 0%, #266867 100%);
          color: white;
        }

        .btn-modern-secondary {
          background: linear-gradient(135deg, #f58800 0%, #ff9500 100%);
          color: white;
        }

        .btn-modern-success {
          background: linear-gradient(135deg, #266867 0%, #3b9a89 100%);
          color: white;
        }

        .btn-modern-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
        }

        .btn-modern-warning {
          background: linear-gradient(135deg, #f58800 0%, #ff9500 100%);
          color: white;
        }

        .btn-modern-outline {
          background: transparent;
          border: 2px solid #051821;
          color: #051821;
        }

        .btn-modern-outline:hover {
          background: linear-gradient(135deg, #051821 0%, #266867 100%);
          border-color: transparent;
          color: white;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        }

        .btn-md {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-height: 44px;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          min-height: 52px;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .btn {
            min-height: 48px;
            padding: 12px 20px;
            font-size: 14px;
          }

          .btn-sm {
            min-height: 40px;
            padding: 8px 16px;
            font-size: 13px;
          }

          .btn-lg {
            min-height: 56px;
            padding: 16px 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </button>
  );
};

export default ModernButton;
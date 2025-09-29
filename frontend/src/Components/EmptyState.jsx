import React from 'react';

const EmptyState = ({ 
  icon = "fas fa-inbox", 
  title = "No Data Found", 
  message = "There's nothing to display here yet.",
  actionButton = null,
  size = "medium"
}) => {
  const sizeClasses = {
    small: { icon: "3rem", padding: "2rem" },
    medium: { icon: "4rem", padding: "3rem" },
    large: { icon: "5rem", padding: "4rem" }
  };

  return (
    <div className="empty-state-modern fade-in">
      <i className={`${icon} empty-icon`}></i>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-message">{message}</p>
      {actionButton && (
        <div className="empty-action">
          {actionButton}
        </div>
      )}
      
      <style jsx>{`
        .empty-state-modern {
          text-align: center;
          padding: ${sizeClasses[size].padding};
          color: #6c757d;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-icon {
          font-size: ${sizeClasses[size].icon};
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        
        .empty-title {
          color: #000000;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .empty-message {
          line-height: 1.6;
          margin-bottom: 2rem;
          color: #495057;
        }
        
        .empty-action {
          margin-top: 1.5rem;
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @media (max-width: 768px) {
          .empty-state-modern {
            padding: 2rem 1rem;
          }
          
          .empty-icon {
            font-size: 3rem;
          }
          
          .empty-title {
            font-size: 1.2rem;
          }
          
          .empty-message {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
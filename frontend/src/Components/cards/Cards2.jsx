/* eslint-disable react/prop-types */
import React from 'react';

function Cards2({ imgSrc, title, text, buttonText, onClick }) {
  return (
    <div className="worker-card-wrapper">
      <div className="modern-worker-card" onClick={onClick}>
        <div className="worker-card-header">
          <div className="worker-icon-container">
            <img src={imgSrc} className="worker-service-icon" alt={title} />
          </div>
          <div className="worker-card-badge">
            <i className="fas fa-user-check"></i>
          </div>
        </div>
        
        <div className="worker-card-content">
          <h5 className="worker-service-title">{title}</h5>
          <p className="worker-service-description">{text}</p>
        </div>
        
        <div className="worker-card-action">
          <button className="btn-worker-action">
            {buttonText}
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
        
        <div className="worker-card-overlay"></div>
      </div>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .worker-card-wrapper {
          padding: 0.5rem;
        }
        
        .modern-worker-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
          border-left: 5px solid #11998e;
        }
        
        .modern-worker-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(17, 153, 142, 0.15);
          border-left-color: #38ef7d;
        }
        
        .modern-worker-card:hover .worker-card-overlay {
          opacity: 1;
        }
        
        .modern-worker-card:hover .worker-card-badge {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .worker-card-header {
          position: relative;
          margin-bottom: 2rem;
        }
        
        .worker-icon-container {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(17, 153, 142, 0.3);
        }
        
        .modern-worker-card:hover .worker-icon-container {
          transform: scale(1.1) rotate(5deg);
        }
        
        .worker-service-icon {
          width: 70px;
          height: 70px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        
        .worker-card-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          opacity: 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        
        .worker-card-content {
          flex-grow: 1;
          margin-bottom: 2rem;
        }
        
        .worker-service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .worker-service-description {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 0;
          font-size: 1rem;
        }
        
        .worker-card-action {
          margin-top: auto;
        }
        
        .btn-worker-action {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border: none;
          border-radius: 25px;
          color: white;
          padding: 1rem 2.5rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
        }
        
        .btn-worker-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
          color: white;
        }
        
        .worker-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .modern-worker-card {
            padding: 2rem 1.5rem;
          }
          
          .worker-icon-container {
            width: 80px;
            height: 80px;
            padding: 1rem;
          }
          
          .worker-service-icon {
            width: 50px;
            height: 50px;
          }
          
          .worker-service-title {
            font-size: 1.25rem;
          }
          
          .worker-service-description {
            font-size: 0.95rem;
          }
          
          .btn-worker-action {
            padding: 0.875rem 2rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Cards2;
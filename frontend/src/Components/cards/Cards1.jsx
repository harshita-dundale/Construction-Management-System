
/* eslint-disable react/prop-types */
function Cards({ imgSrc, title, text, buttonText, onClick }) {  
  return (
    <div className="modern-card-wrapper">
      <div className="modern-service-card" onClick={onClick}>
        <div className="card-header-section">
          <div className="icon-container">
            <img src={imgSrc} className="service-icon" alt={title} />
          </div>
          <div className="card-badge">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        
        <div className="card-content">
          <h5 className="service-title">{title}</h5>
          <p className="service-description">{text}</p>
        </div>
        
        <div className="card-action">
          <button className="btn-service-action">
            {buttonText}
            <i className="fas fa-chevron-right ms-2"></i>
          </button>
        </div>
        
        <div className="card-overlay"></div>
      </div>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-card-wrapper {
          padding: 0.5rem;
        }
        
        .modern-service-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        
        .modern-service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .modern-service-card:hover .card-overlay {
          opacity: 1;
        }
        
        .modern-service-card:hover .card-badge {
          opacity: 1;
          transform: rotate(45deg);
        }
        
        .card-header-section {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .icon-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          padding: 1rem;
          transition: all 0.3s ease;
        }
        
        .modern-service-card:hover .icon-container {
          transform: scale(1.1);
        }
        
        .service-icon {
          width: 50px;
          height: 50px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        
        .card-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .card-content {
          flex-grow: 1;
          margin-bottom: 1.5rem;
        }
        
        .service-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .service-description {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 0;
          font-size: 0.95rem;
        }
        
        .card-action {
          margin-top: auto;
        }
        
        .btn-service-action {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          color: white;
          padding: 0.75rem 2rem;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-service-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          color: white;
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .modern-service-card {
            padding: 1.5rem;
          }
          
          .icon-container {
            width: 60px;
            height: 60px;
          }
          
          .service-icon {
            width: 35px;
            height: 35px;
          }
          
          .service-title {
            font-size: 1.1rem;
          }
          
          .service-description {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Cards;
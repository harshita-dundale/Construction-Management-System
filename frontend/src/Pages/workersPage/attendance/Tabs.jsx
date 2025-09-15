import { useState } from "react";

const Tabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="modern-tabs-wrapper">
      {/* Tab Headers */}
      <div className="tabs-header">
        <div className="tabs-nav">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`modern-tab-btn ${activeTab === index ? 'active' : ''}`}
            >
              <i className="fas fa-briefcase me-2"></i>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {children[activeTab]}
      </div>
      
      <style jsx>{`
        .modern-tabs-wrapper {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .tabs-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .tabs-nav {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .modern-tab-btn {
          background: transparent;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          color: #6c757d;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .modern-tab-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          color: #667eea;
          // transform: translateY(-2px);
        }
        
        .modern-tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .tab-content {
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .tabs-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .modern-tab-btn {
            flex-shrink: 0;
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .tab-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Tabs;

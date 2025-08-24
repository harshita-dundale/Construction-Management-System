import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../Redux/applicationsSlice';
import { setActiveTab } from '../../Redux/AppliTabsSlice';
import { FaTasks, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './ApplicationTabs.css'

const ApplicationTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.appTabs.activeTab);

  const tabs = [
    { name: 'All', icon: <FaTasks /> },
    { name: 'joined', icon: <FaCheckCircle /> }, 
    { name: 'accepted', icon: <FaCheckCircle /> }, 
    { name: 'under_review', icon: <FaClock /> },   
    { name: 'rejected', icon: <FaTimesCircle /> }, 
  ];

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));
    dispatch(setFilter(tab)); // Set filter when tab changes
  };

  return (
    <div className="applications-container">
      {/* Header Section */}
      <div className="applications-header">
        <div className="header-content">
          <h3 className="header-title">
            <i className="fas fa-file-alt me-2"></i>
            My Applications
          </h3>
          <p className="header-subtitle">Track and manage your job applications</p>
        </div>
      </div>
      
      <div className="modern-tabs-container">
        <div className="tabs-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`modern-tab ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.name)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-text">{tab.name.replace('_', ' ')}</span>
              {activeTab === tab.name && <div className="tab-indicator"></div>}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .applications-container {
          margin: 2rem 0;
        }
        
        .applications-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px 15px 0 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          text-align: center;
        }
        
        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }
        
        .modern-tabs-container {
          background: white;
          border-radius: 0 0 15px 15px;
          padding: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-top: 0;
        }
        
        .tabs-wrapper {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .modern-tab {
          position: relative;
          background: transparent;
          border: 2px solid #e9ecef;
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.3s ease;
          cursor: pointer;
          text-transform: capitalize;
        }
        
        .modern-tab:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }
        
        .modern-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .tab-icon {
          font-size: 1rem;
        }
        
        .tab-text {
          font-size: 0.9rem;
        }
        
        .tab-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: #ffd700;
          border-radius: 50%;
        }
        
        @media (max-width: 768px) {
          .tabs-wrapper {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .modern-tab {
            flex-shrink: 0;
            padding: 0.6rem 1.2rem;
          }
          
          .tab-text {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationTabs;
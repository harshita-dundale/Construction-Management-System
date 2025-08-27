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
    // { name: 'accepted', icon: <FaCheckCircle /> }, 
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
        </div>
        <p className="header-subtitle">Track and manage your job applications</p>
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
      {/* <style jsx>{`
      
      `}</style> */}
    </div>
  );
};

export default ApplicationTabs;
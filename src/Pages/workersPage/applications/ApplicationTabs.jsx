import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTasks, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ApplicationTabs = ({ setFilter }) => {
  const tabs = [
    { name: 'All', icon: <FaTasks /> },
    { name: 'Pending', icon: <FaClock /> },
    { name: 'Selected', icon: <FaCheckCircle /> },
    { name: 'Rejected', icon: <FaTimesCircle /> },
  ];

  const [activeTab, setActiveTab] = useState('All');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFilter(tab);
  };

  return (
    <ul className="nav nav-tabs mt-3">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.name}>
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.name)}
            style={{
              color: '#051821',
            }}
          >
            {tab.icon} {tab.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ApplicationTabs;

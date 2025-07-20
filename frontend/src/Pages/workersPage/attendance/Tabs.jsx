import { useState } from "react";
import './Tabs.css';

const Tabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-container py-4" style={{ margin: "0 1.5rem" }}>
      {/* Tab Headers */}
      <div className="row">
        <div className="tab-header-container pb-3">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="tab-content-container mt-3 pt-2">
          {children[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default Tabs;

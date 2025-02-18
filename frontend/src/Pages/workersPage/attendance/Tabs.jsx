// import React, { useState } from 'react';

// const Tabs = ({ tabs, children }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   return (
//     <div>
//       {/* Tab Headers */}
//       <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #ccc' }}>
//         {tabs.map((tab, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveTab(index)}
//             style={{
//               padding: '10px 20px',
//               border: 'none',
//               backgroundColor: activeTab === index ? '#4CAF50' : '#f1f1f1',
//               color: activeTab === index ? 'white' : 'black',
//               cursor: 'pointer',
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div style={{ marginTop: '20px' }}>
//         {/* Render only the active tab's content */}
//         {React.Children.toArray(children)[activeTab]}
//       </div>
//     </div>
//   );
// };

// export default Tabs;


import React, { useState } from 'react';
import './Tabs.css'; // Make sure to create this CSS file and import it

const Tabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-container">
      {/* Tab Headers */}
      <div className="tab-header-container">
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

      {/* Tab Content */}
      <div className="tab-content-container">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export default Tabs;

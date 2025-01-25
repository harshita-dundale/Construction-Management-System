import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../Redux/AppliModelSlice';
import { setActiveTab } from '../../Redux/AppliTabsSlice';
import { FaTasks, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ApplicationTabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.appTabs.activeTab);

  const tabs = [
    { name: 'All', icon: <FaTasks /> },
    { name: 'Pending', icon: <FaClock /> },
    { name: 'Selected', icon: <FaCheckCircle /> },
    { name: 'Rejected', icon: <FaTimesCircle /> },
  ];

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));
    dispatch(setFilter(tab)); // Set filter when tab changes
  };

  return (
    <ul className="nav nav-tabs mt-3">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.name}>
          <button
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.name)}
            style={{ color: '#051821' }}
          >
            {tab.icon} {tab.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ApplicationTabs;


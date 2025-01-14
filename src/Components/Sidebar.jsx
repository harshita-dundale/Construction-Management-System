import  { useState } from "react";
import { Link } from "react-router-dom";
// import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h3 className="sidebar-title">ConstrucHub</h3>
        <ul className="sidebar-list">
          <li>
            <Link to="/browse-jobs" className="sidebar-link">
              <i className="fa fa-briefcase me-2"></i>Browse Jobs
            </Link>
          </li>
          <li>
            <Link to="/applications" className="sidebar-link">
              <i className="fa fa-folder-open me-2"></i>Applications
            </Link>
          </li>
          <li>
            <Link to="/attendances" className="sidebar-link">
              <i className="fa fa-calendar-check me-2"></i>Attendance
            </Link>
          </li>
          <li>
            <Link to="/payments" className="sidebar-link">
              <i className="fa fa-money-bill me-2"></i>Payments
            </Link>
          </li>
          <li>
            <Link to="/support" className="sidebar-link">
              <i className="fa fa-question-circle me-2"></i>Support
            </Link>
          </li>
          <li>
            <Link to="/logout" className="sidebar-link">
              <i className="fa fa-sign-out-alt me-2"></i>Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger-menu d-md-none" onClick={toggleSidebar}>
        <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
      </div>
    </>
  );
}

export default Sidebar;

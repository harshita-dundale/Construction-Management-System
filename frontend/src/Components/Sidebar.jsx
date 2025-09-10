import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth0();
  
  const currentPath = location.pathname.toLowerCase();

  const builderPaths = [
    "/project_pannel",
    "/viewpostedjobs", 
    "/materialmanagement",
    "/dashboard",
    "/profitandcostanalysis",
    "/viewapplications",
    "/hiredworkers",
    "/post-job",
    "/attendance/worker",
    "/payroll",
    "/builder-dashboard"
  ];

  const isBuilderPage = builderPaths.some((path) => currentPath.startsWith(path));
  const isBuilderDashboard = currentPath === "/builder-dashboard";
  
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

  // Update body class when sidebar state changes
  useEffect(() => {
    if (isBuilderPage && !isBuilderDashboard) {
      document.body.classList.toggle('sidebar-collapsed', isCollapsed);
      document.body.classList.add('has-sidebar');
    } else {
      document.body.classList.remove('has-sidebar', 'sidebar-collapsed');
    }
    
    return () => {
      document.body.classList.remove('has-sidebar', 'sidebar-collapsed');
    };
  }, [isCollapsed, isBuilderPage, isBuilderDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    logout({
      returnTo: window.location.origin,
    });
  };

  if (!isBuilderPage || isBuilderDashboard) return null;

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <i className={`fas ${isCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
          </button>
        </div>

        <div className="sidebar-menu">
          {!isBuilderDashboard && (
            <>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/project_pannel" ? "active" : ""}`}
                  onClick={() => navigate("/project_pannel")}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Home</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/post-job" ? "active" : ""}`}
                  onClick={() => navigate("/post-job")}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Post Job</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/viewpostedjobs" ? "active" : ""}`}
                  onClick={() => navigate("/viewpostedjobs")}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Posted Jobs</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/viewapplications" ? "active" : ""}`}
                  onClick={() => navigate("/ViewApplications")}
                >
                  <i className="fas fa-file-alt"></i>
                  <span>Applications</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/hiredworkers" ? "active" : ""}`}
                  onClick={() => navigate("/HiredWorkers")}
                >
                  <i className="fas fa-users"></i>
                  <span>Hired Workers</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/materialmanagement" ? "active" : ""}`}
                  onClick={() => navigate("/materialmanagement")}
                >
                  <i className="fas fa-boxes"></i>
                  <span>Materials</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/dashboard" ? "active" : ""}`}
                  onClick={() => navigate("/dashboard")}
                >
                  <i className="fas fa-user-check"></i>
                  <span>Attendance</span>
                </a>
              </div>
              <div className="nav-item">
                <a
                  className={`nav-link ${currentPath === "/payroll" ? "active" : ""}`}
                  onClick={() => navigate("/payroll")}
                >
                  <i className="fas fa-money-check-alt"></i>
                  <span>Payroll</span>
                </a>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="nav-item">
            <a className="nav-link logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {!isCollapsed && window.innerWidth <= 768 && (
        <div 
          className={`sidebar-overlay ${!isCollapsed ? 'show' : ''}`} 
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
      
      {/* Floating toggle button when collapsed */}
      {isCollapsed && (
        <button 
          className="floating-toggle-btn"
          onClick={() => setIsCollapsed(false)}
          title="Open Sidebar"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
    </>
  );
}

export default Sidebar;
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const selectedProject = useSelector(state => state.project.selectedProject);
  const location = useLocation();

  const getPageName = (pathname) => {
    const routes = {
      '/builder-dashboard': 'Dashboard',
      '/Project_pannel': 'Job Management',
      '/dashboard': 'Attendance',
      '/material-management': 'Materials',
      '/payroll': 'Payroll'
    };
    return routes[pathname] || 'Dashboard';
  };

  return (
    <nav className="breadcrumb-nav">
      <div className="container">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <i className="fas fa-home me-1"></i>
            Dashboard
          </li>
          {selectedProject && (
            <li className="breadcrumb-item">
              <i className="fas fa-building me-1"></i>
              {selectedProject.name}
            </li>
          )}
          <li className="breadcrumb-item active">
            {getPageName(location.pathname)}
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
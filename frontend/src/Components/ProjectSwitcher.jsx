import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProject } from '../Pages/Redux/projectSlice';
import './ProjectSwitcher.css';

const ProjectSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const selectedProject = useSelector(state => state.project.selectedProject);
  const projects = useSelector(state => state.project.projects);

  const handleProjectSelect = (project) => {
    dispatch(selectProject(project));
    localStorage.setItem('selectedProject', JSON.stringify(project));
    setIsOpen(false);
  };

  const recentProjects = projects.slice(0, 3); // Show last 3 projects

  return (
    <div className="project-switcher">
      <button 
        className="project-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="project-info">
          <i className="fas fa-building me-2"></i>
          <span className="project-name">
            {selectedProject?.name || 'Select Project'}
          </span>
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} ms-2`}></i>
      </button>

      {isOpen && (
        <div className="project-dropdown">
          <div className="dropdown-header">
            <span>Recent Projects</span>
          </div>
          {recentProjects.map(project => (
            <button
              key={project._id}
              className={`project-option ${selectedProject?._id === project._id ? 'active' : ''}`}
              onClick={() => handleProjectSelect(project)}
            >
              <div className="project-details">
                <span className="project-title">{project.name}</span>
                <span className="project-location">{project.location}</span>
              </div>
              {selectedProject?._id === project._id && (
                <i className="fas fa-check text-success"></i>
              )}
            </button>
          ))}
          <div className="dropdown-divider"></div>
          <button className="project-option view-all">
            <i className="fas fa-th-large me-2"></i>
            View All Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSwitcher;
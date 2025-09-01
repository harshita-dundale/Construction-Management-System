import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProject } from '../../Pages/Redux/projectSlice';

function ProjectList({
  projects,
  selectedProject,
  indexOfFirstProject,
  indexOfLastProject,
  currentPage,
  totalPages,
  handlePageChange,
  setShowProjectModal,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reversedProjects = [...(projects || [])].reverse();
  const currentProjects = reversedProjects.slice(indexOfFirstProject, indexOfLastProject) || [];

  const handleProjectClick = (project) => {
    dispatch(selectProject(project));
    localStorage.setItem('selectedProject', JSON.stringify(project));
    navigate('/Project_pannel');
  };

  return (
    <div className="container-fluid px-3 px-md-4 mt-5 pb-5">
      <div className="dash-header text-center">
        <h2 className="dash-title">Your Projects</h2>
      </div>
      {projects && projects.length > 0 ? (
        <>
          <div className="projects-info mb-3">
            <span className="text-muted">
              Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
            </span>
          </div>
          <div className={`row g-3 ${projects.length % 3 === 1 ? 'justify-content-center' : ''}`}>
            {currentProjects.map((project) => (
              <div key={project._id} className="col-12 col-sm-6 col-lg-4">
                <div
                  className={`project-card ${selectedProject?._id === project._id ? 'active' : ''}`}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="proj-card-head">
                    <div className="project-status-badge">
                      <i className={`fas ${selectedProject?._id === project._id ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                      {selectedProject?._id === project._id ? 'Active' : 'Available'}
                    </div>
                    <div className="project-icon-small">
                      <i className="fas fa-building"></i>
                    </div>
                  </div>
                  <h4 className="project-card-name">{project.name}</h4>
                  <div className="project-card-details">
                    {project.type && (
                      <div className="detail-row">
                        <i className="fas fa-tag"></i>
                        <span>{project.type}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="detail-row">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.clientName && (
                      <div className="detail-row">
                        <i className="fas fa-user-tie"></i>
                        <span>{project.clientName}</span>
                      </div>
                    )}
                  </div>
                  <div className="project-card-footer">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-wrapper mt-4">
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="no-projects-card">
          <div className="text-center py-5">
            <div className="no-projects-icon mb-3">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h4>No Projects Found</h4>
            <p className="text-muted mb-4">Create your first project to get started</p>
            <Button onClick={() => setShowProjectModal(true)} className="btn-dashboard-primary">
              <i className="fas fa-plus me-2"></i>
              Create Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
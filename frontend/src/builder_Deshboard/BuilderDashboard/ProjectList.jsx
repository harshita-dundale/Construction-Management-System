import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectProject } from '../../Pages/Redux/projectSlice';
import Swal from 'sweetalert2';

function ProjectList({
  projects,
  selectedProject,
  indexOfFirstProject,
  indexOfLastProject,
  currentPage,
  totalPages,
  handlePageChange,
  setShowProjectModal,
  onProjectUpdate,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(null);
  const reversedProjects = [...(projects || [])].reverse();
  const currentProjects = reversedProjects.slice(indexOfFirstProject, indexOfLastProject) || [];

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const handleProjectClick = (project, e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.project-actions')) return;
    
    dispatch(selectProject(project));
    localStorage.setItem('selectedProject', JSON.stringify(project));
    navigate('/Project_pannel');
  };

  const handleEditProject = async (project, e) => {
    e.stopPropagation();
    
    const { value: formValues } = await Swal.fire({
      title: 'Edit Project',
      html: `
        <div style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Project Name</label>
            <input id="swal-input1" class="swal2-input" value="${project.name}" placeholder="Project Name" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Project Type</label>
            <input id="swal-input2" class="swal2-input" value="${project.type || ''}" placeholder="Project Type" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Location</label>
            <input id="swal-input3" class="swal2-input" value="${project.location || ''}" placeholder="Location" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Client Name</label>
            <input id="swal-input4" class="swal2-input" value="${project.clientName || ''}" placeholder="Client Name" style="margin: 0; width: 100%;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Expected Cost</label>
            <input id="swal-input5" class="swal2-input" value="${project.expectedCost || ''}" placeholder="Expected Cost" style="margin: 0; width: 100%;">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update Project',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          type: document.getElementById('swal-input2').value,
          location: document.getElementById('swal-input3').value,
          clientName: document.getElementById('swal-input4').value,
          expectedCost: document.getElementById('swal-input5').value
        }
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...project,
            ...formValues
          })
        });

        if (response.ok) {
          Swal.fire({
            title: 'Updated!',
            text: 'Project has been updated successfully.',
            icon: 'success',
            confirmButtonColor: '#667eea'
          });
          
          // Refresh projects list
          if (onProjectUpdate) {
            onProjectUpdate();
          }
        } else {
          throw new Error('Failed to update project');
        }
      } catch (error) {
        console.error('Error updating project:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update project. Please try again.',
          icon: 'error',
          confirmButtonColor: '#667eea'
        });
      }
    }
  };

  const handleDeleteProject = async (project, e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Project has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#667eea'
          });
          
          // Refresh projects list
          if (onProjectUpdate) {
            onProjectUpdate();
          }
        } else {
          throw new Error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete project. Please try again.',
          icon: 'error',
          confirmButtonColor: '#667eea'
        });
      }
    }
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
                  onClick={(e) => handleProjectClick(project, e)}
                >
                  <div className="proj-card-head">
                    <div className="project-status-badge">
                      <i className={`fas ${selectedProject?._id === project._id ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                      {selectedProject?._id === project._id ? 'Active' : 'Available'}
                    </div>
                    <div className="project-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => handleEditProject(project, e)}
                        title="Edit Project"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteProject(project, e)}
                        title="Delete Project"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <h4 className="project-card-name">{toTitleCase(project.name)}</h4>
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
                    <div className="click-hint">
                      <i className="fas fa-mouse-pointer me-1"></i>
                      <span>Click to open</span>
                    </div>
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
      
      {/* Inline Styles for Action Buttons */}
      <style dangerouslySetInnerHTML={{__html: `
        .project-actions {
          display: flex;
          gap: 0.5rem;
          opacity: 1;
          transition: all 0.3s ease;
          z-index: 10;
          position: relative;
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.8rem;
          z-index: 10;
          position: relative;
        }
        
        .edit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .delete-btn {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
        }
        
        .proj-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .click-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 1;
          transform: translateY(0);
        }
        
        .project-card {
          cursor: pointer;
          position: relative;
        }
        

        
        .project-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .project-actions {
            opacity: 1;
          }
          
          .action-btn {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }
          
          .click-hint {
            opacity: 1;
            transform: translateY(0);
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
          }
        }
      `}} />
    </div>
  );
}

export default ProjectList;
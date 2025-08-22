import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "../Components/Header";
import ProjectModal from "../Components/ProjectModal";
import { selectProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify";

function Builder_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardData1 = useSelector((state) => state.builder.cards);
  const location = useLocation();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const materials = useSelector((state) => state.materials.materials);
  const payrollList = useSelector((state) => state.Payroll.payrollList);

  useEffect(() => {
    const saved = localStorage.getItem("selectedProject");
    if (saved && !selectedProject) {
      dispatch(selectProject(JSON.parse(saved)));
    }
  }, [selectedProject]);

  useEffect(() => {
    const selected = localStorage.getItem("selectedProject");
    if (!selected) {
      setShowProjectModal(true);
    }
  }, []);
  
  useEffect(() => {
    if (location.state && location.state.showProjectModal) {
      setShowProjectModal(true);
    }
  }, [location]);

  useEffect(() => {
    if (selectedProject) {
      setShowProjectModal(false);
    }
  }, [selectedProject]);

  // Total material value
  const totalMaterialCost = Array.isArray(materials)
    ? materials.reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0)
    : 0;
  // Total payable from payrollList
  const totalWorkerPayable = Array.isArray(payrollList)
    ? payrollList.reduce((sum, p) => sum + (p.totalSalary || 0), 0)
    : 0;
  const totalProjectCost = totalMaterialCost + totalWorkerPayable;

  return (
    <div className="dashboard-wrapper">
      <Header />
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container-fluid px-3 px-md-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="header-content">
                <div className="dashboard-badge">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Builder Dashboard
                </div>
                <h1 className="dashboard-title">Project Management Hub</h1>
                <p className="dashboard-subtitle">
                  Streamline your construction projects with powerful management tools
                </p>
              </div>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <div className="header-actions d-flex flex-column align-items-end gap-3">
                <div className="quick-stats mb-3">
                  <div className="stat-badge">
                    <i className="fas fa-project-diagram me-2"></i>
                    <span>Quick Access</span>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '25px',
                      fontWeight: 600,
                      fontSize: '1.15rem',
                      padding: '0.7rem 2.2rem',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.18)',
                      letterSpacing: '0.5px',
                      display: 'inline-block',
                    }}
                  >
                    <i className="fas fa-coins me-2"></i>
                    Total Project Cost: ₹{totalProjectCost.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="btn-dashboard-primary"
                >
                  <i className="fas fa-cog me-2"></i>
                  Manage Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Card */}
      <div className="container-fluid px-3 px-md-4 mb-4">
        <div className="project-status-card">
          <div className="row align-items-center g-3">
            <div className="col-lg-8 col-md-7">
              <div className="project-info">
                {selectedProject ? (
                  <>
                    <div className="project-status active">
                      <i className="fas fa-check-circle me-2"></i>
                      Active Project
                    </div>
                    <h3 className="project-name">{selectedProject.name}</h3>
                    <p className="project-description">
                      {selectedProject.description || "Managing construction project efficiently"}
                    </p>
                    <div className="project-meta">
                      <span className="meta-item">
                        <i className="fas fa-calendar me-1"></i>
                        Started: {new Date().toLocaleDateString()}
                      </span>
                      <span className="meta-item">
                        <i className="fas fa-users me-1"></i>
                        Team: Active
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="project-status inactive">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      No Project Selected
                    </div>
                    <h3 className="project-name text-muted">Select a Project to Continue</h3>
                    <p className="project-description">
                      Choose or create a project to access all dashboard features
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-5 text-center">
              <div className="project-visual">
                <div className="project-icon">
                  <i className={`fas ${selectedProject ? 'fa-building' : 'fa-plus-circle'}`}></i>
                </div>
                <div className="project-progress">
                  <div className="progress-circle">
                    <span className="progress-text">{selectedProject ? '85%' : '0%'}</span>
                  </div>
                  <small className="text-muted">Completion</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="container-fluid px-3 px-md-4" style={{ marginTop: '3rem' }}>
        <div className="section-header text-center">
          <h2 className="section-title">Management Tools</h2>
          <p className="section-subtitle">Access all your project management features</p>
        </div>
        
        <div className="row g-0 g-md-4 justify-content-center">
          {cardData1.map((card, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3">
              <div className="dashboard-card" onClick={() => navigate(card.route)}>
                <div className="card-header mb-3">
                  <div className="card-icon">
                    <img src={card.imgSrc} alt={card.title} className="card-image" />
                  </div>
                  <div className="card-badge">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-description">{card.text}</p>
                  <button className="btn-card-action">
                    {card.buttonText}
                    <i className="fas fa-chevron-right ms-2"></i>
                  </button>
                </div>
                <div className="card-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        show={showProjectModal}
        handleClose={() => {
          if (!selectedProject) {
            toast.warning("Please select a project before closing.", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            setShowProjectModal(false);
          }
        }}
      />

      <style jsx>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding-top: 120px;
          padding-bottom: 3rem;
        }
        
        .dashboard-header {
          background: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(135deg, rgba(140, 155, 222, 0.55) 0%, rgba(59, 92, 224, 0.05) 100%);
          transform: skewX(-15deg);
          transform-origin: top;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .header-actions {
          position: relative;
          z-index: 2;
        }
        
        .quick-stats {
          margin-bottom: 1.5rem;
        }
        
        .stat-badge {
          display: inline-block;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .dashboard-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 2rem;
        }
        
        .btn-dashboard-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-dashboard-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
        }
        
        .project-status-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-left: 5px solid #667eea;
        }
        
        .project-status {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .project-status.active {
          background: #d4edda;
          color: #155724;
        }
        
        .project-status.inactive {
          background: #f8d7da;
          color: #721c24;
        }
        
        .project-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .project-description {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .project-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .meta-item {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .project-visual {
          text-align: center;
        }
        
        .project-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.8rem;
          color: white;
        }
        
        .progress-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: conic-gradient(#667eea 0deg 306deg, #e9ecef 306deg 360deg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          position: relative;
        }
        
        .progress-circle::before {
          content: '';
          width: 38px;
          height: 38px;
          background: white;
          border-radius: 50%;
          position: absolute;
        }
        
        .progress-text {
          font-weight: 700;
          color: #2c3e50;
          z-index: 1;
          position: relative;
          font-size: 0.8rem;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #6c757d;
          font-size: 1rem;
        }
        
        .dashboard-card {
          background: white;
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          height: 100%;
          min-height: 300px;
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .dashboard-card:hover .card-overlay {
          opacity: 1;
        }
        
        .card-header {
          position: relative;
          padding: 1.5rem 1.5rem 1.5rem;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 0.5rem;
        }
        
        .card-icon {
          margin-bottom: 1rem;
        }
        
        .card-image {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        
        .card-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 25px;
          height: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.7rem;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .dashboard-card:hover .card-badge {
          opacity: 1;
          transform: rotate(45deg);
        }
        
        .card-body {
          padding: 0 1.5rem 1.5rem;
          text-align: center;
        }
        
        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.8rem;
        }
        
        .card-description {
          color: #6c757d;
          margin-bottom: 1.2rem;
          line-height: 1.5;
          font-size: 0.9rem;
        }
        
        .btn-card-action {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 20px;
          color: white;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
          font-size: 0.9rem;
        }
        
        .btn-card-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          color: white;
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .dashboard-wrapper {
            padding-top: 100px;
          }
          
          .dashboard-header {
            padding: 2rem 0;
            text-align: center;
          }
          
          .header-actions {
            margin-top: 2rem;
          }
          
          .dashboard-header::before {
            display: none;
          }
          
          .dashboard-title {
            font-size: 2rem;
          }
          
          .section-title {
            font-size: 1.6rem;
          }
          
          .project-name {
            font-size: 1.4rem;
          }
          
          .project-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .project-status-card {
            padding: 1.5rem;
          }
          
          .project-visual {
            margin-top: 1.5rem;
          }
          
          .dashboard-card {
            min-height: 250px;
            margin-bottom: 1rem;
          }
          
          .container-fluid {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .dashboard-wrapper {
            padding-top: 90px;
          }
          
          .dashboard-header {
            padding: 1rem 0;
          }
          
          .dashboard-title {
            font-size: 1.6rem;
          }
          
          .dashboard-subtitle {
            font-size: 1rem;
          }
          
          .section-title {
            font-size: 1.4rem;
          }
          
          .project-status-card {
            padding: 1rem;
          }
          
          .btn-dashboard-primary {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
          }
          
          .dashboard-card {
            min-height: 220px;
            margin-bottom: 0.5rem;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }
          
          .container-fluid {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .card-header {
            padding: 0.8rem 1rem 0.4rem;
          }
          
          .card-body {
            padding: 0 1rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Builder_dashboard;
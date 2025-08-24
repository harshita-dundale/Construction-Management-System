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
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projects = useSelector((state) => state.project.projects);
  const materials = useSelector((state) => state.materials.materials);
  const payrollList = useSelector((state) => state.Payroll.payrollList);

  // Enhanced payroll data state
  const [enhancedPayrollTotal, setEnhancedPayrollTotal] = useState(0);

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects?.slice(indexOfFirstProject, indexOfLastProject) || [];
  const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  // Fetch enhanced payroll data
  useEffect(() => {
    const fetchEnhancedPayrollData = async () => {
      if (!selectedProject?._id) {
        setEnhancedPayrollTotal(0);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const hired = data.filter((app) => app.status === "joined");

        let totalPayable = 0;
        for (const worker of hired) {
          const salary = worker.jobId?.salary || 0;
          const workerId = worker.userId?._id || worker._id;

          try {
            const sumRes = await fetch(
              `http://localhost:5000/api/worker-records/history/${workerId}`
            );
            const history = await sumRes.json();
            const presentCount = history.filter(h => h.status === "Present").length;
            totalPayable += presentCount * salary;
          } catch (err) {
            console.error("Error fetching attendance:", err);
          }
        }

        setEnhancedPayrollTotal(totalPayable);
      } catch (err) {
        console.error("Error fetching enhanced payroll data:", err);
        setEnhancedPayrollTotal(0);
      }
    };

    fetchEnhancedPayrollData();
  }, [selectedProject]);

  // Total material value - filter by selected project
  const totalMaterialCost = Array.isArray(materials) && selectedProject
    ? materials
        .filter(m => m.projectId === selectedProject._id)
        .reduce((sum, m) => sum + ((m.unitPrice || 0) * (m.quantity || 1)), 0)
    : 0;

  // Total payable from payrollList - filter by selected project
  const totalWorkerPayable = Array.isArray(payrollList) && selectedProject
    ? payrollList
        .filter(p => p.projectId === selectedProject._id)
        .reduce((sum, p) => sum + (p.totalSalary || p.payable || 0), 0)
    : 0;

  // Total project cost including enhanced payroll
  const totalProjectCost = totalMaterialCost + totalWorkerPayable + enhancedPayrollTotal;

  return (
    <div className="dashboard-wrapper">
      <Header />

      {/* Dashboard Header - Improved */}
      <div className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
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
            <div className="col-lg-5">
              <div className="header-actions">
                <div className="cost-display">
                  <div className="cost-label">Total Project Cost</div>
                  <div className="cost-amount">₹{totalProjectCost.toLocaleString()}</div>
                </div>
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="btn-primary-custom">
                  <i className="fas fa-cog me-2"></i>
                  Manage Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Cards - Improved */}
      <div className="container mb-5">
        <div className="section-header">
          <h2 className="section-title">Your Projects</h2>
          <p className="section-subtitle">Manage and monitor all your construction projects</p>
        </div>

        {projects && projects.length > 0 ? (
          <>
            <div className="row g-4">
              {currentProjects.map((project) => (
                <div key={project._id} className="col-12 col-md-6 col-xl-4">
                  <div
                    className={`project-card ${selectedProject?._id === project._id ? 'active' : ''}`}
                    onClick={() => {
                      dispatch(selectProject(project));
                      localStorage.setItem("selectedProject", JSON.stringify(project));
                    }}
                  >
                    <div className="project-header">
                      <div className="project-status-badge">
                        <i className={`fas ${selectedProject?._id === project._id ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                        {selectedProject?._id === project._id ? 'Active' : 'Available'}
                      </div>
                      <div className="project-icon-small">
                        <i className="fas fa-building"></i>
                      </div>
                    </div>

                    <h4 className="project-name">{project.name}</h4>

                    <div className="project-details">
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

                    <div className="project-footer">
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
              <div className="pagination-wrapper">
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
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h4>No Projects Found</h4>
            <p>Create your first project to get started</p>
            <Button
              onClick={() => setShowProjectModal(true)}
              className="btn-primary-custom">
              <i className="fas fa-plus me-2"></i>
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* Management Tools - Improved */}
      <div className="container mb-5">
        <div className="section-header">
          <h2 className="section-title">Management Tools</h2>
          <p className="section-subtitle">Access all your project management features</p>
        </div>

        <div className="row g-4">
          {cardData1.map((card, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="tool-card" onClick={() => navigate(card.route)}>
                <div className="tool-icon">
                  <img src={card.imgSrc} alt={card.title} />
                </div>
                <h5 className="tool-title">{card.title}</h5>
                <p className="tool-description">{card.text}</p>
                <div className="tool-action">
                  {card.buttonText}
                  <i className="fas fa-arrow-right ms-2"></i>
                </div>
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

      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          padding-top: 100px;
          padding-bottom: 2rem;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        /* Header Improvements */
        .dashboard-header {
          background: white;
          padding: 2.5rem 0;
          margin-bottom: 3rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header-content {
          text-align: left;
        }
        
        .dashboard-badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .dashboard-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        
        .dashboard-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 0;
        }
        
        .header-actions {
          text-align: right;
        }
        
        .cost-display {
          background: #f1f5f9;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          border-left: 4px solid #4f46e5;
        }
        
        .cost-label {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        
        .cost-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .btn-primary-custom {
          background: #4f46e5;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.2s ease;
        }
        
        .btn-primary-custom:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #64748b;
          font-size: 1rem;
        }
        
        /* Project Cards - Cleaner Design */
        .project-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          cursor: pointer;
          height: 100%;
        }
        
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #4f46e5;
        }
        
        .project-card.active {
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .project-status-badge {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .project-card.active .project-status-badge {
          background: #dcfce7;
          color: #166534;
        }
        
        .project-icon-small {
          width: 32px;
          height: 32px;
          background: #4f46e5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.85rem;
        }
        
        .project-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .project-details {
          margin-bottom: 1rem;
        }
        
        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .detail-row i {
          width: 16px;
          color: #4f46e5;
          margin-right: 0.5rem;
        }
        
        .project-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 0.75rem;
        }
        
        /* Tool Cards - Simplified */
        .tool-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          cursor: pointer;
          text-align: center;
          height: 100%;
        }
        
        .tool-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #4f46e5;
        }
        
        .tool-icon {
          margin-bottom: 1rem;
        }
        
        .tool-icon img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        
        .tool-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .tool-description {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        
        .tool-action {
          color: #4f46e5;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .empty-icon {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }
        
        .empty-state h4 {
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        
        /* Pagination */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .pagination-container {
          display: flex;
          align-items: center;
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          gap: 0.5rem;
        }
        
        .pagination-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pagination-btn:hover:not(:disabled) {
          background: #4f46e5;
          color: white;
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          color: #64748b;
          font-weight: 500;
          padding: 0 1rem;
          font-size: 0.875rem;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-wrapper {
            padding-top: 80px;
          }
          
          .dashboard-header {
            padding: 1.5rem 0;
            text-align: center;
          }
          
          .header-actions {
            text-align: center;
            margin-top: 1.5rem;
          }
          
          .dashboard-title {
            font-size: 1.75rem;
          }
          
          .cost-display {
            text-align: center;
          }
          
          .container {
            padding: 0 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Builder_dashboard;
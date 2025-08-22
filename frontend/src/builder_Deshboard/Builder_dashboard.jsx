
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

  // Total material value
  const totalMaterialCost = Array.isArray(materials)
    ? materials.reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0)
    : 0;
  // Total payable from payrollList
  const totalWorkerPayable = Array.isArray(payrollList)
    ? payrollList.reduce((sum, p) => sum + (p.totalSalary || p.payable || 0), 0)
    : 0;
  // Total project cost including enhanced payroll
  const totalProjectCost = totalMaterialCost + totalWorkerPayable + enhancedPayrollTotal;

  return (
    <div className="dashboard-wrapper">
      <Header />
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container-fluid px-3 px-md-4">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div >
                
                <h1 className="dashboard-title">Project Management Hub</h1>
                <p className="dashboard-subtitle text-center">
                  Streamline your construction projects with powerful management tools
                </p>
                <div className="dashboard-badge d-flex justify-content-center">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Builder Dashboard
                </div>
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

      {/* Project Status Cards */}
      <div className="container-fluid px-3 px-md-4 mb-4">
        <div className="section-header text-center mb-4">
          <h2 className="section-title">Your Projects</h2>
          <p className="section-subtitle">Manage and monitor all your construction projects</p>
        </div>
        
        {projects && projects.length > 0 ? (
          <>
            {/* <div className="projects-info mb-3">
              <span className="text-muted">
                Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
              </span>
            </div> */}
            <div className="row g-3">
              {currentProjects.map((project) => (
              <div key={project._id} className="col-12 col-md-6 col-lg-4">
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
              <Button 
                onClick={() => setShowProjectModal(true)}
                className="btn-dashboard-primary"
              >
                <i className="fas fa-plus me-2"></i>
                Create Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Cards  row -> g-0 g-md-4 justify-content-center*/}
      <div className="container-fluid px-3 px-md-4 mb-4" style={{ marginTop: '3rem' }}>
        <div className="section-header text-center">
          <h2 className="section-title">Management Tools</h2>
          <p className="section-subtitle">Access all your project management features</p>
        </div>
        
        <div className="row g-3 d-flex justify-content-center">
          {cardData1.map((card, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 ">
              <div className="dashboard-card " onClick={() => navigate(card.route)}>
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

      <style>{`
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
          width:50%;
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
          width:50%;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          width:50%;
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
        
        .project-details {
          margin-bottom: 1rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #495057;
          font-size: 0.95rem;
        }
        
        .detail-item i {
          color: #667eea;
          width: 20px;
        }
        
        .detail-item strong {
          margin-right: 0.5rem;
        }
        
        .project-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
          height: 100%;
        }
        
        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .project-card.active {
          border-color: #667eea;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .project-status-badge {
          background: #f8f9fa;
          color: #6c757d;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .project-card.active .project-status-badge {
          background: #d4edda;
          color: #155724;
        }
        
        .project-icon-small {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
        }
        
        .project-card-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .project-card-details {
          margin-bottom: 1rem;
        }
        
        .detail-row {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #495057;
        }
        
        .detail-row i {
          width: 18px;
          color: #667eea;
          margin-right: 0.5rem;
        }
        
        .project-card-footer {
          border-top: 1px solid #e9ecef;
          padding-top: 0.8rem;
        }
        
        .no-projects-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .no-projects-icon {
          font-size: 3rem;
          color: #6c757d;
        }
        
        .projects-info {
          text-align: center;
          font-size: 0.9rem;
        }
        
        .pagination-wrapper {
          display: flex;
          justify-content: center;
        }
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center; /* arrows + text center aligned */
          background: white;
          padding: 0.3rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          gap: 0.5rem; /* thoda spacing arrows & text ke beech */
        }
        
        .pagination-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 10px;
          background: #f8f9fa;
          color: #6c757d;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .pagination-btn i {
          font-size: 14px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        
        .pagination-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }
        
        .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          color: #6c757d;
          font-weight: 600;
          padding: 0 1rem;
          font-size: 0.9rem;
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
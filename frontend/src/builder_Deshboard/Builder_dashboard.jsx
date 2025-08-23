
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "../Components/Header";
import ProjectModal from "../Components/ProjectModal";
import { selectProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify";
import "./Builder_dashboard.css";

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
      <div className="dashboard-header p-4 mb-5 position-relative">
        <div className="container-fluid px-3 px-md-4">
          <div className="row align-items-center">
            <div className="col-lg-8 text-center text-lg-start">
              <div className="text-center">
                
                <h1 className="dashboard-title  my-4 w-100 w-lg-50 mx-auto mx-lg-0">Project Management Hub</h1>
                <p className="dashboard-subtitle mb-4 w-100 w-lg-50 mx-auto mx-lg-0 ">
                Streamline your projects with advanced tools.
Monitor attendance, payments, and progress instantly.
Organize workers and job roles without hassle.
{/* Stay ahead with smarter construction management. */}
                </p>
                <div className="dashboard-badge d-inline-flex justify-content-center w-auto w-lg-50 py-2 px-3 mb-1 mx-auto mx-lg-0">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Builder Dashboard
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
              <div className="header-actions d-flex flex-column align-items-center align-items-lg-end gap-3 .position-relative z-2">
                <div className=" mb-3">
                  <div className="stat-badge d-inline-block p-2">
                    <i className="fas fa-project-diagram me-2"></i>
                    <span>Quick Access</span>
                  </div>
                </div>
                <div>
                  <span
                  className="text-white fw-semibold rounded-pill d-inline-block fs-6 project-cost"
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


    </div>
  );
}

export default Builder_dashboard;
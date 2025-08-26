
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "../Components/Header";
import ProjectModal from "../Components/ProjectModal";
import { selectProject, updateProject, deleteProject, fetchProjects } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth0 } from "@auth0/auth0-react";
import "./Builder_dashboard.css";

function Builder_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const cardData1 = useSelector((state) => state.builder.cards);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  //const projectsPerPage = 6;
  const selectedProject = useSelector((state) => state.project.selectedProject);
  
  const projects = useSelector((state) => state.project.projects);
  const reversedProjects = [...(projects || [])].reverse();
   // Pagination logic
   const indexOfLastProject = currentPage * projectsPerPage;
   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
   const currentProjects = reversedProjects?.slice(indexOfFirstProject, indexOfLastProject) || [];
   
  const materials = useSelector((state) => state.materials.materials);
  const payrollList = useSelector((state) => state.Payroll.payrollList);
  const { user } = useAuth0();
  
  // Enhanced payroll data state
  const [enhancedPayrollTotal, setEnhancedPayrollTotal] = useState(0);
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectData, setEditProjectData] = useState({ name: "", type: "", location: "", clientName: "" });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Edit project function
  const handleEditProject = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditProjectData({
      name: project.name || "",
      type: project.type || "",
      location: project.location || "",
      clientName: project.clientName || ""
    });
  };

  // Update project function
  const handleUpdateProject = async () => {
    if (!editProjectData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await dispatch(updateProject({ 
        projectId: editingProject._id, 
        name: editProjectData.name.trim(),
        type: editProjectData.type.trim(),
        location: editProjectData.location.trim(),
        clientName: editProjectData.clientName.trim()
      }));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project updated successfully!");
      setEditingProject(null);
      setEditProjectData({ name: "", type: "", location: "", clientName: "" });
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error("Failed to update project.");
    }
  };

  // Delete project function
  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteProject(projectId));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed.");
    }
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditProjectData({ name: "", type: "", location: "", clientName: "" });
  };

  // Toggle dropdown function
  const toggleDropdown = (projectId, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === projectId ? null : projectId);
  };

  const totalPages = Math.ceil((reversedProjects?.length || 0) / projectsPerPage);

  useEffect(() => {
    const updateProjectsPerPage = () => {
      if (window.innerWidth < 576) {
        setProjectsPerPage(1); // mobile
      } else if (window.innerWidth < 992) {
        setProjectsPerPage(2); // tablet
      } else {
        setProjectsPerPage(3); // desktop
      }
    };
  
    updateProjectsPerPage(); // set initially
    window.addEventListener("resize", updateProjectsPerPage);
    return () => window.removeEventListener("resize", updateProjectsPerPage);
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
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
        <div className="section-header text-center mb-1">
          <h2 className="section-title">Your Projects</h2>
          {/* <p className="section-subtitle">Manage and monitor all your construction projects, Stay organized, efficient, and always in control.</p> */}
        </div>
        
        {projects && projects.length > 0 ? (
          <>
            <div className="projects-info mb-3">
              <span className="text-muted">
                Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
              </span>
            </div>
            {/* <div className="row g-3"> */}
            <div className={`row g-3 ${projects.length % 3 === 1 ? "justify-content-center" : ""}`}>
              {[...currentProjects] .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((project) => (
              <div key={project._id} className="col-12 col-sm-6 col-lg-4">
                <div 
                  className={`project-card ${selectedProject?._id === project._id ? 'active' : ''}`}
                  onClick={() => {
                    if (editingProject?._id !== project._id) {
                      dispatch(selectProject(project));
                      localStorage.setItem("selectedProject", JSON.stringify(project));
                    }
                  }}
                >
                  <div className="project-header">
                    <div className="project-status-badge">
                      <i className={`fas ${selectedProject?._id === project._id ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                      {selectedProject?._id === project._id ? 'Active' : 'Available'}
                    </div>
                    <div className="project-actions">
                      <div className="dropdown">
                        <button 
                          className="dropdown-toggle-btn"
                          onClick={(e) => toggleDropdown(project._id, e)}
                          title="More Options"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {dropdownOpen === project._id && (
                          <div className="dropdown-menu show">
                            <button 
                              className="dropdown-item"
                              onClick={(e) => {
                                handleEditProject(project, e);
                                setDropdownOpen(null);
                              }}
                            >
                              <i className="fas fa-edit me-2"></i>
                              Edit Project
                            </button>
                            <button 
                              className="dropdown-item delete-item"
                              onClick={(e) => {
                                handleDeleteProject(project._id, e);
                                setDropdownOpen(null);
                              }}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {editingProject && editingProject._id === project._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editProjectData.name}
                        onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                        placeholder="Project Name"
                        className="form-control mb-2"
                      />
                      <select
                        value={editProjectData.type}
                        onChange={(e) => setEditProjectData({...editProjectData, type: e.target.value})}
                        className="form-control mb-2"
                      >
                        <option value="">Select Project Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Road">Road</option>
                        <option value="Renovation">Renovation</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                      <input
                        type="text"
                        value={editProjectData.location}
                        onChange={(e) => setEditProjectData({...editProjectData, location: e.target.value})}
                        placeholder="Project Location"
                        className="form-control mb-2"
                      />
                      <input
                        type="text"
                        value={editProjectData.clientName}
                        onChange={(e) => setEditProjectData({...editProjectData, clientName: e.target.value})}
                        placeholder="Client Name"
                        className="form-control mb-3"
                      />
                      <div className="edit-actions">
                        <button className="btn btn-success btn-sm me-2" onClick={handleUpdateProject}>
                          <i className="fas fa-check me-1"></i>Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                          <i className="fas fa-times me-1"></i>Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
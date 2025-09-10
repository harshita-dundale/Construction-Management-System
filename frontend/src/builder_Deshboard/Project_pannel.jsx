import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import ProjectModal from "../Components/ProjectModal";
import BackButton from "../Components/BackButton";
import { selectProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify";
import "./Project_pannel.css";

function Builder_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const cardData1 = useSelector((state) => state.builder.cards);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(3);

  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projects = useSelector((state) => state.project.projects);
  const reversedProjects = [...(projects || [])].reverse();

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = reversedProjects?.slice(indexOfFirstProject, indexOfLastProject) || [];

  const materials = useSelector((state) => state.materials.materials);
  const payrollList = useSelector((state) => state.Payroll.payrollList);

  const [enhancedPayrollTotal, setEnhancedPayrollTotal] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    materialsCount: 0,
    workersHired: 0,
    attendanceRate: 0,
    monthlyPayroll: 0
  });
  const [projectDetails, setProjectDetails] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    projectDuration: 0
  });
  const [overallProgress, setOverallProgress] = useState(0);

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

    updateProjectsPerPage();
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

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!selectedProject?._id) {
        setDashboardStats({ materialsCount: 0, workersHired: 0, attendanceRate: 0, monthlyPayroll: 0 });
        setOverallProgress(20); // Only planning completed
        return;
      }

      try {
        // Debug materials data
        console.log('🔍 Redux materials:', materials);
        console.log('🔍 Redux materials length:', materials?.length || 0);
        console.log('🔍 Selected project ID:', selectedProject._id);

        // Fetch materials if Redux is empty
        let materialsData = materials;
        if (!materials || materials.length === 0) {
          console.log('⚠️ Redux materials empty, fetching from API...');
          try {
            const materialsRes = await fetch(`http://localhost:5000/api/materials?projectId=${selectedProject._id}`);
            console.log('🌐 Materials API response status:', materialsRes.status);
            if (materialsRes.ok) {
              materialsData = await materialsRes.json();
              console.log('✅ Materials fetched from API:', materialsData?.length || 0);
              console.log('📦 API Materials data:', materialsData);
            } else {
              console.error('❌ Materials API failed:', materialsRes.status);
            }
          } catch (err) {
            console.error('❌ Error fetching materials:', err);
            materialsData = [];
          }
        } else {
          console.log('✅ Using Redux materials:', materials.length);
        }

        // Materials count for selected project
        console.log('🔍 Starting materials filtering...');
        console.log('🔍 Materials data type:', typeof materialsData);
        console.log('🔍 Materials data is array:', Array.isArray(materialsData));

        const projectMaterials = materialsData?.filter(m => {
          const match = m.projectId === selectedProject._id;
          console.log(`🔍 Material: ${m.name || 'No name'} | ProjectId: ${m.projectId} | Selected: ${selectedProject._id} | Match: ${match}`);
          return match;
        }) || [];

        console.log('📦 Project materials found:', projectMaterials.length);
        console.log('📦 Project materials list:', projectMaterials);

        // Calculate material cost
        const materialsCost = projectMaterials.reduce((sum, m) => {
          const cost = (m.unitPrice || 0) * (m.quantity || 1);
          console.log(`Material: ${m.name} | Cost: ${cost}`);
          return sum + cost;
        }, 0);

        setMaterialCost(materialsCost);
        console.log('💰 Total material cost:', materialsCost);

        // Fetch jobs for this project using correct API endpoint
        let jobsData = [];
        try {
          const jobsRes = await fetch(`http://localhost:5000/api/jobs?projectId=${selectedProject._id}`);
          if (jobsRes.ok) {
            const jobsResponse = await jobsRes.json();
            jobsData = jobsResponse || [];
            console.log('✅ Jobs fetched:', jobsData.length);
          } else if (jobsRes.status === 404) {
            console.log('📝 No jobs found for this project');
            jobsData = [];
          } else {
            console.log('⚠️ Jobs API error:', jobsRes.status);
            jobsData = [];
          }
        } catch (err) {
          console.log('❌ Jobs API failed:', err.message);
          jobsData = [];
        }
        const activeJobs = jobsData.filter(job => job.status === 'active' || !job.status).length;

        // Fetch all applications for this project
        const allAppsRes = await fetch(`http://localhost:5000/api/apply?projectId=${selectedProject._id}`);
        const allAppsData = allAppsRes.ok ? await allAppsRes.json() : [];

        // Workers hired
        const workersRes = await fetch(`http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`);
        const workersData = workersRes.ok ? await workersRes.json() : [];
        const hiredWorkers = workersData.filter(app => app.status === "joined");

        // Calculate project duration
        const startDate = new Date(selectedProject.startDate || selectedProject.createdAt);
        const endDate = selectedProject.expectedEndDate ? new Date(selectedProject.expectedEndDate) : new Date();
        const durationDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        // Attendance rate calculation based on project working days
        let totalPresentDays = 0;
        let totalExpectedDays = 0;
        let hasAnyAttendance = false;

        // Calculate working days since project start
        const workingDays = Math.max(Math.floor(durationDays * 0.71), 1); // 5 days per week

        for (const worker of hiredWorkers) {
          try {
            const workerId = worker.userId?._id || worker._id;
            const attendanceRes = await fetch(`http://localhost:5000/api/worker-records/history/${workerId}`);
            if (attendanceRes.ok) {
              const history = await attendanceRes.json();
              const workerPresentCount = history.filter(h => h.status === "Present").length;
              totalPresentDays += workerPresentCount;
              totalExpectedDays += workingDays;
              if (history.length > 0) hasAnyAttendance = true;
            }
          } catch (err) {
            console.error("Error fetching attendance:", err);
          }
        }

        const attendanceRate = totalExpectedDays > 0 ? Math.round((totalPresentDays / totalExpectedDays) * 100) : 0;

        // Calculate progress
        let progress = 20; // Planning always done
        if (projectMaterials.length > 0) progress += 20;
        if (hiredWorkers.length > 0) progress += 20;
        if (hasAnyAttendance) progress += 20;
        if (enhancedPayrollTotal > 0) progress += 20;

        console.log('📊 Final calculated stats:', {
          materialsCount: projectMaterials.length,
          workersHired: hiredWorkers.length,
          attendanceRate,
          monthlyPayroll: enhancedPayrollTotal,
          totalJobs: jobsData.length,
          activeJobs,
          totalApplications: allAppsData.length,
          projectDuration: durationDays,
          overallProgress: progress
        });

        setDashboardStats({
          materialsCount: projectMaterials.length,
          workersHired: hiredWorkers.length,
          attendanceRate,
          monthlyPayroll: enhancedPayrollTotal
        });

        setOverallProgress(progress);

        // Set project details
        setProjectDetails({
          totalJobs: jobsData.length,
          activeJobs,
          totalApplications: allAppsData.length,
          projectDuration: durationDays
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchDashboardStats();
  }, [selectedProject, enhancedPayrollTotal]);

  const [materialCost, setMaterialCost] = useState(0);

  const totalMaterialCost = materialCost;
  const totalWorkerPayable = Array.isArray(payrollList)
    ? payrollList.reduce((sum, p) => sum + (p.totalSalary || p.payable || 0), 0)
    : 0;
  const totalProjectCost = totalMaterialCost + totalWorkerPayable + enhancedPayrollTotal;

  return (
    <div className="proj-dashboard-wrapper">
      <Header />
      <Sidebar />
      <div className="container-fluid px-3 px-md-4" >

        {/* Project Overview Card */}
        {selectedProject && (
          <div className="row mb-4">
            <div className="col-12">

              <div className="project-overview-card">

                <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <BackButton to="/Builder-Dashboard" />
                  <div className="project-info-section" style={{ textAlign: 'center', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 className="project-title" style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
                      <i className="fas fa-building me-2"></i>
                      {selectedProject.name}
                    </h3>
                    <span className="project-status-badge" style={{ color: 'white', background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      <i className="fas fa-check-circle me-1"></i>
                      Active Project
                    </span>
                  </div>
                  <div style={{ width: '150px' }}></div>
                </div>
                <div className="project-details">
                  {/* Project Info Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="info-card">
                        <div className="info-card-icon">
                          <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="info-card-content">
                          <span className="info-card-label">Started</span>
                          <span className="info-card-value">{new Date(selectedProject.startDate || selectedProject.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="info-card">
                        <div className="info-card-icon">
                          <i className="fas fa-clock"></i>
                        </div>
                        <div className="info-card-content">
                          <span className="info-card-label">Duration</span>
                          <span className="info-card-value">{projectDetails.projectDuration} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="info-card">
                        <div className="info-card-icon">
                          <i className="fas fa-rupee-sign"></i>
                        </div>
                        <div className="info-card-content">
                          <span className="info-card-label">Budget</span>
                          <span className="info-card-value">₹{selectedProject.expectedCost || 'Not Set'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                      <div className="stat-card-mini">
                        <div className="stat-mini-icon jobs">
                          <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="stat-mini-content">
                          <span className="stat-mini-number">{projectDetails.totalJobs}</span>
                          <span className="stat-mini-label">Total Jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="stat-card-mini">
                        <div className="stat-mini-icon applications">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="stat-mini-content">
                          <span className="stat-mini-number">{projectDetails.totalApplications}</span>
                          <span className="stat-mini-label">Applications</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="stat-card-mini">
                        <div className="stat-mini-icon workers">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-mini-content">
                          <span className="stat-mini-number">{dashboardStats.workersHired}</span>
                          <span className="stat-mini-label">Workers</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="stat-card-mini">
                        <div className="stat-mini-icon attendance">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-mini-content">
                          <span className="stat-mini-number">{dashboardStats.attendanceRate}%</span>
                          <span className="stat-mini-label">Attendance</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Project Info */}
                  {(selectedProject.description || selectedProject.location || selectedProject.type || selectedProject.clientName) && (
                    <>
                      {/* Location, Type, Client in one row */}
                      {(selectedProject.location || selectedProject.type || selectedProject.clientName) && (
                        <div className="row g-3 mb-3">
                          {selectedProject.location && (
                            <div className="col-md-4">
                              <div className="detail-card">
                                <div className="detail-card-header">
                                  <i className="fas fa-map-marker-alt"></i>
                                  <span>Location</span>
                                </div>
                                <div className="detail-card-body">{selectedProject.location}</div>
                              </div>
                            </div>
                          )}
                          {selectedProject.type && (
                            <div className="col-md-4">
                              <div className="detail-card">
                                <div className="detail-card-header">
                                  <i className="fas fa-building"></i>
                                  <span>Project Type</span>
                                </div>
                                <div className="detail-card-body">{selectedProject.type}</div>
                              </div>
                            </div>
                          )}
                          {selectedProject.clientName && (
                            <div className="col-md-4">
                              <div className="detail-card">
                                <div className="detail-card-header">
                                  <i className="fas fa-user"></i>
                                  <span>Client</span>
                                </div>
                                <div className="detail-card-body">{selectedProject.clientName}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Description in separate row */}
                      {selectedProject.description && (
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="detail-card">
                              <div className="detail-card-header">
                                <i className="fas fa-info-circle"></i>
                                <span>Description</span>
                              </div>
                              <div className="detail-card-body">{selectedProject.description}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Quick Stats Section */}
        {selectedProject && (
          <div className="row mb-4">
            <div className="col-12" style={{ textAlign: 'center' }}>
              <h4 className="stats-title" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-chart-bar me-2"></i>
                Project Statistics
              </h4>
            </div>
            <div className="col-6 col-md-6 mb-3 d-flex">
              <div className="stat-card materials w-100">
                <div className="stat-icon">
                  <i className="fas fa-boxes"></i>
                </div>
                <div className="state-content">
                  <p className="state-label">Materials in Stock</p>
                  <h5 className="state-number">{dashboardStats.materialsCount}</h5>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6 mb-3 d-flex">
              <div className="stat-card payroll w-100">
                <div className="stat-icon">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="state-content">
                  <p className="state-label">Payroll This Month</p>
                  <h5 className="state-number">₹{dashboardStats.monthlyPayroll.toLocaleString()}</h5>

                </div>
              </div>
            </div>
            {/* <div className="col-6 col-md-3 mb-3">
              <div className="stat-card attendance">
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">{dashboardStats.attendanceRate}%</h5>
                  <p className="stat-label">Attendance Rate</p>
                </div>
              </div>
            </div> */}
          </div>
        )}

        {/* Budget Analysis Chart */}
        {selectedProject && selectedProject.expectedCost && (() => {
          // Only show budget chart if budget is set
          const budget = parseFloat(selectedProject.expectedCost.replace(/[^0-9.-]+/g, "")) || 0;

          // Don't show chart if budget is 0 or invalid
          if (budget <= 0) return null;
          const materialCost = totalMaterialCost || 0;
          const payrollCost = dashboardStats.monthlyPayroll || 0;
          const totalSpent = materialCost + payrollCost;
          const remaining = Math.max(budget - totalSpent, 0);

          // Calculate actual percentages
          const actualSpentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
          const actualRemainingPercentage = budget > 0 ? (remaining / budget) * 100 : 100;

          // Smart visibility logic
          let spentPercentage = actualSpentPercentage;
          let remainingPercentage = actualRemainingPercentage;

          // Ensure visibility rules:
          if (totalSpent <= 0) {
            // No spending yet - show full budget as remaining
            spentPercentage = 0;
            remainingPercentage = 100;
          } else if (totalSpent >= budget) {
            // Over budget - show as fully spent
            spentPercentage = 100;
            remainingPercentage = 0;
          } else {
            // Both segments exist - ensure visibility
            if (spentPercentage > 0 && spentPercentage < 8) {
              spentPercentage = 8;
              remainingPercentage = 92;
            } else if (remainingPercentage > 0 && remainingPercentage < 8) {
              remainingPercentage = 8;
              spentPercentage = 92;
            }
          }

          return (
            <div className="row mb-4 d-flex align-items-stretch">
              <div className="col-md-6 d-flex">
                <div className="budget-chart-card w-100">
                  <h4 className="budget-chart-title">
                    <i className="fas fa-chart-pie me-2"></i>
                    Budget Analysis
                  </h4>
                  <div className="donut-chart-container text-center">
                    <div className="donut-chart">
                      <svg width="250" height="250" viewBox="0 0 200 200">
                        {/* Background circle - Total Budget Outline */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#6c757d"
                          strokeWidth="3"
                          strokeDasharray="5,3"
                        />

                        {/* Inner background for segments */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#f8f9fa"
                          strokeWidth="18"
                        />

                        {/* Spent amount arc - Only show if > 0 */}
                        {spentPercentage > 0 && (
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#dc3545"
                            strokeWidth="20"
                            strokeDasharray={`${(spentPercentage / 100) * 502.65} 502.65`}
                            strokeDashoffset="0"
                            transform="rotate(-90 100 100)"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Remaining amount arc - Only show if > 0 */}
                        {remainingPercentage > 0 && (
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#28a745"
                            strokeWidth="20"
                            strokeDasharray={`${(remainingPercentage / 100) * 502.65} 502.65`}
                            strokeDashoffset={`-${(spentPercentage / 100) * 502.65}`}
                            transform="rotate(-90 100 100)"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>

                      <div className="chart-center">
                        <div className="center-value">
                          <span className="percentage">{spentPercentage.toFixed(0)}%</span>
                          <span className="center-label">Used</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex">
                <div className="budget-details-card w-100">
                  <h4 className="budget-chart-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Budget Details
                  </h4>
                  <div className="budget-details-grid">
                    <div className="budget-detail-card spent">
                      <div className="budget-detail-icon">
                        <i className="fas fa-arrow-up"></i>
                      </div>
                      <div className="budget-detail-content">
                        <span className="budget-detail-label">Total Spent</span>
                        <span className="budget-detail-value">₹{totalSpent.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="budget-detail-card remaining">
                      <div className="budget-detail-icon">
                        <i className="fas fa-wallet"></i>
                      </div>
                      <div className="budget-detail-content">
                        <span className="budget-detail-label">Remaining</span>
                        <span className="budget-detail-value">₹{remaining.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="budget-detail-card total">
                      <div className="budget-detail-icon">
                        <i className="fas fa-calculator"></i>
                      </div>
                      <div className="budget-detail-content">
                        <span className="budget-detail-label">Total Budget</span>
                        <span className="budget-detail-value">₹{budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem 0', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
          <h2 className="dash-title">Management Tools</h2>
          <p style={{ fontSize: '1.1rem', color: '#6c757d', fontWeight: '400', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>Access all your project management features</p>
        </div>

        <div className="row g-4 d-flex justify-content-center align-items-stretch mb-5">
          {cardData1.map((card, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex">
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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Header from "../Components/Header";
import ProjectModal from "../Components/ProjectModal";
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

        // Fetch jobs for this project - handle 404 gracefully
        let jobsData = [];
        try {
          const jobsRes = await fetch(`http://localhost:5000/api/jobs/project/${selectedProject._id}`);
          if (jobsRes.ok) {
            const jobsResponse = await jobsRes.json();
            jobsData = jobsResponse.jobs || [];
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

      {/* Back Button */}
      {/* <div className="container-fluid px-3 px-md-4" style={{ marginTop: '1rem' }}>
        <button 
          className="btn btn-outline-primary mb-3"
          onClick={() => navigate('/Builder-Dashboard')}
          style={{
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back
        </button>
      </div> */}

      <div className="container-fluid px-3 px-md-4 " >

        {/* Project Overview Card */}
        {selectedProject && (
          <div className="row mb-4">
            <div className="col-12">

              <div className="project-overview-card">

                <div className="project-header">
                  <button
                    className="btn-back mb-3"
                    onClick={() => navigate("/Builder-Dashboard")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Home
                  </button>
                  <div className="progress-section">
                    <div className="progress-circle-large">

                      <svg width="140" height="140" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" stroke="#e9ecef" strokeWidth="10" fill="none" />
                        <circle
                          cx="60" cy="60" r="50"
                          stroke={overallProgress === 100 ? "#28a745" : overallProgress > 50 ? "#ffc107" : "#667eea"}
                          strokeWidth="10" fill="none"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallProgress / 100)}`}
                          strokeLinecap="round" transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="progress-text-large">
                        <span className="progress-number-large">{overallProgress}%</span>
                        <span className="progress-label-large">Complete</span>
                      </div>
                    </div>
                    <div className="progress-info">
                      <h3 className="project-title">
                        <i className="fas fa-building me-2"></i>
                        {selectedProject.name}
                      </h3>
                      {/* <p className="project-id">ID: {selectedProject._id?.slice(-8)}</p> */}
                      <span className={`project-id ${overallProgress === 100 ? 'completed' : overallProgress > 20 ? 'ongoing' : 'planning'}`}>
                        {overallProgress === 100 ? 'Completed' : overallProgress > 20 ? 'Ongoing' : 'Planning'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="project-details">
                  <div className="project-header-grid">
                    <div className="project-main-info">
                      <div className="project-dates">
                        <div className="date-item">
                          <i className="fas fa-calendar-start"></i>
                          <div className="date-content">
                            <span className="date-label">Started</span>
                            <span className="date-value">{new Date(selectedProject.startDate || selectedProject.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="date-item">
                          <i className="fas fa-clock"></i>
                          <div className="date-content">
                            <span className="date-label">Duration</span>
                            <span className="date-value">{projectDetails.projectDuration} days</span>
                          </div>
                        </div>
                        <div className="date-item">
                          <i className="fas fa-rupee-sign"></i>
                          <div className="date-content">
                            <span className="date-label">Budget</span>
                            <span className="date-value">₹{selectedProject.expectedCost || 'Not Set'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="project-stats-grid">
                        <div className="proj-stat-item">
                          <i className="fas fa-briefcase"></i>
                          <div className="state-content">
                            <span className="state-number">{projectDetails.totalJobs}</span>
                            <span className="state-label">Total Jobs</span>
                          </div>
                        </div>
                        <div className="proj-stat-item">
                          <i className="fas fa-file-alt"></i>
                          <div className="state-content">
                            <span className="state-number">{projectDetails.totalApplications}</span>
                            <span className="state-label">Applications</span>
                          </div>
                        </div>
                        <div className="proj-stat-item">
                          <i className="fas fa-users"></i>
                          <div className="state-content">
                            <span className="state-number">{dashboardStats.workersHired}</span>
                            <span className="state-label">Workers</span>
                          </div>
                        </div>
                        <div className="proj-stat-item">
                          <i className="fas fa-chart-line"></i>
                          <div className="state-content">
                            <span className="state-number">{dashboardStats.attendanceRate}%</span>
                            <span className="state-label">Attendance</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(selectedProject.description || selectedProject.location) && (
                      <div className="project-additional-info">
                        {selectedProject.location && (
                          <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <div className="info-content">
                              <span className="info-label">Location</span>
                              <span className="info-value">{selectedProject.location}</span>
                            </div>
                          </div>
                        )}
                        {selectedProject.type && (
                          <div className="info-item">
                            <i className="fas fa-building"></i>
                            <div className="info-content">
                              <span className="info-label">Project Type</span>
                              <span className="info-value">{selectedProject.type}</span>
                            </div>
                          </div>
                        )}
                        {selectedProject.clientName && (
                          <div className="info-item">
                            <i className="fas fa-user"></i>
                            <div className="info-content">
                              <span className="info-label">Client</span>
                              <span className="info-value">{selectedProject.clientName}</span>
                            </div>
                          </div>
                        )}
                        {selectedProject.description && (
                          <div className="info-item description">
                            <i className="fas fa-info-circle"></i>
                            <div className="info-content">
                              <span className="info-label">Description</span>
                              <span className="info-value">{selectedProject.description}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
            <div className="col-6 col-md-6 mb-3">
              <div className="stat-card materials">
                <div className="stat-icon">
                  <i className="fas fa-boxes"></i>
                </div>
                <div className="state-content">
                  <h5 className="state-number">{dashboardStats.materialsCount}</h5>
                  <p className="state-label">Materials in Stock</p>
                </div>
              </div>
            </div>
            {/* <div className="col-6 col-md-3 mb-3">
              <div className="stat-card workers">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">{dashboardStats.workersHired}</h5>
                  <p className="stat-label">Workers Hired</p>
                </div>
              </div>
            </div> */}
            <div className="col-6 col-md-6 mb-3">
              <div className="stat-card payroll">
                <div className="stat-icon">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="state-content">
                  <h5 className="state-number">₹{dashboardStats.monthlyPayroll.toLocaleString()}</h5>
                  <p className="state-label">Payroll This Month</p>
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
            <div className="row mb-4">
              <div className="col-12">
                <div className="budget-chart-card">
                  <h4 className="budget-chart-title">
                    <i className="fas fa-chart-donut me-2"></i>
                    Budget Analysis
                  </h4>

                  <div className="chart-layout">
                    <div className="donut-chart-container">
                      <div className="donut-chart">
                        <svg width="200" height="200" viewBox="0 0 200 200">
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

                    <div className="chart-details">
                      <div className="detail-item spent">
                        <div className="detail-indicator"></div>
                        <div className="detail-content">
                          <span className="detail-label">Total Spent</span>
                          <span className="detail-value">₹{totalSpent.toLocaleString()}</span>
                          <span className="detail-breakdown">
                            Materials: ₹{totalMaterialCost.toLocaleString()} |
                            Payroll: ₹{dashboardStats.monthlyPayroll.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item remaining">
                        <div className="detail-indicator"></div>
                        <div className="detail-content">
                          <span className="detail-label">Remaining Budget</span>
                          <span className="detail-value">₹{remaining.toLocaleString()}</span>
                          <span className="detail-breakdown">
                            {remainingPercentage.toFixed(0)}% of total budget available
                          </span>
                        </div>
                      </div>

                      <div className="detail-item total">
                        <div className="detail-indicator"></div>
                        <div className="detail-content">
                          <span className="detail-label">Total Budget</span>
                          <span className="detail-value">₹{budget.toLocaleString()}</span>
                          <span className="detail-breakdown">
                            Allocated: {spentPercentage.toFixed(1)}% spent, {remainingPercentage.toFixed(1)}% remaining
                          </span>
                        </div>
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

        <div className="row g-3 d-flex justify-content-center mb-5">
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
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

      console.log('🔍 Starting dashboard data fetch for project:', selectedProject._id);
      console.log('📦 Materials in Redux:', materials?.length || 0);
      console.log('💰 Enhanced payroll total:', enhancedPayrollTotal);

      try {
        // Materials count for selected project
        console.log('🔍 All materials in Redux:', materials?.length || 0);
        console.log('📋 Selected project ID:', selectedProject._id);
        
        const projectMaterials = materials?.filter(m => {
          const matches = m.projectId === selectedProject._id;
          console.log(`Material: ${m.name} | ProjectId: ${m.projectId} | Selected: ${selectedProject._id} | Match: ${matches}`);
          return matches;
        }) || [];
        
        console.log('✅ Filtered project materials:', projectMaterials.length);
        console.log('📦 Project materials list:', projectMaterials.map(m => m.name));
        
        // Fetch jobs for this project
        console.log('🔍 Fetching jobs for project:', selectedProject._id);
        const jobsRes = await fetch(`http://localhost:5000/api/jobs?projectId=${selectedProject._id}`);
        const jobsData = jobsRes.ok ? await jobsRes.json() : [];
        console.log('✅ Jobs response:', jobsRes.status, 'Data length:', jobsData.length);
        const activeJobs = jobsData.filter(job => job.status === 'active' || !job.status).length;
        
        // Fetch all applications for this project
        console.log('🔍 Fetching applications for project:', selectedProject._id);
        const allAppsRes = await fetch(`http://localhost:5000/api/apply?projectId=${selectedProject._id}`);
        const allAppsData = allAppsRes.ok ? await allAppsRes.json() : [];
        console.log('✅ Applications response:', allAppsRes.status, 'Data length:', allAppsData.length);
        
        // Workers hired
        console.log('🔍 Fetching hired workers for project:', selectedProject._id);
        const workersRes = await fetch(`http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`);
        const workersData = workersRes.ok ? await workersRes.json() : [];
        console.log('✅ Workers response:', workersRes.status, 'Data length:', workersData.length);
        const hiredWorkers = workersData.filter(app => app.status === "joined");
        
        // Calculate project duration
        const startDate = new Date(selectedProject.createdAt);
        const currentDate = new Date();
        const durationDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        
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
  }, [selectedProject, materials, enhancedPayrollTotal]);

  const totalMaterialCost = Array.isArray(materials) && selectedProject
    ? materials
        .filter(m => m.projectId === selectedProject._id)
        .reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0)
    : 0;
  const totalWorkerPayable = Array.isArray(payrollList)
    ? payrollList.reduce((sum, p) => sum + (p.totalSalary || p.payable || 0), 0)
    : 0;
  const totalProjectCost = totalMaterialCost + totalWorkerPayable + enhancedPayrollTotal;

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="container-fluid px-3 px-md-4 mb-4" style={{ marginTop: '3rem' }}>
        
        {/* Project Overview Card */}
        {selectedProject && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="project-overview-card">
                <div className="project-header">
                  <div className="progress-section">
                    <div className="progress-circle-large">
                      <svg width="120" height="120" viewBox="0 0 120 120">
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
                      <p className="project-id">ID: {selectedProject._id?.slice(-8)}</p>
                      <span className={`status-badge ${overallProgress === 100 ? 'completed' : overallProgress > 20 ? 'ongoing' : 'planning'}`}>
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
                            <span className="date-value">{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
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
                            <span className="date-value">₹{selectedProject.budget ? (selectedProject.budget / 100000).toFixed(1) : '0'}L</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="project-stats-grid">
                        <div className="stat-item">
                          <i className="fas fa-briefcase"></i>
                          <div className="stat-content">
                            <span className="stat-number">{projectDetails.totalJobs}</span>
                            <span className="stat-label">Total Jobs</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <i className="fas fa-file-alt"></i>
                          <div className="stat-content">
                            <span className="stat-number">{projectDetails.totalApplications}</span>
                            <span className="stat-label">Applications</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <i className="fas fa-users"></i>
                          <div className="stat-content">
                            <span className="stat-number">{dashboardStats.workersHired}</span>
                            <span className="stat-label">Workers</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <i className="fas fa-chart-line"></i>
                          <div className="stat-content">
                            <span className="stat-number">{dashboardStats.attendanceRate}%</span>
                            <span className="stat-label">Attendance</span>
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

        {/* Project Financial Overview */}
        {/* {selectedProject && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="financial-overview">
                <h4 className="financial-title">
                  <i className="fas fa-chart-pie me-2"></i>
                  Financial Overview
                </h4>
                <div className="financial-grid">
                  <div className="financial-item">
                    <span className="financial-label">Total Budget</span>
                    <span className="financial-value budget">
                      ₹{selectedProject.budget ? (selectedProject.budget / 100000).toFixed(1) : '0'}L
                    </span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Materials Cost</span>
                    <span className="financial-value materials">
                      ₹{(totalMaterialCost / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Payroll Spent</span>
                    <span className="financial-value payroll">
                      ₹{(dashboardStats.monthlyPayroll / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Remaining</span>
                    <span className="financial-value remaining">
                      ₹{selectedProject.budget ? ((selectedProject.budget - totalMaterialCost - dashboardStats.monthlyPayroll) / 1000).toFixed(0) : '0'}K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Quick Stats Section */}
        {selectedProject && (
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="stats-title">
                <i className="fas fa-chart-bar me-2"></i>
                Project Statistics
              </h4>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className="stat-card materials">
                <div className="stat-icon">
                  <i className="fas fa-boxes"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">{dashboardStats.materialsCount}</h5>
                  <p className="stat-label">Materials in Stock</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className="stat-card workers">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">{dashboardStats.workersHired}</h5>
                  <p className="stat-label">Workers Hired</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className="stat-card payroll">
                <div className="stat-icon">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">₹{dashboardStats.monthlyPayroll.toLocaleString()}</h5>
                  <p className="stat-label">Payroll This Month</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className="stat-card attendance">
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <h5 className="stat-number">{dashboardStats.attendanceRate}%</h5>
                  <p className="stat-label">Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budget Analysis Chart */}
        {selectedProject && (() => {
          // Validate and set budget
          const budget = selectedProject.budget && selectedProject.budget > 0 ? selectedProject.budget : 1000000;
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

      {/* Enhanced Styles */}
      <style jsx>{`
        .project-overview-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 20px;
          padding: 2rem;
          color: #2c3e50;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }
        
        .project-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
        }
        
        .progress-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .progress-info {
          text-align: left;
        }
        
        .progress-info .project-title {
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .progress-info .project-id {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          margin-bottom: 1rem;
        }
        
        .project-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          color: #1a202c;
        }
        
        .project-title i {
          color: #667eea;
          margin-right: 0.75rem;
        }
        
        .project-id {
          color: #718096;
          margin: 0;
          font-size: 0.85rem;
          font-family: 'Courier New', monospace;
          background: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          display: inline-block;
        }
        
        .project-details {
          flex: 1;
        }
        
        .project-header-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        
        .project-main-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .project-dates {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }
        
        .date-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .date-item i {
          font-size: 1.2rem;
          color: #667eea;
          width: 24px;
          text-align: center;
        }
        
        .date-content {
          display: flex;
          flex-direction: column;
        }
        
        .date-label {
          font-size: 0.75rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .date-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .status-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge.planning {
          background: rgba(255, 193, 7, 0.2);
          color: #856404;
        }
        
        .status-badge.ongoing {
          background: rgba(23, 162, 184, 0.2);
          color: #0c5460;
        }
        
        .status-badge.completed {
          background: rgba(40, 167, 69, 0.2);
          color: #155724;
        }
        
        .project-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        
        .stat-item i {
          font-size: 1.1rem;
          color: #667eea;
          width: 20px;
          text-align: center;
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1;
          color: #1a202c;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
          font-weight: 500;
        }
        
        .project-additional-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }
        
        .info-item i {
          font-size: 1.1rem;
          color: #667eea;
          margin-top: 0.1rem;
          width: 20px;
          text-align: center;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-label {
          display: block;
          font-size: 0.75rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .info-value {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #2d3748;
        }
        
        .info-item.description .info-value {
          font-size: 0.9rem;
          line-height: 1.6;
        }
        
        .financial-overview {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        
        .financial-title {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .financial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .financial-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          border-left: 4px solid #dee2e6;
        }
        
        .financial-label {
          font-weight: 500;
          color: #6c757d;
        }
        
        .financial-value {
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .financial-value.budget {
          color: #17a2b8;
        }
        
        .financial-value.materials {
          color: #dc3545;
        }
        
        .financial-value.payroll {
          color: #ffc107;
        }
        
        .financial-value.remaining {
          color: #28a745;
        }
        
        .project-dates {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .date-item {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .progress-circle-large {
          position: relative;
          display: inline-block;
        }
        
        .progress-text-large {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .progress-number-large {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .progress-label-large {
          display: block;
          font-size: 0.9rem;
          opacity: 0.9;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stats-title {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          height: 100%;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
        }
        
        .stat-card.materials .stat-icon {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        }
        
        .stat-card.workers .stat-icon {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }
        
        .stat-card.payroll .stat-icon {
          background: linear-gradient(135deg, #45b7d1, #96c93d);
        }
        
        .stat-card.attendance .stat-icon {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
        }
        
        .budget-chart-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .budget-chart-title {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .chart-layout {
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        
        .donut-chart-container {
          position: relative;
          flex-shrink: 0;
        }
        
        .donut-chart {
          position: relative;
        }
        
        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .center-value {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .percentage {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
        }
        
        .center-label {
          font-size: 0.8rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
        }
        
        .chart-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
        }
        
        .detail-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }
        
        .detail-item.spent .detail-indicator {
          background: #dc3545;
        }
        
        .detail-item.remaining .detail-indicator {
          background: #28a745;
        }
        
        .detail-item.total .detail-indicator {
          background: #6c757d;
          border: 2px solid #495057;
          width: 14px;
          height: 14px;
        }
        
        .detail-content {
          flex: 1;
        }
        
        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        
        .detail-breakdown {
          display: block;
          font-size: 0.75rem;
          color: #6c757d;
          line-height: 1.3;
        }
        
        @media (max-width: 768px) {
          .project-header {
            flex-direction: column;
            text-align: center;
          }
          
          .project-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
          }
          
          .progress-section {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .progress-info {
            text-align: center;
          }
          
          .project-header-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .project-dates {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .project-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .project-title {
            font-size: 1.5rem;
          }
          
          .financial-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            padding: 1rem;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .chart-layout {
            flex-direction: column;
            gap: 2rem;
          }
          
          .donut-chart svg {
            width: 150px;
            height: 150px;
          }
          
          .percentage {
            font-size: 1.5rem;
          }
          
          .detail-item {
            padding: 0.75rem;
          }
          
          .detail-value {
            font-size: 1.1rem;
          }
        }
      `}</style>

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

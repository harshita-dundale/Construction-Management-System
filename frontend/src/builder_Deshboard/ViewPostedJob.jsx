import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobCard1 from "../Components/cards/JobCard1";
import EditJobModal from "./EditJobModal";
import { toast } from "react-toastify";
import { FaRegAddressBook } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewPostedJobs() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const [projectsWithJobs, setProjectsWithJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user?.sub) return;

    const url = `http://localhost:5000/api/jobs/builder/${encodeURIComponent(user.sub)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setProjectsWithJobs(data.data);
          const flatJobs = data.data.reduce((acc, project) => acc.concat(project.jobs), []);
          setAllJobs(flatJobs);
        } else {
          setProjectsWithJobs([]);
          setAllJobs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user?.sub]);

  const handleJobUpdate = async (updatedJob) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${updatedJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Job updated successfully!");
        setAllJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setJobToEdit(null);
      } else {
        toast.error(result.message || "Failed to update job");
      }
    } catch {
      toast.error("Error updating job");
    }
  };

  const handleDeleteJob = async (job) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job post will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-color)",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;
  // const confirm = window.confirm("Are you sure you want to delete this job?");
  // if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      //alert("Job deleted successfully!");
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The job has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setAllJobs((prev) => prev.filter((j) => j._id !== job._id));

      setProjectsWithJobs((prevProjects) =>
        prevProjects.map((project) => ({
          ...project,
          jobs: project.jobs.filter((j) => j._id !== job._id),
        }))
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: data.message || "Failed to delete the job.",
      });
    //  alert("Failed to delete: " + data.message);
    }
  } catch (err) {
    console.error("Delete Error:", err);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong while deleting the job.",
    });
   // alert("Error deleting job");
  }
};


  if (error) return <p className="text-danger text-center">Error: {error}</p>;
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
      <p>Loading your jobs...</p>
    </div>
  );

  const displayJobs = selectedProject
    ? allJobs.filter((job) =>
        projectsWithJobs.some(
          (project) =>
            project.projectId === selectedProject._id &&
            project.jobs.some((pJob) => pJob._id === job._id)
        )
      )
    : allJobs;

  const rows = [];
  for (let i = 0; i < displayJobs.length; i += 3) {
    rows.push(displayJobs.slice(i, i + 3));
  }

  return (
    <>
      <Header />
      <div className="jobs-page-container">
        {/* Header Section */}
        <div className="jobs-header-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="header-content">
                  <div className="header-badge">
                    <i className="fas fa-briefcase me-2"></i>
                    Job Management
                  </div>
                  <h1 className="header-title">My Posted Jobs</h1>
                  <p className="header-subtitle">Manage and track all your job postings efficiently</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card">
                  <div className="stat-icon">
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{displayJobs.length}</div>
                    <div className="stat-label">Total Jobs</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="quick-actions">
                  <button 
                    className="action-btn primary-btn"
                    onClick={() => navigate('/post-job')}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Post New Job
                  </button>
                  <button 
                    className="action-btn secondary-btn"
                    onClick={() => navigate('/ViewApplications')}
                  >
                    <i className="fas fa-users me-2"></i>
                    View Applications
                  </button>
                  <button 
                    className="action-btn tertiary-btn"
                    onClick={() => toast.info('Analytics feature coming soon!')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Project Filter */}
        {selectedProject && (
          <div className="container mb-4">
            <div className="project-filter">
              <div className="filter-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="filter-content">
                <h6 className="filter-title">{selectedProject.name}</h6>
                <span className="filter-subtitle">Project Filter Active</span>
              </div>
              <div className="filter-badge">
                {displayJobs.length} Jobs
              </div>
            </div>
          </div>
        )}

        <div className="container">
          {displayJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3 className="empty-title">No Jobs Posted Yet</h3>
              <p className="empty-description">
                {selectedProject
                  ? `No jobs have been posted for ${selectedProject.name} project yet.`
                  : "Ready to start hiring? Create your first job posting and find the perfect candidates."}
              </p>
            </div>
          ) : (
            <div className="jobs-content">
              {!selectedProject &&
                projectsWithJobs.map((project) => (
                  <div key={project.projectId} className="project-section">
                    <div className="project-header">
                      <div className="project-info">
                        <div className="project-icon">
                          <i className="fas fa-building"></i>
                        </div>
                        <div className="project-details">
                          <h4 className="project-name">{project.projectName}</h4>
                          <span className="project-meta">
                            {project.jobs.length} job{project.jobs.length !== 1 ? 's' : ''} posted
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="jobs-grid">
                      <div className="row g-4">
                        {project.jobs.map((job) => (
                          <div className="col-xl-4 col-lg-6 col-md-6" key={job._id}>
                            <div className="job-card-wrapper">
                              {actionLoading === job._id ? (
                                <div className="job-card-loading">
                                  <i className="fas fa-spinner fa-spin"></i>
                                  <p>Processing...</p>
                                </div>
                              ) : (
                                <JobCard1
                                  job={job}
                                  onEdit={setJobToEdit}
                                  onDelete={handleDeleteJob}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              {selectedProject && (
                <div className="jobs-grid">
                  <div className="row g-4">
                    {displayJobs.map((job) => (
                      <div className="col-xl-4 col-lg-6 col-md-6" key={job._id}>
                        <div className="job-card-wrapper">
                          {actionLoading === job._id ? (
                            <div className="job-card-loading">
                              <i className="fas fa-spinner fa-spin"></i>
                              <p>Processing...</p>
                            </div>
                          ) : (
                            <JobCard1
                              job={job}
                              onEdit={setJobToEdit}
                              onDelete={handleDeleteJob}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {jobToEdit && (
        <EditJobModal
          job={jobToEdit}
          onClose={() => setJobToEdit(null)}
          onSave={handleJobUpdate}
        />
      )}
      
      <style jsx>{`
        .jobs-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding-top: 6rem;
        }
        
        .jobs-header-section {
          background: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .header-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .header-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin: 0;
        }
        
        .stats-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .project-filter {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
        
        .filter-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .filter-content {
          flex: 1;
        }
        
        .filter-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }
        
        .filter-subtitle {
          font-size: 0.85rem;
          opacity: 0.8;
        }
        
        .filter-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }
        
        .empty-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 3rem;
          color: white;
        }
        
        .empty-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .empty-description {
          color: #6c757d;
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .project-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .project-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }
        
        .project-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .project-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.3rem;
        }
        
        .project-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        
        .project-meta {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .job-card-wrapper {
          transition: all 0.3s ease;
        }
        
        .job-card-wrapper:hover {
          transform: translateY(-5px);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: #6c757d;
        }
        
        .loading-spinner {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #667eea;
        }
        
        .quick-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .action-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .primary-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .secondary-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }
        
        .tertiary-btn {
          background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
          color: white;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        

        
        .job-card-loading {
          background: white;
          border-radius: 15px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          color: #6c757d;
        }
        
        .job-card-loading i {
          font-size: 2rem;
          color: #667eea;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .header-title {
            font-size: 2rem;
          }
          
          .stats-card {
            margin-top: 2rem;
          }
          
          .project-info {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

    </>
  );
}

export default ViewPostedJobs;
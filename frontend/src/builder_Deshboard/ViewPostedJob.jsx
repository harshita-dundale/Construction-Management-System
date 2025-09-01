import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobCard1 from "../Components/cards/JobCard1";
import EditJobModal from "./EditJobModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./ViewPostedJobs.css"; // 👈 CSS file import

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

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
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
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while deleting the job.",
      });
    }
  };

  if (error) return <p className="text-danger text-center">Error: {error}</p>;
  if (loading)
    return (
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
                  <h1 className="header-title">My Posted Jobs</h1>
                </div>
                <p className="header-subtitle me-5">
                Streamline your hiring process by managing and tracking all job postings efficiently, ensuring better organization and faster recruitment.                </p>
                {/* <div className="header-badge">
                  <i className="fas fa-briefcase me-2"></i>
                  Job Management
                </div> */}
              </div>
              <div className="col-md-4">
              
                {selectedProject && (
                  <div className="container mb-4  mt-3">
                    <div className="project-filter">
                      <div className="filter-icon">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="filter-content">
                        <h6 className="filter-title">{selectedProject.name}</h6>
                        <span className="filter-subtitle">Project Filter Active</span>
                      </div>
                      <div className="filter-badge">{displayJobs.length} Jobs</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="quick-actions">
                  <button
                    className="action-btn primary-btn"
                    onClick={() => navigate("/post-job")}>
                    <i className="fas fa-plus me-2"></i>
                    Post New Job
                  </button>
                  <button
                    className="action-btn secondary-btn"
                    onClick={() => navigate("/ViewApplications")}
                  >
                    <i className="fas fa-users me-2"></i>
                    View Applications
                  </button>
                  <button
                    className="action-btn tertiary-btn"
                    onClick={() => toast.info("Analytics feature coming soon!")}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
       <div className="container">
          {displayJobs.length === 0 ? (
            <div className="empty-state-parent">
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
    </>
  );
}
export default ViewPostedJobs;
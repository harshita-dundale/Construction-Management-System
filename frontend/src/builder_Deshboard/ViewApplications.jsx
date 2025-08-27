import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card3 from "../Components/cards/Card3";
import Header from "../Components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import "./viewApplications.css";
import {
  fetchApplications,
  setFilteredApplications,
} from "../Pages/Redux/applicationsSlice";
import { useAuth0 } from "@auth0/auth0-react";

function ViewApplications() {
  const dispatch = useDispatch();
  const { applications, filteredApplications, loading, error } = useSelector(
    (state) => state.applications
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("");
  const { user, isLoading } = useAuth0();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  // 🔁 Fetch fresh data from backend on filter/project change
  useEffect(() => {
    if (user?.email && selectedProject?._id) {
      dispatch(
        fetchApplications({
        //  workerEmail: user.email,
          status: statusFilter,
          experience: experienceFilter,
          projectId: selectedProject._id, 
        })
      );
    }
  }, [statusFilter, experienceFilter, selectedProject, dispatch, user?.email]);


  if (isLoading || !user?.email) {
    return <p>Loading user...</p>;
  }

  const rows = [];
  for (let i = 0; i < filteredApplications.length; i += 3) {
    rows.push(filteredApplications.slice(i, i + 3));
  }

  return (
    <div className="view-applications-wrapper">
      <Header />
      
      {/* Hero Section */}
      <div className="applications-hero">
        <div className="container">
          <div className="text-center">
            <div className="hero-badge mb-3">
              <i className="fas fa-file-alt me-2"></i>
              Applications Management
            </div>
            <h1 className="hero-title">Review Job Applications</h1>
            <p className="hero-subtitle">Manage and review applications for your construction projects</p>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        {/* Filters Section */}
        <div className="filters-card">
          <div className="filters-header">
            <h3 className="filters-title">
              <i className="fas fa-filter me-2"></i>
              Filter Applications
            </h3>
            <p className="filters-subtitle">Narrow down applications based on your criteria</p>
          </div>
          
          <div className="filters-content">
            <div className="row g-2">
              <div className="col-md-6">
                <div className="filter-group">
                  <label className="filter-label">
                    <i className="fas fa-check-circle me-2"></i>
                    Application Status
                  </label>
                  <select
                    className="modern-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Applications</option>
                    <option value="accepted">✅ Accepted</option>
                    <option value="joined">🎯 Joined</option>
                    <option value="rejected">❌ Rejected</option>
                    <option value="under_review">⏳ Under Review</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="filter-group">
                  <label className="filter-label">
                    <i className="fas fa-star me-2"></i>
                    Minimum Experience
                  </label>
                  <input
                    type="number"
                    className="modern-input"
                    placeholder="Years of experience"
                    min="0"
                    max="30"
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="applications-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-users me-2"></i>
              Applications ({filteredApplications.length})
            </h3>
          </div>
          
          <div className="applications-grid">
            {loading ? (
              <LoadingSpinner message="Loading applications..." size="medium" />
            ) : error ? (
              <div className="error-state">
                <i className="fas fa-exclamation-triangle"></i>
                <h4>Error Loading Applications</h4>
                <p>{error}</p>
                <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                  <i className="fas fa-refresh me-2"></i>Try Again
                </button>
              </div>
            ) : filteredApplications.length === 0 ? (
              <EmptyState 
                icon="fas fa-inbox"
                title="No Applications Found"
                message="No applications match your current filter criteria. Try adjusting your filters."
              />
            ) : (
              rows.map((row, index) => (
                <div className="row g-2 mb-4" key={index}>
                  {row.map((application, index) => (
                    <div className="col-lg-4 col-md-6" key={application._id || index}>
                      <Card3 application={application} />
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}



export default ViewApplications;
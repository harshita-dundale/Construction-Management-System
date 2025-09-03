import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
          {/* Back Button */}
          
          
          <div className="text-center">
            {/* <div className="hero-badge mb-3"> */}
              {/* <div className="back-button-container-apps"> */}
            <button
              className="btn-back-apps"
              onClick={() => navigate("/project_pannel")}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Projects
            </button>
          {/* </div> */}
            {/* </div> */}
            <h1 className="hero-title">Review Job Applications</h1>
            <p className="hero-subtitle">Manage and review applications for your construction projects</p>
          </div>
        </div>
      </div>
      
      <div className="container pb-5">
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

        {/* Applications Section section-header*/}
        <div className="applications-section">
          <div className="mt-3">
            <h3 className="view-sec-title ms-4">
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
      
      {/* Inline Styles for Back Button */}
      <style dangerouslySetInnerHTML={{__html: `
        .back-button-container-apps {
          margin-bottom: 2rem;
          padding: 1rem 0;
        }

        .btn-back-apps {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-back-apps:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .back-button-container-apps {
            padding: 0.5rem 0;
          }
          
          .btn-back-apps {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}} />
    </div>
  );
}

export default ViewApplications;
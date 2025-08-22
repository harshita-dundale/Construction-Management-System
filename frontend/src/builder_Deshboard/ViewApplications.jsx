import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card3 from "../Components/cards/Card3";
import Header from "../Components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
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
      
      <style jsx>{`
        .view-applications-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding-top: 80px;
        }
        
        .applications-hero {
          background: white;
          padding: 3rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        
        .hero-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .filters-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .filters-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem 2rem;
          text-align: center;
        }
        
        .filters-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .filters-subtitle {
          opacity: 0.9;
          margin-bottom: 0;
        }
        
        .filters-content {
          padding: 2rem;
        }
        
        .filter-group {
          margin-bottom: 1rem;
        }
        
        .filter-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .filter-label i {
          color: #667eea;
          width: 16px;
        }
        
        .modern-select,
        .modern-input {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
          width: 100%;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        
        .modern-select:focus,
        .modern-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
          outline: none;
        }
        
        .modern-select option {
          padding: 0.5rem;
          background: white;
          color: #2c3e50;
        }
        
        .modern-select option:hover {
          background: #f8f9fa;
        }
        
        .applications-section {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .section-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem 2rem;
          border-bottom: none;
        }
        
        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0;
          display: flex;
          align-items: center;
        }
        
        .section-title i {
          color: white;
        }
        
        .applications-grid {
          padding: 2rem;
        }
        
        .loading-state,
        .error-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #6c757d;
        }
        
        .error-state {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 12px;
          margin: 2rem 0;
        }
        
        .error-state i {
          font-size: 3rem;
          color: #e53e3e;
          margin-bottom: 1rem;
        }
        
        .loading-state .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e9ecef;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        .error-state i,
        .empty-state i {
          font-size: 3rem;
          color: #dc3545;
          margin-bottom: 1rem;
        }
        
        .empty-state i {
          color: #6c757d;
        }
        
        .empty-state h4 {
          color: #495057;
          margin-bottom: 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .applications-hero {
            padding: 2rem 0;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .filters-content,
          .applications-grid {
            padding: 1.5rem;
          }
          
          .filters-header,
          .section-header {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}



export default ViewApplications;
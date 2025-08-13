import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card3 from "../Components/cards/Card3";
import Header from "../Components/Header";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, isLoading } = useAuth0();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const handleCreativeRefresh = async () => {
    setIsRefreshing(true);
    
    // Show loading animation for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (selectedProject?._id) {
      dispatch(
        fetchApplications({
          status: statusFilter,
          experience: experienceFilter,
          projectId: selectedProject._id,
        })
      );
    }
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
    <div>
      <Header />
      <div className="container">
        <h1
          className="text-center mb-4"
          style={{ marginTop: "7rem", color: "#333" }}
        >
          View Applications
        </h1>

        <div
          className="filters p-4 mb-4 rounded shadow bg-light"
          style={filterBoxStyle}
        >
          <h3 className="mb-3 text-info" style={headingStyle}>
            Filters
          </h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="status" className="form-label" style={labelStyle}>
                Status
              </label>
              <select
                id="status"
                className="form-select shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="experience" className="form-label" style={labelStyle}>
                Experience
              </label>
              <input
                type="number"
                id="experience"
                className="form-control shadow-sm"
                style={inputStyle}
                placeholder="Years"
                min="0"
                max="30"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="applications p-4 rounded" style={{
          ...cardContainerStyle,
          opacity: isRefreshing ? 0.7 : 1,
          transform: isRefreshing ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.5s ease'
        }}>
          {loading || isRefreshing ? (
            <div className="text-center py-5" style={loadingStateStyle}>
              <div className="mb-4">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h4 className="text-muted mb-3">
                {isRefreshing ? '🔄 Refreshing Applications...' : '🔍 Loading Applications...'}
              </h4>
              <p className="text-muted">
                {isRefreshing ? 'Getting the latest data for you!' : 'Please wait while we fetch the applications.'}
              </p>
            </div>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-5" style={emptyStateStyle}>
              <div className="mb-4">
                <div style={emptyIconStyle}>📋</div>
              </div>
              <h3 className="text-muted mb-3" style={{ fontWeight: '600' }}>
                No Applications Found
              </h3>
              <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                It looks like there are no applications matching your current filters.
                <br />
                Try adjusting your search criteria or check back later for new applications.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setStatusFilter("all");
                    setExperienceFilter("");
                  }}
                  style={clearFiltersButtonStyle}
                >
                  🔄 Clear Filters
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleCreativeRefresh}
                  disabled={isRefreshing}
                  style={{
                    ...refreshButtonStyle,
                    transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                    transition: 'all 0.8s ease'
                  }}
                >
                  {isRefreshing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      🔄 Refresh Data
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            rows.map((row, index) => (
              <div className="row mb-4" key={index}>
                {row.map((application, index) => (
                  <div className="col-md-4" key={application._id || index}>
                    <Card3 application={application} />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Fix: Define Missing Style Objects
const filterBoxStyle = {
  border: "2px solid rgb(46, 199, 204)",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  fontWeight: "bold",
};

const labelStyle = {
  fontWeight: "600",
  color: "#555",
};

const inputStyle = {
  borderRadius: "8px",
  border: "1px solid #ddd",
  padding: "10px",
};

const cardContainerStyle = {
  borderRadius: "10px",
  border: "2px solid #ccc",
};

const emptyStateStyle = {
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  borderRadius: "15px",
  padding: "40px 20px",
  margin: "20px 0",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
};

const emptyIconStyle = {
  fontSize: "4rem",
  marginBottom: "20px",
  filter: "grayscale(20%)",
};

const clearFiltersButtonStyle = {
  borderRadius: "25px",
  padding: "10px 20px",
  fontWeight: "600",
  transition: "all 0.3s ease",
};

const refreshButtonStyle = {
  borderRadius: "25px",
  padding: "10px 20px",
  fontWeight: "600",
  transition: "all 0.3s ease",
};

const loadingStateStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "15px",
  padding: "40px 20px",
  margin: "20px 0",
  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
  color: "white",
};

export default ViewApplications;
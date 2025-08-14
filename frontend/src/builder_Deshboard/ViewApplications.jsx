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
    <div>
      <Header />
      <div className="container">
        <h2
          className="text-center mb-5 fw-bold"
          style={{ marginTop: "8rem", color: "#333" }}
        >
          View Applications
        </h2>

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
                <option value="joined">Joined</option>
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

        <div className="applications p-4 rounded" style={cardContainerStyle}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : filteredApplications.length === 0 ? (
            <p className="text-muted text-center">
              🚫 No applications found for this filter.
            </p>
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

export default ViewApplications;
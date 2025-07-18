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
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );
  const [statusFilter, setStatusFilter] = useState("all");
  // const [skillsFilter, setSkillsFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const { user, isLoading } = useAuth0();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  useEffect(() => {
    if (user?.email && selectedProject?._id) {
      dispatch(
        fetchApplications({
          workerEmail: user.email,
          status: statusFilter,
          experience: experienceFilter,
          projectId: selectedProject._id, // ✅ Added
        })
      );
    }
  }, [statusFilter, experienceFilter, selectedProject, dispatch, user]);
  // useEffect(() => {
  //   if (user && user.email) {
  //     dispatch(
  //       fetchApplications({
  //         status: statusFilter,
  //         experience: experienceFilter,
  //       })
  //     );
  //   }
  // }, [statusFilter, experienceFilter, dispatch]); // 👈 use `user` in dependency
  // console.log(user.email)

  useEffect(() => {
    if (!applications) return;
    let filtered = [...applications];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (application) => application.status === statusFilter
      );
    }

    // if (skillsFilter) {
    //   filtered = filtered.filter((application) =>
    //     application.skills.some((skill) =>
    //       skill.toLowerCase().includes(skillsFilter.toLowerCase())
    //     )
    //   );
    // }

    if (experienceFilter) {
      filtered = filtered.filter(
        (application) => application.experience >= experienceFilter
      );
    }

    dispatch(setFilteredApplications(filtered));
  }, [statusFilter, experienceFilter, applications, dispatch]); //skillsFilter,

  if (isLoading || !user?.email) {
    return <p>Loading user...</p>;
  }

  const rows = [];
  for (let i = 0; i < applications.length; i += 3) {
    rows.push(applications.slice(i, i + 3));
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h1
          className="text-center mb-4"
          style={{ marginTop: "7rem", color: "#333" }}
        >
          View Applications{" "}
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
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusFilter(value);
                  dispatch(
                    fetchApplications({
                      workerEmail: user.email,
                      status: value,
                    })
                  );
                }}
              >
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
            <div className="col-md-4">
              <label
                htmlFor="experience"
                className="form-label"
                style={labelStyle}
              >
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
          ) : applications.length === 0 ? (
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
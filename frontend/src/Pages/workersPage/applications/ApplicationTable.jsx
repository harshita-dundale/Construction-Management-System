import { useSelector } from "react-redux";

const ApplicationTable = ({ onViewDetails, activeTab }) => {

  const { applications } = useSelector((state) => state.applications); 

  //console.log("Applications from Redux:", applications);

  const filteredApplications = applications.filter((app) => {
    console.log("App status:", app.status);
    return activeTab === 'All' || app.status === activeTab;
  });

  //console.log("Applications from Redux:", applications);
  console.log("Filtered Applications:", filteredApplications);  
  
  // ✅ No data found message
  // if (!filteredApplications || filteredApplications.length === 0) {
  //   return <p className="mt-4">No applications found.</p>;
  // }
  
  if (filteredApplications.length === 0) {
    return <p className="mt-4">No applications found.</p>;
  }

  return (
    <table className="table table-hover mt-4">
      <thead style={{ backgroundColor: "#266867", color: "#ffffff" }}>
        <tr>
          <th>Job Title</th>
          <th>Application Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredApplications.map((app, index) => (
          <tr key={index}>
            {/* <td>{app.title}</td> */}
            <td>{app.jobId?.title || "N/A"}</td>
            {/* <td>{new Date(app.appliedAt).toLocaleDateString()}</td> */}
            <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Not recorded"}</td>
            <td>
              <span className={`badge ${getStatusClass(app.status)}`}>
              {app.status === "under_review" ? "Pending" : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </td>
            <td>
              <button
                className="btn"
                style={{
                  backgroundColor: "#051821",
                  color: "#ffffff",
                  border: "none",
                }}
                onClick={() => onViewDetails(app)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'accepted': return 'bg-success text-white';
    case 'rejected': return 'bg-danger text-white';
    case 'under_review': return 'bg-warning text-dark';
    default: return 'bg-secondary text-white';
  }
};

export default ApplicationTable;

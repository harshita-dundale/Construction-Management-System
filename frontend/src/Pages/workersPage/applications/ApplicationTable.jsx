import { useDispatch, useSelector } from "react-redux";
import { joinAndRejectAppli } from "../../Redux/applicationsSlice";
import Swal from "sweetalert2";

const ApplicationTable = ({ onViewDetails, activeTab }) => {

  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);

  const handleJoin = (id) => {
    dispatch(joinAndRejectAppli({ applicationId: id, action: "join" }));
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Job will be permanently Rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-color)",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      dispatch(joinAndRejectAppli({ applicationId: id, action: "reject" }));
  
      Swal.fire({
        title: "Deleted!",
        text: "The application has been rejected.",
        icon: "success",
        confirmButtonColor: "var(--secondary-color)",
      });
    }
  };
  

  const hasJoinedSameDate = (currentApp) => {
    return applications.some((app) => 
      app._id !== currentApp._id &&
      app.status === "joined" &&
      app.jobId?.startDate === currentApp.jobId?.startDate
    );
  };

  const filteredApplications = applications.filter((app) => {
    return activeTab === 'All' || app.status === activeTab;
  });

  //console.log("Applications from Redux:", applications);
  console.log("Filtered Applications:", filteredApplications);  
  if (filteredApplications.length === 0) {
    return <p className="mt-4">No applications found.</p>;
  }
  return (
    <table className="table table-hover mt-4">
      <thead style={{ backgroundColor: "#266867", color: "#ffffff" }}>
        <tr>
          <th>Job Title</th>
          <th>Start date</th>
          <th>End date</th>
          <th>Application Date</th>
          <th>Status</th>
          <th>Decision</th>
          {/* <th>Action</th> */}
        </tr>
      </thead>
      <tbody>
        {filteredApplications.map((app, index) => {
          const disableButtons = 
            app.status === "under_review" || 
            app.status === "rejected" || 
            (app.status === "accepted" && hasJoinedSameDate(app));

          return (
          <tr key={index}>
            <td>{app.jobId?.title || "N/A"}</td>
            <td>{app.jobId?.startDate ? new Date(app.jobId.startDate).toLocaleDateString() : "N/A"}</td>
           <td>{app.jobId?.endDate ? new Date(app.jobId.endDate).toLocaleDateString() : "N/A"}</td>
            <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Not recorded"}</td>
            <td>
              <span className={`badge ${getStatusClass(app.status)}`}>
              {app.status === "under_review" ? "Pending" : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </td>
             <td>
                <button
                  className="btn btn-sm me-2"
                  style={{ backgroundColor: "#051821", color: "#ffffff", border: "none" }}
                  onClick={() => handleJoin(app._id)}
                  disabled={disableButtons || app.status === "joined"}
                >
                  Join
                </button>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#051821", color: "#ffffff", border: "none" }}
                  onClick={() => handleReject(app._id)}
                  disabled={disableButtons}
                >
                  Reject
                </button>
              </td>
            {/* <td>
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
            </td> */}
          </tr>
          );
        })}
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

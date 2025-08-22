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
    <div className="modern-table-container">
      <div className="table-responsive">
        <table className="modern-applications-table">
          <thead>
            <tr>
              <th><i className="fas fa-briefcase me-2"></i>Job Title</th>
              <th><i className="fas fa-calendar-alt me-2"></i>Start Date</th>
              <th><i className="fas fa-calendar-check me-2"></i>End Date</th>
              <th><i className="fas fa-clock me-2"></i>Applied Date</th>
              <th><i className="fas fa-info-circle me-2"></i>Status</th>
              <th><i className="fas fa-cogs me-2"></i>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app, index) => {
              const disableButtons = 
                app.status === "under_review" || 
                app.status === "rejected" || 
                (app.status === "accepted" && hasJoinedSameDate(app));

              return (
                <tr key={index} className="table-row">
                  <td className="job-title-cell">
                    <div className="job-info">
                      <h6 className="job-name">{app.jobId?.title || "N/A"}</h6>
                    </div>
                  </td>
                  <td className="date-cell">
                    {app.jobId?.startDate ? new Date(app.jobId.startDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="date-cell">
                    {app.jobId?.endDate ? new Date(app.jobId.endDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="date-cell">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Not recorded"}
                  </td>
                  <td className="status-cell">
                    <span className={`modern-badge ${getModernStatusClass(app.status)}`}>
                      <i className={`fas ${getStatusIcon(app.status)} me-1`}></i>
                      {app.status === "under_review" ? "Pending" : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="action-btn join-btn"
                        onClick={() => handleJoin(app._id)}
                        disabled={disableButtons || app.status === "joined"}
                      >
                        <i className="fas fa-check me-1"></i>
                        Join
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(app._id)}
                        disabled={disableButtons}
                      >
                        <i className="fas fa-times me-1"></i>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .modern-table-container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-top: 1rem;
        }
        
        .modern-applications-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }
        
        .modern-applications-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .modern-applications-table th {
          padding: 1rem;
          font-weight: 600;
          text-align: left;
          border: none;
          font-size: 0.9rem;
        }
        
        .table-row {
          transition: all 0.3s ease;
          border-bottom: 1px solid #e9ecef;
        }
        
        .table-row:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-1px);
        }
        
        .modern-applications-table td {
          padding: 1rem;
          vertical-align: middle;
          border: none;
        }
        
        .job-info {
          display: flex;
          align-items: center;
        }
        
        .job-name {
          margin: 0;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95rem;
        }
        
        .date-cell {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .modern-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }
        
        .status-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }
        
        .status-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
        }
        
        .status-warning {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
          color: #212529;
        }
        
        .status-joined {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
          color: white;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .join-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }
        
        .join-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .reject-btn {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
        }
        
        .reject-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        
        @media (max-width: 768px) {
          .modern-applications-table th,
          .modern-applications-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .action-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

const getModernStatusClass = (status) => {
  switch (status) {
    case 'accepted': return 'status-success';
    case 'rejected': return 'status-danger';
    case 'under_review': return 'status-warning';
    case 'joined': return 'status-joined';
    default: return 'status-warning';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'accepted': return 'fa-check-circle';
    case 'rejected': return 'fa-times-circle';
    case 'under_review': return 'fa-clock';
    case 'joined': return 'fa-user-check';
    default: return 'fa-question-circle';
  }
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

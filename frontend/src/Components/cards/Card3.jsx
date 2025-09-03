/* eslint-disable react/prop-types */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../Pages/Redux/applicationsSlice";
import Swal from "sweetalert2";

function Card3({ application, isHiredView = false, onDelete }) {
  const [status, setStatus] = useState(application.status || "under_review");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const refreshApplications = () => {
    if (selectedProject?._id) {
      dispatch(fetchApplications({
        projectId: selectedProject._id,
        status: "all",
        experience: ""
      }));
    }
  };

  const updateStatusInBackend = async (newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/apply/${application._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setStatus(updated.status);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => updateStatusInBackend("accepted");
  const handleReject = () => updateStatusInBackend("rejected");
  const handleUndo = () => updateStatusInBackend("under_review");

  return (
    <div className="application-card">
      <div className="card-header">
        <div className="header-content">
          <div className="applicant-avatar">
            <i className="fas fa-hard-hat"></i>
          </div>
          <div className="applicant-info">
            <h3 className="applicant-name">{application.name}</h3>
            <div className="view-card-title">
              <i className="fas fa-briefcase me-1"></i>
              {application.jobId?.title || "Job Title Not Available"}
            </div>
            <div className="application-date">
              <i className="fas fa-calendar-check me-1"></i>
              Applied {new Date(application.appliedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="info-section">
          <div className="info-row">
            <div className="info-item">
              <div className="info-details">
                <span className="info-label">Contact</span>
                <span className="info-value">{application.phoneNo}</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-details">
                <span className="info-label">Experience</span>
                <span className="info-value">{application.experience} years</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="status-section">
          <div className="status-container">
            <span className="status-label">Builder Status</span>
            <div className={`status-pill builder-status-${application.builderStatus || status}`}>
              <span className="status-emoji">
                {(application.builderStatus === "accepted" || (status === "accepted" && !application.workerAction)) && "✅"}
                {(application.builderStatus === "rejected" || (status === "rejected" && !application.workerAction)) && "❌"}
                {(application.builderStatus === "under_review" || status === "under_review") && "⏳"}
              </span>
              <span className="status-text">
                {application.builderStatus ? 
                  application.builderStatus.replace("_", " ").toUpperCase() : 
                  (status === "joined" || status === "rejected" ? "ACCEPTED" : status.replace("_", " ").toUpperCase())
                }
              </span>
            </div>
          </div>
            
          {(status === "joined" || status === "rejected") && (
            <div className="worker-status-container">
              <span className="status-label">Worker Response</span>
              <div className={`action-indicator ${status === "joined" ? "joined-by-worker" : "rejected-by-worker"}`}>
                <i className={`fas ${status === "joined" ? "fa-user-check" : "fa-user-times"} me-1`}></i>
                <span className="action-text">
                  {status === "joined" ? "JOINED" : "REJECTED"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isHiredView && status === "under_review" && (
        <div className="card-actions">
          <button
            className="action-btn accept-btn"
            onClick={handleAccept}
            disabled={loading}
          >
            <i className="fas fa-check me-2"></i>
            Accept
          </button>
          <button
            className="action-btn reject-btn"
            onClick={handleReject}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Reject
          </button>
        </div>
      )}

      {!isHiredView && status === "accepted" && (
        <div className="card-actions">
          <button
            className="action-btn undo-btn"
            onClick={handleUndo}
            disabled={loading}
          >
            <i className="fas fa-undo me-2"></i>
            Undo
          </button>
          <button
            className="action-btn delete-btn"
            onClick={async () => {
              Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete "${application.name}"'s application?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, Delete",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setLoading(true);
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/apply/${application._id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      Swal.fire("Deleted!", "Application has been deleted.", "success");
                      refreshApplications();
                    } else {
                      Swal.fire("Error", "Failed to delete application.", "error");
                    }
                  } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "An error occurred while deleting.", "error");
                  } finally {
                    setLoading(false);
                  }
                }
              });
            }}
            disabled={loading}
          >
            <i className="fas fa-trash me-2"></i>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {!isHiredView && status === "joined" && (
        <div className="card-actions">
          <button
            className="action-btn view-btn"
            onClick={() => {
              window.open(`/worker-profile/${application.userId?._id || application._id}`, '_blank');
            }}
            disabled={loading}
          >
            <i className="fas fa-eye me-2"></i>
            View Worker
          </button>
          <button
            className="action-btn delete-btn"
            onClick={async () => {
              Swal.fire({
                title: "Are you sure?",
                text: `Do you want to remove "${application.name}" from the project?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, Remove",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setLoading(true);
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/apply/${application._id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      Swal.fire("Removed!", "Worker has been removed from project.", "success");
                      refreshApplications();
                    } else {
                      Swal.fire("Error", "Failed to remove worker.", "error");
                    }
                  } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "An error occurred while removing.", "error");
                  } finally {
                    setLoading(false);
                  }
                }
              });
            }}
            disabled={loading}
          >
            <i className="fas fa-user-minus me-2"></i>
            {loading ? "Removing..." : "Remove"}
          </button>
        </div>
      )}

      {!isHiredView && status === "rejected" && (
        <div className="card-actions">
          <button
            className="action-btn undo-btn"
            onClick={handleUndo}
            disabled={loading}
          >
            <i className="fas fa-undo me-2"></i>
            Undo
          </button>
          <button
            className="action-btn delete-btn"
            onClick={async () => {
              Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete "${application.name}"'s application?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, Delete",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setLoading(true);
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/apply/${application._id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      Swal.fire("Deleted!", "Application has been deleted.", "success");
                      refreshApplications();
                    } else {
                      Swal.fire("Error", "Failed to delete application.", "error");
                    }
                  } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "An error occurred while deleting.", "error");
                  } finally {
                    setLoading(false);
                  }
                }
              });
            }}
            disabled={loading}
          >
            <i className="fas fa-trash me-2"></i>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {isHiredView && (
        <div className="card-actions">
          <button
            className="action-btn view-btn"
            onClick={() => {
              window.open(`/worker-profile/${application.userId?._id || application._id}`, '_blank');
            }}
          >
            <i className="fas fa-eye me-2"></i>
            View Profile
          </button>
          <button
            className="action-btn remove-btn"
            onClick={async () => {
              Swal.fire({
                title: "Are you sure?",
                text: `Do you really want to remove "${application.name}" from hired workers?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, Remove",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  setLoading(true);
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/apply/${application._id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      Swal.fire("Deleted!", "The worker has been removed.", "success");
                      if (onDelete) {
                        onDelete();
                      } else {
                        refreshApplications();
                      }
                    } else {
                      Swal.fire("Error", "Failed to delete the worker.", "error");
                    }
                  } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "An error occurred while deleting.", "error");
                  } finally {
                    setLoading(false);
                  }
                }
              });
            }}
            disabled={loading}
          >
            <i className="fas fa-user-minus me-2"></i>
            {loading ? "Removing..." : "Remove Worker"}
          </button>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .application-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.4s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .application-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(102, 126, 234, 0.2);
        }
        
        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          position: relative;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .applicant-avatar {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }
        
        .applicant-info {
          flex-grow: 1;
          color: white;
        }
        
        .applicant-name {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: white;
        }
        
        .view-card-title {
          font-size: 0.9rem;
          opacity: 0.95;
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }
        
        .application-date {
          font-size: 0.85rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
        }
        
        .card-content {
          padding: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .info-section {
          margin-bottom: 0.5rem;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
          border-left: 3px solid #667eea;
          min-width: 0;
          overflow: visible;
        }
        
        .info-details {
          flex-grow: 1;
          min-width: 0;
          overflow: visible;
        }
        
        .info-label {
          display: block;
          font-size: 0.65rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }
        
        .info-value {
          display: block;
          font-size: 0.75rem;
          color: #2c3e50;
          font-weight: 700;
        }
        
        .status-section {
          margin-top: auto;
        }
        
        .status-container {
          text-align: center;
        }
        
        .status-label {
          display: block;
          font-size: 0.75rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }
        
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.75rem;
        }
        
        .status-pill .status-text {
          font-size: 0.7rem;
        }
        
        .status-pill.status-accepted {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .status-pill.status-rejected {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .status-pill.status-joined {
          background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        
        .status-pill.status-under_review,
        .status-pill.builder-status-under_review {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .status-pill.builder-status-accepted {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .status-pill.builder-status-rejected {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .worker-status-container {
          margin-top: 0.75rem;
          text-align: center;
        }
        
        .status-container {
          margin-bottom: 0.5rem;
        }
        
        .action-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .joined-by-worker {
          background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        
        .rejected-by-worker {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .action-text {
          font-size: 0.7rem;
        }
        
        .card-actions {
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid #e9ecef;
        }
        
        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .accept-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .accept-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
        }
        
        .reject-btn {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        
        .reject-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
        }
        
        .undo-btn {
          background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
          color: #212529;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }
        
        .undo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
        }
        
        .delete-btn,
        .remove-btn {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
        
        .delete-btn:hover,
        .remove-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
        }
        
        .view-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        
        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        @media (max-width: 768px) {
          .application-card {
            border-radius: 15px;
            margin: 0.2rem;
          }
          
          .card-header {
            padding: 1rem;
          }
          
          .applicant-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          
          .applicant-name {
            font-size: 1rem;
          }
          
          .application-date {
            font-size: 0.8rem;
          }
          
          .card-content {
            padding: 0.75rem;
          }
          
          .info-row {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }
          
          .info-item {
            padding: 0.6rem;
            gap: 0.4rem;
          }
          
          .info-label {
            font-size: 0.6rem;
          }
          
          .info-value {
            font-size: 0.7rem;
          }
          
          .status-pill {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .card-actions {
            flex-direction: column;
            padding: 0.75rem 1rem;
            gap: 0.5rem;
          }
          
          .action-btn {
            width: 100%;
            padding: 0.65rem;
            font-size: 0.85rem;
          }
        }
      `}} />
    </div>
  );
}

export default Card3;
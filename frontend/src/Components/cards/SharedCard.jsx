import React, { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import defaultImage from "../../assets/images/photos/browseJobImg.jpeg";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../Pages/Redux/applicationsSlice";
import Swal from "sweetalert2";
import "./JobCard1.css";

function SharedCard({ data, type, onEdit, onDelete, isHiredView = false, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState(data.status || "under_review");
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const refreshApplications = () => {
    if (selectedProject?._id) {
      dispatch(fetchApplications({
        projectId: selectedProject._id,
        status: "all",
        experience: ""
      }));
    }
    if (onRefresh) onRefresh();
  };

  const updateStatusInBackend = async (newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/apply/${data._id}/status`,
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

  const handleRemoveWorker = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to remove "${data.name}" from hired workers?`,
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
            `http://localhost:5000/api/apply/${data._id}`,
            { method: "DELETE" }
          );

          if (res.ok) {
            Swal.fire("Deleted!", "The worker has been removed.", "success");
            refreshApplications();
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
  };

  const handleDeleteApplication = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${data.name}"'s application?`,
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
            `http://localhost:5000/api/apply/${data._id}`,
            { method: "DELETE" }
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
  };

  const getCardContent = () => {
    switch (type) {
      case 'job':
        return {
          title: data.title,
          statusText: 'Active',
          image: data.image,
          details: [
            { icon: 'fas fa-map-marker-alt', label: 'Location', value: data.location },
            { icon: 'fas fa-rupee-sign', label: 'Daily Payment', value: `₹${data.salary}`, isHighlight: true },
            { icon: 'fas fa-calendar-alt', label: 'Duration', value: `${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}` },
            { icon: 'fas fa-phone', label: 'Contact', value: data.PhoneNo }
          ]
        };
      
      case 'application':
      case 'worker':
        return {
          title: data.name,
          statusText: status === 'joined' ? 'Joined' : status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Under Review',
          image: null,
          details: [
            { icon: 'fas fa-briefcase', label: 'Job', value: data.jobId?.title || 'Job Title Not Available' },
            { icon: 'fas fa-phone', label: 'Contact', value: data.phoneNo },
            { icon: 'fas fa-star', label: 'Experience', value: `${data.experience} years` },
            { icon: 'fas fa-calendar', label: 'Applied', value: new Date(data.appliedAt || data.createdAt).toLocaleDateString() }
          ]
        };
      
      default:
        return { title: 'Unknown', statusText: 'Unknown', details: [] };
    }
  };

  const cardContent = getCardContent();

  const renderActionButtons = () => {
    if (type === 'job') {
      return null; // Jobs use the dropdown menu
    }

    if (isHiredView) {
      return (
        <div className="job-card-footer">
          <div className="card-actions-footer">
            <button
              className="footer-action-btn remove-btn"
              onClick={handleRemoveWorker}
              disabled={loading}
            >
              <i className="fas fa-user-minus me-2"></i>
              {loading ? "Removing..." : "Remove Worker"}
            </button>
          </div>
        </div>
      );
    }

    // Application buttons
    if (status === "under_review") {
      return (
        <div className="job-card-footer">
          <div className="card-actions-footer">
            <button
              className="footer-action-btn accept-btn"
              onClick={handleAccept}
              disabled={loading}
            >
              <i className="fas fa-check me-2"></i>
              Accept
            </button>
            <button
              className="footer-action-btn reject-btn"
              onClick={handleReject}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i>
              Reject
            </button>
          </div>
        </div>
      );
    }

    if (status === "accepted" || status === "rejected") {
      return (
        <div className="job-card-footer">
          <div className="card-actions-footer">
            <button
              className="footer-action-btn undo-btn"
              onClick={handleUndo}
              disabled={loading}
            >
              <i className="fas fa-undo me-2"></i>
              Undo
            </button>
            <button
              className="footer-action-btn delete-btn"
              onClick={handleDeleteApplication}
              disabled={loading}
            >
              <i className="fas fa-trash me-2"></i>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      );
    }

    if (status === "joined") {
      return (
        <div className="job-card-footer">
          <div className="card-actions-footer">
            <button
              className="footer-action-btn remove-btn"
              onClick={handleDeleteApplication}
              disabled={loading}
            >
              <i className="fas fa-user-minus me-2"></i>
              {loading ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="modern-job-card mb-5">
      {/* Card Header */}
      <div className="job-card-header">
        <div className="job-status-badge">
          <i className="fas fa-briefcase me-1"></i>
          {cardContent.statusText}
        </div>
        
        {/* Action Menu - Only for jobs */}
        {type === 'job' && (
          <div ref={menuRef} className="job-actions">
            <button
              className="action-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ border: "none", background: "transparent", cursor: "pointer" }}
            >
              <BiDotsVerticalRounded size={20} />
            </button>
            {menuOpen && (
              <div className="action-menu">
                <button className="action-item edit-action" onClick={() => onEdit(data)}>
                  <MdEdit className="me-2" />
                  Edit
                </button>
                <button className="action-item delete-action" onClick={() => onDelete(data)}>
                  <RiDeleteBin6Line className="me-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Image */}
      <div className="job-image-section">
        <div className="job-image-container">
          <img
            src={
              cardContent.image
                ? `http://localhost:5000/uploads/${cardContent.image}`
                : defaultImage
            }
            alt={cardContent.title}
            className="job-image"
          />
          <div className="image-overlay">
            <i className="fas fa-eye"></i>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <h5 className="job-title">{cardContent.title}</h5>
      <div className="job-content">
        <div className="job-details">
          {cardContent.details.map((detail, index) => (
            <div key={index} className="detail-item">
              <div className={`detail-icon ${detail.isHighlight ? 'salary-icon' : ''}`}>
                <i className={detail.icon}></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">{detail.label}</span>
                <span className={`detail-value ${detail.isHighlight ? 'salary-value' : ''}`}>
                  {detail.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Status Section for Applications */}
        {/* {(type === 'application' || type === 'worker') && (
          <div className="status-section">
            <div className="status-container">
              <span className="status-label">Builder Status</span>
              <div className={`status-pill builder-status-${data.builderStatus || status}`}>
                <span className="status-emoji">
                  {((data.builderStatus === "accepted" || (status === "accepted" && !data.workerAction)) && "✅") ||
                   ((data.builderStatus === "rejected" || (status === "rejected" && !data.workerAction)) && "❌") ||
                   ((data.builderStatus === "under_review" || status === "under_review") && "⏳")}
                </span>
                <span className="status-text">
                  {data.builderStatus ? 
                    data.builderStatus.replace("_", " ").toUpperCase() : 
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
        )} */}
      </div>
      
      {/* Action Buttons Footer */}
      {renderActionButtons()}

      {/* Additional Styles for Action Buttons */}
      <style dangerouslySetInnerHTML={{__html: `
        .card-actions-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        
        .footer-action-btn {
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
        
        .footer-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .status-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }
        
        .status-container {
          text-align: center;
          margin-bottom: 0.75rem;
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
        
        .status-pill.builder-status-under_review {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .worker-status-container {
          text-align: center;
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
        
        @media (max-width: 768px) {
          .card-actions-footer {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .footer-action-btn {
            width: 100%;
            padding: 0.65rem;
            font-size: 0.85rem;
          }
        }
      `}} />
    </div>
  );
}

export default SharedCard;
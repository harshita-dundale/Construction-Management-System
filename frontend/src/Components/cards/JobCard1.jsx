import React, { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi"; // 3-dot icon
import defaultImage from "../../assets/images/photos/browseJobImg.jpeg";
import { MdEdit } from "react-icons/md";
import "./JobCard1.css";
import { RiDeleteBin6Line } from "react-icons/ri";

function JobCard1({ job, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const projectName =
    job.projectId && typeof job.projectId === "object"
      ? job.projectId.name
      : null;

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="modern-job-card">
      {/* Card Header */}
      <div className="job-card-header">
        <div className="job-status-badge">
          <i className="fas fa-briefcase me-1"></i>
          Active
        </div>
        
        {/* Action Menu */}
        <div ref={menuRef} className="job-actions">
          <button
            className="action-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ border: "none" , background: "transparent", cursor: "pointer"}}
          >
            <BiDotsVerticalRounded size={20} />
          </button>
          {menuOpen && (
            <div className="action-menu">
              <button className="action-item edit-action" onClick={() => onEdit(job)}>
                <MdEdit className="me-2" />
                Edit
              </button>
              <button className="action-item delete-action" onClick={() => onDelete(job)}>
                <RiDeleteBin6Line className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Image */}
      <div className="job-image-section">
        <div className="job-image-container">
          <img
            src={
              job.image
                ? `http://localhost:5000/uploads/${job.image}`
                : defaultImage
            }
            alt={job.title}
            className="job-image"
          />
          <div className="image-overlay">
            <i className="fas fa-eye"></i>
          </div>
        </div>
      </div>

      {/* Job Content */}<h5 className="job-title">{job.title}</h5>
      <div className="job-content">
        
        
        <div className="job-details">
          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Location</span>
              <span className="detail-value">{job.location}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon salary-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Daily Payment</span>
              <span className="detail-value salary-value">₹{job.salary}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Contact</span>
              <span className="detail-value">{job.PhoneNo}</span>
            </div>
          </div>
          
          {projectName && (
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">Project</span>
                <span className="detail-value">{projectName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      {/* <div className="job-card-footer">
        <div className="job-meta">
          <span className="meta-item">
            <i className="fas fa-clock me-1"></i>
            Posted recently
          </span>
        </div>
      </div>
       */}
      {/* Enhanced Styles */}
    </div>
  );
}
export default JobCard1;
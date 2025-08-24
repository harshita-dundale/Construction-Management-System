import React, { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi"; // 3-dot icon
import defaultImage from "../../assets/images/photos/browseJobImg.jpeg";
import { MdEdit } from "react-icons/md";
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

      {/* Job Content */}
      <div className="job-content">
        <h5 className="job-title">{job.title}</h5>
        
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
      <div className="job-card-footer">
        <div className="job-meta">
          <span className="meta-item">
            <i className="fas fa-clock me-1"></i>
            Posted recently
          </span>
        </div>
      </div>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-job-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.1);
          transition: all 0.4s ease;
          overflow: hidden;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .modern-job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(102, 126, 234, 0.2);
        }
        
        .job-card-header {
          padding: 1.5rem 1.5rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .job-status-badge {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .job-actions {
          position: relative;
        }
        
        
        
        
        .action-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 10;
          min-width: 140px;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
        }
        
        .action-item {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
       
        .edit-action:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .delete-action {
          color: #ff6b6b;
        }
        
        .delete-action:hover {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }
        
        .job-image-section {
          padding: 0 1.5rem;
          text-align: center;
        }
        
        .job-image-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }
        
        .job-image {
          width: 70px;
          height: 70px;
          border-radius: 15px;
          object-fit: cover;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.8);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .job-image-container:hover .image-overlay {
          opacity: 1;
        }
        
        .job-content {
          padding: 0 1.5rem;
          flex-grow: 1;
        }
        
        .job-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        
        .job-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .detail-item:hover {
          background: #e9ecef;
        }
        
        .detail-icon {
          width: 25px;
          height: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.7rem;
          flex-shrink: 0;
        }
        
        .salary-icon {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .detail-content {
          flex-grow: 1;
          min-width: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .detail-label {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 500;
        }
        
        .detail-value {
          font-size: 0.85rem;
          color: #2c3e50;
          font-weight: 600;
          text-align: right;
        }
        
        .salary-value {
          color: #11998e;
          font-size: 0.9rem;
          font-weight: 700;
        }
        
        .job-card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #f8f9fa;
          margin-top: auto;
        }
        
        .job-meta {
          display: flex;
          justify-content: center;
        }
        
        .meta-item {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .job-title {
            font-size: 1rem;
          }
          
          .detail-value {
            font-size: 0.8rem;
          }
          
          .detail-label {
            font-size: 0.75rem;
          }
          
          .job-image {
            width: 60px;
            height: 60px;
          }
          
          .detail-item {
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}
export default JobCard1;
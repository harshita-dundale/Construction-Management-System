import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentJob } from "../../Pages/Redux/applicationsSlice";
import defaultImage from "../../assets/images/photos/browseJobImg.jpeg";
import { toast } from "react-toastify";

function JobCard({ job, isFlipped, onToggleFlip }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectName =
    job.projectId && typeof job.projectId === "object"
      ? job.projectId.name
      : null;

  return (
    <div className="simple-job-card">
      <div className={`card h-100 ${isFlipped ? "flipped" : ""}`}>
        {!isFlipped ? (
          // Front Side
          <>
            <div className="card-img-top-container">
              <img
                src={
                  job.image
                    ? `http://localhost:5000/uploads/${job.image}`
                    : defaultImage
                }
                alt={job.title}
                className="card-img-top"
              />
              {projectName && (
                <div className="project-tag">{projectName}</div>
              )}
            </div>
            
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-center mb-3">{job.title}</h5>
              
              <div className="job-details mb-3">
                <div className="detail-row">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <span>{job.location}</span>
                </div>
                
                <div className="detail-row salary-row">
                  <i className="fas fa-rupee-sign text-success"></i>
                  <span className="fw-bold text-success">₹{job.salary}/day</span>
                </div>
              </div>
              
              <button
                className="btn btn-primary mt-auto"
                onClick={() => onToggleFlip(job._id)}
              >
                View Details
              </button>
            </div>
          </>
        ) : (
          // Back Side
          <div className="card-body d-flex flex-column">
            <button
              className="btn btn-outline-secondary btn-sm align-self-start mb-3"
              onClick={() => onToggleFlip(job._id)}
            >
              ← Back
            </button>
            
            <div className="contact-info mb-3">
              <h6 className="text-primary mb-2">Contact Details</h6>
              <div className="detail-row">
                <i className="fas fa-phone text-info"></i>
                <span>{job.PhoneNo}</span>
              </div>
              <div className="detail-row">
                <i className="fas fa-envelope text-info"></i>
                <span>{job.Email}</span>
              </div>
            </div>
            
            <div className="duration-info mb-3">
              <h6 className="text-primary mb-2">Duration</h6>
              <div className="text-muted small">
                <div>Start: {new Date(job.startDate).toLocaleDateString()}</div>
                <div>End: {new Date(job.endDate).toLocaleDateString()}</div>
              </div>
            </div>
            
            <button
              className="btn btn-success mt-auto"
              onClick={() => {
                if (!job.projectId) {
                  toast.error("Project ID missing. Cannot apply to this job.");
                  return;
                }
                dispatch(setCurrentJob(job));
                navigate("/apply-job");
              }}
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .simple-job-card {
          height: 100%;
        }
        
        .card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
           transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 768px) {
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
          }
        }
        
        .card-img-top-container {
          position: relative;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .card-img-top {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .card:hover .card-img-top {
          transform: scale(1.1);
        }
        
        .project-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .card-title {
          font-weight: 700;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .job-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .detail-row i {
          width: 16px;
          text-align: center;
        }
        
        .salary-row {
          background: rgba(40, 167, 69, 0.1);
          padding: 0.5rem;
          border-radius: 8px;
        }
        
        .contact-info,
        .duration-info {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 1rem;
        }
        
        .contact-info:last-child,
        .duration-info:last-child {
          border-bottom: none;
        }
        
        .btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          color: white;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .simple-job-card {
            margin-bottom: 1rem;
          }
          
          .card {
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          .card-img-top-container {
            height: 100px;
            padding: 0.75rem;
          }
          
          .card-img-top {
            width: 60px;
            height: 60px;
            border-width: 2px;
          }
          
          .card-body {
            padding: 1.25rem;
          }
          
          .card-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
          
          .job-details {
            gap: 0.5rem;
            margin-bottom: 1.25rem;
          }
          
          .detail-row {
            padding: 0.75rem 0.5rem;
            border-radius: 8px;
            font-size: 0.9rem;
          }
          
          .salary-row {
            background: rgba(40, 167, 69, 0.15);
            border: 1px solid rgba(40, 167, 69, 0.2);
          }
          
          .btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.95rem;
            border-radius: 8px;
          }
          
          .contact-info,
          .duration-info {
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
          }
          
          .detail-row i {
            width: 18px;
            font-size: 0.9rem;
          }
          
          .project-tag {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
            border-radius: 6px;
          }
        }
      `}</style>
    </div>
  );
}

export default JobCard;

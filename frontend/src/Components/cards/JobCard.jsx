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
    <div className="col-md-4 col-sm-6 d-flex align-items-stretch">
      <div className={`card-flip h-100 ${isFlipped ? "is-flipped" : ""}`}>
        {/* Card Front */}
        <div className="card-front">
          <div className="card text-center h-100">
            <div className="card-body" style={{ background: "#e2ecea" }}>
              <img
                src={
                  job.image
                    ? `http://localhost:5000/uploads/${job.image}`
                    : defaultImage
                }
                alt={job.title}
                className="rounded-circle mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
              <h5 className="card-title">{job.title}</h5>
              <p className="card-text">Location: {job.location}</p>
              <p className="card-text">Daily Payment: {job.salary}</p>
              {projectName && (
                <p className="card-text text-muted">Project: {projectName}</p>
              )}
              <button
                className="seeMore btn btn-dark mt-auto"
                onClick={() => onToggleFlip(job._id)}
              >
                See More
              </button>
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div className="card-back">
          <div className="card text-center h-100">
            <div className="card-body" style={{ background: "#e2ecea" }}>
              <div
                className="mt-3 text-dark"
                style={{
                  height: "30px",
                  width: "40px",
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={() => onToggleFlip(job._id)}
              >
                Back
              </div>

              <h5 className="card-title">Phone: {job.PhoneNo}</h5>
              <p className="card-text">Email: {job.Email}</p>
              <p className="card-text text-muted">
                Start: {job.startDate} <br /> to <br />
                End: {job.endDate}
              </p>
              <button
                className="seeMore btn btn-dark mt-3"
                onClick={() => {
                  // ✅ Safety Check: projectId must exist
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;

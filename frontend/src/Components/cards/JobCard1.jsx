import { useState, useRef, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi"; // 3-dot icon
import defaultImage from "../../assets/images/photos/browseJobImg.jpeg";
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
    <div
      className="card h-100 shadow rounded-4 border-0 position-relative"
      style={{ background: "#e2ecea" }}
    >
      {/* 3-Dot Icon and Menu */}
      <div ref={menuRef} className="position-absolute end-0 top-0 m-2">
        <button
          className="btn p-0 border-0 bg-transparent"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <BiDotsVerticalRounded size={24} color="#212529" />
        </button>
        {menuOpen && (
          <div
            className="position-absolute border rounded shadow-sm"
            style={{
              right: "0",
              zIndex: 10,
              width: "150px",
              height: "100px",
              backgroundColor: "rgba(26, 70, 84, 0.8)", // 👈 transparent #1a4654
              color: "white",
            }}
          >
            <button className="dropdown-item text-white pt-2 ps-4" onClick={() => onEdit(job)}>
              Edit
            </button>
            <button
              className="dropdown-item text-white pt-2 ps-4"
              onClick={() => onDelete(job)}
            >
            
              Delete
            </button>
          </div>


        )}
      </div>

      {/* Image */}
      <div className="text-center p-3 pb-0">
        <img
          src={
            job.image
              ? `http://localhost:5000/uploads/${job.image}`
              : defaultImage
          }
          alt={job.title}
          className="rounded-circle shadow-sm"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            border: "3px solid #dee2e6",
          }}
        />
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column px-4 pt-2 pb-3">
        <h5 className="card-title text-center fw-bold mb-3">{job.title}</h5>

        <div className="mb-2 small text-dark">
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Daily Payment:</strong> ₹{job.salary}</p>
          <p><strong>Duration:</strong> {job.startDate} to {job.endDate}</p>
          <p><strong>Phone:</strong> {job.PhoneNo}</p>
          <p><strong>Email:</strong> {job.Email}</p>
          {projectName && <p><strong>Project:</strong> {projectName}</p>}
        </div>
      </div>
    </div>
  );
}
export default JobCard1;
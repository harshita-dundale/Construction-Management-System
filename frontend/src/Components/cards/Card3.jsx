/* eslint-disable react/prop-types */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../Pages/Redux/applicationsSlice";
import Swal from "sweetalert2";

function Card3({ application, isHiredView = false }) {
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
    <div className="card shadow-sm mb-4 h-100 d-flex flex-column text-center">
      <div
        style={{ backgroundColor: "rgb(226, 236, 234)" }}
      >
        <h5 className="card-title fw-bold">{application.name}</h5>
        <p className="card-text">
          Applied on: {application.appliedAt?.slice(0, 10)}
        </p>
        <p className="card-text">Phone nu: {application.phoneNo} </p>
        <p className="card-text">Experience: {application.experience} years</p>
        {/* <p className="card-text">
          Skills:{" "}
          {Array.isArray(application.skills)
            ? application.skills.join(", ")
            : application.skills}
        </p> */}
        <p className="card-text">
          <strong>Status:</strong>{" "}
          <span
            className={`fw-bold ${
              status === "accepted"
                ? "text-dark"
                : status === "rejected"
                ? "text-danger"
                : status === "joined"
                ? "text-success"
                : "text-warning"
            }`}
          >
            {status.replace("_", " ")}
          </span>
        </p>
      </div>
         

      {/* ✅ View Applications - Accept/Reject/Undo */}
{!isHiredView && status === "under_review" && (
  <div className="card-footer d-flex justify-content-center">
    <button
      className="btn btn-dark w-50 me-1"
      onClick={handleAccept}
      disabled={loading}
    >
      Accept
    </button>
    <button
      className="btn btn-danger w-50 ms-1"
      onClick={handleReject}
      disabled={loading}
    >
      Reject
    </button>
  </div>
)}

{!isHiredView && status !== "under_review" && (
  <div className="card-footer d-flex justify-content-center">
    <button
      className="btn btn-warning w-50 me-1"
      onClick={handleUndo}
      disabled={loading}
    >
      Undo Status
    </button>
    <button
      className="btn btn-danger w-50 ms-1"
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
      {loading ? "Deleting..." : "Delete"}
    </button>
  </div>
)}

{/* ✅ Hired View - Only Reject with confirm + delete */}
{isHiredView && status === "accepted" && (
  <div className="card-footer">
    <button
  className="btn btn-secondary w-100"
  style={buttonStyle}
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
  }}
  disabled={loading}
>
  {loading ? "Removing..." : "Remove Worker"}
</button>
  </div>
)}
    </div>
  );
}

export default Card3;

const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
}
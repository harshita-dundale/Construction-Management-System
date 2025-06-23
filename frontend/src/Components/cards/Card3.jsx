// style={{ backgroundColor: "rgb(226, 236, 234)" }} style={{backgroundColor:" rgb(226, 236, 234);"}}
/* eslint-disable react/prop-types */

import { useState } from "react";
import Swal from "sweetalert2";

function Card3({ application, isHiredView = false }) {
  const [status, setStatus] = useState(application.status || "under_review");
  const [loading, setLoading] = useState(false);

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
        className="card-body flex-grow-1"
        style={{ backgroundColor: "rgb(226, 236, 234)" }}
      >
        <h5 className="card-title fw-bold">{application.name}</h5>
        <p className="card-text">
          Applied on: {application.appliedAt?.slice(0, 10)}
        </p>
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
                ? "text-success"
                : status === "rejected"
                ? "text-danger"
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
      className="btn btn-success w-50 me-1"
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
  <div className="card-footer">
    <button
      className="btn btn-warning w-100"
      onClick={handleUndo}
      disabled={loading}
    >
      Undo Status
    </button>
  </div>
)}

{/* ✅ Hired View - Only Reject with confirm + delete */}
{isHiredView && status === "accepted" && (
  <div className="card-footer">
    {/* <button
      className="btn btn-danger w-100"
      onClick={async () => {
        const confirmDelete = window.confirm(
          "Are you sure you want to remove this hired worker?"
        );
        if (confirmDelete) {
          setLoading(true);
          try {
            const res = await fetch(
              `http://localhost:5000/api/apply/${application._id}`,
              {
                method: "DELETE",
              }
            );
            if (res.ok) {
              window.location.reload(); // or you can update parent state if needed
            } else {
              alert("Failed to delete the worker.");
            }
          } catch (err) {
            console.error(err);
            alert("Error while deleting the worker.");
          } finally {
            setLoading(false);
          }
        }
      }}
      disabled={loading}
    >
      Remove Worker
    </button> */}
    <button
  className="btn btn-danger w-100"
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
            window.location.reload();
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

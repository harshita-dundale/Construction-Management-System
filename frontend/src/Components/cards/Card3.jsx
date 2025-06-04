

// import { useState } from "react";

// function Card3({ application }) {
//   const [status, setStatus] = useState(application.status || "under_review");
//   const [loading, setLoading] = useState(false);

//   const updateStatusInBackend = async (newStatus) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/apply/${application._id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         const updated = await res.json();
//         setStatus(updated.status);
//       } else {
//         alert("Failed to update status");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error while updating status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = () => updateStatusInBackend("accepted");
//   const handleReject = () => updateStatusInBackend("rejected");

//   return (
//     <div className="card shadow-sm mb-4 h-100 d-flex flex-column text-center">
//       <div className="card-body flex-grow-1" style={{ backgroundColor: "rgb(226, 236, 234)" }}>
//         <h5 className="card-title">{application.name}</h5>
//         <p className="card-text">Applied on: {application.appliedAt?.slice(0, 10)}</p>
//         <p className="card-text">Experience: {application.experience} years</p>
//         <p className="card-text">
//           Skills: {Array.isArray(application.skills) ? application.skills.join(", ") : application.skills}
//         </p>
//         <p className="card-text">
//           <strong>Status:</strong>{" "}
//           <span className={
//             status === "accepted" ? "text-success" :
//             status === "rejected" ? "text-danger" : "text-warning"
//           }>
//             {status.replace("_", " ")}
//           </span>
//         </p>
//       </div>
//       <div className="card-footer d-flex justify-content-center">
//         <button className="btn btn-success w-50 me-1" onClick={handleAccept} disabled={loading || status === "accepted"}>
//           Accept
//         </button>
//         <button className="btn btn-danger w-50 ms-1" onClick={handleReject} disabled={loading || status === "rejected"}>
//           Reject
//         </button>
//       </div>
//     </div>
//   );
// }
// export default Card3;




import { useState } from "react";

function Card3({ application, isHiredView = false }) { // ✅ Added isHiredView prop
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
      <div className="card-body flex-grow-1" style={{ backgroundColor: "rgb(226, 236, 234)" }}>
        <h5 className="card-title">{application.name}</h5>
        <p className="card-text">Applied on: {application.appliedAt?.slice(0, 10)}</p>
        <p className="card-text">Experience: {application.experience} years</p>
        <p className="card-text">
          Skills: {Array.isArray(application.skills) ? application.skills.join(", ") : application.skills}
        </p>
        <p className="card-text">
          <strong>Status:</strong>{" "}
          <span className={
            status === "accepted" ? "text-success" :
            status === "rejected" ? "text-danger" : "text-warning"
          }>
            {status.replace("_", " ")}
          </span>
        </p>
      </div>

      {/* ✅ Accept/Reject Buttons sirf pending applications ke liye */}
      {status === "under_review" && !isHiredView && (
        <div className="card-footer d-flex justify-content-center">
          <button className="btn btn-success w-50 me-1" onClick={handleAccept} disabled={loading}>
            Accept
          </button>
          <button className="btn btn-danger w-50 ms-1" onClick={handleReject} disabled={loading}>
            Reject
          </button>
        </div>
      )}

      {/* ✅ Undo Button sirf View Applications me hoga, Hired Workers me nahi */}
      {status !== "under_review" && !isHiredView && (
        <div className="card-footer">
          <button className="btn btn-warning w-100" onClick={handleUndo} disabled={loading}>
            Undo Status
          </button>
        </div>
      )}
    </div>
  );
}

export default Card3;

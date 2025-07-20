import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Dashboard() {
  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const selectedProject = useSelector((state) => state.project.selectedProject);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject?._id) {
        setLoading(false);
        setError("No project selected");
        return;
      }

      try {
        const applyRes = await fetch(
          `http://localhost:5000/api/apply?status=accepted&projectId=${selectedProject._id}`
        );
        const applyData = await applyRes.json();

        const accepted = applyData.filter((app) => app.status === "accepted");

        const merged = accepted.map((worker) => ({
          ...worker,
         // workerId: worker.userId,
         //workerId: worker.userId._id,
          workerId: worker.userId || worker._id || "", // fallback
          present: false,
        }));

        setHiredWorkers(merged);
        setLoading(false);
      } catch (err) {
        console.error("Error loading workers:", err);
        setError("Failed to load workers.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  const handleAttendanceToggle = (id) => {
    setHiredWorkers((prev) =>
      prev.map((worker) =>
        worker._id === id ? { ...worker, present: !worker.present } : worker
      )
    );
  };

  const handleApplyAll = (status) => {
    setHiredWorkers((prev) =>
      prev.map((worker) => ({ ...worker, present: status }))
    );
  };

  const handleSubmitAttendance = async () => {
    if (!date || new Date(date) > new Date()) {
      toast.error("Please select a valid date (no future dates)");
      return;
    }

    const payload = hiredWorkers.map((worker) => ({
      workerId: worker._id,
      //workerId: worker.userId,
      projectId: selectedProject._id,
      date,
      status: worker.present ? "Present" : "Absent",
    }));
    console.log("🚀 Sending attendance:", payload);

    try {
      setProcessing(true);
      const res = await fetch(
        "http://localhost:5000/api/worker-records/mark-all",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attendance: payload, // 👈 full data array
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to mark attendance");
      toast.success("Attendance marked successfully");
      setProcessing(false);
      setHiredWorkers((prev) => prev.map((w) => ({ ...w, present: false })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading workers...</p>;
  if (error)
    return <p className="text-center mt-5 text-danger">Error: {error}</p>;

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Mark Attendance</h2>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <span className="input-group-text">
              <FaCalendarAlt />
            </span>
            <input
              type="date"
              className="form-control"
              max={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="btn-group">
            <button
              className="btn btn-outline-success"
              onClick={() => handleApplyAll(true)}
            >
              Mark All Present
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleApplyAll(false)}
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="table-responsive shadow">
          <table className="table table-striped table-hover text-center border rounded">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Worker Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hiredWorkers.map((worker, index) => (
                <tr key={worker._id || index} className="align-middle">
                  <td>{index + 1}</td>
                  <td>{worker.name}</td>
                  {/* <td>
                    <input
                      type="checkbox"
                      className="form-check-input border border-dark"
                      checked={worker.present}
                      onChange={() => handleAttendanceToggle(worker._id)}
                    />
                  </td> */}
                  <td>
                    <div className="d-flex flex-column align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input border border-dark"
                        checked={worker.present}
                        onChange={() => handleAttendanceToggle(worker._id)}
                      />
                      <small
                        className={`fw-bold ${
                          worker.present ? "text-success" : "text-danger"
                        }`}
                      >
                        {worker.present ? " Present" : " Absent"}
                      </small>
                    </div>
                  </td>

                  <td>
                    <Link
                      to={`/attendance/worker/${worker.workerId}`}
                      className="btn btn-outline-primary btn-sm"
                      style={buttonStyle}
                    >
                      👁️ View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary px-4 py-2"
            disabled={processing}
            onClick={handleSubmitAttendance}
            style={buttonStyle}
          >
            {processing ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};

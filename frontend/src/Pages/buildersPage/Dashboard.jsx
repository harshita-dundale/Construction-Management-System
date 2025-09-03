import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import "./Dashboard.css";

// Modern table styles
const modernTableStyles = `
  .attendance-table-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .table-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .table-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .table-summary {
    display: flex;
    gap: 1rem;
  }
  
  .summary-item {
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .modern-table {
    margin: 0;
  }
  
  .modern-table thead th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 1rem;
    font-weight: 600;
    color: white;
    border-bottom: 2px solid #667eea;
  }
  
  .attendance-row {
    transition: all 0.3s ease;
  }
  
  .attendance-row:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .attendance-row td {
    padding: 1rem;
    vertical-align: middle;
  }
  
  .worker-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }
  
  .worker-name {
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .atte-number {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .table-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .table-summary {
      justify-content: center;
    }
    
    .worker-info .d-flex {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = modernTableStyles;
  document.head.appendChild(styleSheet);
}

function Dashboard() {
  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const selectedProject = useSelector((state) => state.project.selectedProject);

  // Fetch attendance stats for selected date and project
  const fetchAttendanceStats = async () => {
    if (!selectedProject?._id || !date) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/worker-records/stats?projectId=${selectedProject._id}&date=${date}`
      );
      
      if (response.ok) {
        const stats = await response.json();
        setTotalPresent(stats.present || 0);
        setTotalAbsent(stats.absent || 0);
      } else {
        // If no stats endpoint, calculate from current workers
        const presentCount = hiredWorkers.filter(w => w.present).length;
        const absentCount = hiredWorkers.length - presentCount;
        setTotalPresent(presentCount);
        setTotalAbsent(absentCount);
      }
    } catch (err) {
      console.error("Error fetching attendance stats:", err);
      // Fallback to current selection
      const presentCount = hiredWorkers.filter(w => w.present).length;
      const absentCount = hiredWorkers.length - presentCount;
      setTotalPresent(presentCount);
      setTotalAbsent(absentCount);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject?._id) {
        setLoading(false);
        setError("No project selected");
        return;
      }

      try {
        const applyRes = await fetch(
          `http://localhost:5000/api/apply?status=joined&projectId=${selectedProject._id}`
        );
        const applyData = await applyRes.json();

        const accepted = applyData.filter((app) => app.status === "joined");

        const merged = accepted.map((worker) => ({
          ...worker,
         workerId: worker.userId?._id || worker.userId || worker._id ,
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

  // Fetch stats when project or date changes
  useEffect(() => {
    fetchAttendanceStats();
  }, [selectedProject, date, hiredWorkers]);

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
        workerId:  worker.userId?._id || worker.userId || worker.workerId || "",
      projectId: selectedProject._id,
      date,
      status: worker.present ? "Present" : "Absent",
    }));
    console.log("🚀 Sending attendance:", payload);

    try {
      setProcessing(true);
      // console.log("📤 Attendance Payload:", payload);

      const res = await fetch(
        "http://localhost:5000/api/worker-records/mark-all",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attendance: payload, 
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <LoadingSpinner 
            message="Loading Workers..." 
            size="large" 
          />
        </div>
      </>
    );
  }  if (error)
    return <p className="text-center mt-5 text-danger">Error: {error}</p>;

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="material-header">
  <div className="container">
    <div className="row d-flex align-items-center py-4">
      {/* Left Side: Heading, Subtitle */}
      <div className="col-md-8 ">
        <div className="mate-head-content">
          <h1 className="mate-head-title">Manage Attendance</h1>
          <p className="mate-head-subtitle me-5">
          Easily mark and track daily attendance of workers. View job-wise records, monitor presence/absence, and maintain accurate logs for smoother project management.
          </p>
          <span className="mate-head-badge mt-3">
            <i className="fas fa-boxes me-2"></i>
            {selectedProject?.name || 'Attendance Management'}
          </span>
        </div>
      </div>

      {/* Right Side: Stats */}
      <div className="col-md-4">
        <div className="header-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{totalPresent}</div>
              <div className="stat-label">Total Present</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{totalAbsent}</div>
              <div className="stat-label">Total Absent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="container mt-4">
        {/* <h2 className="text-center mb-4">Mark Attendance</h2> */}

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

          <div className="attendance-actions">
            <button
              className="btn attendance-btn present-btn"
              onClick={() => handleApplyAll(true)}
            >
              <i className="fas fa-check-circle me-2"></i>
              Mark All Present
            </button>
            <button
              className="btn attendance-btn absent-btn"
              onClick={() => handleApplyAll(false)}
            >
              <i className="fas fa-times-circle me-2"></i>
              Mark All Absent
            </button>
          </div>
        </div>

        {hiredWorkers.length === 0 ? (
          <EmptyState 
            icon="fas fa-users"
            title="No Workers Available"
            message="Please hire workers first to manage attendance."
            actionButton={
              <button className="btn btn-primary" onClick={() => window.location.href = '/Project_pannel '}>
                <i className="fas fa-plus me-2"></i>Hire Workers
              </button>
            }
          />
        ) : (
        <div className="atte-table-container">
          <div className="table-responsive">
            <table className="atte-applications-table">
              <thead>
                <tr>
                  <th><i className="fas fa-hashtag me-2"></i>Sr.</th>
                  <th><i className="fas fa-user me-2"></i>Worker Name</th>
                  <th><i className="fas fa-check-circle me-2"></i>Status</th>
                  <th><i className="fas fa-cogs me-2"></i>Action</th>
                </tr>
              </thead>
            <tbody>
              {hiredWorkers.map((worker, index) => (
                <tr key={worker._id || index} className="table-row">
                  <td className="text-center">
                    <div className="atte-number">{index + 1}</div>
                  </td>
                  <td className="worker-name-cell">
                    <div className="worker-info">
                      {/* <div className="worker-avatar me-3">
                        <i className="fas fa-hard-hat"></i>
                      </div> */}
                      <span className="worker-name">{worker.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column justify-content-center align-items-center gap-1">
                      <input
                        type="checkbox"
                        className="form-check-input border border-dark me-5"
                        checked={worker.present}
                        onChange={() => handleAttendanceToggle(worker._id)}
                        // style={{ transform: "scale(1.3)" }}  text-success 
                      />
                      <small
                        className={`fw-bold ${
                          worker.present ? "text-dark" : "text-danger"
                        } ms-3`}
                      >
                        {worker.present ? " Present" : " Absent"}
                      </small>
                    </div>
                  </td>

                  <td>
                    <Link
                      to={`/attendance/worker/${worker.workerId}`}
                      className="btn btn-sm view-history-btn"
                    >
                      <GrFormView /> View History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        )}

        <div className="d-flex justify-content-end my-4">
          <button
            disabled={processing}
            onClick={handleSubmitAttendance}
            className="btn px-4 py-2 submit-btn"
          >
            {processing ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

// const buttonStyle = {
//   backgroundColor: "var(--primary-color)",
//   transition: "background-color 0.3s ease, color 0.3s ease",
//   color: "var(--text-color)",
// };

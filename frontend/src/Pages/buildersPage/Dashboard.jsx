import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { toast } from "react-toastify";
import { useSelector } from "react-redux"; 

function Dashboard() {
  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const selectedProject = useSelector((state) => state.project.selectedProject); // ✅

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applyRes, recordsRes] = await Promise.all([
          // fetch("http://localhost:5000/api/apply"),
          fetch(`http://localhost:5000/api/apply?status=accepted&projectId=${selectedProject._id}`),
          fetch("http://localhost:5000/api/worker-records"),
        ]);

        const applyData = await applyRes.json();
        const recordsData = await recordsRes.json();

        const accepted = applyData.filter((app) => app.status === "accepted");

        const merged = accepted.map((worker) => {
          const record = recordsData.find((r) => r.name === worker.name);

          const daysWorked = record?.daysWorked || 0;
          const dailyWage = record?.dailyWage || worker.dailyWage || 500;
          const payment = record?.payment || daysWorked * dailyWage;

          return {
            ...worker,
            present: false,
            daysWorked,
            dailyWage,
            payment,
          };
        });

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
      prev.map((worker) => {
        if (worker._id === id) {
          const wasPresent = worker.present;
          const updatedDaysWorked = wasPresent
            ? Math.max(0, worker.daysWorked - 1)
            : worker.daysWorked + 1;
          const updatedPayment = updatedDaysWorked * worker.dailyWage;

          return {
            ...worker,
            present: !wasPresent,
            daysWorked: updatedDaysWorked,
            payment: updatedPayment,
          };
        }
        return worker;
      })
    );
  };

  const handleProcessPayments = () => {
    if (!hiredWorkers.some((w) => w.present)) {
      toast.error("Attendance mark Required");
      // alert("Kisi ko present mark nahi kiya. Pehle attendance mark karo.");
      return;
    }

    setProcessing(true);

    fetch("http://localhost:5000/api/worker-records/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        hiredWorkers.map((worker) => ({
          _id: worker._id,
          name: worker.name,
          dailyWage: worker.dailyWage,
          daysWorked: worker.daysWorked,
          payment: worker.payment,
        }))
      ),
    })
      .then((res) => res.json())
      .then(async () => {
        const [applyRes, recordsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/apply?status=accepted&projectId=${selectedProject._id}`),
          fetch("http://localhost:5000/api/worker-records"),
        ]);
      
      // .then(async () => {
      //   const [applyRes, recordsRes] = await Promise.all([
      //     fetch("http://localhost:5000/api/apply"),
      //     fetch("http://localhost:5000/api/worker-records"),
      //   ]);

        const applyData = await applyRes.json();
        const recordsData = await recordsRes.json();
        const accepted = applyData.filter((app) => app.status === "accepted");

        const refreshed = accepted.map((worker) => {
          const record = recordsData.find((r) => r.name === worker.name);
          const daysWorked = record?.daysWorked || 0;
          const dailyWage = record?.dailyWage || worker.dailyWage ; // || 500
          const payment = record?.payment || daysWorked * dailyWage;

          return {
            ...worker,
            present: false,
            daysWorked,
            dailyWage,
            payment,
          };
        });

        setHiredWorkers(refreshed);
        setProcessing(false);
        toast.success("Payments processed successfully!");
        //alert("Payments processed successfully & frontend updated!");
      })
      .catch((err) => {
        console.error("Error saving or refreshing data:", err);
        // alert("Error occurred.");
        toast.error("Payments Failed. Please try again.");
        setProcessing(false);
      });
  };

  if (loading) return <p className="text-center mt-5">Loading workers...</p>;
  if (error)
    return <p className="text-center mt-5 text-danger">Error: {error}</p>;

  const totalPayment = hiredWorkers.reduce(
    (sum, worker) => sum + (worker.payment || 0),
    0
  );

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="mb-5 text-center" style={{ marginTop: "8rem" }}>
          Worker Attendance & Payment
        </h1>

        <div className="table-responsive shadow">
          <table className="table table-striped table-hover text-center border rounded">
            <thead
              className="table-dark"
              style={{ backgroundColor: "#f58800", color: "white" }}
            >
              <tr>
                <th>#</th>
                <th>Worker Name</th>
                <th>Daily Wage (₹)</th>
                <th>Present</th>
                <th>Days Worked</th>
                <th> Payment (₹)</th>
              </tr>
            </thead>
            <tbody>
              {hiredWorkers.map((worker, index) => (
                <tr key={worker._id || index} className="align-middle">
                  <td>{index + 1}</td>
                  <td>{worker.name}</td>
                  <td>₹{worker.jobId?.salary}</td>
                  {/* <td>₹{worker.dailyWage}</td> */}
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input border border-dark border-3"
                      checked={worker.present}
                      onChange={() => handleAttendanceToggle(worker._id)}
                    />
                  </td>
                  <td>{worker.daysWorked}</td>
                  <td>₹{worker.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm border">
          {/* <h5 className="m-0">
            Total Workers:{" "}
            <strong className="text-primary">{hiredWorkers.length}</strong>
          </h5> */}
          <h5 className="text-end mb-3 fw-bold">
            Total Payment:{" "}
            <span > ₹{totalPayment.toLocaleString()} </span>
            {/* className="text-success" */}
          </h5>
          <button
            className="btn btn-light px-4 py-2 fw-bold"
            style={{
              color: "white",
              backgroundColor: "#f58800",
              border: "none",
              cursor: processing ? "not-allowed" : "pointer",
              opacity: processing ? 0.6 : 1,
            }}
            disabled={processing}
            onMouseEnter={(e) =>
              !processing && (e.target.style.backgroundColor = "#d17000")
            }
            onMouseLeave={(e) =>
              !processing && (e.target.style.backgroundColor = "#f58800")
            }
            onClick={handleProcessPayments}
          >
            {processing ? "Processing..." : "Process Payments"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
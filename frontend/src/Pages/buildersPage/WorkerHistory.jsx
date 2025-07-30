import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../Components/Header";

  function WorkerHistory() {
    const { workerId } = useParams();
    const [history, setHistory] = useState([]);
    const [workerName, setWorkerName] = useState("");
    const [loading, setLoading] = useState(true);
    console.log("Using workerId:", workerId);

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/worker-records/history/${workerId}`
          );
          const data = await res.json();
          if (!Array.isArray(data)) {
            console.error("❌ Unexpected response:", data);
            setHistory([]);
            return;
          }
    
          console.log("✅ History response:", data);
          setHistory(data);
          
          if (data.length > 0) {
            //setWorkerName(data[0].workerName || "Worker");
            setWorkerName(data[0]?.workerId?.name || "Worker");
          }

           setLoading(false);
        } catch (err) {
          console.error("Error fetching history", err);
          setLoading(false);
        }
      };

      fetchHistory();
    }, [workerId]);

    const presentCount = history.filter((h) => h.status === "Present").length;
    const absentCount = history.filter((h) => h.status === "Absent").length;

    return (
      <> <Header />
      <div className="container mt-5" style={{ marginTop: "160px"}}>
        <h2 className="text-center mb-4" style={{ marginTop: "160px"}}>👤 Attendance History</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="text-center mb-3">
              <h4>{workerName}</h4>
              <p className="text-muted">🆔 ID: {workerId}</p>
            </div>
            <div className="mt-4 text-end fw-bold">
              Summary:  Present: {presentCount} |  Absent: {absentCount}
            </div>
            <table className="table table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString("en-IN")}</td>
                    <td>
                      {record.status === "Present" ? (
                        <span className="text-success fw-bold"> Present</span>
                      ) : (
                        <span className="text-danger fw-bold"> Absent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </>
        )}
      </div>
      </>
    );
  }

export default WorkerHistory;

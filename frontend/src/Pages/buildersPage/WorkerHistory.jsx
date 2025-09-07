import React from 'react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import BackButton from "../../Components/BackButton";
import { MdCoPresent } from "react-icons/md";

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
      <div className="container" style={{ marginTop: "100px"}}>
        {/* Header Row with Back Button and Title */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <BackButton to="/dashboard" text="Back to Dashboard" variant="outline" />
          <h2 className="mb-0"><MdCoPresent className="me-3 mb-1" />
            Attendance History</h2>
          <div style={{ width: '200px' }}></div> {/* Spacer for centering */}
        </div>
        
        <style>{`
          .history-table-card {
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
          
          .modern-table tbody tr {
            // transition: all 0.3s ease;
          }
          
          .modern-table tbody tr:hover {
            background: rgba(102, 126, 234, 0.05);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .modern-table tbody td {
            padding: 1rem;
            vertical-align: middle;
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
          }
        `}</style>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="text-center mb-3">
              {/* <h4>{workerName}</h4> */}
              {/* <p className="text-muted">🆔 ID: {workerId}</p> */}
            </div>

            {history.length === 0 ? (
              <div className="text-center mt-5">
                <p className="text-muted fs-5">No History Available</p>
              </div>
            ) : (
              <div className="history-table-card g-4">
                <div className="table-header mb-2">
                  <h5 className="table-title">
                    <i className="fas fa-calendar-check me-2"></i>
                    Worker Attendance History
                  </h5>
                  <div className="table-summary">
                    <span className="summary-item">
                      <i className="fas fa-check me-1"></i>
                      {presentCount} Present
                    </span>
                    <span className="summary-item">
                      <i className="fas fa-times me-1"></i>
                      {absentCount} Absent
                    </span>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table modern-table">
                    <thead>
                      <tr className="gap-2">
                        <th className="text-center"><i className="fas fa-calendar-day me-2"></i>Date</th>
                        <th className="text-center"><i className="fas fa-check-circle me-2"></i>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center">
                              <i className="fas fa-calendar text-primary me-2"></i>
                              <span className="fw-medium">
                                {new Date(record.date).toLocaleDateString("en-IN", {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            {record.status === "Present" ? (
                              <span className="badge bg-success px-3 py-2">
                                <i className="fas fa-check me-1"></i>Present
                              </span>
                            ) : (
                              <span className="badge bg-danger px-3 py-2">
                                <i className="fas fa-times me-1"></i>Absent
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </>
        )}
      </div>
      </>
    );
  }

export default WorkerHistory;

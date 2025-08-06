import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GrFormView } from "react-icons/gr";
import Header from "../Components/Header";
function PayrollPage() {
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projectId = selectedProject?._id;

  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  // 1️⃣ Fetch all accepted hires + calculate payable
  useEffect(() => {
    const fetchHiredWorkers = async () => {
      if (!projectId) {
        setError("No project selected");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/apply?status=accepted&projectId=${projectId}`
        );
        if (!res.ok) throw new Error("Failed to fetch hired workers");
        const data = await res.json();
        const hired = data.filter((app) => app.status === "accepted");

        const merged = await Promise.all(
          hired.map(async (w) => {
            const name     = w.name || w.userId?.name || "Unknown";
            const jobTitle = w.jobId?.title || "N/A";
            const salary   = w.jobId?.salary || 0;
            const jobId    = w.jobId?._id || "";
            const workerId = w.userId?._id || w._id;

            // Fetch attendance history for present/absent counts
            let presentCount = 0, absentCount = 0, totalPayable = 0;
            let actualPaidAmount = 0, paymentStatus = "Unpaid";
            
            try {
              const sumRes = await fetch(
                `http://localhost:5000/api/worker-records/history/${workerId}`
              );
              const history = await sumRes.json();
              presentCount = history.filter(h => h.status === "Present").length;
              absentCount = history.filter(h => h.status === "Absent").length;
              totalPayable = presentCount * salary;
            } catch (err) {
              console.error("Error fetching attendance:", err);
            }

            // ✅ Check actual payment status from payroll database
            try {
              const payrollRes = await fetch(`http://localhost:5000/api/payroll/worker/${workerId}`);
              if (payrollRes.ok) {
                const payrollData = await payrollRes.json();
                const currentMonthPayroll = payrollData.find(p => p.month === "2025-08");
                if (currentMonthPayroll) {
                  const totalPaid = currentMonthPayroll.paidAmounts.reduce((a, b) => a + b, 0);
                  actualPaidAmount = totalPaid;
                  paymentStatus = currentMonthPayroll.status;
                }
              }
            } catch (err) {
              console.error("Error fetching payroll status:", err);
            }

            return {
              _id: workerId,
              name,
              jobTitle,
              salary,
              jobId,
              present: presentCount,
              absent: absentCount,
              payable: totalPayable,
              amountPaid: 0,    // For new input
              actualPaid: actualPaidAmount,  // ✅ Actual paid from DB
              paymentStatus: paymentStatus,  // ✅ Real status from DB
            };
          })
        );

        setHiredWorkers(merged);
      } catch (err) {
        console.error("Error loading workers", err);
        setError("Could not load payroll data");
      } finally {
        setLoading(false);
      }
    };

    fetchHiredWorkers();
  }, [projectId]);

  // 2️⃣ Inline edit of amountPaid - FIXED VERSION
  const handleAmountChange = (workerId, value) => {
    const paid = parseInt(value, 10) || 0;
    
    // ✅ Negative numbers allow nahi karo
    if (paid < 0) {
      alert("❌ Amount negative nahi ho sakti!");
      return;
    }
    
    setHiredWorkers((prev) =>
      prev.map((w) => (w._id === workerId ? { ...w, amountPaid: paid } : w))
    );
  };

  const handleConfirmPayment = async (worker) => {
    if (worker.amountPaid <= 0) {
      alert("❌ Paise enter kar bhai! Zero ya negative amount nahi chalega!");
      return;
    }
    
    const remainingAmount = worker.payable - (worker.actualPaid || 0);
    if (worker.amountPaid > remainingAmount) {
      alert(`❌ Zyada paise nahi de sakte!\nRemaining amount: ₹${remainingAmount}\nAlready paid: ₹${worker.actualPaid || 0}`);
      return;
    }

    const payload = {
      workerId: worker._id,
      jobId: worker.jobId,
      projectId: projectId,
      month: "2025-08",
      paymentDate: new Date().toISOString().slice(0, 10),
      paidAmount: worker.amountPaid,
      totalSalary: worker.payable,
      present: worker.present,
      absent: worker.absent
    };

    try {
      const res = await fetch("http://localhost:5000/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save payroll");
      const saved = await res.json();

      alert(`✅ Payment successful!\n${worker.name}: ₹${worker.amountPaid} paid`);
      
      setHiredWorkers((prev) =>
        prev.map((w) => {
          if (w._id === worker._id) {
            const newTotalPaid = (w.actualPaid || 0) + worker.amountPaid;
            const newStatus = newTotalPaid >= w.payable ? "Paid" : "Partial";
            return {
              ...w,
              amountPaid: 0,
              actualPaid: newTotalPaid,
              paymentStatus: newStatus
            };
          }
          return w;
        })
      );
      
    } catch (err) {
      console.error("Payroll save error:", err);
      alert(`❌ Payment failed for ${worker.name}`);
    }
  };

  // 4️⃣ Status badge - Show real database status
  const getStatusBadge = (worker) => {
    // ✅ Show actual payment status from database
    if (worker.paymentStatus === "Paid") {
      return <span className="badge bg-success">Paid</span>;
    } else if (worker.paymentStatus === "Partial") {
      return <span className="badge bg-warning text-dark">Partial</span>;
    } else {
      return <span className="badge bg-danger">Unpaid</span>;
    }
  };

  // 5️⃣ Open history modal
  const openHistoryModal = async (workerId, name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payroll/worker/${workerId}`);
      const data = await res.json();
      setSelectedHistory(data);
    } catch {
      setSelectedHistory([]);
    } finally {
      setSelectedName(name);
      setShowModal(true);
    }
  };

  if (loading) return <div className="text-center my-4">Loading payroll...</div>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <>
    <Header/>
    <div className="container mt-5 ">
      <h2 style={{ marginTop: "7rem", color: "#333" }} className=" text-center mb-4 fw-bold"><RiSecurePaymentFill className="me-2 "/>
 Payroll Summary</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover text-center border rounded mt-3">
          <thead className="table-dark" style={{backgroundColor :  "var(--secondary-color)"}}>
            <tr>
            <th>Sr.</th>
              <th>Name</th>
              {/* <th>Job Title</th> (₹)*/}
              <th>Salary </th>
              {/* <th>Present</th>
              <th>Absent</th> */}
              <th>Paid Amount</th>
              <th>Payable</th>
              <th>Status</th>
              <th>History</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {hiredWorkers.map((worker, index) => {
              const remainingPayable = Math.max(0, worker.payable - (worker.actualPaid || 0)); // ✅ Already paid minus kar ke remaining amount
              return (
                <tr key={worker._id}>
                  <td>{index + 1}</td>
                  <td>{worker.name}</td>
                  {/* <td>{worker.jobTitle}</td> */}
                  <td>₹{worker.salary}</td>
                  {/* <td>{worker.present}</td>
                  <td>{worker.absent}</td> */}
                  <td className="text-dark fw-bold">
                    ₹{worker.payable}
                    {worker.actualPaid > 0 && (
                      <small className="text-muted d-block" style={{ fontSize : "12px" }}>
                      {/* Paid: ₹{worker.actualPaid},  */}
                       ( Remaining: ₹{remainingPayable})
                      </small>
                    )}
                  </td>
                  <td style={{ width: "100px" }}>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center"
                      value={worker.amountPaid}
                      min="0"                   
                      max={Math.max(0, worker.payable - (worker.actualPaid || 0))}  
                      placeholder="Enter amount"
                      onChange={(e) =>
                        handleAmountChange(worker._id, e.target.value)
                      }
                    />
                  </td>
                  {/* ❌ Balance cell removed */}
                  <td>{getStatusBadge(worker)}</td>
                  <td>
                    <button
                      className=" btn btn-outline-primary btn-sm"
                      onClick={() => openHistoryModal(worker._id, worker.name)}
                      style={buttonStyle}
                    >
                      <GrFormView /> View History
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleConfirmPayment(worker)}
                      disabled={worker.amountPaid <= 0 || (worker.payable - (worker.actualPaid || 0)) <= 0}  
                      style={buttonStyle}
                    >
                       Confirm
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* History Modal - Balance column retained here */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-25">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{selectedName}'s Payment History</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                {selectedHistory.length === 0 ? (
                  <p className="text-muted">No history found.</p>
                ) : (
                  <table className="table table-bordered text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistory.map((record, recordIndex) => {
                        // ✅ Handle arrays in backend model
                        if (record.paymentDates && record.paidAmounts) {
                          // Multiple payments in same month
                          return record.paymentDates.map((date, i) => (
                            <tr key={`${recordIndex}-${i}`}>
                              <td>{date?.slice(0, 10) || date}</td>
                              <td>₹{record.paidAmounts[i] || 0}</td>
                              <td>₹{record.balance != null ? record.balance : "-"}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    record.status === "Paid"
                                      ? "bg-success"
                                      : record.status === "Partial"
                                      ? "bg-warning text-dark"
                                      : "bg-danger"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ));
                        } else {
                          // Single payment format (fallback)
                          return (
                            <tr key={recordIndex}>
                              <td>{record.paymentDate?.slice(0, 10) || record.createdAt?.slice(0, 10) || "N/A"}</td>
                              <td>₹{record.paidAmount || record.totalAmount || 0}</td>
                              <td>₹{record.balance != null ? record.balance : "-"}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    record.status === "Paid"
                                      ? "bg-success"
                                      : record.status === "Partial"
                                      ? "bg-warning text-dark"
                                      : "bg-danger"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
export default PayrollPage;

const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};
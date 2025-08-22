
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RiSecurePaymentFill } from "react-icons/ri";
// import { GrFormView } from "react-icons/gr";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import Header from "../Components/Header";

// function PayrollPage() {
//   const selectedProject = useSelector((state) => state.project.selectedProject);
//   const projectId = selectedProject?._id;

//   const [hiredWorkers, setHiredWorkers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [selectedHistory, setSelectedHistory] = useState([]);
//   const [selectedName, setSelectedName] = useState("");
//   const [selectedWorkerId, setSelectedWorkerId] = useState(null);
//   const [paymentLoading, setPaymentLoading] = useState(null);

//   useEffect(() => {
//     const fetchHiredWorkers = async () => {
//       if (!projectId) {
//         setError("No project selected");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/apply?status=joined&projectId=${projectId}`
//         );
//         if (!res.ok) throw new Error("Failed to fetch hired workers");
//         const data = await res.json();
//         const hired = data.filter((app) => app.status === "joined");

//         const merged = await Promise.all(
//           hired.map(async (w) => {
//             const name = w.name || w.userId?.name || "Unknown";
//             const jobTitle = w.jobId?.title || "N/A";
//             const salary = w.jobId?.salary || 0;
//             const jobId = w.jobId?._id || "";
//             const workerId = w.userId?._id || w._id;

//             let presentCount = 0,
//               absentCount = 0,
//               totalPayable = 0;
//             let actualPaidAmount = 0,
//               paymentStatus = "Unpaid";

//             try {
//               const sumRes = await fetch(
//                 `http://localhost:5000/api/worker-records/history/${workerId}`
//               );
//               const history = await sumRes.json();
//               presentCount = history.filter((h) => h.status === "Present").length;
//               absentCount = history.filter((h) => h.status === "Absent").length;
//               totalPayable = presentCount * salary;
//             } catch (err) {
//               console.error("Error fetching attendance:", err);
//             }

//             try {
//               const payrollRes = await fetch(
//                 `http://localhost:5000/api/payroll/worker/${workerId}`
//               );
//               if (payrollRes.ok) {
//                 const payrollData = await payrollRes.json();
//                 const currentMonthPayroll = payrollData.find(
//                   (p) => p.month === "2025-08"
//                 );
//                 if (currentMonthPayroll) {
//                   const totalPaid = currentMonthPayroll.paidAmounts.reduce(
//                     (a, b) => a + b,
//                     0
//                   );
//                   actualPaidAmount = totalPaid;
//                   paymentStatus = currentMonthPayroll.status;
//                 }
//               }
//             } catch (err) {
//               console.error("Error fetching payroll status:", err);
//             }

//             return {
//               _id: workerId,
//               name,
//               jobTitle,
//               salary,
//               jobId,
//               present: presentCount,
//               absent: absentCount,
//               payable: totalPayable,
//               amountPaid: '',
//               actualPaid: actualPaidAmount,
//               paymentStatus: paymentStatus,
//             };
//           })
//         );

//         setHiredWorkers(merged);
//       } catch (err) {
//         console.error("Error loading workers", err);
//         setError("Could not load payroll data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHiredWorkers();
//   }, [projectId]);

//   const handleAmountChange = (workerId, value) => {
//     if (value === '') {
//       setHiredWorkers((prev) =>
//         prev.map((w) => (w._id === workerId ? { ...w, amountPaid: '' } : w))
//       );
//       return;
//     }
    
//     const paid = parseInt(value, 10) || 0;
//     if (paid < 0) {
//       toast.error(" could not be negative");
//       return;
//     }

//     setHiredWorkers((prev) =>
//       prev.map((w) => (w._id === workerId ? { ...w, amountPaid: paid } : w))
//     );
//   };

//   const handleConfirmPayment = async (worker) => {
//     if (worker.amountPaid <= 0) {
//       toast.error("Enter Amount! Zero or negative amount is not valid");
//       return;
//     }

//     const remainingAmount = worker.payable - (worker.actualPaid || 0);
//     if (worker.amountPaid > remainingAmount) {
//       toast.error(
//         ` Do not give more money\nRemaining: ₹${remainingAmount}\nAlready paid: ₹${worker.actualPaid || 0}`
//       );
//       return;
//     }
//     setPaymentLoading(worker._id);

//     const payload = {
//       workerId: worker._id,
//       jobId: worker.jobId,
//       projectId: projectId,
//       month: "2025-08",
//       paymentDate: new Date().toISOString().slice(0, 10),
//       paidAmount: worker.amountPaid,
//       totalSalary: worker.payable,
//       present: worker.present,
//       absent: worker.absent,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/payroll", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save payroll");
//       const saved = await res.json();

// toast.success(`💰 Payment successful!\n${worker.name}: ₹${worker.amountPaid} paid`, {
//         style: {
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: '#fff'
//         }
//       });

//       setHiredWorkers((prev) =>
//         prev.map((w) => {
//           if (w._id === worker._id) {
//             const newTotalPaid = (w.actualPaid || 0) + worker.amountPaid;
//             const newStatus = newTotalPaid >= w.payable ? "Paid" : "Partial";
//             return {
//               ...w,
//               amountPaid: 0,
//               actualPaid: newTotalPaid,
//               paymentStatus: newStatus,
//             };
//           }
//           return w;
//         })
//       );
//     } catch (err) {
//       console.error("Payroll save error:", err);
//       toast.error(`❌ Payment failed for ${worker.name}`);
//     } finally {
//       setPaymentLoading(null);
//     }
//   };

//   const getStatusBadge = (worker) => {
//     if (worker.paymentStatus === "Paid") {
//       return <span className="badge bg-success">Paid</span>;
//     } else if (worker.paymentStatus === "Partial") {
//       return <span className="badge bg-warning text-dark">Partial</span>;
//     } else {
//       return <span className="badge bg-danger">Unpaid</span>;
//     }
//   };

//   const openHistoryModal = async (workerId, name) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/payroll/worker/${workerId}`);
//       const data = await res.json();
//       setSelectedHistory(data);
//     } catch {
//       setSelectedHistory([]);
//     } finally {
//       setSelectedName(name);
//       setSelectedWorkerId(workerId);
//       setShowModal(true);
//     }
//   };

//   const getWorkerTotalPayable = (workerId) => {
//     const worker = hiredWorkers.find(w => w._id === workerId);
//     return worker?.payable || 0;
//   };

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-5">
//           <div className="text-center" style={{ marginTop: "10rem" }}>
//             <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <h4>Loading Payroll Data...</h4>
//             <p className="text-muted">Please wait while we fetch worker payment information.</p>
//           </div>
//         </div>
//       </>
//     );
//   }
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <>
//       <Header />
//       <div className="container mt-5">
//         <h2
//           style={{ marginTop: "8rem", color: "#333" }}
//           className="text-center mb-4 fw-bold"
//         >
//           <RiSecurePaymentFill className="me-2" />
//           Payroll Summary
//         </h2>
//         {hiredWorkers.length === 0 ? (
//           <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//             <p className="text-muted fs-5">No workers available. Please hire workers first.</p>
//           </div>
//         ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover text-center border rounded mt-3">
//             <thead className="table-dark" style={{ backgroundColor: "var(--secondary-color)" }}>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Name</th>
//                 <th>Salary</th>
//                 <th>Paid Amount</th>
//                 <th>Payable</th>
//                 <th>Status</th>
//                 <th>History</th>
//                 <th>Confirm</th>
//               </tr>
//             </thead>
//             <tbody>
//               {hiredWorkers.map((worker, index) => {
//                 const remainingPayable = Math.max(0, worker.payable - (worker.actualPaid || 0));
//                 return (
//                   <tr key={worker._id}>
//                     <td>{index + 1}</td>
//                     <td>{worker.name}</td>
//                     <td>₹{worker.salary}</td>
//                     <td className="text-dark fw-bold">
//                       ₹{worker.payable}
//                       {worker.actualPaid > 0 && (
//                         <small className="text-muted d-block" style={{ fontSize: "12px" }}>
//                           ( Remaining: ₹{remainingPayable})
//                         </small>
//                       )}
//                     </td>
//                     <td style={{ width: "100px" }}>
//                       <input
//                         type="number"
//                         className="form-control form-control-sm text-center"
//                         value={worker.amountPaid || ''}
//                         min="0"
//                         max={remainingPayable}
//                         placeholder={`₹${remainingPayable}`}
//                         onChange={(e) =>
//                           handleAmountChange(worker._id, e.target.value)
//                         }
//                       />
//                     </td>
//                     <td>{getStatusBadge(worker)}</td>
//                     <td>
//                       <button
//                         className="btn btn-outline-primary btn-sm"
//                         onClick={() => openHistoryModal(worker._id, worker.name)}
//                         style={buttonStyle}
//                       >
//                         <GrFormView /> View History
//                       </button>
//                     </td>
//                     <td>
//                       {/* <button
//                         className="btn btn-sm"
//                         onClick={() => handleConfirmPayment(worker)}
//                         disabled={worker.amountPaid <= 0 || remainingPayable <= 0}
//                         style={buttonStyle}
//                       >
//                         Confirm
//                       </button> */}
//                        <button
//                         className="btn btn-sm"
//                         onClick={() => handleConfirmPayment(worker)}
//                         disabled={worker.amountPaid <= 0 || remainingPayable <= 0 || paymentLoading === worker._id}
//                         style={{
//                           ...buttonStyle,
//                           position: 'relative',
//                           minWidth: '80px'
//                         }}
//                       >
//                         {paymentLoading === worker._id ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                             Processing...
//                           </>
//                         ) : (
//                           'Confirm'
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//         )}

//         {/* History Modal */}
//         {showModal && (
//           <div className="modal show d-block bg-dark bg-opacity-25">
//             <div className="modal-dialog modal-lg">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title fw-bold">{selectedName}'s Payment History</h5>
//                   <div className="d-flex align-items-center">
//                     <span className="me-3 text-success fw-bold">Total: ₹{getWorkerTotalPayable(selectedWorkerId)}</span>
//                     <button className="btn-close" onClick={() => setShowModal(false)} />
//                   </div>
//                 </div>
//                 <div className="modal-body">
//                   {selectedHistory.length === 0 ? (
//                     <p className="text-muted">No history found.</p>
//                   ) : (
//                     <table className="table table-bordered text-center">
//                       <thead className="table-light">
//                         <tr>
//                           <th>Date</th>
//                           <th>Paid</th>
//                           <th>Remaining</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           let runningTotal = 0;
//                           const totalPayable = getWorkerTotalPayable(selectedWorkerId);
//                          // const totalPayable = selectedHistory[0]?.totalSalary || 0;
//                           const rows = [];

//                           selectedHistory.forEach((record, recordIndex) => {
//                             if (record.paymentDates && record.paidAmounts) {
//                               record.paymentDates.forEach((date, i) => {
//                                 const paid = record.paidAmounts[i] || 0;
//                                 runningTotal += paid;
//                                 const remaining = Math.max(0, totalPayable - runningTotal);
//                                 const status =
//                                   remaining === 0
//                                     ? "Paid"
//                                     : remaining < totalPayable
//                                     ? "Partial"
//                                     : "Unpaid";

//                                 rows.push(
//                                   <tr key={`${recordIndex}-${i}`}>
//                                     <td>{date?.slice(0, 10) || "N/A"}</td>
//                                     <td>₹{paid}</td>
//                                     <td>₹{remaining}</td>
//                                     <td>
//                                       <span
//                                         className={`badge ${
//                                           status === "Paid"
//                                             ? "bg-success"
//                                             : status === "Partial"
//                                             ? "bg-warning text-dark"
//                                             : "bg-danger"
//                                         }`}
//                                       >
//                                         {status}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 );
//                               });
//                             } else {
//                               const paid = record.paidAmount || record.totalAmount || 0;
//                               runningTotal += paid;
//                               const remaining = Math.max(0, totalPayable - runningTotal);
//                               const status =
//                                 remaining === 0
//                                   ? "Paid"
//                                   : remaining < totalPayable
//                                   ? "Partial"
//                                   : "Unpaid";

//                               rows.push(
//                                 <tr key={recordIndex}>
//                                   <td>
//                                     {record.paymentDate?.slice(0, 10) ||
//                                       record.createdAt?.slice(0, 10) ||
//                                       "N/A"}
//                                   </td>
//                                   <td>₹{paid}</td>
//                                   <td>₹{remaining}</td>
//                                   <td>
//                                     <span
//                                       className={`badge ${
//                                         status === "Paid"
//                                           ? "bg-success"
//                                           : status === "Partial"
//                                           ? "bg-warning text-dark"
//                                           : "bg-danger"
//                                       }`}
//                                     >
//                                       {status}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               );
//                             }
//                           });

//                           return rows;
//                         })()}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }

// export default PayrollPage;

// const buttonStyle = {
//   backgroundColor: "var(--primary-color)",
//   transition: "background-color 0.3s ease, color 0.3s ease",
//   color: "var(--text-color)",
// };
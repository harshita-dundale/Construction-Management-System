import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GrFormView } from "react-icons/gr";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";

function PayrollPageEnhanced() {
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projectId = selectedProject?._id;

  // Get materials from Redux
  const materials = useSelector((state) => state.materials.materials);

  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    const fetchHiredWorkers = async () => {
      if (!projectId) {
        setError("No project selected");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/apply?status=joined&projectId=${projectId}`
        );
        if (!res.ok) throw new Error("Failed to fetch hired workers");
        const data = await res.json();
        const hired = data.filter((app) => app.status === "joined");

        const merged = await Promise.all(
          hired.map(async (w) => {
            const name = w.name || w.userId?.name || "Unknown";
            const jobTitle = w.jobId?.title || "N/A";
            const salary = w.jobId?.salary || 0;
            const jobId = w.jobId?._id || "";
            const workerId = w.userId?._id || w._id;

            let presentCount = 0,
              absentCount = 0,
              totalPayable = 0;
            let actualPaidAmount = 0,
              paymentStatus = "Unpaid";

            try {
              const sumRes = await fetch(
                `http://localhost:5000/api/worker-records/history/${workerId}`
              );
              const history = await sumRes.json();
              presentCount = history.filter((h) => h.status === "Present").length;
              absentCount = history.filter((h) => h.status === "Absent").length;
              totalPayable = presentCount * salary;
            } catch (err) {
              console.error("Error fetching attendance:", err);
            }

            try {
              const payrollRes = await fetch(
                `http://localhost:5000/api/payroll/worker/${workerId}`
              );
              if (payrollRes.ok) {
                const payrollData = await payrollRes.json();
                const currentMonthPayroll = payrollData.find(
                  (p) => p.month === "2025-08"
                );
                if (currentMonthPayroll) {
                  const totalPaid = currentMonthPayroll.paidAmounts.reduce(
                    (a, b) => a + b,
                    0
                  );
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
              amountPaid: '',
              actualPaid: actualPaidAmount,
              paymentStatus: paymentStatus,
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

  const handleAmountChange = (workerId, value) => {
    if (value === '') {
      setHiredWorkers((prev) =>
        prev.map((w) => (w._id === workerId ? { ...w, amountPaid: '' } : w))
      );
      return;
    }
    
    const paid = parseInt(value, 10) || 0;
    if (paid < 0) {
      toast.error("Amount could not be negative");
      return;
    }

    setHiredWorkers((prev) =>
      prev.map((w) => (w._id === workerId ? { ...w, amountPaid: paid } : w))
    );
  };

  const handleConfirmPayment = async (worker) => {
    if (worker.amountPaid <= 0) {
      toast.error("Enter Amount! Zero or negative amount is not valid");
      return;
    }

    const remainingAmount = worker.payable - (worker.actualPaid || 0);
    if (worker.amountPaid > remainingAmount) {
      toast.error(
        `Do not give more money\nRemaining: ₹${remainingAmount}\nAlready paid: ₹${worker.actualPaid || 0}`
      );
      return;
    }
    
    setPaymentLoading(worker._id);

    const payload = {
      workerId: worker._id,
      jobId: worker.jobId,
      projectId: projectId,
      month: "2025-08",
      paymentDate: new Date().toISOString().slice(0, 10),
      paidAmount: worker.amountPaid,
      totalSalary: worker.payable,
      present: worker.present,
      absent: worker.absent,
    };

    try {
      const res = await fetch("http://localhost:5000/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save payroll");

      toast.success(`💰 Payment successful!\n${worker.name}: ₹${worker.amountPaid} paid`, {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff'
        }
      });

      setHiredWorkers((prev) =>
        prev.map((w) => {
          if (w._id === worker._id) {
            const newTotalPaid = (w.actualPaid || 0) + worker.amountPaid;
            const newStatus = newTotalPaid >= w.payable ? "Paid" : "Partial";
            return {
              ...w,
              amountPaid: '',
              actualPaid: newTotalPaid,
              paymentStatus: newStatus,
            };
          }
          return w;
        })
      );
    } catch (err) {
      console.error("Payroll save error:", err);
      toast.error(`❌ Payment failed for ${worker.name}`);
    } finally {
      setPaymentLoading(null);
    }
  };

  const getEnhancedStatusBadge = (worker) => {
    if (worker.paymentStatus === "Paid") {
      return (
        <span className="badge bg-success px-3 py-2">
          <i className="fas fa-check-circle me-1"></i>Fully Paid
        </span>
      );
    } else if (worker.paymentStatus === "Partial") {
      return (
        <span className="badge bg-warning text-dark px-3 py-2">
          <i className="fas fa-clock me-1"></i>Partial
        </span>
      );
    } else {
      return (
        <span className="badge bg-danger px-3 py-2">
          <i className="fas fa-times-circle me-1"></i>Unpaid
        </span>
      );
    }
  };

  const openHistoryModal = async (workerId, name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payroll/worker/${workerId}`);
      const data = await res.json();
      setSelectedHistory(data);
    } catch {
      setSelectedHistory([]);
    } finally {
      setSelectedName(name);
      setSelectedWorkerId(workerId);
      setShowModal(true);
    }
  };

  const getWorkerTotalPayable = (workerId) => {
    const worker = hiredWorkers.find(w => w._id === workerId);
    return worker?.payable || 0;
  };

  // Calculate summary statistics
  const totalWorkers = hiredWorkers.length;
  const totalPayable = hiredWorkers.reduce((sum, w) => sum + w.payable, 0);
  const totalPaid = hiredWorkers.reduce((sum, w) => sum + (w.actualPaid || 0), 0);
  const totalRemaining = totalPayable - totalPaid;
  const paidWorkers = hiredWorkers.filter(w => w.paymentStatus === "Paid").length;
  const partialWorkers = hiredWorkers.filter(w => w.paymentStatus === "Partial").length;
  const unpaidWorkers = hiredWorkers.filter(w => w.paymentStatus === "Unpaid").length;

  // Calculate total material cost
  const totalMaterialCost = materials.reduce((sum, m) => sum + (m.unitPrice * (m.quantity || 1)), 0);
  // Combined total
  const totalProjectCost = totalPayable + totalMaterialCost;

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading Payroll Data...</h4>
            <p className="text-muted">Please wait while we fetch worker payment information.</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <Header />
      <div className="container-fluid px-4" style={{ marginTop: "6rem" }}>
        {/* Dashboard Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="mt-4  justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-0 text-gray-800 fw-bold">
                  <RiSecurePaymentFill className="me-2 text-primary" />
                  Payroll Dashboard
                </h1>
                <p className="text-muted text-center mb-4">Manage worker payments and track payroll status</p>
                {/* Total Project Cost in Header */}
                {/* <div className="mt-2">
                  <span className="badge bg-secondary fs-5 px-4 py-2">
                    Total Project Cost: ₹{totalProjectCost.toLocaleString()}
                  </span>
                </div> */}
              </div>
              <div className="text-end">
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {selectedProject?.name || "No Project Selected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-2 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Workers
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{totalWorkers}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-users fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Payable
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">₹{totalPayable.toLocaleString()}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-rupee-sign fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Total Paid
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">₹{totalPaid.toLocaleString()}</div>
                    <div className="progress progress-sm mt-2">
                      <div className="progress-bar bg-info" style={{width: `${totalPayable > 0 ? (totalPaid/totalPayable)*100 : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Remaining
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">₹{totalRemaining.toLocaleString()}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clock fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                <h6 className="m-0 font-weight-bold">Payment Status Overview</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="status-item">
                      <div className="status-circle bg-success">{paidWorkers}</div>
                      <h6 className="mt-2 text-success">Fully Paid</h6>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="status-item">
                      <div className="status-circle bg-warning">{partialWorkers}</div>
                      <h6 className="mt-2 text-warning">Partially Paid</h6>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="status-item">
                      <div className="status-circle bg-danger">{unpaidWorkers}</div>
                      <h6 className="mt-2 text-danger">Unpaid</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hiredWorkers.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
              <i className="fas fa-users fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No Workers Available</h4>
              <p className="text-muted">Please hire workers first to manage payroll.</p>
            </div>
          </div>
        ) : (
          /* Modern Payroll Table */
          <div className="payroll-table-card">
            <div className="table-header ">
              <h5 className="table-title">
                <i className="fas fa-users-cog me-2"></i>
                Worker Payroll Management
              </h5>
              <div className="table-summary">
                <span className="summary-item">
                  <i className="fas fa-users me-1"></i>
                  {hiredWorkers.length} Workers
                </span>
                <span className="summary-item">
                  <i className="fas fa-rupee-sign me-1"></i>
                  ₹{totalPayable.toLocaleString()} Total
                </span>
              </div>
            </div>
            <div className="table-responsive mt-2">
              <table className="table modern-table">
                <thead>
                  <tr>
                    <th className="px-3 py-3"><i className="fas fa-hashtag me-2"></i>Sr.</th>
                    <th className="px-3 py-3"><i className="fas fa-user me-2"></i>Worker Details</th>
                    <th className="px-3 py-3"><i className="fas fa-calendar-check me-2"></i>Attendance</th>
                    <th className="px-3 py-3"><i className="fas fa-wallet me-2"></i>Payment Info</th>
                    <th className="px-3 py-3"><i className="fas fa-cogs me-2"></i>Actions</th>
                  </tr>
                </thead>
                  <tbody>
                    {hiredWorkers.map((worker, index) => {
                      const remainingPayable = Math.max(0, worker.payable - (worker.actualPaid || 0));
                      const paymentProgress = worker.payable > 0 ? ((worker.actualPaid || 0) / worker.payable) * 100 : 0;
                      
                      return (
                        <tr key={worker._id} className="payroll-row align-middle">
                          <td className="px-3 py-3">
                            <div className="worker-number">
                              {index + 1}
                            </div>
                          </td>
                          
                          <td className="px-3 py-3">
                            <div className="worker-info">
                              <div className="d-flex align-items-center">
                                {/* <div className="worker-avatar me-3">
                                  <div className="worker-icon">
                                    <i className="fas fa-hard-hat"></i>
                                  </div>
                                </div> */}
                                <div>
                                  <h6 className="mb-0 fw-bold worker-name">{worker.name}</h6>
                                  <small className="job-title">{worker.jobTitle}</small>
                                  <div className="mt-1">
                                    <span className="salary-badge">₹{worker.salary}/day</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-3 py-3">
                            <div className="attendance-info">
                              <div className="d-flex justify-content-between mb-1">
                                <span className="badge bg-success">{worker.present} Present</span>
                                <span className="badge bg-danger">{worker.absent} Absent</span>
                              </div>
                              <small className="text-muted">Total: {worker.present + worker.absent} days</small>
                            </div>
                          </td>
                          
                          <td className="px-3 py-3">
                            <div className="payment-info">
                              <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="fw-bold text-success">₹{worker.payable}</span>
                                  <span className="text-muted small">Total Earned</span>
                                </div>
                                <div className="progress mb-1" style={{height: '6px'}}>
                                  <div 
                                    className="progress-bar bg-info" 
                                    style={{width: `${paymentProgress}%`}}
                                  ></div>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <span className="text-info small">₹{worker.actualPaid || 0} Paid</span>
                                  <span className="text-warning small">₹{remainingPayable} Remaining</span>
                                </div>
                              </div>
                              
                              <div className="payment-input">
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text">₹</span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={worker.amountPaid || ''}
                                    min="0"
                                    max={remainingPayable}
                                    placeholder={remainingPayable.toString()}
                                    onChange={(e) => handleAmountChange(worker._id, e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-2 py-3">
                            <div className="action-buttons">
                              {/* <div className="mb-2">
                                {getEnhancedStatusBadge(worker)}
                              </div> */}
                              
                              <div className="btn-group-vertical d-grid gap-1">
                                <button
                                  className="btn btn-warning btn-sm text-white"
                                  onClick={() => openHistoryModal(worker._id, worker.name)}
                                  style={{
                                    background: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 100%)',
                                    border: 'none',
                                    fontWeight: '600'
                                  }}
                                >
                                  <i className="fas fa-history me-1"></i>History
                                </button>
                                
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleConfirmPayment(worker)}
                                  disabled={worker.amountPaid <= 0 || remainingPayable <= 0 || paymentLoading === worker._id}
                                  style={{
                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    border: 'none',
                                    fontWeight: '600'
                                  }}
                                >
                                  {paymentLoading === worker._id ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-check me-1"></i>Pay Now
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          // </div>
        )}

        {/* Enhanced History Modal */}
        {showModal && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle me-3">
                      {selectedName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="modal-title mb-0 fw-bold">{selectedName}'s Payment History</h5>
                      <small className="opacity-75">Complete payment transaction history</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="text-end me-3">
                      <div className="text-white-50 small">Total Payable</div>
                      <div className="h5 mb-0 text-white">₹{getWorkerTotalPayable(selectedWorkerId).toLocaleString()}</div>
                    </div>
                    <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                  </div>
                </div>
                
                <div className="modal-body p-4">
                  {selectedHistory.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-receipt fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No Payment History</h5>
                      <p className="text-muted">No payment transactions found for this worker.</p>
                    </div>
                  ) : (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="card bg-light">
                            <div className="card-body">
                              <div className="row text-center">
                                <div className="col-md-4">
                                  <h6 className="text-muted mb-1">Total Transactions</h6>
                                  <h4 className="text-primary mb-0">{selectedHistory.length}</h4>
                                </div>
                                <div className="col-md-4">
                                  <h6 className="text-muted mb-1">Total Paid</h6>
                                  <h4 className="text-success mb-0">
                                    ₹{selectedHistory.reduce((sum, record) => {
                                      if (record.paidAmounts) {
                                        return sum + record.paidAmounts.reduce((a, b) => a + b, 0);
                                      }
                                      return sum + (record.paidAmount || 0);
                                    }, 0).toLocaleString()}
                                  </h4>
                                </div>
                                <div className="col-md-4">
                                  <h6 className="text-muted mb-1">Payment Status</h6>
                                  <h4 className="text-info mb-0">Active</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="custom-table-header" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important', color: 'white !important'}}>
                            <tr>
                              <th className="px-3 py-3"><i className="fas fa-calendar me-2"></i>Date</th>
                              <th className="px-3 py-3"><i className="fas fa-rupee-sign me-2"></i>Amount Paid</th>
                              <th className="px-3 py-3"><i className="fas fa-wallet me-2"></i>Remaining</th>
                              <th className="px-3 py-3"><i className="fas fa-info-circle me-2"></i>Status</th>
                              <th className="px-3 py-3"><i className="fas fa-chart-line me-2"></i>Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              let runningTotal = 0;
                              const totalPayable = getWorkerTotalPayable(selectedWorkerId);
                              const rows = [];

                              selectedHistory.forEach((record, recordIndex) => {
                                if (record.paymentDates && record.paidAmounts) {
                                  record.paymentDates.forEach((date, i) => {
                                    const paid = record.paidAmounts[i] || 0;
                                    runningTotal += paid;
                                    const remaining = Math.max(0, totalPayable - runningTotal);
                                    const progress = totalPayable > 0 ? (runningTotal / totalPayable) * 100 : 0;
                                    const status = remaining === 0 ? "Paid" : remaining < totalPayable ? "Partial" : "Unpaid";

                                    rows.push(
                                      <tr key={`${recordIndex}-${i}`} className="align-middle">
                                        <td className="px-3 py-3">
                                          <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar-day text-primary me-2"></i>
                                            <span className="fw-medium">
                                              {new Date(date).toLocaleDateString("en-IN", {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                              })}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-3">
                                          <span className="badge bg-success fs-6 px-3 py-2">
                                            ₹{paid.toLocaleString()}
                                          </span>
                                        </td>
                                        <td className="px-3 py-3">
                                          <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                                            ₹{remaining.toLocaleString()}
                                          </span>
                                        </td>
                                        <td className="px-3 py-3">
                                          <span className={`badge fs-6 px-3 py-2 ${
                                            status === "Paid" ? "bg-success" : 
                                            status === "Partial" ? "bg-warning text-dark" : "bg-danger"
                                          }`}>
                                            <i className={`fas ${
                                              status === "Paid" ? "fa-check-circle" : 
                                              status === "Partial" ? "fa-clock" : "fa-times-circle"
                                            } me-1`}></i>
                                            {status}
                                          </span>
                                        </td>
                                        <td className="px-3 py-3">
                                          <div className="progress" style={{height: '8px', width: '100px'}}>
                                            <div 
                                              className="progress-bar bg-info" 
                                              style={{width: `${progress}%`}}
                                            ></div>
                                          </div>
                                          <small className="text-muted">{progress.toFixed(1)}%</small>
                                        </td>
                                      </tr>
                                    );
                                  });
                                } else {
                                  const paid = record.paidAmount || record.totalAmount || 0;
                                  runningTotal += paid;
                                  const remaining = Math.max(0, totalPayable - runningTotal);
                                  const progress = totalPayable > 0 ? (runningTotal / totalPayable) * 100 : 0;
                                  const status = remaining === 0 ? "Paid" : remaining < totalPayable ? "Partial" : "Unpaid";

                                  rows.push(
                                    <tr key={recordIndex} className="align-middle">
                                      <td className="px-3 py-3">
                                        <div className="d-flex align-items-center">
                                          <i className="fas fa-calendar-day text-primary me-2"></i>
                                          <span className="fw-medium">
                                            {new Date(record.paymentDate || record.createdAt).toLocaleDateString("en-IN", {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-3">
                                        <span className="badge bg-success fs-6 px-3 py-2">
                                          ₹{paid.toLocaleString()}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3">
                                        <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                                          ₹{remaining.toLocaleString()}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3">
                                        <span className={`badge fs-6 px-3 py-2 ${
                                          status === "Paid" ? "bg-success" : 
                                          status === "Partial" ? "bg-warning text-dark" : "bg-danger"
                                        }`}>
                                          <i className={`fas ${
                                            status === "Paid" ? "fa-check-circle" : 
                                            status === "Partial" ? "fa-clock" : "fa-times-circle"
                                          } me-1`}></i>
                                          {status}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3">
                                        <div className="progress" style={{height: '8px', width: '100px'}}>
                                          <div 
                                            className="progress-bar bg-info" 
                                            style={{width: `${progress}%`}}
                                          ></div>
                                        </div>
                                        <small className="text-muted">{progress.toFixed(1)}%</small>
                                      </td>
                                    </tr>
                                  );
                                }
                              });

                              return rows;
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="modal-footer bg-light">
                  <div className="d-flex justify-content-between w-100">
                    <div className="text-muted">
                      <small>Last updated: {new Date().toLocaleDateString()}</small>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      <i className="fas fa-times me-1"></i>Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Modern Custom Styles */}
      <style jsx>{`
        .border-left-primary {
          border-left: 0.25rem solid #4e73df !important;
        }
        .border-left-success {
          border-left: 0.25rem solid #1cc88a !important;
        }
        .border-left-info {
          border-left: 0.25rem solid #36b9cc !important;
        }
        .border-left-warning {
          border-left: 0.25rem solid #f6c23e !important;
        }
        .status-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin: 0 auto;
        }
        
        /* Modern Payroll Table Styles */
        .payroll-table-card {
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
        
        .payroll-row {
          transition: all 0.3s ease;
        }
        
        .payroll-row:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .payroll-row td {
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
        }
        
        .job-title {
          color: #6c757d;
          font-size: 0.85rem;
        }
        
        .salary-badge {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .worker-number {
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
        
        .progress-sm {
          height: 0.5rem;
        }
        
        .card {
          border-radius: 0.35rem;
        }
        
        .custom-table-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        
        .custom-table-header th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
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
      `}</style>
    </>
  );
}

export default PayrollPageEnhanced;
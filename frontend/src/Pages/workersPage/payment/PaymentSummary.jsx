
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import pay1 from "../../../assets/images/icons/pay1.gif";
import pay2 from "../../../assets/images/icons/pay2.gif";
import { useDispatch } from "react-redux";
import {
  fetchAttendanceSummary,
  fetchAttendanceHistory,
  fetchPaymentHistory,
} from "../../Redux/AttendanceSlice";
import { useAuth0 } from "@auth0/auth0-react";
import "./PaymentSummary.css";

const PaymentSummary = ({ jobId }) => {
  const [showSection, setShowSection] = useState(null);
  const [jobSalary, setJobSalary] = useState(1000);
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const workerEmail = user?.email;

  const {
    history,
    summaryStatus,
    summaryError,
    loading,
    paymentData,
    paymentHistory,
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    if (workerEmail) {
      dispatch(fetchAttendanceHistory(workerEmail));
      dispatch(fetchAttendanceSummary(workerEmail));
      dispatch(fetchPaymentHistory(workerEmail));
    }
  }, [dispatch, workerEmail]);

  // Use default daily wage
  // const dailyWage = 1000; // Fixed value for now
  const selectedJob = history?.find((job) => job.jobId === jobId);
  const selectedPaymentRecords =
    paymentHistory?.filter((record) => record.jobId === jobId) || [];

  useEffect(() => {
    console.log("✅ paymentHistory:", paymentHistory);
    console.log("✅ selectedJob:", selectedJob);
    console.log("✅ selectedPaymentRecords:", selectedPaymentRecords);
  }, [paymentHistory, selectedJob, selectedPaymentRecords]);
  if (!selectedJob) {
    return <div>No attendance records found for this job.</div>;
  }

  const presentCount =
    selectedJob?.attendanceRecords?.filter((a) => a.status === "Present")
      .length || 0;
  const absentCount =
    selectedJob?.attendanceRecords?.filter((a) => a.status === "Absent")
      .length || 0;
  const selectedAttendanceRecords = selectedJob?.attendanceRecords || [];
  
  // Get daily wage - use payment record or default with proper formatting
  const rawDailyWage = selectedPaymentRecords[0]?.totalSalary / (presentCount || 1) || 1000;
  const dailyWage = Math.round(rawDailyWage); // Round to nearest whole number
  
  // Calculate total earned based on attendance
  const totalEarned = presentCount * dailyWage;
  
  // Calculate total paid from payment records
  const totalPaid = selectedPaymentRecords.reduce(
    (sum, rec) => sum + rec.paidAmount,
    0
  );
  
  // Calculate remaining amount
  const pendingPayments = Math.max(totalEarned - totalPaid, 0);

  const handleToggle = (section) => {
    setShowSection((prev) => (prev === section ? null : section));
    
    // Auto scroll to table after state update
    setTimeout(() => {
      if (section && showSection !== section) {
        const historySection = document.querySelector(`[data-section="${section}"]`);
        if (historySection) {
          historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);
  };

  if (summaryStatus === "loading") {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: "3rem 0" }}>
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Payment & Attendance Data...</h5>
          <p className="text-muted">Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }
  if (summaryStatus === "failed") return <p>Error: {summaryError}</p>;

  const paymentProgress = totalEarned > 0 ? (totalPaid / totalEarned) * 100 : 0;
  const attendanceTotal = presentCount + absentCount;
  const attendanceProgress = attendanceTotal > 0 ? (presentCount / attendanceTotal) * 100 : 0;

  return (
    <div className="container py-4">
      {/* Summary Cards Row */}
      <div className="row g-4 mb-4">
        {/* Payment Summary Card */}
        <div className="col-lg-6">
          <div className="card h-100 shadow-lg border-0 payment-card" onClick={() => handleToggle("payment")}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper payment-icon me-3">
                  <i className="fas fa-wallet" style={{fontSize: '2rem', color: '#3498db'}}></i>
                </div>
                <div>
                  <h4 className="card-title mb-1 fw-bold" style={{color: '#2c3e50'}}>Payment Summary</h4>
                  <p className="text-muted mb-0">Track your earnings</p>
                </div>
              </div>
              
              <div className="payment-metrics">
                <div className="metric-item mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="metric-label fw-bold">Daily Wage</span>
                    <span className="metric-value fw-bold">₹{dailyWage.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="metric-item mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="metric-label fw-bold">Total Earned</span>
                    <span className="metric-value fw-bold text-success">₹{totalEarned.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="metric-item mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="metric-label fw-bold">Total Paid</span>
                    <span className="metric-value fw-bold text-info">₹{totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="progress mb-2" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-info" 
                      style={{width: `${paymentProgress}%`}}
                    ></div>
                  </div>
                  <small className="text-muted">{paymentProgress.toFixed(1)}% of earnings paid</small>
                </div>
                
                <div className="metric-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="metric-label fw-bold">Remaining</span>
                    <span className="metric-value fw-bold text-warning">₹{pendingPayments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="click-hint-btn">
                  <i className="fas fa-eye me-2"></i>
                  <span>Click to view payment history</span>
                  <i className="fas fa-chevron-down ms-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary Card */}
        <div className="col-lg-6">
          <div className="card h-100 shadow-lg border-0 attendance-card" onClick={() => handleToggle("attendance")}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper attendance-icon me-3">
                  <i className="fas fa-user-check" style={{fontSize: '2rem', color: '#28a745'}}></i>
                </div>
                <div>
                  <h4 className="card-title mb-1 fw-bold" style={{color: '#2c3e50'}}>Attendance Summary</h4>
                  <p className="text-muted mb-0">Track your presence</p>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading attendance data...</p>
                </div>
              ) : (
                <div className="attendance-metrics">
                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="stat-box present-stat">
                        <h3 className="stat-number text-success">{presentCount}</h3>
                        <p className="stat-label mb-0">Days Present</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-box absent-stat">
                        <h3 className="stat-number text-danger">{absentCount}</h3>
                        <p className="stat-label mb-0">Days Absent</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="attendance-progress mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small text-muted fw-bold">Attendance Rate</span>
                      <span className="small fw-bold">{attendanceProgress.toFixed(1)}%</span>
                    </div>
                    <div className="progress" style={{height: '10px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${attendanceProgress}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="total-days text-center">
                    <span className="badge bg-light text-dark fw-bold fs-6">Total Working Days: {attendanceTotal}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <div className="click-hint-btn">
                  <i className="fas fa-eye me-2"></i>
                  <span>Click to view attendance history</span>
                  <i className="fas fa-chevron-down ms-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Section Display */}
      {showSection === "payment" && (
        <div className="row" data-section="payment">
          <div className="col-12">
            <div className="card shadow-lg border-0 history-table-card">
              <div className="card-header text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h5 className="mb-0"><i className="fas fa-history me-2"></i>Payment History</h5>
              </div>
              <div className="card-body p-0">
                {selectedPaymentRecords.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3"><i className="fas fa-calendar me-2"></i>Date</th>
                          <th className="px-4 py-3"><i className="fas fa-rupee-sign me-2"></i>Amount</th>
                          <th className="px-4 py-3"><i className="fas fa-chart-line me-2"></i>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPaymentRecords.map((entry, index) => (
                          <tr key={index} className="border-bottom">
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="date-badge me-2">
                                  <i className="fas fa-calendar-day text-primary"></i>
                                </div>
                                <span className="fw-medium">
                                  {entry.paymentDate
                                    ? new Date(entry.paymentDate).toLocaleDateString("en-IN", {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })
                                    : "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-success fs-6 px-3 py-2">
                                ₹{entry.paidAmount || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-info px-3 py-2">
                                <i className="fas fa-check-circle me-1"></i>Paid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="empty-state">
                      <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No Payment Records</h5>
                      <p className="text-muted">No payment history available for this job yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSection === "attendance" && (
        <div className="row" data-section="attendance">
          <div className="col-12">
            <div className="card shadow-lg border-0 history-table-card">
              <div className="card-header text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h5 className="mb-0"><i className="fas fa-user-check me-2"></i>Attendance History</h5>
              </div>
              <div className="card-body p-0">
                {selectedAttendanceRecords.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3"><i className="fas fa-calendar me-2"></i>Date</th>
                          <th className="px-4 py-3"><i className="fas fa-user-clock me-2"></i>Status</th>
                          <th className="px-4 py-3"><i className="fas fa-info-circle me-2"></i>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAttendanceRecords.map((entry, index) => (
                          <tr key={index} className="border-bottom">
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="date-badge me-2">
                                  <i className="fas fa-calendar-day text-success"></i>
                                </div>
                                <span className="fw-medium">
                                  {new Date(entry.date).toLocaleDateString("en-IN", {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    weekday: 'short'
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`badge fs-6 px-3 py-2 ${
                                entry.status === "Present" 
                                  ? "bg-success" 
                                  : "bg-danger"
                              }`}>
                                <i className={`fas ${
                                  entry.status === "Present" 
                                    ? "fa-check-circle" 
                                    : "fa-times-circle"
                                } me-1`}></i>
                                {entry.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <small className="text-muted">
                                {entry.status === "Present" 
                                  ? "Earned ₹" + dailyWage 
                                  : "No earnings"}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="empty-state">
                      <i className="fas fa-user-times fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No Attendance Records</h5>
                      <p className="text-muted">No attendance history available yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyles = `
  .payment-card {
    background: white;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    border: 1px solid #e9ecef;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .payment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  .attendance-card {
    background: white;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    border: 1px solid #e9ecef;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .attendance-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  .icon-wrapper {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 10px;
    border: 1px solid #e9ecef;
  }
  
  .metric-item {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e9ecef;
  }
  
  .metric-label {
    font-size: 14px;
    color: #6c757d;
  }
  
  .metric-value {
    font-size: 18px;
    color: #2c3e50;
  }
  
  .stat-box {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    border: 1px solid #e9ecef;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 12px;
    opacity: 0.9;
  }
  
  .progress {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .progress-bar {
    border-radius: 10px;
  }
  
  .wage-indicator {
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .wage-bar {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    animation: slideIn 1s ease-out;
  }
  
  .earning-animation {
    text-align: center;
    margin-top: 5px;
  }
  
  .earning-pulse {
    color: #28a745;
    font-size: 0.8rem;
    font-weight: bold;
    animation: pulse 2s infinite;
  }
  
  .payment-status {
    color: #6c757d;
    font-weight: 500;
  }
  
  .pending-alert {
    color: #856404;
    font-size: 0.75rem;
    margin-top: 5px;
    animation: blink 2s infinite;
  }
  
  .stat-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-trend {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .progress-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
  }
  
  .progress-percentage {
    font-size: 1rem;
    font-weight: bold;
    color: #28a745;
  }
  
  .attendance-status {
    text-align: center;
  }
  
  .working-days-card {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #e9ecef;
  }
  
  .days-breakdown {
    margin-top: 0.5rem;
  }
  
  @keyframes slideIn {
    from { width: 0; }
    to { width: 100%; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = cardStyles;
  document.head.appendChild(styleSheet);
}

export default PaymentSummary;
      <style jsx>{`
        .payment-card, .attendance-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-card:hover, .attendance-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
        
        .click-hint-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .click-hint-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .history-table-card {
          animation: slideIn 0.5s ease-out;
          margin-top: 2rem;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
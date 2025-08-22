import React, { useEffect, useState } from "react";
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

  // Fetch job salary
  useEffect(() => {
    const fetchJobSalary = async () => {
      if (jobId) {
        try {
          const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
          if (response.ok) {
            const jobData = await response.json();
            setJobSalary(jobData.salary || 1000);
          }
        } catch (error) {
          console.error('Error fetching job salary:', error);
        }
      }
    };
    fetchJobSalary();
  }, [jobId]);
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
  
  // Get daily wage from job salary
  const dailyWage = jobSalary;
  
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

  return (
    <div
      style={{ textAlign: "center", fontFamily: "sans-serif" }}
      className="container"
    >
      <div className="row">
        {/* 💰 Payment Box */}
        <div
          className="col-md-6"
          style={boxStyle}
          onClick={() => handleToggle("payment")}
        >
          <img
            src={pay1}
            className="rounded mb-3 icons"
            width="80"
            height="80"
          />
          <h3 style={headingStyle}>Payment Summary</h3>
          <p>
            <strong>Daily Wage:</strong> ₹{dailyWage}
          </p>
          <p>
            <strong>Total Earned:</strong> ₹{totalEarned}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹{totalPaid}
          </p>
          <p style={{ fontWeight: "bold", color: "#ef4444" }}>
            <strong>Remaining Amount:</strong> ₹{pendingPayments}
          </p>

          <p style={clickTextStyle}>Click to view Payment History</p>
        </div>

        {/* 📅 Attendance Box */}
        <div
          className="col-md-6"
          style={boxStyle}
          onClick={() => handleToggle("attendance")}
        >
          <img
            src={pay2}
            className="rounded mb-3 icons"
            width="80"
            height="80"
          />
          <h3 style={headingStyle}>Attendance Summary</h3>

          {loading ? (
            <p>Loading attendance summary...</p>
          ) : (
            <>
              <p>
                <strong>Days Present:</strong> {presentCount}
              </p>
              <p>
                <strong>Days Absent:</strong> {absentCount}
              </p>
            </>
          )}
          <p style={clickTextStyle}>Click to view Attendance History</p>
        </div>

        {/* Section Display */}
        {showSection === "payment" && (
          <div className="container my-5">
            <table className="tableHistory table table-striped table-hover text-center border rounded">
              <thead
                style={{ backgroundColor: "var(--secondary-color)" }}
                className="table-dark"
              >
                <tr className="header-row">
                  <th className="header-cell">Date</th>
                  <th className="header-cell">Amount</th>
                  {/* <th className="header-cell">Status</th> */}
                </tr>
              </thead>
              <tbody>
                {selectedPaymentRecords.length > 0 ? (
                  selectedPaymentRecords.map((entry, index) => (
                    <tr
                      key={index}
                      className={`body-row ${
                        index % 2 === 0 ? "alternate-row" : ""
                      } align-middle`}
                    >
                      <td className="cell">
                        {entry.paymentDate
                          ? new Date(entry.paymentDate).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </td>
                      <td className="cell">
                        {entry.paidAmount !== undefined
                          ? `₹${entry.paidAmount}`
                          : "N/A"}
                      </td>
                      {/* <td
                        className="cell"
                        style={{
                          color: entry.status === "Present" ? "green" : "red",
                        }}
                      >
                        {entry.status}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="cell" colSpan="3">
                      No payment records available for this job.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showSection === "attendance" && (
          <div className="container my-5">
            {/* <h5 className="mb-3 text-start"><strong>Attendance History</strong></h5>var(--secondary-color)*/}
            <table className="tableHistory table table-striped table-hover text-center border rounded">
              <thead
                style={{ backgroundColor: "var(--secondary-color)" }}
                className="table-dark"
              >
                <tr className="header-row">
                  <th className="header-cell">Date</th>
                  <th className="header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttendanceRecords.length > 0 ? (
                  selectedAttendanceRecords.map((entry, index) => (
                    <tr
                      key={index}
                      className={`body-row ${
                        index % 2 === 0 ? "alternate-row" : ""
                      } align-middle`}
                    >
                      <td className="cell">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td
                        className="cell"
                        style={{
                          color: entry.status === "Present" ? "green" : "red",
                        }}
                      >
                        {entry.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="cell" colSpan="2">
                      No attendance records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;

const boxStyle = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "400px",
  margin: "10px auto",
  cursor: "pointer",
};

const headingStyle = {
  color: "#1f2937",
  marginBottom: "20px",
};

const clickTextStyle = {
  fontSize: "14px",
  color: "#111",
  marginTop: "20px",
};

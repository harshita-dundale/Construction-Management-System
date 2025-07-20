import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PaymentHistory from "../payment/PaymentHistory";
import AttendanceHistory from "../attendance/AttendanceHistory";
import pay1 from "../../../assets/images/icons/pay1.gif"
import pay2 from "../../../assets/images/icons/pay2.gif"
import { useDispatch } from "react-redux";
import { fetchAttendanceSummary , fetchAttendanceHistory,  } from "../../Redux/AttendanceSlice"; 
import { useAuth0 } from "@auth0/auth0-react"; 

const PaymentSummary = () => {
  const [showSection, setShowSection] = useState(null);

  const dispatch = useDispatch();
  const { user } = useAuth0();
  const workerEmail = user?.email;

  const { paymentData, paymentHistory, attendanceData, attendanceHistory, loading } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    if (workerEmail) {
      dispatch(fetchAttendanceSummary(workerEmail));
    }
  }, [dispatch, workerEmail]);

  // const handleToggle = (section) => {
  //   setShowSection((prev) => (prev === section ? null : section));
  //   if (section === "attendance") {
  //     // dispatch(fetchAttendanceHistory());
  //     // dispatch(fetchAttendanceHistory({ workerId, jobId }));
  //     dispatch(fetchAttendanceHistory(workerEmail));

  //   }
  // };

  const handleToggle = (section) => {
    setShowSection((prev) => (prev === section ? null : section));
  
    if (section === "attendance") {
      // Fake example values — replace with real logic
      const workerId = "some_worker_id"; 
      const jobId = "some_job_id";
  
      dispatch(fetchAttendanceHistory({ workerId, jobId }));
    }
  };
  

  // Count present/absent days
  // const presentCount = attendanceHistory.filter((a) => a.status === "Present").length;
  // const absentCount = attendanceHistory.filter((a) => a.status === "Absent").length;

  const presentCount = Array.isArray(attendanceHistory)
  ? attendanceHistory.filter((a) => a.status === "Present").length
  : 0;
const absentCount = Array.isArray(attendanceHistory)
  ? attendanceHistory.filter((a) => a.status === "Absent").length
  : 0;

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }} className="container">
      <div className="row">
        {/* 💰 Payment Box */}
        <div className="col-md-6" style={boxStyle} onClick={() => handleToggle("payment")}> 
          <img src={pay1} className="rounded mb-3 icons" width="80" height="80" />
          <h3 style={headingStyle}>Payment Summary</h3>
          <p><strong>Daily Wage:</strong> ₹{paymentData?.dailyWage ?? "--"}</p>
          <p><strong>Total Paid:</strong> ₹{paymentData?.totalPaid ?? "--"}</p>
          <p style={{ fontWeight: "bold", color: "#ef4444" }}>
            <strong>Pending Payments:</strong> ₹{paymentData?.pending ?? "--"}
          </p>
          <p style = {clickTextStyle}>Click to view Payment History</p>
        </div>

        {/* 📅 Attendance Box */}
        <div className="col-md-6" style={boxStyle} onClick={() => handleToggle("attendance")}> 
          <img src={pay2} className="rounded mb-3 icons" width="80" height="80" />
          <h3 style={headingStyle}>Attendance Summary</h3>

          {loading ? (
            <p>Loading attendance summary...</p>
          ) : (
            <>
              <p><strong>Days Present:</strong> {presentCount}</p>
              <p><strong>Days Absent:</strong> {absentCount}</p>
            </>
          )}
          <p style = {clickTextStyle}>Click to view Attendance History</p>
        </div>

        {/* Section Display */}
        {showSection === "payment" && <PaymentHistory payments={paymentHistory} />}
        {showSection === "attendance" && (
          <div className="container my-5">
            <table className="tableHistory">
              <thead>
                <tr className="header-row">
                  <th className="header-cell">Date</th>
                  <th className="header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((entry, index) => (
                    <tr key={index} className={`body-row ${index % 2 === 0 ? "alternate-row" : ""}`}>
                      <td className="cell">{entry.date}</td>
                      <td className="cell" style={{ color: entry.status === "Present" ? "green" : "red" }}>
                        {entry.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="cell" colSpan="2">No attendance records available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

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


export default PaymentSummary;

import { useState } from "react";
import { useSelector } from "react-redux";
import PaymentHistory from "../payment/PaymentHistory";
import pay1 from "../../../assets/images/icons/pay1.gif"
import pay2 from "../../../assets/images/icons/pay2.gif"

const PaymentSummary = () => {
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const paymentData = useSelector((state) => state.attendance.paymentData);
  const payments = useSelector((state) => state.attendance.paymentHistory);
  const [activeTab, setActiveTab] = useState(null); 
  const attendanceData = useSelector((state) => state.attendance.attendanceData);

  const handleToggle = (tab) => {
    if (activeTab === tab) {
      setShowPaymentHistory(false);
      setActiveTab(null);
    } else {
      setShowPaymentHistory(true);
      setActiveTab(tab);
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }} className="container">
      <div className="row">
      <div className="col-md-6"
        style={boxStyle}
        onClick={() => handleToggle("payment")}
        // onClick={() => setShowPaymentHistory(!showPaymentHistory)}
      >
        <img src = {pay1} className="rounded mb-3 icons" width="80" height="80"  />
        <h3 style={headingStyle}>Payment Summary</h3>
        <p><strong>Daily Wage:</strong> ₹{paymentData.dailyWage}</p>
        <p><strong>Total Paid:</strong> ₹{paymentData.totalPaid}</p>
        <p style={{ fontWeight: "bold", color: "#ef4444" }}>
          <strong>Pending Payments:</strong> ₹{paymentData.pending}
        </p>
        <p style={clickTextStyle}>
          Click to view Payment History
        </p>
      </div>
      {/* Attendance Summary Box */}
      <div className="col-md-6"
        style={boxStyle}
        onClick={() => handleToggle("attendance")}
      >
         <img src = {pay2} className="rounded mb-3 icons" width="80" height="80"  />
        <h3 style={headingStyle}>Attendance Summary</h3>
        <p><strong>Total Days Worked:</strong> {attendanceData.totalDays}</p>
        <p><strong>Days Absent:</strong> {attendanceData.absentDays}</p>
        <p style={{ fontWeight: "bold", color: attendanceData.percentage >= 75 ? "#10b981" : "#ef4444" }}>
          <strong>Attendance Percentage:</strong> {attendanceData.percentage}%
        </p>
        <p style={clickTextStyle}>Click to view Payment History</p>
      </div>
      {showPaymentHistory && <PaymentHistory payments={payments} />}
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

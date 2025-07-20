// src/components/AttendanceHistory.jsx
import { useSelector } from "react-redux";
import "../historyTables.css";

const AttendanceHistory = () => {
  const attendance = useSelector((state) => state.attendance.attendanceHistory);
  if (!attendance || attendance.length === 0) {
    return <p>No attendance history available.</p>;
  }
  
  return (
    <div className="container my-5">
      <table className="tableHistory">
        <thead>
          <tr className="header-row">
            <th className="header-cell p-3">Date</th>
            <th className="header-cell p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance?.attendanceList?.length > 0 ? (
            attendance.attendanceList.map((entry, index) => (
              <tr key={index} className={`body-row ${index % 2 === 0 ? "alternate-row" : ""}`}>
                <td className="cell p-3 fs-6">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="cell p-3 fs-6">{entry.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="cell p-3" colSpan="2">No attendance data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;

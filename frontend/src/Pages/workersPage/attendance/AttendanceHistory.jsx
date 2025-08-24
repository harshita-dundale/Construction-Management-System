// src/components/AttendanceHistory.jsx
import React from 'react';
import { useSelector } from "react-redux";
import "../historyTables.css";

const AttendanceHistory = () => {
  const attendance = useSelector((state) => state.attendance.attendanceHistory);
  if (!attendance || attendance.length === 0) {
    return (
      <div className="container my-5">
        <div className="attendance-table-card">
          <div className="table-header">
            <h5 className="table-title">
              <i className="fas fa-calendar-check me-2"></i>
              Attendance History
            </h5>
          </div>
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h4 className="empty-title">No Attendance History</h4>
            <p className="empty-description">
              No attendance records found. Start marking attendance to see history.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-5">
      <div className="attendance-table-card">
        <div className="table-header">
          <h5 className="table-title">
            <i className="fas fa-calendar-check me-2"></i>
            Attendance History
          </h5>
          <div className="table-summary">
            <span className="summary-item">
              <i className="fas fa-list me-1"></i>
              {attendance?.attendanceList?.length || 0} Records
            </span>
          </div>
        </div>
        
        {attendance?.attendanceList?.length > 0 ? (
          <div className="table-responsive">
            <table className="table modern-table">
              <thead>
                <tr>
                  <th><i className="fas fa-calendar-day me-2"></i>Date</th>
                  <th><i className="fas fa-check-circle me-2"></i>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.attendanceList.map((entry, index) => (
                  <tr key={index} className="attendance-row">
                    <td>
                      <div className="date-display">
                        <div className="date-icon">
                          <i className="fas fa-calendar"></i>
                        </div>
                        <span className="date-text">
                          {new Date(entry.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        entry.status === 'Present' ? 'status-present' : 'status-absent'
                      }`}>
                        <i className={`fas ${
                          entry.status === 'Present' ? 'fa-check' : 'fa-times'
                        } me-1`}></i>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h4 className="empty-title">No Attendance Records</h4>
            <p className="empty-description">
              No attendance data available for this period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;

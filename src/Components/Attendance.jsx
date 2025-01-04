import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Attendance.css";

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const attendanceData = {
    "2024-12-01": "present",
    "2024-12-02": "absent",
    "2024-12-03": "present",
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (attendanceData[dateString] === "absent") {
        return <div className="dot dot-absent"></div>;
      }
    }
    return null;
  };

  return (
    <div className="attendance-container mt-5">
      <h4 className="text-center mb-4">Attendance Summary</h4>

      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
        />
      </div>

      <div className="selected-date mt-4 text-center">
        <h5>Selected Date: {date.toDateString()}</h5>
        <p>
          Status:{" "}
          <span
            className={`badge ${
              attendanceData[date.toISOString().split("T")[0]] === "present"
                ? "bg-success"
                : attendanceData[date.toISOString().split("T")[0]] ===
                  "absent"
                ? "bg-danger"
                : "bg-secondary"
            }`}
          >
            {attendanceData[date.toISOString().split("T")[0]] || "No Record"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Attendance;

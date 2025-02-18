import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [workers, setWorkers] = useState([
    { id: 1, name: 'John Doe', present: false, dailyWage: 500 },
    { id: 2, name: 'Jane Smith', present: false, dailyWage: 600 },
    { id: 3, name: 'Michael Brown', present: false, dailyWage: 550 },
  ]);
  const [totalDays, setTotalDays] = useState(0);
  const handleAttendanceToggle = (id) => {
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) =>
        worker.id === id ? { ...worker, present: !worker.present } : worker
      )
    );
  };
  const calculatePayments = () => {
    setTotalDays(totalDays + 1);
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        const daysWorked = worker.present ? (worker.daysWorked || 0) + 1 : worker.daysWorked || 0;
        return {
          ...worker,
          daysWorked,
          payment: daysWorked * worker.dailyWage,
          present: false, // Reset attendance for the next day
        };
      })
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Worker Attendance and Payment</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Worker Name</th>
            <th>Daily Wage</th>
            <th>Present</th>
            <th>Days Worked</th>
            <th>Total Payment</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.dailyWage}</td>
              <td>
                <input
                  type="checkbox"
                  checked={worker.present}
                  onChange={() => handleAttendanceToggle(worker.id)}
                />
              </td>
              <td>{worker.daysWorked || 0}</td>
              <td>{worker.payment || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" onClick={calculatePayments}>
          Process Payments
        </button>
        <h5>Total Workdays: {totalDays}</h5>
      </div>
    </div>
  );
}

export default Dashboard;
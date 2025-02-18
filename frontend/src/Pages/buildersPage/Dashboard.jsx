import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header';

function Dashboard() {
  const [workers, setWorkers] = useState([
    { id: 1, name: 'John Doe', present: false, dailyWage: 500, daysWorked: 0 },
    { id: 2, name: 'Jane Smith', present: false, dailyWage: 600, daysWorked: 0 },
    { id: 3, name: 'Michael Brown', present: false, dailyWage: 550, daysWorked: 0 },
    { id: 4, name: 'Amli Sek', present: false, dailyWage: 550, daysWorked: 0 },
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
    setTotalDays((prevDays) => prevDays + 1);
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) => {
        const daysWorked = worker.present ? worker.daysWorked + 1 : worker.daysWorked;
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
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="mb-4 text-center" style={{ marginTop: '7rem' }}>
          Worker Attendance and Payment
        </h1>
        <div className="table-responsive">
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
                  <td>{worker.daysWorked}</td>
                  <td>{worker.payment || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={calculatePayments}>
            Process Payments
          </button>
          <h5>Total Workdays: {totalDays}</h5>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
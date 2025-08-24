import { useSelector, useDispatch } from "react-redux";
import { toggleAttendance, processPayments } from "../../Pages/Redux/workerSlice";
import Header from "../../Components/Header";
// import "./Dashboard.css"; 

function Dashboard() {
  const dispatch = useDispatch();
  const workers = useSelector((state) => state.workers.workers);
  const totalDays = useSelector((state) => state.workers.totalDays);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="mb-5 text-center" style={{ marginTop: "7rem" }}>
          Worker Attendance & Payment
        </h1>
        {/* shadow-lg p-3 mb-5 bg-white rounded */}
        <div className="table-responsive shadow">
          <table className="table table-striped table-hover text-center border rounded">
            <thead className="customTh table-dark"  style={{ backgroundColor: "#f58800", color: "white" }}>
              <tr>
                <th>#</th>
                <th>Worker Name</th>
                <th>Daily Wage (₹)</th>
                <th>Present</th>
                <th>Days Worked</th>
                <th>Total Payment (₹)</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="align-middle">
                  <td>{worker.id}</td>
                  <td >{worker.name}</td>
                  <td >₹{worker.dailyWage}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={worker.present}
                      onChange={() => dispatch(toggleAttendance(worker.id))}
                    />
                  </td>
                  <td >{worker.daysWorked}</td>
                  <td>₹{worker.payment || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm border">
          <h5 className="m-0">Total Workdays: <strong className="text-primary">{totalDays}</strong></h5>
          <button 
          className="btn btn-light align-self-center px-4 py-2 fw-bold pay-btn"
          style={{color:"white"}}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--secondary-color)")}
           onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--primary-color)")}
           onClick={() => dispatch(processPayments())}>
            Process Payments
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

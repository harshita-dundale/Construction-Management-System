import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfitAndCostAnalysis = () => {
  const [workerPayments, setWorkerPayments] = useState(0);
  const [materialCosts, setMaterialCosts] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const totalExpenses = parseFloat(workerPayments) + parseFloat(materialCosts);
  const profitOrLoss = parseFloat(revenue) - totalExpenses;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Profit and Cost Analysis</h1>
      {/* Expenses Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Track Expenses</h5>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="workerPayments" className="form-label">
                  Worker Payments
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="workerPayments"
                  placeholder="Enter total worker payments"
                  value={workerPayments}
                  onChange={(e) => setWorkerPayments(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="materialCosts" className="form-label">
                  Material Costs
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="materialCosts"
                  placeholder="Enter total material costs"
                  value={materialCosts}
                  onChange={(e) => setMaterialCosts(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Track Revenue</h5>
          <form>
            <div className="mb-3">
              <label htmlFor="revenue" className="form-label">
                Total Revenue
              </label>
              <input
                type="number"
                className="form-control"
                id="revenue"
                placeholder="Enter total revenue"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Summary Section */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Summary</h5>
          <div className="row">
            <div className="col-md-4 text-center">
              <h6>Total Revenue</h6>
              <p className="fs-5">${revenue || 0}</p>
            </div>
            <div className="col-md-4 text-center">
              <h6>Total Expenses</h6>
              <p className="fs-5">${totalExpenses || 0}</p>
            </div>
            <div className="col-md-4 text-center">
              <h6>Profit / Loss</h6>
              <p className={`fs-5 ${profitOrLoss >= 0 ? "text-success" : "text-danger"}`}>
                ${profitOrLoss || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profit or Loss Analysis */}
      <div className="mt-4 text-center">
        <button
          className="btn btn-primary"
          onClick={() => alert(`Profit/Loss: $${profitOrLoss}`)}
        >
          View Profit / Loss
        </button>
      </div>
    </div>
  );
};

export default ProfitAndCostAnalysis;

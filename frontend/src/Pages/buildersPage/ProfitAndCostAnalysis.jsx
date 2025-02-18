import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/Header";

const ProfitAndCostAnalysis = () => {
  const [workerPayments, setWorkerPayments] = useState(0);
  const [materialCosts, setMaterialCosts] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const totalExpenses = parseFloat(workerPayments) + parseFloat(materialCosts);
  const profitOrLoss = parseFloat(revenue) - totalExpenses;

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1
          className="text-center mb-4"
          style={{
            marginTop: "7rem",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: "700",
            color: "#333",
          }}
        >
          Profit and Cost Analysis
        </h1>

        {/* Expenses Section */}
        <div
          className=" mb-4 p-3"
          style={{
            border:"2px solid #2ECC71",
            borderRadius: "10px",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="card-body">
            <h5 className="card-title text-success" >Track Expenses</h5>
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
        <div
          className="mb-4 p-3"
          style={{
            border: "2px solid #F7DC6F",
            borderRadius: "10px",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="card-body">
            <h5 className="card-title text-warning">Track Revenue</h5>
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
        <div
          className=" mb-4 p-3"
          style={{
            border: "2px solid #5DADE2",
            borderRadius: "10px",
            backgroundColor: "#F4F6F7",
            boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body">
            <h5 className="card-title text-info">Summary</h5>
            <div className="row text-center">
              <div className="col-md-4">
                <h6>Total Revenue</h6>
                <p className="fs-5 text-dark">${revenue || 0}</p>
              </div>
              <div className="col-md-4">
                <h6>Total Expenses</h6>
                <p className="fs-5 text-dark">${totalExpenses || 0}</p>
              </div>
              <div className="col-md-4">
                <h6>Profit / Loss</h6>
                <p
                  className={`fs-5 ${
                    profitOrLoss >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  ${profitOrLoss || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profit or Loss Analysis */}
        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4 py-2"
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              background: "#051821",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={() => alert(`Profit/Loss: $${profitOrLoss}`)}
          >
            View Profit / Loss
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfitAndCostAnalysis;

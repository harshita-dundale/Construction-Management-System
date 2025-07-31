import { useSelector, useDispatch } from "react-redux";
import { setWorkerPayments, setMaterialCosts, setRevenue } from "../Redux/financeSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../Components/Header";

const ProfitAndCostAnalysis = () => {
  const dispatch = useDispatch();

  // Redux state se values fetch kar rahe hain
  const workerPayments = useSelector((state) => state.finance.workerPayments);
  const materialCosts = useSelector((state) => state.finance.materialCosts);
  const revenue = useSelector((state) => state.finance.revenue);

  const totalExpenses = parseFloat(workerPayments) + parseFloat(materialCosts);
  const profitOrLoss = parseFloat(revenue) - totalExpenses;

  return (
    <>
      <Header />
      <div className="container mt-5 my-5" >
        <h1 className="text-center mb-4" style={{ marginTop: "8rem", fontFamily: "sans-serif" }}>Profit and Cost Analysis</h1>
        {/* Profit or Loss Analysis */}
        {/* <div className="text-center mt-4 mb-2 d-flex justify-content-end">
          <button
            className="btn btn-light  service-btns"
            onClick={() => alert(`Profit/Loss: $${profitOrLoss}`)}
          >
            View Profit / Loss
          </button>
        </div> */}
        {/* Expenses Section */}
        <div className="mb-4 p-3 mt-5" style={{ border: "2px solid #5DADE2", borderRadius: "10px" }}>
          <h5 className="text-info">Track Expenses</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="workerPayments">Worker Payments</label>
              <input
                type="number"
                className="form-control"
                id="workerPayments"
                placeholder="Enter total worker payments"
                style={{ fontStyle: "italic" }}
                value={workerPayments === 0 ? "" : workerPayments}
                onChange={(e) => dispatch(setWorkerPayments(Number(e.target.value)))}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="materialCosts">Material Costs</label>
              <input
                type="number"
                className="form-control"
                id="materialCosts"
                placeholder="Enter total material costs"
                style={{ fontStyle: "italic" }}
                value={materialCosts === 0 ? "" : materialCosts}
                onChange={(e) => dispatch(setMaterialCosts(Number(e.target.value)))}
              />
            </div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="mb-4 p-3" style={{ border: "2px solid #F7DC6F", borderRadius: "10px" }}>
          <h5 className="text-warning">Track Revenue</h5>
          <label htmlFor="revenue" >Total Revenue</label>
          <input
            type="number"
            className="form-control"
            id="revenue"
            placeholder="Enter total revenue"
            style={{ fontStyle: "italic" }}
            value={revenue === 0 ? "" : revenue}
            onChange={(e) => dispatch(setRevenue(Number(e.target.value)))}
          />
        </div>

        {/* Summary Section */}
        <div className="mb-4 p-3" style={{ border: "2px solid #2ECC71", borderRadius: "10px" }}>
          <h5 className="text-success">Summary</h5>
          <div className="row text-center">
            <div className="col-md-4">
              <h5>Total Revenue</h5>
              <p className="fs-5">${revenue || 0}</p>
            </div>
            <div className="col-md-4">
              <h5>Total Expenses</h5>
              <p className="fs-5">${totalExpenses || 0}</p>
            </div>
            <div className="col-md-4">
              <h5>Profit / Loss</h5>
              <p className={`fs-5 ${profitOrLoss >= 0 ? "text-success" : "text-danger"}`}>
                ${profitOrLoss || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitAndCostAnalysis;
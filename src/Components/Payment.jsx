import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Payment = () => {
   const paymentHistory = [
    { date: "2024-12-01", amount: 1500, status: "Paid", method: "Credit Card" },
    { date: "2024-12-10", amount: 1200, status: "Pending", method: "Bank Transfer" },
    { date: "2024-11-25", amount: 800, status: "Paid", method: "PayPal" },
    { date: "2024-11-15", amount: 1000, status: "Paid", method: "Debit Card" },
  ];

  return (
    <div className="payment-section card p-3 mt-4">
      {/* Payment History*/}
      <h4 className="text-center my-2 mb-3">Payment History</h4>
      <table className="table  table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
              <td>{payment.date}</td>
              <td>${payment.amount}</td>
              <td>
                <span className={`badge ${payment.status === "Paid" ? "bg-success" : "bg-warning"}`}>
                  {payment.status}
                </span>
              </td>
              <td>{payment.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payment;


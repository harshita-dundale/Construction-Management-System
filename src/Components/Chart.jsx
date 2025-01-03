import { Bar } from "react-chartjs-2";

function Chart() {

   const earningsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Earnings",
        data: [1000, 1200, 1400, 800, 1100, 1250, 1300, 1500, 1450, 1600, 1700, 1900],
        backgroundColor: "#28a745",
      },
    ],
  };

  return (
    <div>
       <h4 className="text-center my-2">Monthly Earnings</h4>
      <div className="chart-container mb-4">
        <Bar data={earningsData} options={{ responsive: true, plugins: { title: { display: true, text: "Earnings per Month" } } }} />
      </div>
    </div>
  )
}

export default Chart

// import { useSelector } from "react-redux";
// import "../historyTables.css";

// const PaymentHistory = () => {
//   const payments = useSelector((state) => state.attendance.paymentHistory);

//   return (
//     <div className="container my-5 ">
//       <table className="tableHistory table table-striped table-hover text-center border rounded">
//         <thead >
//           <tr className="header-row ">
//             <th className="header-cell p-3">Date</th>
//             <th className="header-cell p-3">Status</th>
//             <th className="header-cell p-3">Amount Paid (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.length > 0 ? (
//             payments.map((payment, index) => (
//               <tr key={index} className={`body-row ${index % 2 === 0 ? "alternate-row" : ""}`}>
//                 <td className="cell p-3 fs-6">{payment.date}</td>
//                 <td className="cell p-3 fs-6">{payment.status}</td>
//                 <td className="cell p-3 fs-6">{payment.amount}</td>
//               </tr>
//             ))
//           ) : (
//             <tr><td className="cell" colSpan="2">No payment history available.</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PaymentHistory;
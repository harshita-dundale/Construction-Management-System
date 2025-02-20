import '../historyTables.css'
import PropTypes from 'prop-types';

const PaymentHistory = ({ payments }) => {
  return (
    <div className="containerTable">
      <table className="tableHistory">
        <thead>
          <tr className="header-row">
            <th className="header-cell">Date</th>
            <th className="header-cell">Amount Paid (₹)</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <tr
                key={index}
                className={`body-row ${index % 2 === 0 ? 'alternate-row' : ''}`}
              >
                <td className="cell">{payment.date}</td>
                <td className="cell">{payment.amount}</td>
              </tr>
            ))
          ) : (
            <tr className="body-row">
              <td className="cell" colSpan="2" style={{ textAlign: 'center', color: '#9ca3af' }}>
                No payment history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

PaymentHistory.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PaymentHistory;

const PaymentSummary = () => {
  const data = {
    dailyWage: 500,
    totalPaid: 10000,
    pending: 2000,
  };

  return (
    <div
      style={{
        backgroundColor: '#ecf2f9',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '10px auto',
      }}
    >
      <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>Payment Summary</h3>
      <p style={{ margin: '10px 0', fontSize: '16px', color: '#4b5563' }}>
        <strong>Daily Wage:</strong> ₹{data.dailyWage}
      </p>
      <p style={{ margin: '10px 0', fontSize: '16px', color: '#4b5563' }}>
        <strong>Total Paid:</strong> ₹{data.totalPaid}
      </p>
      <p
        style={{
          margin: '10px 0',
          fontSize: '18px',
          color: '#ef4444',
          fontWeight: 'bold',
        }}
      >
        <strong>Pending Payments:</strong> ₹{data.pending}
      </p>
    </div>
  );
};

export default PaymentSummary;

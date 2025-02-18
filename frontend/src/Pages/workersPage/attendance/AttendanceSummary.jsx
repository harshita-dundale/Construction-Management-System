const AttendanceSummary = () => {
  const data = {
    totalDays: 20,
    absentDays: 5,
    percentage: 75,
  };

  return (
    <div
      style={{
        backgroundColor: '#ecf2f9',
        // backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '10px auto',
      }}
    >
      <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>Attendance Summary</h3>
      <p style={{ margin: '10px 0', fontSize: '16px', color: '#4b5563' }}>
        <strong>Total Days Worked:</strong> {data.totalDays}
      </p>
      <p style={{ margin: '10px 0', fontSize: '16px', color: '#4b5563' }}>
        <strong>Days Absent:</strong> {data.absentDays}
      </p>
      <p
        style={{
          margin: '10px 0',
          fontSize: '18px',
          color: data.percentage >= 75 ? '#10b981' : '#ef4444',
          fontWeight: 'bold',
        }}
      >
        <strong>Attendance Percentage:</strong> {data.percentage}%
      </p>
    </div>
  );
};

export default AttendanceSummary;

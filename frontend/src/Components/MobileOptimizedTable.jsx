import React from 'react';

const MobileOptimizedTable = ({ 
  headers, 
  data, 
  renderRow, 
  className = "",
  emptyMessage = "No data available"
}) => {
  return (
    <div className={`mobile-table-container ${className}`}>
      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table modern-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => renderRow(item, index, false))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-md-none">
        {data.length > 0 ? (
          <div className="mobile-cards">
            {data.map((item, index) => (
              <div key={index} className="mobile-card">
                {renderRow(item, index, true)}
              </div>
            ))}
          </div>
        ) : (
          <div className="mobile-empty-state">
            <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
            <p className="text-muted">{emptyMessage}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .mobile-table-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .modern-table {
          margin: 0;
          background: white;
        }

        .modern-table thead th {
          background: linear-gradient(135deg, #051821 0%, #266867 100%);
          border: none;
          padding: 1rem;
          font-weight: 600;
          color: white;
          border-bottom: 2px solid #051821;
        }

        .modern-table tbody tr {
          transition: all 0.3s ease;
          border-bottom: 1px solid #f8f9fa;
        }

        .modern-table tbody tr:hover {
          background: rgba(38, 104, 103, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(5, 24, 33, 0.1);
        }

        .modern-table tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-color: #f8f9fa;
        }

        .mobile-cards {
          padding: 1rem;
        }

        .mobile-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border-left: 4px solid #051821;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .mobile-card:last-child {
          margin-bottom: 0;
        }

        .mobile-empty-state {
          text-align: center;
          padding: 3rem 2rem;
        }

        .table-responsive {
          border-radius: 20px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .mobile-table-container {
            border-radius: 12px;
            margin: 0 0.5rem;
          }

          .mobile-cards {
            padding: 0.5rem;
          }

          .mobile-card {
            padding: 0.75rem;
            border-radius: 8px;
          }

          .mobile-empty-state {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileOptimizedTable;
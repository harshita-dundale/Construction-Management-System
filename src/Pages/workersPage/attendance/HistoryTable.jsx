import React from 'react';
import '../historyTables.css'
import { useTable } from 'react-table';
import PropTypes from 'prop-types';

const HistoryTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'Status', accessor: 'status' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: 'center', margin: '20px 0', color: '#9ca3af' }}>
        No attendance records available.
      </p>
    );
  }

  return (
    <div className="containerTable">
      <table {...getTableProps()} className="tableHistory">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="header-cell">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`body-row ${index % 2 === 0 ? 'alternate-row' : ''}`}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="cell">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

HistoryTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
};

HistoryTable.defaultProps = {
  data: [],
};

export default HistoryTable;

import { useSelector } from "react-redux";

const ApplicationTable = ({onViewDetails, activeTab}) => {

  const { allApplications } = useSelector((state) => state.applicationsModel);

  const filteredApplications = activeTab === 'All' 
    ? allApplications 
    : allApplications.filter((app) => app.status === activeTab);

  return (
    <table className="table table-hover mt-4">
      <thead style={{ backgroundColor: '#266867', color: '#ffffff' }}>
        <tr>
          <th>Job Title</th>
          <th>Application Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredApplications.map((app, index) => (
          <tr key={index}>
            <td>{app.title}</td>
            <td>{app.date}</td>
            <td>
              <span className={`badge ${getStatusClass(app.status)}`}>
                {app.status}
              </span>
            </td>
            <td>
              <button
                className="btn"
                style={{
                  backgroundColor: '#051821',
                  color: '#ffffff',
                  border: 'none',
                }}
                onClick={() => onViewDetails(app)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-warning text-dark';
    case 'Selected':
      return 'bg-success text-white';
    case 'Rejected':
      return 'bg-danger text-white';
    default:
      return 'bg-secondary text-white';
  }
};

export default ApplicationTable;

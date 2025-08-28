import './DashboardStats.css';

function DashboardStats({ totalProjects, ongoingWorkers, totalMaterialExpenses, pendingPayments }) {
  const statsData = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: 'fas fa-project-diagram',
      color: '#667eea',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Ongoing Workers',
      value: ongoingWorkers,
      icon: 'fas fa-users',
      color: '#28a745',
      bgGradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
    },
    {
      title: 'Material Expenses',
      value: `₹${totalMaterialExpenses.toLocaleString()}`,
      icon: 'fas fa-boxes',
      color: '#fd7e14',
      bgGradient: 'linear-gradient(135deg, #fd7e14 0%, #ffc107 100%)'
    },
    {
      title: 'Pending Payments',
      value: `₹${pendingPayments.toLocaleString()}`,
      icon: 'fas fa-credit-card',
      color: '#dc3545',
      bgGradient: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)'
    }
  ];

  return (
    <div className="container-fluid px-3 px-md-4 mb-5">
      <div className="dash-header text-center mb-4">
        <h2 className="dash-title">Dashboard Overview</h2>
        <p className="dash-subtitle">A quick look at your project statistics</p>
      </div>
      <div className="row g-3 justify-content-center">
        {statsData.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: stat.bgGradient }}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">{stat.title}</h5>
                <p className="stat-value" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <div className="stat-overlay"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardStats;
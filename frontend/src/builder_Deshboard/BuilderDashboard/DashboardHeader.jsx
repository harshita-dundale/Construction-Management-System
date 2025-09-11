// import { Button } from "react-bootstrap";

// function DashboardHeader({ totalProjectCost, setShowProjectModal }) {
//   return (
//     <div className="dashboard-header p-lg-4 mb-lg-5 position-relative">
//       <div className="container-fluid px-3 px-md-4">
//         <div className="row align-items-center">
//           <div className="col-lg-8 text-center text-lg-start">
//             <div className="text-center">
//               <h1 className="dashboard-title text-start pt-3">
//                 Project Management Hub
//               </h1>
//               <p className="dashboard-subtitle text-start mb-4 w-75 w-small-100 pt-3 pb-3">
//                 Streamline your projects with advanced tools.
//                 Monitor attendance, payments, and progress instantly.
//                 Organize workers and job roles without hassle.
//               </p>
//               {/* <div className="dashboard-badge d-inline-flex justify-content-center w-auto w-lg-50 py-2 px-3 mb-1 mx-auto mx-lg-0">
//                 <i className="fas fa-tachometer-alt me-2"></i>
//                 Builder Dashboard
//               </div> */}
//             </div>
//           </div>
//           <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
//             <div className="d-flex flex-column align-items-center align-items-lg-end gap-3 position-relative z-2">
//               <Button onClick={() => setShowProjectModal(true)} className="btn-dashboard-primary">
//                 <i className="fas fa-cog me-2"></i>
//                 Manage Projects
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardHeader;

const DashboardHeader = ({
  title,
  subtitle,
  badgeText,
  badgeIcon = "fas fa-boxes", // default badge icon
  stats = [], // [{ number: 10, label: "Total Present" }]
  projectFilter = null, // { name, jobsCount }
  actions = null, // JSX for custom buttons
  showSearch = false, // enable search input
  searchValue = "",
  onSearchChange = () => {},
  searchPlaceholder = "Search...",
  controlButton = null, // optional button next to search (like Add Material)
}) => {
  return (
    <div className="py-5 mt-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side */}
          <div className="col-md-8">
            <div className="">
              <h1 className="header-title">{title}</h1>
              {subtitle && <p className="header-subtitle me-5">{subtitle}</p>}
              {badgeText && (
                <span className="mate-head-badge mt-3">
                  <i className={`${badgeIcon} me-2`}></i>
                  {badgeText}
                </span>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="col-md-4 text-md-end mt-4 mt-md-0">
            {/* Stats header-stats*/}
            {stats.length > 0 && (
              <div className="">
                <div className="stats-grid-head">
                  {stats.map((stat, index) => (
                    <div className="stat-item" key={index}>
                      <div className="stat-number-head">{stat.number}</div>
                      <div className="stat-label-head">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Filter */}
            {projectFilter && (
              <div className="project-filter mt-3">
                <div className="filter-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="filter-content">
                  <h6 className="filter-title">{projectFilter.name}</h6>
                  <span className="filter-subtitle">Project Filter Active</span>
                </div>
                {projectFilter.jobsCount !== undefined && (
                  <div className="filter-badge">
                    {projectFilter.jobsCount} Jobs
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {actions && <div className="mt-3">{actions}</div>}
          </div>
        </div>

        {/* Control Panel (Search + Button) */}
        {(showSearch || controlButton) && (
          <div className="control-panel mt-4">
            <div className="row align-items-center">
              {showSearch && (
                <div className="col-md-8">
                  <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      className="search-input"
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {controlButton && (
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  {controlButton}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;


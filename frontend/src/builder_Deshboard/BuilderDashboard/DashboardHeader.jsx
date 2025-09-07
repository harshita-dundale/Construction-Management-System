import { Button } from "react-bootstrap";

function DashboardHeader({ totalProjectCost, setShowProjectModal }) {
  return (
    <div className="dashboard-header p-4 mb-5 position-relative">
      <div className="container-fluid px-3 px-md-4">
        <div className="row align-items-center">
          <div className="col-lg-8 text-center text-lg-start">
            <div className="text-center">
              <h1 className="dashboard-title text-start">
                Project Management Hub
              </h1>
              <p className="dashboard-subtitle text-start mb-4 w-75 w-small-100">
                Streamline your projects with advanced tools.
                Monitor attendance, payments, and progress instantly.
                Organize workers and job roles without hassle.
              </p>
              {/* <div className="dashboard-badge d-inline-flex justify-content-center w-auto w-lg-50 py-2 px-3 mb-1 mx-auto mx-lg-0">
                <i className="fas fa-tachometer-alt me-2"></i>
                Builder Dashboard
              </div> */}
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
            <div className="header-actions d-flex flex-column align-items-center align-items-lg-end gap-3 .position-relative z-2">
              <div className=" mb-3">
                {/* <div className="stat-badge d-inline-block p-2">
                  <i className="fas fa-project-diagram me-2"></i>
                  <span>Quick Access</span>
                </div> */}
              </div>
              {/* <div>
                <span className="text-white fw-semibold rounded-pill d-inline-block fs-6 project-cost">
                  <i className="fas fa-coins me-2"></i>
                  Total Project Cost: ₹{totalProjectCost.toLocaleString()}
                </span>
              </div> */}
              <Button onClick={() => setShowProjectModal(true)} className="btn-dashboard-primary">
                <i className="fas fa-cog me-2"></i>
                Manage Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
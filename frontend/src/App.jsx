import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// FontAwesome icons loaded via CDN in index.html
import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
<<<<<<< HEAD
import Project_pannel from './builder_Deshboard/Project_pannel';
=======
import Builder_dashboard from './builder_Deshboard/BuilderDashboard/Builder_dashboard'
>>>>>>> 0647b0a6f75c44aec9419fd6f38cb67e0def5fc8
import BrowseJob from './Pages/workersPage/BrowseJob';
import PostJobForm from './builder_Deshboard/PostJobForm';
import ViewApplications from './builder_Deshboard/ViewApplications';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './Pages/buildersPage/Dashboard';
import HiredWorkers from './Pages/buildersPage/HiredWorkers';
import MaterialManagement from './Pages/buildersPage/MaterialManagement';
import ProfitAndCostAnalysis from './Pages/buildersPage/ProfitAndCostAnalysis';
import ApplicationSection from './Pages/workersPage/applications/ApplicationSection';
import MainAttendance from './Pages/workersPage/attendance/MainAttendance';
import ApplyForm from './Pages/workersPage/ApplyForm'; 
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import WorkerHistory from "./Pages/buildersPage/WorkerHistory"
import ViewPostedJobs from './builder_Deshboard/ViewPostedJob';
import PayrollPageEnhanced from './builder_Deshboard/PayrollPageEnhanced';

function App() {
  const domain = "dev-i7r8hkh5ekl5da21.us.auth0.com";
  const clientId = "RiNHeQ3WgXZjurVZUUpJ0utwNQMA27lx";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}>
      <Router>
      <ToastContainer  position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/Project_pannel" element={<Project_pannel />} />
          <Route path="/post-job" element={<PostJobForm />} />
          <Route path="/ViewApplications" element={<ViewApplications />} />
          <Route path="/browse-Job" element={<BrowseJob />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/HiredWorkers" element={<HiredWorkers />} />
          <Route path="/MaterialManagement" element={<MaterialManagement />} />
          <Route path="/ProfitAndCostAnalysis" element={<ProfitAndCostAnalysis />} />
          <Route path="/applications" element={<ApplicationSection />} />
          <Route path="/attendances" element={<MainAttendance />} />
          <Route path="/apply-job" element={<ApplyForm />} /> 
          <Route path="/attendance/worker/:workerId" element={<WorkerHistory />} />
          <Route path="/ViewPostedJobs" element={<ViewPostedJobs />} />
          <Route path="/payroll" element={<PayrollPageEnhanced />} />
        </Routes>
      </Router>  
    </Auth0Provider>
  );
}
export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
import Builder_dashboard from './builder_Deshboard/Builder_dashboard';
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
          <Route path="/Builder-Dashboard" element={<Builder_dashboard />} />
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
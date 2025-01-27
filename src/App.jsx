import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
// import Worker_dashboard from './Pages/Worker_dashboard';
import Builder_dashboard from './builder_Deshboard/Builder_dashboard';
import BrowseJob from './Pages/workersPage/BrowseJob';
import TrackBilling from './Pages/workersPage/TrackBilling';
import PostJobForm from './builder_Deshboard/PostJobForm';
import ViewApplications from './builder_Deshboard/ViewApplications';
// import TrackingBilling from './TrackingBilling';
import { Auth0Provider } from '@auth0/auth0-react';
import Dashboard from './builder_Deshboard/Dashboard';
import MaterialManagement from './builder_Deshboard/MaterialManagement';
import ProfitAndCostAnalysis from './builder_Deshboard/ProfitAndCostAnalysis'


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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/Builder-Dashboard" element={<Builder_dashboard />} />
          <Route path="/post-job" element={<PostJobForm />} />
          <Route path="/ViewApplications" element={<ViewApplications />}></Route>
          <Route path="/browse-Job" element={<BrowseJob />} />
          <Route path="/Track-Billing" element={<TrackBilling />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="/MaterialManagement" element={<MaterialManagement />} />
          <Route path="/ProfitAndCostAnalysis" element={<ProfitAndCostAnalysis />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}
export default App;
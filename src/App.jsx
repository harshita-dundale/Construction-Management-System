import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';

// import '@syncfusion/ej2-react-charts/styles/material.css';

import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
import BrowseJob from './Pages/workersPage/BrowseJob';
import TrackBilling from './Pages/workersPage/TrackBilling';
import ApplicationSection from './Pages/workersPage/applications/ApplicationSection';
import MainAttendance from './Pages/workersPage/attendance/MainAttendance';
import Builder_dashboard from './buildersPage/Builder_dashboard';
import PostJobForm from './buildersPage/PostJobForm';
// import ViewApplications from './buildersPage/ViewApplications';

function App() {
  return (
    
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/browse-Job" element={<BrowseJob />} />
        <Route path="/Track-Billing" element={<TrackBilling />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/applications" element={<ApplicationSection />} />
        <Route path="/attendances" element={<MainAttendance />} />

        <Route path="/builder-page" element={<Builder_dashboard />} />
        <Route path="/post-job" element={<PostJobForm />} />
        {/* <Route path="/ViewApplications" element={<ViewApplications />} /> */}
      </Routes>
    </Router>
    
      </>
        )
}

export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';

// import '@syncfusion/ej2-react-charts/styles/material.css';

import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
import BrowseJob from './Pages/workersPage/BrowseJob';
import TrackBilling from './Pages/workersPage/TrackBilling';

function App() {
  return (
    
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/browse-Job" element={<BrowseJob />} />
        <Route path="/Track-Billing" element={<TrackBilling />} />
      </Routes>
    </Router>
    
      </>
        )
}

export default App;
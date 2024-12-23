import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';

import LandingPage from './Pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from './Pages/RoleSelectionPage';
import Worker_dashboard from './Pages/Worker_dashboard';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/Worker-Dashboard" element={<Worker_dashboard />} />
      </Routes>
    </Router>
      </>
        )
}

export default App;
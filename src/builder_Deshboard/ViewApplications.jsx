import { useState } from 'react';
import Card3 from '../Components/cards/Card3';

function ViewApplications() {
  const [applications] = useState([
    {
      id: 1,
      name: "John Doe",
      appliedDate: "2023-12-01",
      experience: 5,
      skills: ["JavaScript", "React", "Node.js"],
      status: "under_review",
    },
    {
      id: 2,
      name: "Jane Smith",
      appliedDate: "2023-12-02",
      experience: 3,
      skills: ["Python", "Django", "Machine Learning"],
      status: "shortlisted",
    },
    {
      id: 3,
      name: "Sam Wilson",
      appliedDate: "2023-12-03",
      experience: 7,
      skills: ["Java", "Spring", "AWS"],
      status: "rejected",
    },
  ]);
  return (
    <div>
      {/* Header Section */}
      <header
        className="text-center"
        style={{backgroundColor: "#1a4654",  position: "fixed",color: "white", top: 0, left: 0,
     width: "100%",zIndex: 1000,}}>
        <h1 style={{ color: "white" }}>View Applications</h1>
        <p>Applications for <strong>Builders & Workers</strong></p>
      </header>
      {/* Container */}
      <div className="container" style={{ marginTop: '180px' }}> {/* Added margin-top to avoid overlap with header */}
        <div className="filters bg-white rounded shadow-sm p-4 mb-4">
          <h3 className="mb-3">Filters</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="status" className="form-label">Status</label>
              <select id="status" className="form-select">
                <option value="all">All</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="skills" className="form-label">Skills</label>
              <input type="text" id="skills"className="form-control" placeholder="Search skills"/>  
            </div>
            <div className="col-md-4">
              <label htmlFor="experience" className="form-label">Experience</label>
              <input
                type="number"
                id="experience"
                className="form-control"
                placeholder="Years"
                min="0"
                max="30"/>              
            </div>
          </div>
        </div>
        {/* List of Applications */}
        <div className="applications bg-white rounded shadow-sm p-4">
          {applications.map((application) => (
            <Card3 key={application.id} application={application} /> // Render the Card3 component
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer
        className="text-center py-4"
        style={{
          backgroundColor: "#051821", color: "white", left: 0, bottom: 0, width: "100%",
          }}>
        &copy; 2024 Job Portal. All rights reserved.
      </footer>
    </div>
  );
}
export default ViewApplications;
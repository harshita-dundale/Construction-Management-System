import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Tabs from "./Tabs";
import PaymentSummary from "../payment/PaymentSummary";
import Header from "../../../Components/Header";
import { useAuth0 } from "@auth0/auth0-react";
import "./MainAttendance.css"; // 👈 alag CSS import

const MainAttendance = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const workerEmail = user?.email;
  
  // Get selected job from navigation state
  const selectedJobFromState = location.state?.selectedJobId;
  const selectedJobTitle = location.state?.selectedJobTitle;

  useEffect(() => {
    const fetchJobs = async () => {
      if (!workerEmail) return;
      try {
        console.log("📡 Fetching jobs for:", workerEmail);

        const res = await fetch(
          `http://localhost:5000/api/apply/my-jobs?email=${workerEmail}`
        );
        console.log("🌐 Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();

        setJobTitles(data.map((job) => job.title));
        setJobIds(data.map((job) => job._id));
      } catch (err) {
        console.error("❌ Failed to fetch job titles:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    if (workerEmail) {
      fetchJobs();
    }
  }, [workerEmail]);
  
  if (isLoading || loadingJobs) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h4>Loading Attendance Data...</h4>
            <p className="text-muted">Please wait while we fetch your job information.</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return <div>Please login to continue</div>; 
  }

  return (
    <div className="attendance-page">
      <Header />
      <div className="attendance-container">
        {/* Header Section */}
        <div className="attendance-header">
          <div className="header-content">
            <h3 className="header-titl">
              <i className="fas fa-calendar-check me-2"></i>
              My Attendance
            </h3>
          </div>
        </div>
        
        {selectedJobFromState ? (
          // Show only selected job data
          <div className="selected-job-container">
            <div className="selected-job-header">
              <h4 className="selected-job-title">
                <i className="fas fa-briefcase me-2"></i>
                {selectedJobTitle}
              </h4>
              <span className="selected-badge">
                <i className="fas fa-check-circle me-1"></i>
                Selected Job
              </span>
            </div>
            <PaymentSummary jobId={selectedJobFromState}/>
          </div>
        ) : jobTitles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <h4 className="empty-title">No Jobs Available</h4>
            <p className="empty-description">Please join a job first to track your attendance.</p>
          </div>
        ) : (
          <Tabs tabs={jobTitles}>
            {jobIds.map((id) => (
              <div key={id}>
                <PaymentSummary jobId={id}/>
              </div>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MainAttendance;

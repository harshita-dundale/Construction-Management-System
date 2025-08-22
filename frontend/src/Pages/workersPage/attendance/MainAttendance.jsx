import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import Tabs from "./Tabs";
import PaymentSummary from "../payment/PaymentSummary";
import Header from "../../../Components/Header";
import { useAuth0 } from "@auth0/auth0-react";

const MainAttendance = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const workerEmail = user?.email;

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
        
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
          }
          
          .loading-content {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          .loading-spinner {
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 1rem;
          }
        `}</style>
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
            <h3 className="header-title">
              <i className="fas fa-calendar-check me-2"></i>
              My Attendance
            </h3>
            {/* <p className="header-subtitle">Track your daily attendance and payment summary</p> */}
          </div>
        </div>
        
        {jobTitles.length === 0 ? (
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
      
      <style jsx>{`
        .attendance-page {
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .attendance-container {
          margin-top: 6rem;
          padding: 2rem 1.5rem;
        }
        
        .attendance-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        
        .header-content {
          text-align: center;
        }
        
        .header-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: white;
        }
        
        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .empty-description {
          color: #6c757d;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MainAttendance;

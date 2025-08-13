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
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
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
    <div>
      <Header />
      <div style={{ marginTop: "6rem" }}>
        <Tabs tabs={jobTitles}>
          {jobIds.map((id) => (
            <div key={id}>
              <PaymentSummary jobId={id}/>
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MainAttendance;

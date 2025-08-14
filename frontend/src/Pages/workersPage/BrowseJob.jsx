import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import "./BrowseJob.css";
//import { setCurrentJob } from "../../Pages/Redux/applicationsSlice";
import JobCard from "../../Components/cards/JobCard";

function BrowseJob() {
  const [jobs, setJobs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter out expired jobs
  const filterActiveJobs = (jobsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return jobsList.filter(job => {
      const jobEndDate = new Date(job.endDate);
      jobEndDate.setHours(0, 0, 0, 0);
      
      // Show only jobs that haven't expired (today <= endDate)
      return today <= jobEndDate;
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        const activeJobs = filterActiveJobs(data);
        setJobs(activeJobs);
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCardFlip = (id) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="text-center" style={{ marginTop: "10rem" }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>Loading Job Listings...</h4>
            <p className="text-muted">Please wait while we fetch available jobs for you.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "130px" }}>
        <div className="row text-center d-flex justify-content-center">
          <h1 className="mt-2 fw-bold" style={{ color: "#051821" }}>
            Latest Job Listings
          </h1>
          <p className="fs-5 pt-3 col-md-8">
            Explore open positions and apply for suitable construction jobs near
            you.
          </p>
        </div>
        <div className="row g-4 d-flex justify-content-center">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isFlipped={flippedCards.includes(job._id)}
              onToggleFlip={toggleCardFlip}
            />
          ))}
          {jobs.length === 0 && (
            <div className="text-center mt-5">
              <p>No jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowseJob;
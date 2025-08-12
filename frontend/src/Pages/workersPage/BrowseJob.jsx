import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import "./BrowseJob.css";
//import { setCurrentJob } from "../../Pages/Redux/applicationsSlice";
import JobCard from "../../Components/cards/JobCard";

function BrowseJob() {
  const [jobs, setJobs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

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
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const toggleCardFlip = (id) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "130px" }}>
        <div className="row text-center d-flex justify-content-center">
          <h1 className="mt-2" style={{ color: "#051821" }}>
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

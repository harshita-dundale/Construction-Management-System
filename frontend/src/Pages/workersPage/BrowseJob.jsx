import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import "./BrowseJob.css";

function BrowseJob() {
  const [jobs, setJobs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
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

      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row text-center d-flex justify-content-center">
          <h1 className="mt-2" style={{ color: "#051821" }}>
            Latest Job Listings
          </h1>
          <p className="fs-5 pt-3 col-md-8">
            Explore open positions and apply for suitable construction jobs near you.
          </p>
        </div>

        <div className="row g-4 d-flex justify-content-center">
          {jobs.map((job) => (
            <div
              className="col-md-4 col-sm-6 d-flex align-items-stretch"
              key={job._id}
            >
              <div
                className={`card-flip h-100 ${
                  flippedCards.includes(job._id) ? "is-flipped" : ""
                }`}
              >
              
                <div className="card-front">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{ background: "#e2ecea" }}>
                      <img
                        src={`http://localhost:5000/uploads/${job.image}`}
                        alt={job.title}
                        className="rounded-circle mb-3"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <h5 className="card-title">{job.title}</h5>
                      <p className="card-text">{job.location}</p>
                      <p className="card-text">{job.salary} / day</p>
                      <p className="card-text">{job.Email}</p>
                      <button
                        className="seeMore btn btn-dark mt-auto"
                        onClick={() => toggleCardFlip(job._id)}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Back */}
                <div className="card-back">
                  <div className="card text-center h-100">
                    <div className="card-body" style={{ background: "#e2ecea" }}>
                     
                        
                          <div className="mt-auto text-dark"
                        style={{ height: "30px", width: "40px", color: "black", cursor: "pointer" }}
                        onClick={() => toggleCardFlip(job._id)}
                      >
                         Back
                      </div>
{/* 
                          <div className="mt-auto text-dark"
                        style={{ height: "30px", width: "40px", color: "black", cursor: "pointer" }} */}
                        {/* onClick={() => dispatch(toggleCardFlip(builder.login.uuid))}>
                        Back
                      </div> */}


                      <h5 className="card-title"> {job.PhoneNo}</h5>
                      <p className="card-text text-muted">
                         {job.startDate} to {job.endDate}
                      </p>
                      <button className="seeMore btn btn-dark mt-3">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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


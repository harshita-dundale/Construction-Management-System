import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import "./BrowseJob.css";
//import { setCurrentJob } from "../../Pages/Redux/applicationsSlice";
import JobCard from "../../Components/cards/JobCard";
import { useAuth0 } from "@auth0/auth0-react";

function BrowseJob() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const { user, isAuthenticated } = useAuth0();

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
        setFilteredJobs(activeJobs);
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch current month income for logged-in worker
  useEffect(() => {
    const fetchMonthlyIncome = async () => {
      if (!isAuthenticated || !user?.email) {
        console.log("❌ User not authenticated or no email:", { isAuthenticated, email: user?.email });
        setMonthlyIncome(0);
        return;
      }

      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        console.log("📅 Current month/year:", currentMonth, currentYear);
        
        // Fetch worker attendance data using the correct endpoint
        console.log("🔍 Fetching attendance data for:", user.email);
        
        const response = await fetch(`http://localhost:5000/api/worker-records/full-history?email=${encodeURIComponent(user.email)}`);
        
        if (!response.ok) {
          console.log("❌ Worker records endpoint failed:", response.status);
          setMonthlyIncome(0);
          return;
        }
        
        const data = await response.json();
        console.log("📊 API Response:", data);
        
        let totalIncome = 0;
        
        // Process the worker records data
        if (Array.isArray(data)) {
          console.log("📋 Processing worker records data...");
          data.forEach(jobRecord => {
            if (jobRecord.attendanceRecords && Array.isArray(jobRecord.attendanceRecords)) {
              jobRecord.attendanceRecords.forEach(record => {
                const recordDate = new Date(record.date);
                if (recordDate.getMonth() + 1 === currentMonth && recordDate.getFullYear() === currentYear) {
                  if (record.status === "Present") {
                    // Use a default daily wage of 1000 (you can fetch job details for actual salary)
                    const dailyWage = 1000;
                    totalIncome += dailyWage;
                    console.log("💰 Added income:", dailyWage, "Total:", totalIncome);
                  }
                }
              });
            }
          });
        }
        
        console.log("💵 Final monthly income:", totalIncome);
        setMonthlyIncome(totalIncome);
      } catch (error) {
        console.error("❌ Error fetching monthly income:", error);
        setMonthlyIncome(0);
      }
    };

    fetchMonthlyIncome();
  }, [isAuthenticated, user?.email]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const handleSearch = () => {
    // Search is handled by useEffect above
  };

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
          <LoadingSpinner 
            message="Loading Job Listings..." 
            size="large" 
          />
        </div>
      </>
    );
  }

  return (
    <div className="browse-jobs-container">
      <Header />
      
      {/* Hero Section */}
      <div className="jobs-hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* <div className="hero-badge mb-3">
                <i className="fas fa-briefcase me-2"></i>
                Job Opportunities
              </div> */}
              <h1 className="hero-title">Find Your Next
                <span className="text-gradient"> Construction Job</span>
              </h1>
              <p className="hero-description fs-5 mt-4">
                Discover exciting construction opportunities and connect with top builders. 
                Your next career move is just a click away.
              </p>
              
              {/* Search Bar */}
              <div className="search-container mt-4">
                <div className="search-box">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search jobs by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="search-btn" onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{filteredJobs.length}</div>
                  <div className="stat-label">Active Jobs</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">₹{monthlyIncome.toLocaleString()}</div>
                  <div className="stat-label">This Month Income</div>
                </div>
                {/* <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Companies</div>
                </div> */}
                {/* <div className="stat-card">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Workers Hired</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Jobs Section */}
      <div className="jobs-section">
        <div className="container">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="dash-title text-center">Available Positions</h2>
            {/* <p className="section-subtitle">Browse through our latest job openings</p> */}
          </div>
          
          {/* Filter Bar */}
          {/* <div className="filter-bar mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="results-count">
                  <i className="fas fa-list me-2"></i>
                  Showing {jobs.length} active jobs
                </div>
              </div>
              <div className="col-md-6 text-end">
                <div className="filter-buttons">
                  <button className="btn btn-filter active">
                    <i className="fas fa-th-large me-2"></i>All Jobs
                  </button>
                  <button className="btn btn-filter">
                    <i className="fas fa-clock me-2"></i>Recent
                  </button>
                  <button className="btn btn-filter">
                    <i className="fas fa-star me-2"></i>Featured
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Jobs Grid */}
          <div className="jobs-grid">
            {filteredJobs.length > 0 ? (
              <div className="row g-2">
                {filteredJobs.map((job) => (
                  <div key={job._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="job-card-wrapper">
                      <JobCard
                        job={job}
                        isFlipped={flippedCards.includes(job._id)}
                        onToggleFlip={toggleCardFlip}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="fas fa-briefcase"
                title={searchTerm ? "No Jobs Found" : "No Jobs Available"}
                message={
                  searchTerm ? 
                    `No jobs found matching "${searchTerm}". Try different keywords.` :
                    "There are currently no active job listings. Please check back later or contact us for upcoming opportunities."
                }
                actionButton={
                  <button className="btn" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: '600', padding: '0.75rem 1.5rem'}}>
                    <i className="fas fa-bell me-2"></i>
                    Get Notified
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseJob;
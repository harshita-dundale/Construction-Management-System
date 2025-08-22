import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import "./BrowseJob.css";
//import { setCurrentJob } from "../../Pages/Redux/applicationsSlice";
import JobCard from "../../Components/cards/JobCard";

function BrowseJob() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
              <div className="hero-badge mb-3">
                <i className="fas fa-briefcase me-2"></i>
                Job Opportunities
              </div>
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
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Companies</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Workers Hired</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Jobs Section */}
      <div className="jobs-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Available Positions</h2>
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
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .browse-jobs-container {
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .jobs-hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8rem 0 4rem;
          position: relative;
          overflow: hidden;
        }
        
        .jobs-hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: rectangles 20s linear infinite;
        }
        
        .jobs-hero-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(90deg, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 40px, transparent 40px),
            linear-gradient(transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 40px, transparent 40px);
          background-size: 50px 50px;
          animation: rectangles 20s linear infinite reverse;
        }
        
        @keyframes rectangles {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.15);
          padding: 2rem 1.5rem;
          border-radius: 15px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .stat-card:nth-child(3) {
          grid-column: 1 / -1;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #667eea;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-top: 0.5rem;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #ffd700, #ffeb3b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          opacity: 0.9;
          line-height: 1.6;
          margin: 0;
        }
        
        .search-container {
          max-width: 100%;
        }
        
        .search-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .search-box {
          position: relative;
          background: white;
          border-radius: 50px;
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 1.5rem;
          color: #6c757d;
          z-index: 1;
          pointer-events: none;
        }
        
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          background: transparent;
          color: #2c3e50;
          cursor: text;
          user-select: text;
          z-index: 3;
          position: relative;
        }
        
        .search-input:focus {
          outline: none;
          border: none;
        }
        
        .search-input::placeholder {
          color: #6c757d;
        }
        
        .search-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .search-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .quick-stats {
          margin-top: 3rem;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #ffd700;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.5rem;
        }
        
        .jobs-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #6c757d;
          font-size: 1.1rem;
        }
        
        .filter-bar {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .results-count {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        
        .btn-filter {
          background: transparent;
          border: 2px solid #e9ecef;
          color: #6c757d;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-filter:hover,
        .btn-filter.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
        }
        
        .jobs-grid {
          margin-top: 2rem;
        }
        
        .job-card-wrapper {
          height: 100%;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          font-size: 3rem;
          color: white;
        }
        
        .empty-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .empty-description {
          color: #6c757d;
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
            text-align: center;
          }
          
          .hero-description {
            text-align: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            margin-top: 3rem;
          }
          
          .stat-card:nth-child(3) {
            grid-column: 1;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .filter-buttons {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .search-input {
            font-size: 0.9rem;
          }
          
          .search-btn {
            padding: 0.8rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default BrowseJob;
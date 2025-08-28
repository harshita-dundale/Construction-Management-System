import "./App.css";
import image1 from "../assets/images/photos/postjob.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobTitle,
  setDailyPayment,
  setStartDate,
  setEndDate,
  setLocation,
  setEmail,
  setPhoneNo,
  resetForm,
} from "../Pages/Redux/postJobSlice.js";
import { useState, useEffect } from "react";
import {
  selectProject, 
  fetchProjects, 
} from "../Pages/Redux/projectSlice.js";
import { useAuth0 } from "@auth0/auth0-react";

function PostJobForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postJob = useSelector((state) => state.postJob);
  // const [selectedImage, setSelectedImage] = useState(null);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const projects = useSelector((state) => state.project.projects);

  const { user } = useAuth0(); 

  useEffect(() => {
    if (projects.length === 0 && user?.sub) {
      dispatch(fetchProjects(user.sub)); 
    }
  }, [dispatch, projects, user?.sub]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject?._id) {
      toast.error("Please select a project before posting a job.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(postJob.startDate);
    const endDate = new Date(postJob.endDate);
    
    // Check if start date is in the past
    if (startDate < today) {
      toast.error("Start date cannot be in the past.");
      return;
    }
    
    // Check if end date is in the past
    if (endDate < today) {
      toast.error("End date cannot be in the past.");
      return;
    }
    
    // Check if end date is before start date
    if (endDate < startDate) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }
    
    // Check minimum 1 day gap between start and end date
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    if (dayDiff < 1) {
      toast.error("There must be at least 1 day gap between start and end date.");
      return;
    }
    const formData = new FormData();
    formData.append("title", postJob.jobTitle);
    //  formData.append("skillsRequired", postJob.skillsRequired);
    formData.append("salary", postJob.dailyPayment);
    formData.append("startDate", postJob.startDate);
    formData.append("endDate", postJob.endDate);
    formData.append("location", postJob.location);
    formData.append("PhoneNo", postJob.phoneNo);
    formData.append("Email", postJob.email);
    formData.append("projectId", selectedProject._id);
   

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" Server responded with error:", errorText);
        alert("Server error. Check console for details.");
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Job posted:", data);
        dispatch(resetForm());
        toast.success("Job Posted successfully!");
        //alert("Job Posted Successfully!");
      } else {
        const text = await response.text();
        console.warn(" Response is not JSON:", text);
        // alert("Unexpected response format from server.");
        toast.error("Server error. Try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to post job. Server might be down.");
    }
  };

  return (
    <div className="post-job-wrapper">
       <Header />
       
       {/* Hero Section */}
       <div className="post-job-hero">
         <div className="container">
           <div className="text-center">
             <div className="hero-badge mb-3">
               <i className="fas fa-briefcase me-2"></i>
               Job Posting
             </div>
             <h1 className="hero-title">Create New Job Opportunity</h1>
             <p className="hero-subtitle">Connect with skilled workers for your construction projects</p>
           </div>
         </div>
       </div>
    
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="post-job-card">
            <div className="card-header">
              <button
                className="btn-back mb-3"
                onClick={() => navigate("/Project_pannel ")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
              <h2 className="form-title">Job Details</h2>
              <p className="form-subtitle">Fill in the information below to post your job</p>
            </div>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-project-diagram me-2"></i>
                  Project Information
                </h3>
                
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-folder me-2"></i>
                    Select Project
                  </label>
                  <select
                    className="form-control modern-select"
                    value={selectedProject?._id || ""}
                    onChange={(e) => {
                      const selected = projects.find(
                        (p) => p._id === e.target.value
                      );
                      dispatch(selectProject(selected));
                    }}
                    required
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-briefcase me-2"></i>
                  Job Details
                </h3>
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-tag me-2"></i>
                        Job Title
                      </label>
                      <input
                        type="text"
                        className="form-control modern-input"
                        placeholder="e.g., Construction Worker, Electrician"
                        value={postJob.jobTitle}
                        onChange={(e) => dispatch(setJobTitle(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-rupee-sign me-2"></i>
                        Daily Payment
                      </label>
                      <input
                        type="number"
                        className="form-control modern-input"
                        placeholder="₹ Amount"
                        value={postJob.dailyPayment}
                        onChange={(e) => dispatch(setDailyPayment(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-calendar me-2"></i>
                  Timeline
                </h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-play me-2"></i>
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control modern-input"
                        value={postJob.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => dispatch(setStartDate(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-stop me-2"></i>
                        End Date
                      </label>
                      <input
                        type="date"
                        className="form-control modern-input"
                        value={postJob.endDate}
                        min={postJob.startDate ? new Date(new Date(postJob.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        onChange={(e) => dispatch(setEndDate(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-address-card me-2"></i>
                  Contact Information
                </h3>
                
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Job Location
                  </label>
                  <input
                    type="text"
                    className="form-control modern-input"
                    placeholder="Enter job site location"
                    value={postJob.location}
                    onChange={(e) => dispatch(setLocation(e.target.value))}
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-envelope me-2"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control modern-input"
                        placeholder="your@email.com"
                        value={postJob.email}
                        onChange={(e) => dispatch(setEmail(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-phone me-2"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control modern-input"
                        placeholder="10-digit phone number"
                        value={postJob.phoneNo}
                        onChange={(e) => dispatch(setPhoneNo(e.target.value))}
                        pattern="\d{10}"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </div> */}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary-action"
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Post Job
                </button>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => dispatch(resetForm())}
                >
                  <i className="fas fa-redo me-2"></i>
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    
    <style jsx>{`
      .post-job-wrapper {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding-top: 80px;
      }
      
      .post-job-hero {
        background: white;
        padding: 6rem 0 3rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .hero-badge {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      .hero-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      
      .hero-subtitle {
        font-size: 1.1rem;
        color: #6c757d;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .post-job-card {
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      
      .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        text-align: center;
      }
      
      .btn-back {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }
      
      .btn-back:hover {
        background: rgba(255, 255, 255, 0.3);
        color: white;
        transform: translateY(-2px);
      }
      
      .form-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .form-subtitle {
        opacity: 0.9;
        margin-bottom: 0;
      }
      
      .job-form {
        padding: 2rem;
      }
      
      .form-section {
        margin-bottom: 2.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e9ecef;
      }
      
      .form-section:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
      }
      
      .section-title i {
        color: #667eea;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-label {
        font-weight: 600;
        color: #495057;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
      }
      
      .form-label i {
        color: #667eea;
        width: 16px;
      }
      
      .modern-input,
      .modern-select {
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f8f9fa;
      }
      
      .modern-input:focus,
      .modern-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: white;
        outline: none;
      }
      
      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        padding-top: 2rem;
        border-top: 1px solid #e9ecef;
      }
      
      .btn-primary-action {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .btn-primary-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        color: white;
      }
      
      .btn-secondary-action {
        background: transparent;
        color: #6c757d;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      
      .btn-secondary-action:hover {
        background: #f8f9fa;
        border-color: #6c757d;
        color: #495057;
        transform: translateY(-2px);
      }
      
      @media (max-width: 768px) {
        .post-job-hero {
          padding: 5rem 0 2rem;
        }
        
        .hero-title {
          font-size: 2rem;
        }
        
        .job-form {
          padding: 1.5rem;
        }
        
        .card-header {
          padding: 1.5rem;
        }
        
        .form-actions {
          flex-direction: column;
          align-items: center;
        }
        
        .btn-primary-action,
        .btn-secondary-action {
          width: 100%;
          max-width: 250px;
        }
      }
    `}</style>
    </div>
  );
}
export default PostJobForm;
const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};
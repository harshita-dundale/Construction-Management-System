import "./App.css";
import image1 from "../assets/images/photos/postjob.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";
import BackButton from "../Components/BackButton";
import "./PostJobForm.css"
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
    
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="post-job-card">
            <div className="card-header">
              <BackButton to="/Project_pannel" />
              <h2 className="form-title">Job Details</h2>
              <p className="form-subtitle">Fill in the information below to post your job</p>
            </div>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="post-form-section">
                <h3 className="post-title">
                  <i className="fas fa-project-diagram me-2"></i>
                  Project Information
                </h3>
                
                <div className="post-form-group">
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
                      // Auto-fill fields from selected project
                      if (selected) {
                        if (selected.location) {
                          dispatch(setLocation(selected.location));
                        }
                        if (selected.email) {
                          dispatch(setEmail(selected.email));
                        }
                        if (selected.phoneNumber) {
                          dispatch(setPhoneNo(selected.phoneNumber));
                        }
                      }
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

              <div className="post-form-section">
                {/* <h3 className="section-title">
                  <i className="fas fa-briefcase me-2"></i>
                  Job Details
                </h3> */}
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="post-form-group">
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
                    <div className="post-form-group">
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

              <div className="post-form-section">
                {/* <h3 className="section-title">
                  <i className="fas fa-calendar me-2"></i>
                  Timeline
                </h3> */}
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="post-form-group">
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
                    <div className="post-form-group">
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

              <div className="post-form-section">
                {/* <h3 className="section-title">
                  <i className="fas fa-address-card me-2"></i>
                  Contact Information
                </h3> */}
                
                <div className="post-form-group">
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
                
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="post-form-group">
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
                    <div className="post-form-group">
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

              {/* <div className="post-form-group mb-3">
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
    </div>
  );
}
export default PostJobForm;

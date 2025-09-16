import "./App.css";
import image1 from "../assets/images/photos/postjob.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
// import BackButton from "../Components/BackButton";
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projects.length === 0 && user?.sub) {
      dispatch(fetchProjects(user.sub)); 
    }
  }, [dispatch, projects, user?.sub]);

  // Auto-fill from selected project
  useEffect(() => {
    if (selectedProject) {
      if (selectedProject.location && !postJob.location) {
        dispatch(setLocation(selectedProject.location));
      }
      if (selectedProject.email && !postJob.email) {
        dispatch(setEmail(selectedProject.email));
      }
      if (selectedProject.phoneNumber && !postJob.phoneNo) {
        dispatch(setPhoneNo(selectedProject.phoneNumber));
      }
    }
  }, [selectedProject, dispatch, postJob.location, postJob.email, postJob.phoneNo]);

  const validateField = (field, value) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'jobTitle':
        if (!value.trim()) {
          errors.jobTitle = 'Job title is required';
        } else if (value.trim().length < 3) {
          errors.jobTitle = 'Job title must be at least 3 characters';
        } else if (value.trim().length > 100) {
          errors.jobTitle = 'Job title must be less than 100 characters';
        } else {
          delete errors.jobTitle;
        }
        break;
        
      case 'dailyPayment':
        if (!value.trim()) {
          errors.dailyPayment = 'Daily payment is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          errors.dailyPayment = 'Enter a valid positive amount';
        } else if (parseFloat(value) < 100) {
          errors.dailyPayment = 'Minimum daily payment should be ₹100';
        } else if (parseFloat(value) > 50000) {
          errors.dailyPayment = 'Daily payment seems too high';
        } else {
          delete errors.dailyPayment;
        }
        break;
        
      case 'location':
        if (!value.trim()) {
          errors.location = 'Job location is required';
        } else if (value.trim().length < 5) {
          errors.location = 'Location must be at least 5 characters';
        } else {
          delete errors.location;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors.email = 'Enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'phoneNo':
        if (!value.trim()) {
          errors.phoneNo = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          errors.phoneNo = 'Enter valid 10-digit Indian mobile number';
        } else {
          delete errors.phoneNo;
        }
        break;
        
      case 'startDate':
        if (!value) {
          errors.startDate = 'Start date is required';
        } else if (new Date(value) < new Date().setHours(0,0,0,0)) {
          errors.startDate = 'Start date cannot be in the past';
        } else {
          delete errors.startDate;
        }
        break;
        
      case 'endDate':
        if (value && postJob.startDate && new Date(value) <= new Date(postJob.startDate)) {
          errors.endDate = 'End date must be after start date';
        } else {
          delete errors.endDate;
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value, dispatchAction) => {
    dispatch(dispatchAction(value));
    validateField(field, value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedProject?._id) {
      toast.error("Please select a project before posting a job.");
      setIsSubmitting(false);
      return;
    }

    // Validate all fields
    const fieldsToValidate = ['jobTitle', 'dailyPayment', 'location', 'email', 'phoneNo', 'startDate'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const fieldValue = postJob[field] || (field === 'startDate' ? postJob.startDate : '');
      const fieldValid = validateField(field, fieldValue);
      if (!fieldValid) isValid = false;
    });
    
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      setIsSubmitting(false);
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
        setFieldErrors({});
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
      toast.error("Failed to post job. Server might be down.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-job-wrapper">
       <Header />
       <Sidebar />
       
       {/* Hero Section */}
       {/* <div className="post-job-hero">
         <div className="container">
           <div className="text-center">
             <div className="hero-badge mb-3">
               <i className="fas fa-briefcase me-2"></i>
               Job Posting
             </div>
             <h3 className="hero-title">Create New Job Opportunity</h3>
             <p className="hero-subtitle">Connect with skilled workers for your construction projects</p>
           </div>
         </div>
       </div>
     */}
    <div className="container mt-5 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="post-job-card">
            <div className="card-header">
              {/* <BackButton to="/Project_pannel" /> */}
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
                      // Auto-fill will happen via useEffect
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
                        className={`form-control modern-input ${fieldErrors.jobTitle ? 'is-invalid' : ''}`}
                        placeholder="e.g., Construction Worker, Electrician"
                        value={postJob.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value, setJobTitle)}
                        required
                      />
                      {fieldErrors.jobTitle && <div className="field-error">{fieldErrors.jobTitle}</div>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="post-form-group">
                      <label className="form-label">
                        <i className="fas fa-rupee-sign me-2"></i>
                        Daily Payment
                      </label>
                      <input
                        // type="number"
                        className={`form-control modern-input ${fieldErrors.dailyPayment ? 'is-invalid' : ''}`}
                        placeholder="₹ Amount"
                        value={postJob.dailyPayment}
                        onChange={(e) => handleInputChange('dailyPayment', e.target.value, setDailyPayment)}
                        min="100"
                        max="50000"
                        required
                      />
                      {fieldErrors.dailyPayment && <div className="field-error">{fieldErrors.dailyPayment}</div>}
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
                        className={`form-control modern-input ${fieldErrors.startDate ? 'is-invalid' : ''}`}
                        value={postJob.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleInputChange('startDate', e.target.value, setStartDate)}
                        required
                      />
                      {fieldErrors.startDate && <div className="field-error">{fieldErrors.startDate}</div>}
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
                        className={`form-control modern-input ${fieldErrors.endDate ? 'is-invalid' : ''}`}
                        value={postJob.endDate}
                        min={postJob.startDate ? new Date(new Date(postJob.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        onChange={(e) => handleInputChange('endDate', e.target.value, setEndDate)}
                      />
                      {fieldErrors.endDate && <div className="field-error">{fieldErrors.endDate}</div>}
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
                    className={`form-control modern-input ${fieldErrors.location ? 'is-invalid' : ''}`}
                    placeholder="Enter job site location"
                    value={postJob.location}
                    onChange={(e) => handleInputChange('location', e.target.value, setLocation)}
                    required
                  />
                  {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}
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
                        className={`form-control modern-input ${fieldErrors.email ? 'is-invalid' : ''}`}
                        placeholder="your@email.com"
                        value={postJob.email}
                        onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                        required
                      />
                      {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
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
                        className={`form-control modern-input ${fieldErrors.phoneNo ? 'is-invalid' : ''}`}
                        placeholder="10-digit phone number"
                        value={postJob.phoneNo}
                        onChange={(e) => handleInputChange('phoneNo', e.target.value, setPhoneNo)}
                        pattern="\d{10}"
                        maxLength="10"
                        required
                      />
                      {fieldErrors.phoneNo && <div className="field-error">{fieldErrors.phoneNo}</div>}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Posting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Post Job
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => {
                    dispatch(resetForm());
                    setFieldErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-redo me-2"></i>
                  Reset Form
                </button>
                
                <style dangerouslySetInnerHTML={{__html: `
                  .field-error {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: flex;
                    align-items: center;
                  }
                  
                  .field-error::before {
                    content: '⚠';
                    margin-right: 0.5rem;
                    font-size: 0.75rem;
                  }
                  
                  .modern-input.is-invalid,
                  .modern-select.is-invalid {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                  }
                  
                  .modern-input.is-invalid:focus,
                  .modern-select.is-invalid:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                  }
                  
                  .btn-primary-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                  }
                  
                  .btn-secondary-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                  }
                `}} />
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
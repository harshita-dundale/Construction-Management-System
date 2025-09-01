import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setFullName,
  setPhoneNo,
  setExperience,
  resetForm,
} from "../Redux/ApplyJobSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function ApplyForm() {
  const dispatch = useDispatch();
  const currentJob = useSelector((state) => state.applications.currentJob);
  const applyJob = useSelector((state) => state.applyJob);
  const [submitStatus, setSubmitStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Clear form first, then auto-fill from user profile
  useEffect(() => {
    dispatch(resetForm());
  }, [dispatch]);

  // Auto-fill from user profile data
  useEffect(() => {
    const autoFillFromProfile = async () => {
      if (!user?.email) return;

      // Auto-fill name from Auth0
      if (user.name) {
        dispatch(setFullName(user.name));
      }

      try {
        // Get user profile data
        const encodedEmail = encodeURIComponent(user.email);
        const response = await fetch(`http://localhost:5000/api/auth/get-user/${encodedEmail}`);
        
        if (response.ok) {
          const userData = await response.json();
          
          // Auto-fill phone from profile
          if (userData.phoneNo) {
            dispatch(setPhoneNo(userData.phoneNo));
          }
          
          // Auto-fill experience from profile
          if (userData.experience) {
            dispatch(setExperience(userData.experience.toString()));
          }
        }
      } catch (error) {
        console.log('Could not fetch user profile for auto-fill');
        // Form stays with just Auth0 name filled
      }
    };

    if (user && isAuthenticated) {
      autoFillFromProfile();
    }
  }, [user, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!currentJob?._id) {
      toast.error("Job ID not found. Please try again.");
      navigate("/browse-Job");
    }
  }, [currentJob, navigate]);
  
  if (isLoading) return <div>Loading user...</div>;

  const jobId = currentJob?._id;
  
  if (!jobId) {
    toast.error("Job ID not found. Please try again.");
    return;
  }

  // Phone number validation function
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      return "Phone number is required";
    }
    if (phone.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  // Handle phone number change with validation
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      dispatch(setPhoneNo(value));
      setPhoneError(validatePhoneNumber(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number before submission
    const phoneValidationError = validatePhoneNumber(applyJob.phoneNo);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      toast.error(phoneValidationError);
      return;
    }

    // ✅ More Reliable Check
    if (!isAuthenticated || !user || !user.email) {
      alert("User not logged in or email not found!");
      return;
    }

    const payload = {
      userId: user._id,
      name: applyJob.fullName,
      email: user.email,
      phoneNo: applyJob.phoneNo,
      experience: applyJob.experience,
      jobId,
      projectId: currentJob.projectId,
      appliedAt: new Date().toISOString(),
      status: "under_review",
    };
    try {
      const response = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setSubmitStatus("Failed to submit application.");
        return;
      }
      toast.success("Application submitted successfully!");
      dispatch(resetForm());
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="apply-form-wrapper">
        <div className="container-fluid px-0">
          <div className="row g-0 min-vh-100">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <div className="form-container">
                <div className="form-header">
                  {/* <button
                    className="btn-back"
                    onClick={() => navigate("/browse-Job")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Jobs
                  </button>
                   */}

                   <button
                    className="btn-back mb-3"
                    onClick={() => navigate("/browse-Job")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Jobs
                  </button>
                  <div className="form-title-section text-center mt-3">
                    <h1 className="form-title mb-4">Apply for Position</h1>
                    {currentJob && (
                      <div className="job-info-card">
                        <div className="job-badge">
                          <i className="fas fa-briefcase me-2"></i>
                          {currentJob.title}
                        </div>
                        <div className="job-salary">
                          <i className="fas fa-rupee-sign me-1"></i>
                          {currentJob.salary}/day
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={applyJob.fullName}
                      onChange={(e) => dispatch(setFullName(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${phoneError ? 'error' : ''}`}
                      placeholder="Enter 10-digit phone number"
                      value={applyJob.phoneNo}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      required
                    />
                    {phoneError && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {phoneError}
                      </div>
                    )}
                    <div className="input-hint">
                      <i className="fas fa-info-circle me-1"></i>
                      Enter a valid 10-digit Indian mobile number
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-medal me-2"></i>
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Years of experience"
                      value={applyJob.experience}
                      onChange={(e) => dispatch(setExperience(e.target.value))}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      <i className="fas fa-paper-plane me-2"></i>
                      Submit Application
                    </button>
                    <button
                      type="button"
                      className="reset-btn"
                      onClick={() => dispatch(resetForm())}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Reset Form
                    </button>
                  </div>

                  {submitStatus && (
                    <div className="status-message">
                      <i className="fas fa-info-circle me-2"></i>
                      {submitStatus}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .apply-form-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .image-container {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
        }
        
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }
        
        .form-input.error {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
        }
        
        .input-hint {
          color: #6c757d;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
        }
        
        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }
        
        .circle-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .circle-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .circle-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .main-image {
          max-width: 400px;
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
        }
        
        .image-overlay {
          color: white;
        }
        
        .overlay-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .overlay-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .form-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .btn-back {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          margin-bottom: 2rem;
        }
        
        .btn-back:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }
        
        .form-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .job-info-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0.4rem 2rem;
          border-radius: 15px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .job-badge {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .job-salary {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.3rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .modern-form {
          background: white;
          padding: 1.3rem;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          background: #f8f9fa;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .submit-btn {
          flex: 2;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .reset-btn {
          flex: 1;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          color: #6c757d;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
        }
        
        .reset-btn:hover {
          background: #e9ecef;
          color: #495057;
          transform: translateY(-2px);
        }
        
        .status-message {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-top: 1.5rem;
          font-weight: 500;
        }
        
        @media (max-width: 576px) {
          .form-actions {
            flex-direction: column;
          }
          
          .job-info-card {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .modern-form {
            padding: 1.5rem;
          }
        }
      `}} />
    </>
  );
}

export default ApplyForm;
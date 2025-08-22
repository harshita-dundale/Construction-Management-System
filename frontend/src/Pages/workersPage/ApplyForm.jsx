import React, { useState } from "react";
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
import image1 from "../../assets/images/photos/postjob.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function ApplyForm() {
  const dispatch = useDispatch();
  const currentJob = useSelector((state) => state.applications.currentJob);
  const applyJob = useSelector((state) => state.applyJob);
  const [submitStatus, setSubmitStatus] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!currentJob?._id) {
      toast.error("Job ID not found. Please try again.");
      navigate("/browse-Job");
    }
  }, [currentJob, navigate]);
  
  if (isLoading) return <div>Loading user...</div>;

  const jobId = currentJob?._id;

  // useEffect(() => {
  //   if (!jobId) {
  //     toast.error("Job ID not found. Please try again.");
  //     navigate("/browse-Job");
  //   }
  // }, [jobId, navigate]);
  
  if (!jobId) {
    toast.error("Job ID not found. Please try again.");
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ More Reliable Check
    if (!isAuthenticated || !user || !user.email) {
      alert("User not logged in or email not found!");
      return;
    }
   // console.log("🔍 projectId in currentJob:", currentJob?.projectId);
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
    <div className="container my-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-7 text-center">
          <img
            src={image1}
            className="img-fluid rounded"
            alt="Apply"
            style={{ maxWidth: "100%" }}
          />
        </div>

        <div
          className="col-md-5 p-5 rounded shadow"
          style={{ backgroundColor: "#e0f7fa" }}
        >
          <button
            className="btn mb-4"
            onClick={() => navigate("/browse-Job")}
            style={buttonStyle}
          >
            Back 
          </button>
          <h2 className="mb-4 text-center fw-bold text-dark">Apply for Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="fw-bold text-dark">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={applyJob.fullName}
                onChange={(e) => dispatch(setFullName(e.target.value))}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold text-dark">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit phone number"
                value={applyJob.phoneNo}
                onChange={(e) => dispatch(setPhoneNo(e.target.value))}
                pattern="\d{10}"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="fw-bold text-dark">Experience (years)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter years of experience"
                value={applyJob.experience}
                onChange={(e) => dispatch(setExperience(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn me-2" style={buttonStyle}>
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => dispatch(resetForm())}
              >
                Reset Form
              </button>
            </div>

            {submitStatus && (
              <div className="alert alert-info mt-3" role="alert">
                {submitStatus}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyForm;

const buttonStyle = {
  backgroundColor: "#0c1f26",
  color: "#ffffff",
  border: "none",
  padding: "10px 20px",
  fontWeight: "bold",
  borderRadius: "4px",
  transition: "0.3s ease",
};
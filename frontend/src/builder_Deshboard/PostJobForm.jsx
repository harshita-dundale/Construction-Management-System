import './App.css';
import image1 from '../assets/images/photos/postjob.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify"; 

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setJobTitle,
//setSkillsRequired,
  setDailyPayment,
  setStartDate,
  setEndDate,
  setLocation,
  setEmail,
  setPhoneNo,
  resetForm,
} from '../Pages/Redux/postJobSlice.js';
import { useState } from 'react';

function PostJobForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postJob = useSelector((state) => state.postJob);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", postJob.jobTitle);
    formData.append("skillsRequired", postJob.skillsRequired);
    formData.append("salary", postJob.dailyPayment);
    formData.append("startDate", postJob.startDate);
    formData.append("endDate", postJob.endDate);
    formData.append("location", postJob.location);
    formData.append("PhoneNo", postJob.phoneNo);
    formData.append("Email", postJob.email);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

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
    <div className="container">
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="post-job pt-4">
            <button
              className="btn mb-4"
              onClick={() => navigate("/Builder-Dashboard")}
              style={buttonStyle}
            >
              Back
            </button>
            <h1 style={{ fontWeight: "bold" }}>Post a Job</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter job title"
                  value={postJob.jobTitle}
                  onChange={(e) => dispatch(setJobTitle(e.target.value))}
                  required
                />
              </div>
              
              {/* <div className="form-group mb-3">
                <label htmlFor="skills-required" style={{ fontWeight: "bold" }}>Skills Required</label>
                <select
                  className="form-control"
                  value={postJob.skillsRequired}
                  onChange={(e) => dispatch(setSkillsRequired(e.target.value))}>
                  <option value="masonry">Masonry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="electrician">Electrician</option>
                </select>
              </div> */}
              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Daily Payment</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter daily payment"
                  value={postJob.dailyPayment}
                  onChange={(e) => dispatch(setDailyPayment(e.target.value))}
                />
              </div>

              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={postJob.startDate}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={postJob.endDate}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                />
              </div>

              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter location"
                  value={postJob.location}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={postJob.email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit phone number"
                  value={postJob.phoneNo}
                  onChange={(e) => dispatch(setPhoneNo(e.target.value))}
                  pattern="\d{10}"
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label style={{ fontWeight: "bold" }}>Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </div>

              <div className="d-flex justify-content-end mb-3 pb-3">
                <button type="submit" className="btn btn-light me-2" style={buttonStyle}>
                  Post Job
                </button>
                <button
                  type="reset"
                  className="btn btn-danger"
                  onClick={() => dispatch(resetForm())}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center">
          <img src={image1} className="img-fluid" alt="Post job" />
        </div>
      </div>
    </div>
  );
}
export default PostJobForm;
const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};
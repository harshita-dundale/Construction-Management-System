
import './App.css';
 import image1 from '../assets/images/photos/postjob.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setJobTitle,
  setSkillsRequired,
  setDailyPayment,
  setStartDate,
  setEndDate,
  setLocation,
  setEmail,
  setPhoneNo,
  resetForm,
} from '../Pages/Redux/postJobSlice.js';

function PostJobForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postJob = useSelector((state) => state.postJob);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', postJob);
  };

  return (
    <div className="container">
      {/* <div className="row">
        <div className="d-flex align-item-center justify-content-start mt-4 mb-0">
      <button
              className="btn btn-light"
              style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--secondary-color)")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--primary-color)")}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
            </div>
      </div> */}
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="post-job pt-4">

            <h1 style={{ fontWeight: "bold" }}>Post a Job</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="job-title" style={{ fontWeight: "bold" }}>Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  className="form-control"
                  placeholder="Enter job title"
                  style={{ fontStyle: "italic" }}
                  value={postJob.jobTitle}
                  onChange={(e) => dispatch(setJobTitle(e.target.value))}
                />
              </div>
              
              {/* <div className="form-group mb-3">
                <label htmlFor="skills-required" style={{ fontWeight: "bold" }}>Skills Required</label>
                <select
                  id="skills-required"
                  name="skills-required"
                  className="form-control"
                  value={postJob.skillsRequired}
                  onChange={(e) => dispatch(setSkillsRequired(e.target.value))}
                >
                  <option value="masonry">Masonry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="electrician">Electrician</option>
                </select>
              </div> */}
              
              <div className="form-group mb-3">
                <label htmlFor="daily-payment" style={{ fontWeight: "bold" }}>Daily Payment</label>
                <input
                  type="text"
                  id="daily-payment"
                  name="daily-payment"
                  className="form-control"
                  placeholder="Enter daily payment"
                  style={{ fontStyle: "italic" }}
                  value={postJob.dailyPayment}
                  onChange={(e) => dispatch(setDailyPayment(e.target.value))}
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="start-date" style={{ fontWeight: "bold" }}>Start Date</label>
                <input
                  type="text"
                  id="start-date"
                  name="start-date"
                  className="form-control"
                  placeholder="dd-mm-yyyy"
                  style={{ fontStyle: "italic" }}
                  value={postJob.startDate}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="end-date" style={{ fontWeight: "bold" }}>End Date</label>
                <input
                  type="text"
                  id="end-date"
                  name="end-date"
                  className="form-control"
                  placeholder="dd-mm-yyyy"
                  style={{ fontStyle: "italic" }}
                  value={postJob.endDate}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="location" style={{ fontWeight: "bold" }}>Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  placeholder="Enter job location"
                  style={{ fontStyle: "italic" }}
                  value={postJob.location}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                />
              </div>
              
              {/* <div className="form-group mb-3">
                <label htmlFor="email" style={{ fontWeight: "bold" }}>Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  style={{ fontStyle: "italic" }}
                  value={postJob.email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                />
              </div> */}
              
              <div className="form-group mb-3">
                <label htmlFor="phone-no" style={{ fontWeight: "bold" }}>Phone Number</label>
                <input
                  type="tel"
                  id="phone-no"
                  name="phone-no"
                  className="form-control"
                  placeholder="Enter your phone number"
                  style={{ fontStyle: "italic" }}
                  value={postJob.phoneNo}
                  onChange={(e) => dispatch(setPhoneNo(e.target.value))}
                  pattern="\d{10}"
                  maxLength="10"
                  required
                />
                <small className="form-text text-muted">Phone number must be 10 digits.</small>
              </div>
              <div className="d-flex justify-content-end mb-3 pb-3">
              <button type="submit" className="btn btn-light me-2"  style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--secondary-color)")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--primary-color)")}>
                Post Job</button>

              <button type="reset" className="btn btn-danger" onClick={() => dispatch(resetForm())}>
                Reset Form </button> 
                </div>
            </form>
          </div>
        </div>
        <div className="col-lg-6 d-flex align-items-center">
          <img src={image1}  className="img-fluid" alt="Responsive Job Post Illustration" />
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

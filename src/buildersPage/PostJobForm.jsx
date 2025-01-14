// import './App.css';
//import image1 from '../assets/images/photos/image1.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function PostJobForm() {
  return (
    <div className="container py-5 my-5">
      <div className="row align-items-center">
        {/* Form Section */}
        <div className="col-lg-6 mb-4 mb-lg-0  ">
          <div className="post-job pt-5 ">
            <h1>Post a Job</h1>
            <form>
              <div className="form-group mb-3 ">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  className="form-control"
                  placeholder="Enter job title"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="skills-required">Skills Required</label>
                <select id="skills-required" name="skills-required" className="form-control">
                  <option value="masonry">Masonry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="electrician">Electrician</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="daily-payment">Daily Payment</label>
                <input
                  type="text"
                  id="daily-payment"
                  name="daily-payment"
                  className="form-control"
                  placeholder="Enter daily payment"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="text"
                  id="start-date"
                  name="start-date"
                  className="form-control"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="text"
                  id="end-date"
                  name="end-date"
                  className="form-control"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  placeholder="Enter job location"
                />
              </div>
              <button type="submit" className="btn btn-primary me-2">Post Job</button>
              <button type="reset" className="btn btn-secondary">Reset Form</button>
            </form>
          </div>
        </div>
        {/* Image Section */}
        <div className="col-lg-6 text-center">
          <img src="" className="img-fluid" alt="Responsive Job Post Illustration" />
        </div>
      </div>
    </div>
  );
}

export default PostJobForm;
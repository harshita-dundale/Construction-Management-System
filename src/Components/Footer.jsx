// import React from 'react'
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram"
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer() {
  return (
    <>
      <footer className="text-white py-5" style={{ backgroundColor: "#051821" }}>
        <div className="container">
          <div className="text-center mb-4">
            <h5>Connecting Builders and Workers for Seamless Project Execution</h5>
            <p>
              Bridging the gap between builders and workers with a streamlined solution for collaboration and workforce management.
            </p>
          </div>
          <div className="row text-center mb-4 mt-4">
            <div className="col-md-4">
              <h6>Contact Us</h6>
              <p>Phone: +91 9325411885</p>
              <p>Email: harshitad.bca2023@ssism.org</p>
              <p>Address: 123, Sandalpur, Dewas, India</p>
            </div>
            <div className="col-md-4">
              <h6>For Builders</h6>
              <ul className="list-unstyled">
                <li><a href="#login" className="text-white text-decoration-none">Hire Workers</a></li>
                <li><a href="#login" className="text-white text-decoration-none">Manage Material</a></li>
                <li><a href="#login" className="text-white text-decoration-none">Profit/Loss Analysis</a></li>
                <li><a href="#login" className="text-white text-decoration-none">Manage Workers</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6>For Workers</h6>
              <ul className="list-unstyled">
                <li><a href="#login" className="text-white text-decoration-none">Apply for Jobs</a></li>
                <li><a href="#login" className="text-white text-decoration-none">View Attendance</a></li>
                <li><a href="#login" className="text-white text-decoration-none">Track Payments</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-white">
            <h5>Stay Connected :</h5>
            <a href="https://facebook.com" className="me-3">
            <FontAwesomeIcon icon={faFacebook} style={{height:"1.8vw", color:"white"}}/>   
            {/* <FontAwesomeIcon icon="fa-brands fa-facebook" />*/}
            </a>
            <a href="https://twitter.com" className="me-3">
            <FontAwesomeIcon icon={faTwitter} style={{height:"1.8vw", color:"white"}}/>
            {/* <FontAwesomeIcon icon="fa-brands fa-square-twitter" />  */}
            </a>
            <a href="https://linkedin.com" className="me-3"> 
            <FontAwesomeIcon icon={faLinkedin} style={{height:"1.8vw", color:"white"}}/>
            {/* <FontAwesomeIcon icon="fa-brands fa-linkedin" />  */}
            </a>
            <a href="https://instagram.com" className="">
              <FontAwesomeIcon icon={faInstagram} style={{height:"1.8vw", color:"white"}}/> 
            {/* <FontAwesomeIcon icon="fa-brands fa-instagram" />  */}
            </a>
          </div>
          <div className="text-center mt-4">
          <p className="mb-0">© 2024 ConstructHub. All Rights Reserved.</p>
        </div>
        </div>
      </footer>
    </>
  )
}

export default Footer


import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram"
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer() {
  return (
    <>
      <footer className="modern-footer">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="container">
            {/* Brand Section */}
            <div className="footer-brand text-center mb-5">
              <h3 className="brand-title">
                <i className="fas fa-hard-hat me-3"></i>
                ConstructHub
              </h3>
              <p className="brand-description">
                Connecting Builders and Workers for Seamless Project Execution
              </p>
            </div>

            {/* Footer Content Grid */}
            <div className="row g-2">
              {/* Contact Section */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <h5 className="section-title">Contact Us</h5>
                  </div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="fas fa-mobile-alt me-3"></i>
                      <span>+91 9325411885</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-envelope me-3"></i>
                      <span>harshitad.bca2023@ssism.org</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-map-marker-alt me-3"></i>
                      <span>123, Sandalpur, Dewas, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Builder Services */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-section">
                  <div className="section-header">
                    <div className="section-icon builder-icon">
                      <i className="fas fa-hard-hat"></i>
                    </div>
                    <h5 className="section-title">Builder Services</h5>
                  </div>
                  <ul className="service-links">
                    <li><a href="/builder-dashboard"><i className="fas fa-users me-2"></i>Hire Workers</a></li>
                    <li><a href="/materialmanagement"><i className="fas fa-boxes me-2"></i>Manage Material</a></li>
                    <li><a href="/profitandcostanalysis"><i className="fas fa-chart-line me-2"></i>Profit/Loss Analysis</a></li>
                    <li><a href="/hiredworkers"><i className="fas fa-user-cog me-2"></i>Manage Workers</a></li>
                  </ul>
                </div>
              </div>

              {/* Worker Services */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-section">
                  <div className="section-header">
                    <div className="section-icon worker-icon">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <h5 className="section-title">Worker Services</h5>
                  </div>
                  <ul className="service-links">
                    <li><a href="/browse-job"><i className="fas fa-briefcase me-2"></i>Apply for Jobs</a></li>
                    <li><a href="/attendances"><i className="fas fa-calendar-check me-2"></i>View Attendance</a></li>
                    <li><a href="/attendances"><i className="fas fa-wallet me-2"></i>Track Payments</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Copyright Section */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <div className="social-section">
                  <h6 className="social-title">Stay Connected</h6>
                  <div className="social-links">
                    <a href="https://facebook.com" className="social-link facebook">
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://twitter.com" className="social-link twitter">
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://linkedin.com" className="social-link linkedin">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="https://instagram.com" className="social-link instagram">
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="copyright">
                  <p className="mb-0">
                    <i className="fas fa-copyright me-2"></i>
                    2024 ConstructHub. All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        

        
        .footer-main {
          position: relative;
          z-index: 2;
          padding: 2rem 0 1rem;
        }
        
        .footer-brand {
          margin-bottom: 2rem;
        }
        
        .brand-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }
        
        .brand-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 500px;
          margin: 0 auto;
        }
        
        .footer-section {
          padding: 1rem 0;
          height: 100%;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .section-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        
        .builder-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .worker-icon {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          padding: 0.5rem 0;
          border-radius: 5px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .contact-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          padding-left: 0.5rem;
          transform: translateX(5px);
        }
        
        .service-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .service-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          border-radius: 5px;
        }
        
        .service-links a:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          padding-left: 0.5rem;
          transform: translateX(5px);
        }
        
        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }
        
        .social-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
        }
        
        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .social-link:hover {
          transform: translateY(-3px);
          color: white;
        }
        
        .facebook:hover {
          background: #3b5998;
          border-color: #3b5998;
        }
        
        .twitter:hover {
          background: #1da1f2;
          border-color: #1da1f2;
        }
        
        .linkedin:hover {
          background: #0077b5;
          border-color: #0077b5;
        }
        
        .instagram:hover {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          border-color: #bc1888;
        }
        
        .copyright {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
          .brand-title {
            font-size: 2rem;
          }
          
          .footer-section {
            padding: 1rem;
            text-align: center;
          }
          
          .section-header {
            justify-content: center;
          }
          
          .social-links {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .footer-bottom {
            text-align: center;
          }
          
          .footer-bottom .row > div {
            margin-bottom: 1rem;
          }
          
          .contact-info {
            align-items: center;
          }
        }
        
        @media (max-width: 576px) {
          .brand-title {
            font-size: 1.8rem;
          }
          
          .brand-description {
            font-size: 1rem;
          }
          
          .footer-section {
            padding: 0.75rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
          
          .contact-item {
            font-size: 0.9rem;
            justify-content: center;
            text-align: center;
          }
          
          .service-links a {
            font-size: 0.9rem;
            justify-content: center;
          }
          
          .social-link {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  )
}

export default Footer


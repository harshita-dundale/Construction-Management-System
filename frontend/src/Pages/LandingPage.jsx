import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cards1 from "../Components/cards/Cards1";
import Cards2 from "../Components/cards/Cards2";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "./LandingPage.css";
import homeImg from "../assets/images/photos/homeImg.png";
import aboutImg from "../assets/images/photos/aboutImg.png";
import { selectCardBuilder, selectCardWorker } from "./Redux/CardSlice";

function LandingPage() {
  const cardBuilder = useSelector(selectCardBuilder);
  const cardWorker = useSelector(selectCardWorker);
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleSeeMore = () => {
    const aboutSection = document.querySelector("#about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  };

  const getRouteFromTitle = (title) => {
    switch (title) {
      case "Job Management":
        return "/Project_pannel ";
      case "Worker Management":
        return "/hiredworkers";
      case "Material Management":
        return "/materialmanagement";
      case "Payroll":
        return "/payroll";
      case "Browse & Apply":
        return "/browse-job";
      case "Payment Management":
        return "/attendances";
      default:
        return "/";
    }
  };

  const handleCardClick = (title, expectedRole) => {
    const targetRoute = getRouteFromTitle(title);

    if (!isAuthenticated) {
      // Login ke baad specific page par redirect karne ke liye appState use karo
      loginWithRedirect({
        appState: { returnTo: targetRoute }
      });
      return;
    }

    const userRole = localStorage.getItem("userRole");
    if (!userRole) {
      navigate("/role-selection");
      return;
    }

    if (userRole.toLowerCase() !== expectedRole.toLowerCase()) {
      toast.error(`🚫 You are logged in as ${userRole}. Please select the correct role first.`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontWeight: "bold",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)"
        }
      });
      navigate("/role-selection");
      return;
    }

    // Direct specific page par navigate karo
    navigate(targetRoute);
  };

  return (
    <>
      <Header />
      <section className="landing-hero-section" id="home-section">
        <div className="container mt-3">
          <div className="row d-flex align-items-center min-vh-100 ">
            <div className="col-md-6 col-12 hero-content">
              {/* <div className="hero-badge mb-4">
                <i className="fas fa-hard-hat me-2"></i>
                Construction Management Platform
              </div> */}
              <h1 className="hero-title text-center text-md-start pt-5">
                Builders & Workers
                <span className="text-gradient"> Collaboration</span>
              </h1>
              <p className="hero-description mt-4 fs-5 text-center text-md-start">
                Welcome to our comprehensive Builder-Worker Management Platform, where construction meets efficiency. 
                Streamline your projects, manage your workforce, and boost productivity with our cutting-edge tools.
              </p>
              <div className="hero-buttons d-flex justify-content-center justify-content-md-start gap-3 mt-5">
                <button
                  onClick={handleGetStarted}
                  className="btn btn-hero-primary px-3 py-2"
                >
                  <i className="fas fa-rocket me-2"></i>
                  Get Started
                </button>
                <button
                  onClick={handleSeeMore}
                  className="btn btn-hero-secondary px-3 py-2"
                >
                  <i className="fas fa-info-circle me-2"></i>
                  Learn More
                </button>
              </div>
              
              {/* Stats */}
              <div className=" row mt-4 text-center text-md-start">
                <div className="col-4">
                  <div className="landing-number">500+</div>
                  <div className="landing-label">Projects</div>
                </div>
                <div className="col-4">
                  <div className="landing-number">1000+</div>
                  <div className="landing-label">Workers</div>
                </div>
                <div className="col-4">
                  <div className="landing-number">50+</div>
                  <div className="landing-label">Builders</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-12 text-center mt-md-0 pt-3">
              <div className="hero-image-container pt-5">
                <img
                  src={homeImg}
                  alt="Construction Management"
                  className="hero-image img-fluid"
                />
                <div className="floating-card card-1">
                  <i className="fas fa-chart-line text-success"></i>
                  <span>Real-time Analytics</span>
                </div>
                <div className="floating-card card-2">
                  <i className="fas fa-users text-primary"></i>
                  <span>Team Management</span>
                </div>
                <div className="floating-card card-3">
                  <i className="fas fa-mobile-alt text-warning"></i>
                  <span>Mobile Ready</span>
                </div>
              </div>
              
              {/* Mobile Feature Cards */}
              <div className="mobile-features d-block d-md-none mt-3">
                <div className="row g-2">
                  <div className="col-4">
                    <div className="mobile-feature-card">
                      <i className="fas fa-chart-line text-success"></i>
                      <span>Analytics</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mobile-feature-card">
                      <i className="fas fa-users text-primary"></i>
                      <span>Team Mgmt</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mobile-feature-card">
                      <i className="fas fa-mobile-alt text-warning"></i>
                      <span>Mobile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services-section">
        <div className="container">
          {/*<div className="services-hero text-center mb-5">
             <div className="services-badge">
              <i className="fas fa-tools me-2"></i>
              Our Services
            </div>
            <h2 className="services-main-title">
              Complete Construction
              <br />
              <span className="services-highlight">Management Suite</span>
            </h2>
            <p className="services-description">
              Everything you need to manage construction projects efficiently
            </p>
          </div> */}

          {/* Builder Services */}
          <div className="service-category mb-5">
            <div className="category-header text-center mb-4">
              <div className="category-icon">
                <i className="fas fa-hard-hat"></i>
              </div>
              <h2 className="category-title">Builder Services</h2>
              <p className="category-subtitle">Powerful tools for construction management</p>
            </div>
            <div className="row g-1 g-md-3 justify-content-center">
              {cardBuilder.map((card, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3">
                  <div className="service-card" onClick={() => handleCardClick(card.title, "builder")}>
                    <div className="service-card-header">
                      <img src={card.imgSrc} alt={card.title} className="service-icon" />
                    </div>
                    <div className="service-card-body">
                      <h5 className="service-title">{card.title}</h5>
                      <p className="service-description">{card.text}</p>
                      <button className="btn btn-service">
                        {card.buttonText}
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worker Services */}
          <div className="service-category">
            <div className="category-header text-center mb-4">
              <div className="category-icon worker-icon">
                <i className="fas fa-users"></i>
              </div>
              <h2 className="category-title">Worker Services</h2>
              <p className="category-subtitle">Essential tools for workforce management</p>
            </div>
            <div className="row g-1 g-md-3 justify-content-center">
              {cardWorker.map((card, index) => (
                <div key={index} className="col-12 col-md-6">
                  <div className="service-card worker-card" onClick={() => handleCardClick(card.title, "worker")}>
                    <div className="service-card-header">
                      <img src={card.imgSrc} alt={card.title} className="service-icon" />
                    </div>
                    <div className="service-card-body">
                      <h5 className="service-title">{card.title}</h5>
                      <p className="service-description">{card.text}</p>
                      <button className="btn btn-service worker-btn">
                        {card.buttonText}
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" id="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-12 text-center mb-5 mb-md-0">
              <div className="about-image-container">
                <img
                  src={aboutImg}
                  alt="About Construction Management"
                  className="about-image img-fluid"
                />
                {/* <div className="about-overlay">
                  <div className="landing-about">
                    <div className="about-stat">
                      <i className="fas fa-award"></i>
                      <span>5+ Years Experience</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            
            <div className="col-md-6 col-12">
              <div className="about-content">
                {/* <div className="section-badge mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  About Us
                </div> */}
                <h1 className="about-title">Building the Future of Construction Management</h1>
                <p className="about-description mt-4 fs-5">
                  At the heart of every successful construction project lies effective collaboration between builders and workers. 
                  Our platform bridges the gap, empowering builders to manage projects seamlessly and workers to showcase their skills efficiently.
                </p>
                
                <div className="about-features mt-4">
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-success me-3"></i>
                    <span>Cutting-edge project management tools</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-success me-3"></i>
                    <span>Real-time workforce coordination</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-success me-3"></i>
                    <span>Advanced material tracking system</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-success me-3"></i>
                    <span>Comprehensive profit analysis</span>
                  </div>
                </div>
                
                <p className="about-mission mt-4">
                  Together, we build not just structures, but trust, efficiency, and progress, one project at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .landing-hero-section {
          background: white;
          color: #2c3e50;
          position: relative;
          overflow: hidden;
          padding-top: 2rem;
        }
        
        .landing-hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        
        // .hero-content {
        //   position: relative;
        //   z-index: 2;
        // }
        
        // .hero-badge {
        //   display: inline-block;
        //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        //   color: white;
        //   padding: 0.5rem 1rem;
        //   border-radius: 25px;
        //   font-size: 0.9rem;
        //   font-weight: 500;
        // }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          color: #6c757d;
          line-height: 1.6;
        }
        
        .btn-hero-primary {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
          color: white;
        }
        
        .btn-hero-secondary {
          background: transparent;
          border: 2px solid #2c3e50;
          border-radius: 25px;
          color: #2c3e50;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-hero-secondary:hover {
          background: #2c3e50;
          border-color: #2c3e50;
          // transform: translateY(-2px);
          color: white;
        }
        
        // .landing-hero-stats {
        //   margin-top: 3rem;
        // }
        
        .landing-number {
          font-size: 1.7rem;
          font-weight: 800;
          color: #667eea;
        }
        
        .landing-label {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 0.3rem;
        }
        
        .hero-image-container {
          position: relative;
        }
        
        .hero-image {
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }
        
        .hero-image:hover {
          transform: scale(1.05);
        }
        
        .floating-card {
          position: absolute;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          animation: float 3s ease-in-out infinite;
        }
        
        .card-1 {
          top: 20%;
          right: -10%;
          animation-delay: 0s;
        }
        
        .card-2 {
          bottom: 30%;
          left: -10%;
          animation-delay: 1s;
        }
        
        .card-3 {
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .services-section {
          padding: 5rem 0;
          background: #f8f9fa;
        }
        
        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .section-title {
          font-size: 3rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 0;
          text-align: center;
          line-height: 1.2;
        }
        
        .services-hero {
          padding: 2rem 0;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .services-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .services-main-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #2c3e50;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        
        .services-highlight {
          color: #667eea;
          font-weight: 900;
        }
        
        .services-description {
          font-size: 1.2rem;
          color: #6c757d;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section-description {
          color: #6c757d;
          max-width: 650px;
          margin: 0 auto;
          font-size: 1.15rem;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .category-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
          color: white;
        }
        
        .worker-icon {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .category-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .category-subtitle {
          color: #6c757d;
          font-size: 1.1rem;
        }
        
        .service-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
           transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .service-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 1rem;
        }
        
        .service-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .service-description {
          color: #6c757d;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        .btn-service {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          color: white;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-service:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          color: white;
        }
        
        .worker-btn {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .worker-btn:hover {
          box-shadow: 0 5px 15px rgba(17, 153, 142, 0.3);
        }
        
        .about-section {
          padding: 5rem 0;
          background: white;
        }
        
        .about-image-container {
          position: relative;
        }
        
        .about-image {
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .about-overlay {
          position: absolute;
          bottom: -20px;
          left: 20px;
          right: 20px;
        }
        
        // .landing-about {
        //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        //   color: white;
        //   padding-top: 1rem;
        //   padding-bottom: 1rem;
        //   border-radius: 15px;
        //   text-align: center;
        //   box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        // }
        
        // .about-stat {
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   gap: 0.5rem;
        //   font-weight: 600;
        // }
        
        .about-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          line-height: 1.2;
        }
        
        .about-description {
          color: #6c757d;
          line-height: 1.6;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: #495057;
        }
        
        .about-mission {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          font-style: italic;
        }
        
        @media (max-width: 992px) {
          .landing-hero-section {
            padding-top: 5rem;
          }
          
          .hero-title {
            font-size: 2.8rem;
          }
          
          .section-title {
            font-size: 2.5rem;
          }
          
          .category-title {
            font-size: 2.2rem;
          }
          
          .about-title {
            font-size: 2.2rem;
          }
        }
        
        @media (max-width: 768px) {
          .landing-hero-section {
            padding-top: 4rem;
          }
          
          .hero-title {
            font-size: 2.2rem;
            text-align: center;
          }
          
          .hero-description {
            text-align: center;
            font-size: 1rem;
          }
          
          .hero-buttons {
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            max-width: 280px;
          }
          
          .hero-stats {
            margin-top: 2rem;
            text-align: center;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .category-title {
            font-size: 1.8rem;
          }
          
          .about-title {
            font-size: 1.8rem;
            text-align: center;
          }
          
          .about-description {
            text-align: center;
          }
          
          .floating-card {
            display: none;
          }
          
          .mobile-features {
            margin-top: 1.5rem;
          }
          
          .mobile-feature-card {
            background: white;
            padding: 1rem 0.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .mobile-feature-card i {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            display: block;
          }
          
          .mobile-feature-card span {
            font-size: 0.8rem;
            font-weight: 600;
            color: #2c3e50;
          }
          
          .service-card {
            margin-bottom: 1rem;
          }
          
          .service-card:hover {
            transform: none;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .btn-service:hover {
            transform: none;
            box-shadow: none;
          }
          
          .worker-btn:hover {
            box-shadow: none;
          }
          
          .row {
            margin-left: -0.25rem;
            margin-right: -0.25rem;
          }
          
          .row > * {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }
          
          .services-section {
            padding: 3rem 0;
          }
          
          .about-section {
            padding: 3rem 0;
          }
        }
        
        @media (max-width: 576px) {
          .landing-hero-section {
            padding-top: 3rem;
          }
          
          .hero-title {
            font-size: 1.8rem;
            line-height: 1.3;
          }
          
          .hero-description {
            font-size: 0.95rem;
            padding: 0 1rem;
          }
          
          .hero-badge {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .btn-hero-primary,
          .btn-hero-secondary {
            padding: 0.7rem 1.5rem;
            font-size: 0.9rem;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .stat-label {
            font-size: 0.8rem;
          }
          
          .services-main-title {
            font-size: 2rem;
          }
          
          .services-badge {
            font-size: 0.9rem;
            padding: 0.6rem 1.2rem;
          }
          
          .services-description {
            font-size: 1rem;
          }
          
          .services-main-title {
            font-size: 2.5rem;
          }
          
          .services-description {
            font-size: 1.1rem;
            padding: 0 1rem;
          }
          
          .services-hero {
            padding: 1rem 0;
          }
          
          .category-title {
            font-size: 1.5rem;
          }
          
          .category-subtitle {
            font-size: 0.95rem;
          }
          
          .about-title {
            font-size: 1.5rem;
          }
          
          .about-description {
            font-size: 0.95rem;
          }
          
          .service-card {
            padding: 1.5rem;
          }
          
          .service-card:hover {
            transform: none;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .btn-service:hover {
            transform: none;
            box-shadow: none;
          }
          
          .worker-btn:hover {
            box-shadow: none;
          }
          
          .service-title {
            font-size: 1.1rem;
          }
          
          .service-description {
            font-size: 0.9rem;
          }
          
          .btn-service {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .feature-item {
            font-size: 1rem;
          }
          
          .about-mission {
            font-size: 1.1rem;
          }
          
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .hero-buttons {
            gap: 0.75rem;
          }
          
          .btn-hero-primary,
          .btn-hero-secondary {
            max-width: 250px;
          }
          
          .service-card {
            padding: 1.25rem;
          }
          
          .category-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
          
          .mobile-feature-card {
            padding: 0.75rem 0.25rem;
          }
          
          .mobile-feature-card i {
            font-size: 1.2rem;
          }
          
          .mobile-feature-card span {
            font-size: 0.7rem;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}


export default LandingPage;

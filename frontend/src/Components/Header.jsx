import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/images/photos/logo.png";
import ProfileAvatar from "./ProfileAvatar";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const role = localStorage.getItem("userRole");
      if (!role) {
        navigate("/role-selection");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    logout({
      returnTo: window.location.origin,
    });
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    } else {
      navigate(`/${sectionId}`);
      setActiveSection(sectionId);
    }
  };

  const currentPath = location.pathname.toLowerCase();

  const builderPaths = [
    "/builder-dashboard",
    "/viewpostedjobs",
    "/materialmanagement",
    "/dashboard",
    "/profitandcostanalysis",
    "/viewapplications",
    "/hiredworkers",
    "/post-job",
    "/attendance/worker", 
    "/payroll",
  ];

  const isBuilderPage = builderPaths.some((path) =>
    currentPath.startsWith(path)
  );

  const isWorkerPage = [
    "/browse-job",
    "/track-billing",
    "/applications",
    "/attendances",
  ].includes(currentPath);

  return (
    <header className="modern-header">
      <nav className="navbar navbar-expand-lg navbar-dark py-3">
        <div className="container d-flex flex-wrap align-items-center">
          <div className="navbar-brand d-flex align-items-center" style={{marginLeft: '15px'}}>
            <img src={logo} alt="Construction Management" height="45" width="180" className="logo-img" />
          </div>


          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {isAuthenticated && (
              <div className="profile-icon d-block d-lg-none mb-3">
                <ProfileAvatar />
              </div>
            )}

            <ul className="navbar-nav ms-auto align-items-center">
              {/* Worker Navigation */}
              {isWorkerPage && (
                <>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/browse-job" ? "active" : ""}`} onClick={() => navigate("/browse-job")}>
                      <i className="fas fa-search me-2"></i>Browse Jobs
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/applications" ? "active" : ""}`} onClick={() => navigate("/applications")}>
                      <i className="fas fa-file-alt me-2"></i>Applications
                    </a>
                  </li>
                  <li className="nav-item me-4">
                    <a className={`nav-link modern-nav-link ${currentPath === "/attendances" ? "active" : ""}`} onClick={() => navigate("/attendances")}>
                      <i className="fas fa-wallet me-2"></i>Payroll Manager
                    </a>
                  </li>
                </>
              )}

              {/* Builder Navigation */}
              {isBuilderPage && (
                <>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/builder-dashboard" ? "active" : ""}`} onClick={() => navigate("/builder-dashboard")}>
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/viewpostedjobs" ? "active" : ""}`} onClick={() => navigate("/viewpostedjobs")}>
                      <i className="fas fa-briefcase me-2"></i>Posted Jobs
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/materialmanagement" ? "active" : ""}`} onClick={() => navigate("/materialmanagement")}>
                      <i className="fas fa-boxes me-2"></i>Materials
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${currentPath === "/dashboard" ? "active" : ""}`} onClick={() => navigate("/dashboard")}>
                      <i className="fas fa-user-check me-2"></i>Attendance
                    </a>
                  </li>
                  <li className="nav-item me-4">
                    <a className={`nav-link modern-nav-link ${currentPath === "/payroll" ? "active" : ""}`} onClick={() => navigate("/payroll")}>
                      <i className="fas fa-money-check-alt me-2"></i>Payroll
                    </a>
                  </li>
                </>
              )}

              {/* Default Static Page Nav */}
              {!isWorkerPage && !isBuilderPage && (
                <>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${activeSection === "home-section" ? "active" : ""}`} onClick={() => handleScrollToSection("home-section")}>
                      <i className="fas fa-home me-2"></i>Home
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a className={`nav-link modern-nav-link ${activeSection === "services-section" ? "active" : ""}`} onClick={() => handleScrollToSection("services-section")}>
                      <i className="fas fa-cogs me-2"></i>Services
                    </a>
                  </li>
                  <li className="nav-item me-4">
                    <a className={`nav-link modern-nav-link ${activeSection === "about-section" ? "active" : ""}`} onClick={() => handleScrollToSection("about-section")}>
                      <i className="fas fa-info-circle me-2"></i>About Us
                    </a>
                  </li>
                </>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <li className="nav-item">
                  <button className="btn btn-modern-primary px-4 py-2" type="button" onClick={() => loginWithRedirect()}>
                    <i className="fas fa-sign-in-alt me-2"></i>Log In
                  </button>
                </li>
              ) : (
                <li className="nav-item d-none d-lg-block">
                  {/* <div className="profile-icon ms-3"> */}
                    <ProfileAvatar />
                  {/* </div> */}
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .logo-img {
          transition: transform 0.3s ease;
        }
        
        .logo-img:hover {
          transform: scale(1.05);
        }
        
        .modern-nav-link {
          position: relative;
          padding: 0.75rem 1rem !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .modern-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white !important;
          transform: translateY(-2px);
        }
        
        .modern-nav-link.active {
          background: rgba(255, 255, 255, 0.2);
          color: white !important;
          border-bottom: 3px solid #667eea;
        }
        
        .btn-modern-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-modern-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
        }
        
        .navbar-toggler {
          border: none;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        
        .navbar-toggler:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }
        
        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
        
        @media (max-width: 991px) {
          .modern-nav-link {
            text-align: center;
            margin: 0.25rem 0;
            padding: 0.75rem 1rem;
          }
          
          .navbar-nav {
            text-align: center;
          }
          
          .btn-modern-primary {
            margin-top: 1rem;
            width: 100%;
            max-width: 200px;
          }
        }
        
        @media (max-width: 576px) {
          .modern-header {
            padding: 0.5rem 0;
          }
          
          .logo-img {
            height: 35px;
            width: 140px;
          }
          
          .modern-nav-link {
            font-size: 0.9rem;
            padding: 0.6rem 0.8rem;
          }
          
          .btn-modern-primary {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
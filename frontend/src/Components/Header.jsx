import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css"; // ab sari CSS alag file me
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
    "/project_pannel",
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

  // Check if current page is Builder Dashboard
  const isBuilderDashboard = currentPath === "/builder-dashboard";

  return (
    <header className="modern-header">
      <nav className="navbar navbar-expand-lg navbar-dark py-3">
        <div className="container ">
          <div
            className="navbar-brand d-flex align-items-center"
            style={{ marginLeft: "15px" }}
          >
            <img
              src={logo}
              alt="Construction Management"
              height="45"
              width="180"
              className="logo-img"
            />
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
                    <a
                      className={`nav-link modern-nav-link ${
                        currentPath === "/browse-job" ? "active" : ""
                      }`}
                      onClick={() => navigate("/browse-job")}
                    >
                      <i className="fas fa-search me-2"></i>Browse Jobs
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a
                      className={`nav-link modern-nav-link ${
                        currentPath === "/applications" ? "active" : ""
                      }`}
                      onClick={() => navigate("/applications")}
                    >
                      <i className="fas fa-file-alt me-2"></i>Applications
                    </a>
                  </li>
                </>
              )}



              {/* Builder Dashboard - Show in Header */}
              {isBuilderDashboard && (
                <li className="nav-item me-3">
                  <a
                    className="nav-link modern-nav-link active"
                    onClick={() => navigate("/builder-dashboard")}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                  </a>
                </li>
              )}
              
              {/* All Builder Pages - Show Project Name */}
              {isBuilderPage && (
                <li className="nav-item me-3">
                  <span className="nav-link modern-nav-link active project-name-header">
                    {/* <i className="fas fa-project-diagram me-2"></i> */}
                    {localStorage.getItem("selectedProject") ? 
                      JSON.parse(localStorage.getItem("selectedProject")).name || "Project" 
                      : "Project"
                    }
                  </span>
                </li>
              )}

              {/* Default Static Page Nav */}
              {!isWorkerPage && !isBuilderPage && !isBuilderDashboard && (
                <>
                  <li className="nav-item me-3">
                    <a
                      className={`nav-link modern-nav-link ${
                        activeSection === "home-section" ? "active" : ""
                      }`}
                      onClick={() => handleScrollToSection("home-section")}
                    >
                      <i className="fas fa-home me-2"></i>Home
                    </a>
                  </li>
                  <li className="nav-item me-3">
                    <a
                      className={`nav-link modern-nav-link ${
                        activeSection === "services-section" ? "active" : ""
                      }`}
                      onClick={() => handleScrollToSection("services-section")}
                    >
                      <i className="fas fa-cogs me-2"></i>Services
                    </a>
                  </li>
                  <li className="nav-item me-4">
                    <a
                      className={`nav-link modern-nav-link ${
                        activeSection === "about-section" ? "active" : ""
                      }`}
                      onClick={() => handleScrollToSection("about-section")}
                    >
                      <i className="fas fa-info-circle me-2"></i>About Us
                    </a>
                  </li>
                </>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <li className="nav-item">
                  <button
                    className="btn btn-modern-primary px-4 py-2"
                    type="button"
                    onClick={() => loginWithRedirect()}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>Log In
                  </button>
                </li>
              ) : (
                <li className="nav-item d-none d-lg-block">
                  <ProfileAvatar />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
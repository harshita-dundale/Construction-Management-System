import { useState, useEffect } from "react";
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
    <header style={{ backgroundColor: "#1a4654", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
      <nav className="navbar navbar-expand-lg navbar-dark py-4 d-flex align-items-sm-center">
        <div className="container d-flex flex-wrap align-items-center">
          <img src={logo} alt="logo" height="50" width="200" />


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse text-center" id="navbarNav">
            <div className="profile-icon d-block d-lg-none mb-3">
              <ProfileAvatar />
            </div>

            <ul className="navbar-nav ms-auto">
              {/* Worker Navigation */}
              {isWorkerPage && (
                <>
                  <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/browse-job" ? "active bold-underline" : ""}`} onClick={() => navigate("/browse-job")}>Browse Job</a>
                  </li>
                  <li className="nav-item me-2">
                    <a className={`nav-link ${currentPath === "/applications" ? "active bold-underline" : ""}`} onClick={() => navigate("/applications")}>Applications</a>
                  </li>
                  <li className="nav-item me-2">
                    <a className={`nav-link ${currentPath === "/attendances" ? "active bold-underline" : ""}`} onClick={() => navigate("/attendances")}>Payroll Manager</a>
                  </li>
                </>
              )}

              {/* Builder Navigation */}
              {isBuilderPage && (
                <>
                  <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/builder-dashboard" ? "active bold-underline" : ""}`} onClick={() => navigate("/builder-dashboard")}>Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/viewpostedjobs" ? "active bold-underline" : ""}`} onClick={() => navigate("/viewpostedjobs")}>Posted Jobs</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/materialmanagement" ? "active bold-underline" : ""}`} onClick={() => navigate("/materialmanagement")}>Materials</a>
                  </li>
                  {/* <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/profitandcostanalysis" ? "active bold-underline" : ""}`} onClick={() => navigate("/profitandcostanalysis")}>Profit & Cost</a>
                  </li> */}
                  <li className="nav-item">
                    <a className={`nav-link ${currentPath === "/dashboard" ? "active bold-underline" : ""}`} onClick={() => navigate("/dashboard")}>Attendance</a>
                  </li>

                  <li className="nav-item me-2">
                    <a className={`nav-link ${currentPath === "/attendance" ? "active bold-underline" : ""}`} onClick={() => navigate("/payroll")}> Payroll</a>
                  </li>

                </>
              )}

              {/* Default Static Page Nav */}
              {!isWorkerPage && !isBuilderPage && (
                <>
                  <li className="nav-item">
                    <a className={`nav-link ${activeSection === "home-section" ? "active bold-underline" : ""}`} onClick={() => handleScrollToSection("home-section")}>Home</a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${activeSection === "services-section" ? "active bold-underline" : ""}`} onClick={() => handleScrollToSection("services-section")}>Services</a>
                  </li>
                  <li className="nav-item me-2">
                    <a className={`nav-link ${activeSection === "about-section" ? "active bold-underline" : ""}`} onClick={() => handleScrollToSection("about-section")}>About Us</a>
                  </li>
                </>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <li className="nav-item">
                  <button className="btn btn-light" type="button" onClick={() => loginWithRedirect()}>Log In</button>
                </li>
              ) : (
                <li className="nav-item d-none d-lg-block">
                  <div className="profile-icon ms-3">
                    <ProfileAvatar />
                  </div>
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
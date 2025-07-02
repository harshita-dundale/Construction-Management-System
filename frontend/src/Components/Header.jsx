
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/images/photos/logo.png";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState("");
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    useEffect(() => {
        const sections = document.querySelectorAll("section");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const role = localStorage.getItem("userRole");
            if (!role) {
                navigate("/role-selection");  // Redirect to Role Selection Page
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
    const isWorkerPage = ["/browse-job", "/track-billing", "/applications", "/attendances"].includes(currentPath);// "/ViewPostedJobs ,"
    const isBuilderPage = ["/builder-dashboard", "/viewpostedjobs", "/materialmanagement", "/dashboard", "/profitandcostanalysis", "/viewapplications", "/hiredworkers", "/post-job",].includes(currentPath);

    return (
        <header style={{ backgroundColor: "#1a4654", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
            <nav className="navbar navbar-expand-lg navbar-dark py-4">
                <div className="container">
                    <img src={logo} alt="" height="50" width="200" />
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
                        <ul className="navbar-nav ms-auto">

                            {/* Worker-specific options */}
                            {isWorkerPage && (
                                <>
                                    <li className="nav-item">
                                        <a className={`nav-link ${location.pathname === "/browse-Job" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/browse-Job")}>
                                            Browse Job
                                        </a>
                                    </li>
                                    <li className="nav-item me-2">
                                        <a className={`nav-link ${location.pathname === "/applications" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/applications")}>
                                            Applications
                                        </a>
                                    </li>
                                    {/*<li className="nav-item me-2">
                                         <a className={`nav-link ${location.pathname === "/attendances" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/attendances")}>
                                            Payroll Manager
                                        </a>
                                    </li> */}
                                    <li className="nav-item">
                                        <button className="btn btn-light" type="button" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}

                            {/* Builder-specific options */}
                            {isBuilderPage && (
                                <>
                                    <li className="nav-item">
                                        <a className={`nav-link ${location.pathname === "/Builder-Dashboard" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/Builder-Dashboard")}>
                                            Dashboard
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className={`nav-link ${location.pathname === "/ViewPostedJobs" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/ViewPostedJobs")}>
                                           postedjobs
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className={`nav-link ${location.pathname === "/MaterialManagement" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/MaterialManagement")}>
                                            Materials
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${location.pathname === "/ProfitAndCostAnalysis" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/ProfitAndCostAnalysis")}>
                                            Profit & Cost
                                        </a>
                                    </li>
                                    <li className="nav-item me-2">
                                        <a className={`nav-link ${location.pathname === "/Dashboard" ? "active bold-underline" : ""}`}
                                            onClick={() => navigate("/Dashboard")}>
                                            Attendance & Payroll
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-light" type="button" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}

                            {/* Default options for Landing Page */}
                            {!isWorkerPage && !isBuilderPage && (
                                <>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "home-section" ? "active bold-underline" : ""}`}
                                            onClick={() => handleScrollToSection("home-section")}>
                                            Home
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activeSection === "services-section" ? "active bold-underline" : ""}`}
                                            onClick={() => handleScrollToSection("services-section")}>
                                            Services
                                        </a>
                                    </li>
                                    <li className="nav-item me-2">
                                        <a className={`nav-link ${activeSection === "about-section" ? "active bold-underline" : ""}`}
                                            onClick={() => handleScrollToSection("about-section")}>
                                            About Us
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        {!isAuthenticated ? (
                                            <button className="btn btn-light" type="button" onClick={() => loginWithRedirect()}>
                                                Log In
                                            </button>
                                        ) : (
                                            <button className="btn btn-light" type="button" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        )}
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
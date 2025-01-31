
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState("");

    // Detect active section when scrolling
    useEffect(() => {
        const sections = document.querySelectorAll("section");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.3 });  // Reduce threshold for better detection

        sections.forEach(section => observer.observe(section));

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, []);

    // Function to navigate smoothly to a section
    const handleScrollToSection = (sectionId) => {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setActiveSection(sectionId);  // Manually update state for immediate highlight
        }
    };

    // Active route detection for Worker/Builder pages
    const isWorkerPage = ["/browse-Job", "/Track-Billing", "/applications", "/attendances"].includes(location.pathname);
    const isBuilderPage = location.pathname === "/builder";

    return (
        <>
            <header style={{ backgroundColor: "#1a4654", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
                <nav className="navbar navbar-expand-lg navbar-dark py-4">
                    <div className="container">
                        <a className="navbar-brand" href="#">Brand</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse text-center" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                {isWorkerPage || isBuilderPage ? (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/browse-Job" ? "active" : ""}`}
                                                onClick={() => navigate("/browse-Job")}>
                                                {isWorkerPage ? "Browse Job" : "Projects"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/applications" ? "active" : ""}`}
                                                onClick={() => navigate("/applications")}>
                                                {isWorkerPage ? "Applications" : "Resources"}
                                            </a>
                                        </li>
                                        <li className="nav-item me-2">
                                            <a className={`nav-link ${location.pathname === "/attendances" ? "active" : ""}`}
                                                onClick={() => navigate("/attendances")}>
                                                {isWorkerPage ? "Payroll Manager" : "Resources"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-light" type="button" onClick={() => navigate("/landing-page")}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <a className={`nav-link ${activeSection === "home-section" ? "active" : ""}`}
                                                onClick={() => handleScrollToSection("home-section")}>
                                                Home
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${activeSection === "services-section" ? "active" : ""}`}
                                                onClick={() => handleScrollToSection("services-section")}>
                                                Services
                                            </a>
                                        </li>
                                        <li className="nav-item me-2">
                                            <a className={`nav-link ${activeSection === "about-section" ? "active" : ""}`}
                                                onClick={() => handleScrollToSection("about-section")}>
                                                About Us
                                            </a>
                                        </li>
                                        <li className="nav-item d-flex justify-content-center">
                                            <button className="btn btn-outline-light me-2" type="button" onClick={() => navigate("/role-selection")}>
                                                Sign Up
                                            </button>
                                            <button className="btn btn-light" type="button">
                                                Login
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;

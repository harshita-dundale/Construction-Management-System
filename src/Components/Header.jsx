import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            const userRole = localStorage.getItem("userRole");

            if (!userRole) {
                navigate("/role-selection");
            } else if (userRole === "worker") {
                navigate("/browse-Job");
            } else if (userRole === "Builder-Dashboard") {
                navigate("/builder");
            }
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userRole"); // Clear role on logout
        logout({
            returnTo: window.location.origin,
        });
    };

    const isWorkerPage = location.pathname === "/browse-Job" || location.pathname === "/Track-Billing";
    const isBuilderPage = location.pathname === "/Builder-Dashboard" || location.pathname === "/MaterialManagement" || location.pathname === "/ProfitAndCostAnalysis" || location.pathname === "/Dashboard" || location.pathname === "/ViewApplications" ;

    return (
        <header style={{ backgroundColor: "#1a4654", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
            <nav className="navbar navbar-expand-lg navbar-dark py-4">
                <div className="container">
                    <a className="navbar-brand" href="#">Brand</a>
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
                                        <a className="nav-link active" onClick={() => navigate("/browse-Job")}>
                                            Browse Job
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" onClick={() => navigate("/Track-Billing")}>
                                            Track Billing
                                        </a>
                                    </li>
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
                                        <a className="nav-link active" onClick={() => navigate("/Builder-Dashboard")}>
                                            Deshboard
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" onClick={() => navigate("/MaterialManagement")}>
                                            Materials
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" onClick={() => navigate("/ProfitAndCostAnalysis")}>
                                            Profit & Cost 
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" onClick={() => navigate("/Dashboard")}>
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

                            {/* Default options */}
                            {!isWorkerPage && !isBuilderPage && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#home">
                                            Home
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#services">
                                            Services
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#about">
                                            About Us
                                        </a>
                                    </li>
                                    {/* <li className="nav-item">
                                        <button className="btn btn-light" type="button" onClick={() => navigate("/role-selection")}>
                                            Login
                                        </button>
                                    </li> */}
                                    <li className="nav-item">
                                        {!isAuthenticated ? (
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={() => loginWithRedirect()}
                                            >
                                                Log In
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={handleLogout}
                                            >
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
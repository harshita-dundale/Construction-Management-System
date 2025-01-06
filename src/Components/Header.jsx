

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
    // const [authState, setAuthState] = useState(null);

    // Auth0 initialization ke baad auth state synchronize karna
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) {
            const timer = setTimeout(() => {
                navigate("/role-selection");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate]);

    const handleBrowsejob = () => {
        navigate("/browse-Job");     // Redirect to the browse job page
    };
    const handleTrackBilling = () => {
        navigate("/Track-Billing");     // Redirect to the track billing page
    };

    const handleServiceClick = () => {
        const section = document.querySelector("#services-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }

    const handleAboutClick = () => {
        const section = document.querySelector("#about-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const isWorkerPage = location.pathname === "/browse-Job" || location.pathname === "/Track-Billing";
    const isBuilderPage = location.pathname === "/builder";

    return (
        <>
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
                                {isWorkerPage || isBuilderPage ? (
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleBrowsejob}>
                                                {isWorkerPage ? "Browse Job" : "Projects"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleTrackBilling}>
                                                {isWorkerPage ? "Track Billing" : "Resources"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-light" type="button">
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#home">
                                                Home
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleServiceClick}>
                                                Services
                                            </a>
                                        </li>
                                        <li className="nav-item me-2">
                                            <a className="nav-link" onClick={handleAboutClick}>
                                                About Us
                                            </a>
                                        </li>


                                        <li className="nav-item d-flex justify-content-center">
                                            {!isAuthenticated ? (
                                                <li className="nav-item d-flex">
                                                    <button
                                                        className="btn mx-5 btn-light info-btn align-items-center"
                                                        type="button"
                                                        onClick={() =>
                                                            loginWithRedirect({
                                                                redirect_uri: `${window.location.origin}`,
                                                            })
                                                        }
                                                    >
                                                        Log In
                                                    </button>
                                                </li>
                                            ) : (
                                                <li className="nav-item">
                                                    <button
                                                        className="btn btn-light info-btn align-items-center"
                                                        type="button"
                                                        onClick={() =>
                                                            logout({
                                                                returnTo: window.location.origin,
                                                            })
                                                        }
                                                    >
                                                        Log Out
                                                    </button>
                                                </li>
                                            )}
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import './Header.css';
// import { useAuth0 } from "@auth0/auth0-react";

// function Header() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

//     useEffect(() => {
//         if (isAuthenticated) {
//             const userRole = localStorage.getItem("userRole");

//             if (!userRole) {
//                 navigate("/role-selection");
//             } else if (userRole === "worker") {
//                 navigate("/browse-Job");
//             } else if (userRole === "builder") {
//                 navigate("/");
//             }
//         }
//     }, [isAuthenticated, navigate]);

//     const handleRoleSelection = (role) => {
//         localStorage.setItem("userRole", role); // Save the role in localStorage
//         if (role === "worker") {
//             navigate("/browse-Job");
//         } else if (role === "builder") {
//             navigate("/builder");
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("userRole"); // Clear the role on logout
//         logout({
//             returnTo: window.location.origin,
//         });
//     };

//     const handleBrowseJob = () => {
//         navigate("/browse-Job");
//     };

//     const handleTrackBilling = () => {
//         navigate("/Track-Billing");
//     };

//     const handleServiceClick = () => {
//         const section = document.querySelector("#services-section");
//         if (section) {
//             section.scrollIntoView({ behavior: "smooth" });
//         }
//     };

//     const handleAboutClick = () => {
//         const section = document.querySelector("#about-section");
//         if (section) {
//             section.scrollIntoView({ behavior: "smooth" });
//         }
//     };

//     const isWorkerPage = location.pathname === "/browse-Job" || location.pathname === "/Track-Billing";
//     const isBuilderPage = location.pathname === "/builder";

//     return (
//         <>
//             <header style={{ backgroundColor: "#1a4654", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
//                 <nav className="navbar navbar-expand-lg navbar-dark py-4">
//                     <div className="container">
//                         <a className="navbar-brand" href="#">Brand</a>
//                         <button
//                             className="navbar-toggler"
//                             type="button"
//                             data-bs-toggle="collapse"
//                             data-bs-target="#navbarNav"
//                             aria-controls="navbarNav"
//                             aria-expanded="false"
//                             aria-label="Toggle navigation"
//                         >
//                             <span className="navbar-toggler-icon"></span>
//                         </button>
//                         <div className="collapse navbar-collapse text-center" id="navbarNav">
//                             <ul className="navbar-nav ms-auto">
//                                 {isWorkerPage || isBuilderPage ? (
//                                     <>
//                                         <li className="nav-item">
//                                             <a className="nav-link" onClick={handleBrowseJob}>
//                                                 {isWorkerPage ? "Browse Job" : "Projects"}
//                                             </a>
//                                         </li>
//                                         <li className="nav-item">
//                                             <a className="nav-link" onClick={handleTrackBilling}>
//                                                 {isWorkerPage ? "Track Billing" : "Resources"}
//                                             </a>
//                                         </li>
//                                         <li className="nav-item">
//                                             <button className="btn btn-light" type="button" onClick={handleLogout}>
//                                                 Logout
//                                             </button>
//                                         </li>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <li className="nav-item">
//                                             <a className="nav-link active" href="#home">
//                                                 Home
//                                             </a>
//                                         </li>
//                                         <li className="nav-item">
//                                             <a className="nav-link" onClick={handleServiceClick}>
//                                                 Services
//                                             </a>
//                                         </li>
//                                         <li className="nav-item me-2">
//                                             <a className="nav-link" onClick={handleAboutClick}>
//                                                 About Us
//                                             </a>
//                                         </li>
//                                         <li className="nav-item d-flex justify-content-center">
//                                             {!isAuthenticated ? (
//                                                 <button
//                                                     className="btn mx-5 btn-light info-btn align-items-center"
//                                                     type="button"
//                                                     onClick={() =>
//                                                         loginWithRedirect({
//                                                             redirect_uri: `${window.location.origin}`,
//                                                         })
//                                                     }
//                                                 >
//                                                     Log In
//                                                 </button>
//                                             ) : (
//                                                 <button
//                                                     className="btn btn-light info-btn align-items-center"
//                                                     type="button"
//                                                     onClick={handleLogout}
//                                                 >
//                                                     Log Out
//                                                 </button>
//                                             )}
//                                         </li>
//                                     </>
//                                 )}
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>
//             </header>
//         </>
//     );
// }

// export default Header;

// import logo from "../assets/images/logo.png"
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css'

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignUpClick = () => {
        navigate("/role-selection");     // Redirect to the role selection page
    };
    const handleBrowsejob = () => {
        navigate("/browse-Job");     // Redirect to the brwose job page
    };
    // const handleTrackBilling = () => {
    //     navigate("/Track-Billing");     // Redirect to the track billing page
    // };
    const handleApplications = () => {
        navigate("/applications");    
    };
    const handlePayroll = () => {
        navigate("/attendances");    
    };
    const handlelogout = () => {
        navigate("/landing-page");     // Redirect to the track billing page
    };

    const handleHomeClick = () => {
        const id1 = document.querySelector("#home-section");
        if (id1) {
            id1.scrollIntoView({ behavior: "smooth" });
            // id1.style.backgroundColor = "lightblue";
        }
    }
    const handleServiceClick = () => {
        const id2 = document.querySelector("#services-section");
        if (id2) {
            id2.scrollIntoView({ behavior: "smooth" });
        }
    }

    const handleAboutClick = () => {
        const section = document.querySelector("#about-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const isWorkerPage = location.pathname === "/browse-Job" || location.pathname === "/Track-Billing" 
    || location.pathname === "/applications" || location.pathname === "/attendances";
    const isBuilderPage = location.pathname === "/builder";
    // , position: "fixed",
    // top: 0,
    // width: "100%",
    // zIndex: 1000
    return (
      <>
       <header style={{ backgroundColor: "#1a4654" , position: "fixed", top: 0, width: "100%", zIndex: 1000}}>
         <nav className="navbar navbar-expand-lg navbar-dark py-4">
           <div className="container">
             {/* Replace with your logo if needed */}
             {/* <img src={logo} alt="logo" className="navbar-brand" width="190" height="65" /> */}
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
                                    // Conditional rendering for Worker/Builder pages
                        <>
                          <li className="nav-item">
                                            <a className="nav-link" onClick={handleBrowsejob}>
                                                {isWorkerPage ? "Browse Job" : "Projects"}
                                            </a>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a className="nav-link" onClick={handleTrackBilling}>
                                                {isWorkerPage ? "Track Billing" : "Resources"}
                                            </a>
                                        </li> */}
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handleApplications}>
                                                {isWorkerPage ? "Applications" : "Resources"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" onClick={handlePayroll}>
                                                {isWorkerPage ? "Payroll Manager" : "Resources"}
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-light" type="button" onClick={handlelogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    // Default navigation links
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link active" onClick={handleHomeClick}>
                                                Home
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link active" onClick={handleServiceClick}>
                                                Services
                                            </a>
                                        </li>
                                        <li className="nav-item me-2">
                                            <a className="nav-link active" onClick={handleAboutClick}>
                                                About Us
                                            </a>
                                        </li>
                                        <li className="nav-item d-flex justify-content-center">
                                            <button
                                                className="btn btn-outline-light me-2"
                                                type="button"
                                                onClick={handleSignUpClick}>
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
    )
}

export default Header

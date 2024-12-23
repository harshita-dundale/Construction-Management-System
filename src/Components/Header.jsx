import logo from "../assets/images/logo.png"
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate("/role-selection");     // Redirect to the role selection page
    };
    
    const handleServiceClick=()=>{
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

    return (
        <>
            <header style={{ backgroundColor: "#1a4654",position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000 }}>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container">
                        <img src={logo} alt="logo" className="navbar-brand" width="180" height="65"/>
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
                                <li className="nav-item">
                                    <a className="nav-link active" href="#home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={handleServiceClick}>Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={handleAboutClick}>About Us</a>
                                </li>
                                <li className="nav-item d-flex">
                                <button className="btn btn-outline-light me-2 info-btn align-items-center" type="button" onClick={handleSignUpClick}>Sign Up</button>
                                <button className="btn btn-light info-btn align-items-center" type="button">Login</button>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header

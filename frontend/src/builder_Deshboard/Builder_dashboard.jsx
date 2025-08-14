import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Cards1 from "../Components/cards/Cards1";
import Header from "../Components/Header";
import ProjectModal from "../Components/ProjectModal";
 import { selectProject } from "../Pages/Redux/projectSlice";
 import { toast } from "react-toastify";

function Builder_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cardData1 = useSelector((state) => state.builder.cards);
  const location = useLocation();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const selectedProject = useSelector((state) => state.project.selectedProject);

  
useEffect(() => {
  const saved = localStorage.getItem("selectedProject");
  if (saved && !selectedProject) {
    dispatch(selectProject(JSON.parse(saved)));
  }
}, [selectedProject]);

 // console.log("🎯 Selected Project:", selectedProject);

  useEffect(() => {
    const selected = localStorage.getItem("selectedProject");
    if (!selected) {
      setShowProjectModal(true);
    }
  }, []);
  
  useEffect(() => {
    // Check if the state passed from navigation indicates to show the modal
    if (location.state && location.state.showProjectModal) {
      setShowProjectModal(true); // Corrected the setter function name
    }
  }, [location]);

  useEffect(() => {
    if (selectedProject) {
      setShowProjectModal(false);
    }
  }, [selectedProject]);

  return (
    <>
      <Header />
      <div className="container-fluid" style={{ marginTop: "8rem" }}>
        <div className="row align-items-center text-center text-md-start">

        <div className="col-12">
      <h1 className="my-3 fw-bold text-center">Builder Dashboard</h1>
    </div>
          
          {/* <div className="col-md-4 text-end justify-content-end">
            <Button
              onClick={() => setShowProjectModal(true)}
              style={buttonStyle}
              className="btn btn-light me-2"
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "var(--secondary-color)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "var(--primary-color)")
              }
            >
              Manage Projects
            </Button>
          </div> */}
          {/* Button: center on small, end on medium+ */}
        </div>
         
        <p className="text-center fs-5">
          Welcome to the Builder Dashboard! Manage your construction projects
          effectively.
        </p>
        
        {selectedProject ? (
            <h4 className="text-center mt-3">
               <strong>for - {selectedProject.name}</strong>
            </h4>
          ) : (
            <h4 className="text-center mt-3 text-danger">
              No Project Selected
            </h4>
          )}
        {/* handleClose={() => {
            if (selectedProject) {
              setShowProjectModal(false);
            } else {
              alert("Please select a project before closing.");
            }
          }} */}

        <ProjectModal
          show={showProjectModal}
          handleClose={() => {
            if (!selectedProject) {
              toast("Please select a project before closing.");

             // console.log("Please select a project before closing.");
             // alert("Please select a project before closing.");
            } else {
              setShowProjectModal(false);
            }
          }}
        />

      <div className="col-11 d-flex justify-content-center justify-content-md-end mb-3">
      <Button
        onClick={() => setShowProjectModal(true)}
        style={buttonStyle}
        className="btn btn-light me-5"
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "var(--secondary-color)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "var(--primary-color)")
        }
      >
        Manage Projects
      </Button>
    </div>
        <div className="row g-3 px-2 my-4 justify-content-center text-center">
          {cardData1.map((card, index) => (
            <Cards1
              key={index}
              imgSrc={card.imgSrc}
              title={card.title}
              text={card.text}
              buttonText={card.buttonText}
              onClick={() => navigate(card.route)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Builder_dashboard;

const buttonStyle = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
}
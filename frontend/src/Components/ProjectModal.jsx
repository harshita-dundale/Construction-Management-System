import { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects,addProject,selectProject,updateProject} from "../Pages/Redux/projectSlice";
import { useAuth0 } from "@auth0/auth0-react";
// import { deleteProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify"; 
// import Swal from "sweetalert2";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { FiEdit2 } from "react-icons/fi";
// import { FiCheck, FiX } from "react-icons/fi";
import "./ProjectModal.css";

const ProjectModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const { projects, status } = useSelector((state) => state.project);
  const userProjects = projects.filter((p) => p.userId === user?.sub);

  const [newProject, setNewProject] = useState({
    name: "",
    type: "",
    location: "",
    clientName: "",
    phoneNumber: "",
    email: "",
    startDate: "",
    expectedEndDate: "",
    expectedCost: ""
  });
  const [localError, setLocalError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  // const [editProjectData, setEditProjectData] = useState({
  //   name: "",
  //   type: "",
  //   location: "",
  //   clientName: ""
  // });

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      dispatch(fetchProjects(user.sub));
      // Auto-fill email from logged-in user
      setNewProject(prev => ({
        ...prev,
        email: user?.email || ""
      }));
    }
  }, [dispatch, isAuthenticated, user?.sub, user?.email]);

  // const handleProjectSelect = (project) => {
  //   dispatch(selectProject(project));
  //   localStorage.setItem("selectedProject", JSON.stringify(project));
  //   handleClose();
  // };

  const handleNewProjectValidation = async () => {
    if (!newProject.name.trim()) {
      setLocalError("Project name is required");
      return;
    }
    if (!newProject.location.trim()) {
      setLocalError("Project location is required");
      return;
    }
    if (!newProject.clientName.trim()) {
      setLocalError("Client name is required");
      return;
    }
    
    const isDuplicate = userProjects.some(
      (p) =>
        p.name.toLowerCase() === newProject.name.trim().toLowerCase() &&
        p.userId === user.sub
    );
    
    if (isDuplicate) {
      toast.error("You already have a project with this name.");
      setLocalError("Project already exists");
      return;
    }

    try {
      await dispatch(addProject({ 
        userId: user.sub, 
        name: newProject.name.trim(),
        type: newProject.type.trim(),
        location: newProject.location.trim(),
        clientName: newProject.clientName.trim(),
        phoneNumber: newProject.phoneNumber.trim(),
        email: newProject.email.trim(),
        startDate: newProject.startDate,
        expectedEndDate: newProject.expectedEndDate,
        expectedCost: newProject.expectedCost.trim()
      }));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project added successfully!");
      setNewProject({ 
        name: "", 
        type: "", 
        location: "", 
        clientName: "",
        phoneNumber: "",
        email: user?.email || "",
        startDate: "",
        expectedEndDate: "",
        expectedCost: ""
      });
      setLocalError(null);
      handleClose();
    } catch (err) {
      console.error("Error adding project:", err);
      setLocalError("Failed to add project.");
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" centered>
        <div className="modal-content-enhanced">
          <Modal.Header closeButton className="modal-header-enhanced">
            <Modal.Title className="modal-title-enhanced text-white">
              <i className="fas fa-project-diagram me-2"></i>
              Project Management
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-enhanced">
            {status === "loading" ? (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading projects...</p>
              </div>
            ) : (
              <>
                {/* Add New Project Form */}
                {!editingProject && (
                  <div className="add-project-section">
                    <div className="d-flex justify-content-center">
                      <h5 className="section-title">
                        <i className="fas fa-plus-circle me-2"></i>
                        Create New Project
                      </h5>
                      {/* <p className="section-subtitle">Fill in the details to create a new construction project</p> */}
                    </div>
                    
                    <div className="form-container">
                      {/* Basic Project Information */}
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-building me-2"></i>
                          Project Name *
                        </label>
                        <Form.Control
                          type="text"
                          value={newProject.name}
                          placeholder="Enter project name"
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          className="modern-input"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-tag me-2"></i>
                          Project Type
                        </label>
                        <Form.Select
                          value={newProject.type}
                          onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                          className="modern-select"
                        >
                          <option value="">Select Project Type</option>
                          <option value="Residential">🏠 Residential</option>
                          <option value="Commercial">🏢 Commercial</option>
                          <option value="Road">🛣️ Road</option>
                          <option value="Renovation">🔨 Renovation</option>
                          <option value="Industrial">🏭 Industrial</option>
                          <option value="Infrastructure">🌉 Infrastructure</option>
                        </Form.Select>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          Project Location *
                        </label>
                        <Form.Control
                          type="text"
                          value={newProject.location}
                          placeholder="Enter project location (Address, City, State)"
                          onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                          className="modern-input"
                          required
                        />
                      </div>
                      
                      {/* Client Information */}
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-user-tie me-2"></i>
                          Client Name *
                        </label>
                        <Form.Control
                          type="text"
                          value={newProject.clientName}
                          placeholder="Enter client/owner name"
                          onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                          className="modern-input"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-phone me-2"></i>
                          Phone Number
                        </label>
                        <Form.Control
                          type="tel"
                          value={newProject.phoneNumber}
                          placeholder="Enter contact phone number"
                          onChange={(e) => setNewProject({...newProject, phoneNumber: e.target.value})}
                          className="modern-input"
                          pattern="[0-9]{10}"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <Form.Control
                          type="email"
                          value={newProject.email}
                          placeholder="Enter email address"
                          onChange={(e) => setNewProject({...newProject, email: e.target.value})}
                          className="modern-input"
                        />
                      </div>
                      
                      {/* Project Timeline */}
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-calendar-plus me-2"></i>
                          Start Date
                        </label>
                        <Form.Control
                          type="date"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                          className="modern-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-calendar-check me-2"></i>
                          Expected End Date
                        </label>
                        <Form.Control
                          type="date"
                          value={newProject.expectedEndDate}
                          onChange={(e) => setNewProject({...newProject, expectedEndDate: e.target.value})}
                          className="modern-input"
                          min={newProject.startDate}
                        />
                      </div>
                      
                      {/* Financial Information */}
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-dollar-sign me-2"></i>
                          Expected Total Project Cost
                        </label>
                        <Form.Control
                          type="number"
                          value={newProject.expectedCost}
                          placeholder="Enter expected project cost (₹)"
                          onChange={(e) => setNewProject({...newProject, expectedCost: e.target.value})}
                          className="modern-input"
                          min="0"
                          step="1000"
                        />
                      </div>

                      {localError && (
                        <div className="error-message">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {localError}
                        </div>
                      )}
                      
                      <button className="create-btn" onClick={handleNewProjectValidation}>
                        <i className="fas fa-plus me-2"></i>
                        Create Project
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default ProjectModal;
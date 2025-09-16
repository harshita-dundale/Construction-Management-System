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
  const [fieldErrors, setFieldErrors] = useState({});
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

  const validateField = (field, value) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Project name is required';
        } else if (value.trim().length < 3) {
          errors.name = 'Project name must be at least 3 characters';
        } else if (value.trim().length > 50) {
          errors.name = 'Project name must be less than 50 characters';
        } else {
          delete errors.name;
        }
        break;
        
      case 'location':
        if (!value.trim()) {
          errors.location = 'Project location is required';
        } else if (value.trim().length < 5) {
          errors.location = 'Location must be at least 5 characters';
        } else {
          delete errors.location;
        }
        break;
        
      case 'clientName':
        if (!value.trim()) {
          errors.clientName = 'Client name is required';
        } else if (value.trim().length < 2) {
          errors.clientName = 'Client name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          errors.clientName = 'Client name should only contain letters and spaces';
        } else {
          delete errors.clientName;
        }
        break;
        
      case 'phoneNumber':
        if (value.trim() && !/^[6-9]\d{9}$/.test(value.trim())) {
          errors.phoneNumber = 'Enter valid 10-digit Indian mobile number';
        } else {
          delete errors.phoneNumber;
        }
        break;
        
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors.email = 'Enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'startDate':
        if (value && new Date(value) < new Date().setHours(0,0,0,0)) {
          errors.startDate = 'Start date cannot be in the past';
        } else {
          delete errors.startDate;
        }
        break;
        
      case 'expectedEndDate':
        if (value && newProject.startDate && new Date(value) <= new Date(newProject.startDate)) {
          errors.expectedEndDate = 'End date must be after start date';
        } else {
          delete errors.expectedEndDate;
        }
        break;
        
      case 'expectedCost':
        if (value.trim() && (isNaN(value) || parseFloat(value) <= 0)) {
          errors.expectedCost = 'Enter a valid positive amount';
        } else if (value.trim() && parseFloat(value) > 10000000000) {
          errors.expectedCost = 'Amount seems too large';
        } else {
          delete errors.expectedCost;
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNewProject({ ...newProject, [field]: value });
    validateField(field, value);
    if (localError) setLocalError(null);
  };

  const handleNewProjectValidation = async () => {
    // Validate all fields
    const fieldsToValidate = ['name', 'location', 'clientName', 'phoneNumber', 'email', 'startDate', 'expectedEndDate', 'expectedCost'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, newProject[field]);
      if (!fieldValid) isValid = false;
    });
    
    // Check for required fields
    if (!newProject.name.trim() || !newProject.location.trim() || !newProject.clientName.trim()) {
      setLocalError("Please fill in all required fields");
      return;
    }
    
    if (!isValid) {
      setLocalError("Please fix the errors above");
      return;
    }
    
    // Check for duplicate project name
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
      setFieldErrors({});
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
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`modern-input ${fieldErrors.name ? 'is-invalid' : ''}`}
                          required
                        />
                        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
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
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className={`modern-input ${fieldErrors.location ? 'is-invalid' : ''}`}
                          required
                        />
                        {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}
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
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className={`modern-input ${fieldErrors.clientName ? 'is-invalid' : ''}`}
                          required
                        />
                        {fieldErrors.clientName && <div className="field-error">{fieldErrors.clientName}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-phone me-2"></i>
                          Phone Number
                        </label>
                        <Form.Control
                          type="tel"
                          value={newProject.phoneNumber}
                          placeholder="Enter 10-digit mobile number"
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className={`modern-input ${fieldErrors.phoneNumber ? 'is-invalid' : ''}`}
                          maxLength="10"
                        />
                        {fieldErrors.phoneNumber && <div className="field-error">{fieldErrors.phoneNumber}</div>}
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
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`modern-input ${fieldErrors.email ? 'is-invalid' : ''}`}
                        />
                        {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
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
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className={`modern-input ${fieldErrors.startDate ? 'is-invalid' : ''}`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {fieldErrors.startDate && <div className="field-error">{fieldErrors.startDate}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">
                          <i className="fas fa-calendar-check me-2"></i>
                          Expected End Date
                        </label>
                        <Form.Control
                          type="date"
                          value={newProject.expectedEndDate}
                          onChange={(e) => handleInputChange('expectedEndDate', e.target.value)}
                          className={`modern-input ${fieldErrors.expectedEndDate ? 'is-invalid' : ''}`}
                          min={newProject.startDate}
                        />
                        {fieldErrors.expectedEndDate && <div className="field-error">{fieldErrors.expectedEndDate}</div>}
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
                          onChange={(e) => handleInputChange('expectedCost', e.target.value)}
                          className={`modern-input ${fieldErrors.expectedCost ? 'is-invalid' : ''}`}
                          min="0"
                          step="1000"
                        />
                        {fieldErrors.expectedCost && <div className="field-error">{fieldErrors.expectedCost}</div>}
                      </div>

                      {localError && (
                        <div className="error-message">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          {localError}
                        </div>
                      )}
                      
                      <style dangerouslySetInnerHTML={{__html: `
                        .field-error {
                          color: #dc3545;
                          font-size: 0.875rem;
                          margin-top: 0.25rem;
                          display: flex;
                          align-items: center;
                        }
                        
                        .field-error::before {
                          content: '⚠';
                          margin-right: 0.5rem;
                          font-size: 0.75rem;
                        }
                        
                        .modern-input.is-invalid,
                        .modern-select.is-invalid {
                          border-color: #dc3545;
                          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                        }
                        
                        .modern-input.is-invalid:focus,
                        .modern-select.is-invalid:focus {
                          border-color: #dc3545;
                          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                        }
                        
                        .form-group {
                          margin-bottom: 1.5rem;
                        }
                      `}} />
                      
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
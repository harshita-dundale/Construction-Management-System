import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects,addProject,selectProject,updateProject} from "../Pages/Redux/projectSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify"; 
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { FiCheck, FiX } from "react-icons/fi";

  const ProjectModal = ({ show, handleClose }) => {
    
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth0();
    const { projects, status } = useSelector((state) => state.project); //selectedProject,
    const userProjects = projects.filter((p) => p.userId === user?.sub);

    const [newProject, setNewProject] = useState({
      name: "",
      type: "",
      location: "",
      clientName: ""
    });
    const [localError, setLocalError] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editProjectData, setEditProjectData] = useState({
      name: "",
      type: "",
      location: "",
      clientName: ""
    });

    useEffect(() => {
      if (isAuthenticated && user?.sub) {
        dispatch(fetchProjects(user.sub));
      }
    }, [dispatch, isAuthenticated, user?.sub]);

    const handleProjectSelect = (project) => {
      dispatch(selectProject(project));
      localStorage.setItem("selectedProject", JSON.stringify(project)); // ✅ save
      handleClose();
    };

    const handleNewProject = async () => {
      if (!newProject.name.trim()) {
        setLocalError("Project name is required");
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
          clientName: newProject.clientName.trim()
        }));
        await dispatch(fetchProjects(user.sub));
        toast.success("Project added successfully!");
        setNewProject({ name: "", type: "", location: "", clientName: "" });
        setLocalError(null);
        handleClose();
      } catch (err) {
        console.error("Error adding project:", err);
        setLocalError("Failed to add project.");
      }
    };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectData({
      name: project.name || "",
      type: project.type || "",
      location: project.location || "",
      clientName: project.clientName || ""
    });
  };

  const handleUpdateProject = async () => {
    if (!editProjectData.name.trim()) {
      setLocalError("Project name is required");
      return;
    }

    const isDuplicate = userProjects.some(
      (p) =>
        p.name.toLowerCase() === editProjectData.name.trim().toLowerCase() &&
        p.userId === user.sub &&
        p._id !== editingProject._id
    );
    
    if (isDuplicate) {
      toast.error("You already have a project with this name.");
      setLocalError("Project name already exists");
      return;
    }

    try {
      await dispatch(updateProject({ 
        projectId: editingProject._id, 
        name: editProjectData.name.trim(),
        type: editProjectData.type.trim(),
        location: editProjectData.location.trim(),
        clientName: editProjectData.clientName.trim()
      }));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project updated successfully!");
      setEditingProject(null);
      setEditProjectData({ name: "", type: "", location: "", clientName: "" });
      setLocalError(null);
    } catch (err) {
      console.error("Error updating project:", err);
      setLocalError("Failed to update project.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditProjectData({ name: "", type: "", location: "", clientName: "" });
    setLocalError(null);
  };

  const handleDeleteProject = async (projectId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-color)",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteProject(projectId));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Select or Add a Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status === "loading" ? (
          <p>Loading projects...</p>
        // ) : projects.length > 0 ? (
        ) : userProjects.length > 0 ? (
          <div>
            {userProjects.filter((p) => p.userId === user?.sub) 
             .map((p) => (
              <div
                key={p._id}
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}
              >
                {editingProject && editingProject._id === p._id ? (
                  <div className="flex-grow-1">
                    <Form.Control
                      type="text"
                      value={editProjectData.name}
                      onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                      placeholder="Project Name *"
                      className="mb-2"
                      size="sm"
                    />
                    <Form.Select
                      value={editProjectData.type}
                      onChange={(e) => setEditProjectData({...editProjectData, type: e.target.value})}
                      className="mb-2"
                      size="sm"
                    >
                      <option value="">Select Project Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Road">Road</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </Form.Select>
                    <Form.Control
                      type="text"
                      value={editProjectData.location}
                      onChange={(e) => setEditProjectData({...editProjectData, location: e.target.value})}
                      placeholder="Project Location"
                      className="mb-2"
                      size="sm"
                    />
                    <Form.Control
                      type="text"
                      value={editProjectData.clientName}
                      onChange={(e) => setEditProjectData({...editProjectData, clientName: e.target.value})}
                      placeholder="Client Name"
                      className="mb-2"
                      size="sm"
                    />
                    <div className="d-flex gap-2">
                      <button
                        onClick={handleUpdateProject}
                        className="btn btn-sm btn-success"
                        title="Save Changes"
                      > 
                        <FiCheck /> Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-sm btn-secondary"
                        title="Cancel Edit"
                      > 
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      onClick={() => handleProjectSelect(p)}
                      style={{ cursor: "pointer", flexGrow: 1 }}
                    >
                      <div className="fw-bold">{p.name}</div>
                      {p.type && <small className="text-muted">Type: {p.type}</small>}<br/>
                      {p.location && <small className="text-muted">Location: {p.location}</small>}<br/>
                      {p.clientName && <small className="text-muted">Client: {p.clientName}</small>}
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditProject(p)}
                        className="btn btn-sm text-primary me-2"
                        title="Edit Project"
                      > 
                        <FiEdit2 style={{ transform: "scale(1.2)" }}/>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="btn btn-sm text-danger"
                        title="Delete Project"
                      > 
                        <RiDeleteBin6Line style={{ transform: "scale(1.3)" }}/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found. Please add one.</p>
        )}

        {!editingProject && (
          <>
            <div className="mt-3">
              <h6 className="mb-3">Add New Project</h6>
              
              <Form.Control
                type="text"
                value={newProject.name}
                placeholder="Project Name *"
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="mb-2"
              />
              
              <Form.Select
                value={newProject.type}
                onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                className="mb-2"
              >
                <option value="">Select Project Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Road">Road</option>
                <option value="Renovation">Renovation</option>
                <option value="Industrial">Industrial</option>
                <option value="Infrastructure">Infrastructure</option>
              </Form.Select>
              
              <Form.Control
                type="text"
                value={newProject.location}
                placeholder="Project Location (Address, City, State)"
                onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                className="mb-2"
              />
              
              <Form.Control
                type="text"
                value={newProject.clientName}
                placeholder="Client/Owner Name"
                onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                className="mb-2"
              />
            </div>
            
            {localError && <p className="text-danger">{localError}</p>}
            <Button style={buttonStyle1} onClick={handleNewProject}>
              Add Project
            </Button>
          </>
        )}
        
        {editingProject && localError && (
          <p className="text-danger mt-2">{localError}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;

// const buttonStyle = {
//   backgroundColor: "var(--primary-color)",
//   color: "var(--text-color)",
// };

const buttonStyle1 = {
  backgroundColor: "var(--primary-color)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  color: "var(--text-color)",
};

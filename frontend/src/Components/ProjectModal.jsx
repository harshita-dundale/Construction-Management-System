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

    const [newProject, setNewProject] = useState("");
    const [localError, setLocalError] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editProjectName, setEditProjectName] = useState("");

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
      if (!newProject.trim()) {
        setLocalError("Project name is required");
        return;
      }

      // const isDuplicate = projects.some(
      //   (p) => p.name && p.name.toLowerCase() === newProject.trim().toLowerCase()
      // );
      // const isDuplicate = projects.some(
      const isDuplicate = userProjects.some(
        (p) =>
          p.name.toLowerCase() === newProject.trim().toLowerCase() &&
          p.userId === user.sub
      );
      
      if (isDuplicate) {
        toast.error("You already have a project with this name.");
        setLocalError("Project already exists");
        return;
      }

      try {
        await dispatch(addProject({ userId: user.sub, name: newProject }));
        await dispatch(fetchProjects(user.sub));
        toast.success("Project added successfully!");
        setNewProject("");
        setLocalError(null);
        handleClose();
      } catch (err) {
        console.error("Error adding project:", err);
        setLocalError("Failed to add project.");
      }
    };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
  };

  const handleUpdateProject = async () => {
    if (!editProjectName.trim()) {
      setLocalError("Project name is required");
      return;
    }

    const isDuplicate = userProjects.some(
      (p) =>
        p.name.toLowerCase() === editProjectName.trim().toLowerCase() &&
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
        name: editProjectName.trim() 
      }));
      await dispatch(fetchProjects(user.sub));
      toast.success("Project updated successfully!");
      setEditingProject(null);
      setEditProjectName("");
      setLocalError(null);
    } catch (err) {
      console.error("Error updating project:", err);
      setLocalError("Failed to update project.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditProjectName("");
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
                  <div className="d-flex align-items-center flex-grow-1">
                    <Form.Control
                      type="text"
                      value={editProjectName}
                      onChange={(e) => setEditProjectName(e.target.value)}
                      className="me-2"
                      size="sm"
                    />
                    <button
                      onClick={handleUpdateProject}
                      className="btn btn-sm text-success me-1"
                      title="Save Changes"
                    > 
                      <FiCheck style={{ transform: "scale(1.3)" }}/>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-sm text-danger"
                      title="Cancel Edit"
                    > 
                      <FiX style={{ transform: "scale(1.3)" }}/>
                    </button>
                  </div>
                ) : (
                  <>
                    <span 
                      onClick={() => handleProjectSelect(p)}
                      style={{ cursor: "pointer", flexGrow: 1 }}
                    >
                      {p.name}
                    </span>
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
            <Form.Control
              type="text"
              value={newProject}
              placeholder="Add New Project"
              onChange={(e) => setNewProject(e.target.value)}
              className="my-2"
            />
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

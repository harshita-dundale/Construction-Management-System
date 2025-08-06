import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects,addProject,selectProject,} from "../Pages/Redux/projectSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify"; 
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";

  const ProjectModal = ({ show, handleClose }) => {
    
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth0();
    const { projects, status } = useSelector((state) => state.project); //selectedProject,
    const userProjects = projects.filter((p) => p.userId === user?.sub);

    const [newProject, setNewProject] = useState("");
    const [localError, setLocalError] = useState(null);

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
          <ul>
              {/* // {projects .filter((p) => p.userId === user?.sub)  */}
            {userProjects.filter((p) => p.userId === user?.sub) 
             .map((p) => (
              <li
                key={p._id}
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer", borderBottom: "1px solid #ccc", padding: "6px 0" }}
              >
                <span onClick={() => handleProjectSelect(p)}>{p.name}</span>
                <button
                  onClick={() => handleDeleteProject(p._id)}
                  className="btn btn-sm text-danger"
                > 
                  <RiDeleteBin6Line style={{ transform: "scale(1.3)" }}/>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found. Please add one.</p>
        )}

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

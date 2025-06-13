import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects,addProject,selectProject,} from "../Pages/Redux/projectSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { deleteProject } from "../Pages/Redux/projectSlice";
import { toast } from "react-toastify"; 

const ProjectModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const {
    projects = [],
    selectedProject,
    status,
    error,
  } = useSelector((state) => state.project);

  // ✅ Auth0
  const { user, isAuthenticated } = useAuth0();

  // ✅ Local states
  const [newProject, setNewProject] = useState("");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      console.log("📡 Fetching projects for user:", user.sub);
      dispatch(fetchProjects(user.sub)) // ✅ Fetch projects from backend
        .then((res) => console.log("🔄 API Response:", res))
        .catch((err) => console.error("🚨 Fetch Error:", err));
    }
  }, [dispatch, isAuthenticated, user?.sub]);

  console.log("🔍 Checking projects:", projects);

  const handleProjectSelect = (project) => {
    dispatch(selectProject(project));
    handleClose();
  };

  // const handleNewProject = async () => {
  //   if (!isAuthenticated || !user.sub) {
  //     console.error("🚨 User not authenticated or user.sub is missing:", user);
  //     setLocalError("Authentication error: Please log in again.");
  //     return;
  //   }

    const handleNewProject = async () => {
      if (!newProject.trim()) {
        setLocalError("Project name is required");
        return;
      }

    const isDuplicate = projects.some(
      (p) => p.name.toLowerCase() === newProject.trim().toLowerCase()
    );
    if (isDuplicate) {
      setLocalError("Project name is required");
      return;
    }

    try {
      //console.log("📡 Sending new project to backend:", newProject);
     //const result =  await dispatch(addProject({ userId: user.sub, name: newProject }));
     // console.log("✅ Project added:", result);

     await dispatch(addProject({ userId: user.sub, name: newProject }));

      console.log("📡 Fetching projects again...");
      // const updatedProjects = await dispatch(fetchProjects(user.sub));
      // console.log("🔄 Updated projects:", updatedProjects);
      dispatch(fetchProjects(user.sub));
      setNewProject("");
      setLocalError(null);
    } catch (err) {
      console.error("🚨 Error adding project:", err);
      setLocalError("Failed to add project. Try again.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Confirm to delete this project?");
    if (!confirmDelete) return;
  
    try {
      await dispatch(deleteProject(projectId)).unwrap();
  
      if (selectedProject && selectedProject._id === projectId) {
        dispatch(selectProject(null)); // Clear selected project
      }
  
      await dispatch(fetchProjects(user.sub));
      toast.success("Project deleted successfully!"); // here is the pop up 
    } catch (error) {
      console.error("❌ Failed to delete project:", error);
      toast.error("Failed to delete project. Please try again.");
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
        ) : status === "succeeded" &&
          Array.isArray(projects) &&
          projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li
                key={project._id || project.name}
                className="d-flex justify-content-between align-items-center"
                style={{
                  cursor: "pointer",
                  padding: "5px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <span onClick={() => handleProjectSelect(project)}>
                  {project.name}
                </span>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="btn btn-sm btn-outline-danger ms-2"
                > 🗑️  </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found. Add a new project.</p>
        )}

        <Form.Control
          type="text"
          placeholder="Enter new project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="my-2"
        />
        <Button onClick={handleNewProject}>Add New Project</Button>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;
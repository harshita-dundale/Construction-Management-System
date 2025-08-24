import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setProjects, selectProject, addProject } from "../Pages/Redux/projectSlice";

const ProjectModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { projects, selectedProject } = useSelector((state) => state.project);
  const [newProject, setNewProject] = useState("");

  // Dummy projects (Later replace with API call)
  useEffect(() => {
    const dummyProjects = [
      { id: 1, name: "Mall Construction" },
      { id: 2, name: "Residential Building" },
    ];
    dispatch(setProjects(dummyProjects));
  }, [dispatch]);

  // Project Select Handler
  const handleProjectSelect = (project) => {
    dispatch(selectProject(project));
    handleClose();
  };

  // New Project Add Handler
  const handleNewProject = () => {
    if (newProject.trim() === "") return;
    const newProjectData = { id: projects.length + 1, name: newProject };
    dispatch(addProject(newProjectData));
    setNewProject("");
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Select or Add a Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {projects.map((project) => (
            <li key={project.id} onClick={() => handleProjectSelect(project)}
            style={{ cursor: "pointer", padding: "5px 0" }}>
              {project.name}
            </li>
          ))}
        </ul>
        <Form.Control
          type="text"
          placeholder="Enter new project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="my-2" />
        <Button onClick={handleNewProject}>Add New Project</Button>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectModal;

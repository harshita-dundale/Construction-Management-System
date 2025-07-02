
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import role1 from "../assets/images/photos/role1.svg";
import role2 from "../assets/images/photos/role2.svg";
import SelectRole from "../Components/SelectRole";
import ProjectModal from "../Components/ProjectModal";
import Login from "./Login";
import { setUserRole } from "../Pages/Redux/roleSelected";
import { fetchProjects, selectProject } from "../Pages/Redux/projectSlice";
import Header from "../Components/Header";
function RoleSelectionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const role = useSelector((state) => state.role.role);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`)
        .then((response) => {
          if (!response.ok) throw new Error("User role not found");
          return response.json();
        })
        .then((data) => {
          if (data.role) dispatch(setUserRole(data.role));
        })
        .catch((err) => console.warn("⚠️ No role found, ask to select role.", err));
    }
  }, [user?.email]);

  useEffect(() => {
    if (role === "builder" && user?.sub) {
      dispatch(fetchProjects(user.sub)).then((resultAction) => {
        const projects = resultAction.payload?.projects;
  
        if (!projects || projects.length === 0) {
          setShowProjectModal(true);
          return;
        }
  
        const storedProject = localStorage.getItem(`selectedProject_${user.sub}`);
        let selected = storedProject ? JSON.parse(storedProject) : projects[0];
  
        dispatch(selectProject(selected));
        localStorage.setItem(`selectedProject_${user.sub}`, JSON.stringify(selected));
        navigate("/Builder-Dashboard");
      });
    }
  }, [role, user?.sub, dispatch]);
  

  const updateUserRole = async (role) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0Id: user.sub,
          name: user.name,
          email: user.email,
          role,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to update role");

      dispatch(setUserRole(role));
      return true;
    } catch (error) {
      console.error("Role update error:", error.message);
      return false;
    }
  };

  const handleBuilderSelect = async () => {
    if (await updateUserRole("builder")) {
      setShowProjectModal(true);
    }
  };

  const handleWorkerSelect = async () => {
    if (await updateUserRole("worker")) {
      navigate("/browse-job");
    }
  };

  const roles = [
    {
      imgSrc: role1,
      h1Text: "Builder",
      pText: "Choose Builder role to manage your construction projects.",
      buttonText: "Submit",
      onClick: handleBuilderSelect,
    },
    {
      imgSrc: role2,
      h1Text: "Worker",
      pText: "Choose Worker role to apply and track your jobs.",
      buttonText: "Submit",
      onClick: handleWorkerSelect,
    },
  ];

  return (
    <>
      <Header />
      <Login />
      <div className="container mt-5"><style>{`
        .text-warning {
        margin-top: 7rem;
          color: #ffc107 !important;
        }
      `}</style>
        <h1 className="text-center text-warning">Select Your Role!</h1>
        <div className="row justify-content-center mt-4">
          {roles.map((role, idx) => (
            <SelectRole key={idx} {...role} />
          ))}
        </div>
      </div>

      <ProjectModal
        show={showProjectModal}
        handleClose={() => {
          setShowProjectModal(false);
          navigate("/Builder-Dashboard");
        }}
      />
    </>
  );
}

export default RoleSelectionPage;

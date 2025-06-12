import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import role1 from "../assets/images/photos/role1.svg";
import role2 from "../assets/images/photos/role2.svg";
import SelectRole from "../Components/SelectRole";
import ProjectModal from "../Components/ProjectModal";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./Login";
import { setUserRole } from "../Pages/Redux/roleSelected";
import { selectProject } from "../Pages/Redux/projectSlice";
import { fetchProjects } from "../Pages/Redux/projectSlice";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const role = useSelector((state) => state.role.role);
  
  useEffect(() => {
    if (isAuthenticated && user?.email) {
       fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`)
      //fetch(`http://localhost:5000/get-role?email=${user.email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User role not found");
        }
        return response.json();
      })
      .then((data) => {
        if (data.role) {
          dispatch(setUserRole(data.role));
        }
      })
      .catch((error) => {
        console.warn("⚠️ No role found, let user select a role.", error);
      });
    }
  }, [user?.email]);

  useEffect(() => {
    if (role === "builder" && user?.email) {
      dispatch(fetchProjects(user.email));  // ✅ Builder role select hone par projects fetch karega
    }
  }, [role, user?.email, dispatch]);

  // Role update function
  const updateUserRole = async (role) => {
    try {
      const userEmail = user?.email || "";
      const auth0Id = user?.sub || "";
      const userName = user?.name || "";

      if (!userEmail || !role) {
        console.error("❌ Missing userEmail or role!");
        return false;
      };

      const response = await fetch("http://localhost:5000/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     auth0Id: user.auth0Id,
        //     name: user.name,
        //     email: user.email,
        //     role: role
        // })  
        body: JSON.stringify({ auth0Id, name: userName, email: userEmail, role }),
      }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to update role");

      localStorage.setItem("userRole", role);
      dispatch(setUserRole(role));

      console.log("✅ Role updated successfully:", data);

      if (role === "builder") {
        dispatch(fetchProjects(userEmail));
      }
      return true;

    } catch (error) {
      console.error("Error updating role:", error.message);
      return false;
    }
  };

  const handleBuilderSelect = async () => {
    if (await updateUserRole("builder")) {
      setShowProjectModal(true);
      const selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
      if (selectedProject) {
        dispatch(selectProject(selectedProject)); // ✅ Store selected project in Redux
      }
    }
  };

  const handleWorkerSelect = async () => {
    if (await updateUserRole("worker")) {
      // navigate("/browse-job", { replace: true });
      setTimeout(() => navigate("/browse-job"), 500);
    }
  };

  const roles = [
    {
      imgSrc: role1,
      h1Text: "Builder",
      pText: "Choose Builder role to streamline construction, assign tasks, and ensure project success-your key to find skilled workers!",
      buttonText: "submit",
      onClick: handleBuilderSelect,
    },
    {
      imgSrc: role2,
      h1Text: "Worker",
      pText: "Opt for the Worker role to contribute to construction projects, track tasks, report progress, and collaborate seamlessly!",
      buttonText: "submit",
      onClick: handleWorkerSelect,
    }
  ];

  return (
    <>
      <Login />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center mt-5 ">
            <h1 style={{ color: "#f58800" }}>Select Your Role ! </h1>
          </div>

          {roles.map((role, index) => (
            <SelectRole
              key={index}
              imgSrc={role.imgSrc}
              h1Text={role.h1Text}
              pText={role.pText}
              buttonText={role.buttonText}
              onClick={role.onClick}
            />
          ))}
        </div>
      </div>

      {/* Modal component jo builder role select hone par show hoga */}
      <ProjectModal
        show={showProjectModal}
        handleClose={() => {
          setShowProjectModal(false);
          // Agar Redux ke through project select ho jata hai,
          // dashboard page par navigate karne ka logic modal ke andar ya Redux middleware me implement kar sakti ho.
          // Yahan simple example ke liye navigate kar sakti ho agar project selection complete ho jaye.
          if (localStorage.getItem("userRole") === "builder") {
            navigate("/Builder-Dashboard");
          }
        }}
      />
    </>
  );
}
export default RoleSelectionPage;
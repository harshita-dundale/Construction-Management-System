import React, { useEffect, useState } from "react";
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
        .catch((err) => console.warn("⚠️ No role found, ask to select role.", encodeURIComponent(err.message || 'Unknown error')));
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
        navigate("/Project_pannel");
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
      console.error("Role update error:", encodeURIComponent(error.message || 'Unknown error'));
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
      <Login />
      <div className="container mt-5">
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
          navigate("/Project_pannel");
        }}
      />
    </>
  );
}

export default RoleSelectionPage;


// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import role1 from "../assets/images/photos/role1.svg";
// import role2 from "../assets/images/photos/role2.svg";
// import SelectRole from "../Components/SelectRole";
// import ProjectModal from "../Components/ProjectModal";
// import { useAuth0 } from "@auth0/auth0-react";
// import Login from "./Login";
// import { setUserRole } from "../Pages/Redux/roleSelected";
// import { selectProject } from "../Pages/Redux/projectSlice";
// import { fetchProjects } from "../Pages/Redux/projectSlice";
// import { toast } from "react-toastify";

// function RoleSelectionPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useAuth0();
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const role = useSelector((state) => state.role.role);

//   useEffect(() => {
//     if (isAuthenticated && user?.email) {
//       fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`)
//         //fetch(`http://localhost:5000/get-role?email=${user.email}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("User role not found");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           if (data.role) {
//             dispatch(setUserRole(data.role));
//           }
//         })
//         .catch((error) => {
//           console.warn("⚠️ No role found, let user select a role.", error);
//         });
//     }
//   }, [user?.email]);

//   useEffect(() => {
//     if (role === "builder" && user?.sub) {
//       dispatch(fetchProjects(user.sub)).then((resultAction) => {
//         const data = resultAction.payload;
  
//         if (!data?.projects || data.projects.length === 0) {
//           console.warn("❌ No projects found. Forcing modal open.");
//           setShowProjectModal(true);
//           return;
//         }
  
//         // ✅ Always select the first project for the builder
//         dispatch(selectProject(data.projects[0]));
//         navigate("/Builder-Dashboard");
//       });
//     }
//   }, [role, user?.sub, dispatch]);
  

//   useEffect(() => {
//     const selectedProject = localStorage.getItem("selectedProject");
//     if (!selectedProject) {
//       toast.warn("Access denied. Please select a project.");
//       navigate("/select-role");
//     }
//   }, []);

//   useEffect(() => {
//     const prevUserId = localStorage.getItem("userId");
//     const currentUserId = user?.sub;
//     if (prevUserId && currentUserId && prevUserId !== currentUserId) {
//       localStorage.removeItem("selectedProject");
//     }
//     if (currentUserId) {
//       localStorage.setItem("userId", currentUserId);
//     }
//   }, [user?.sub]);

//   // Role update function
//   const updateUserRole = async (role) => {
//     try {
//       const userEmail = user?.email || "";
//       const auth0Id = user?.sub || "";
//       const userName = user?.name || "";

//       if (!userEmail || !role) {
//         console.error("❌ Missing userEmail or role!");
//         return false;
//       }

//       const response = await fetch("http://localhost:5000/api/auth/set-role", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         //   body: JSON.stringify({
//         //     auth0Id: user.auth0Id,
//         //     name: user.name,
//         //     email: user.email,
//         //     role: role
//         // })
//         body: JSON.stringify({
//           auth0Id,
//           name: userName,
//           email: userEmail,
//           role,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok)
//         throw new Error(data?.message || "Failed to update role");

//       const currentUserId = localStorage.getItem("currentUserId");
//       if (currentUserId !== user.sub) {
//         localStorage.removeItem("selectedProject");
//         // localStorage.setItem("currentUserId", user.sub);
//         localStorage.setItem(
//           `selectedProject_${user.sub}`,
//           JSON.stringify(project)
//         );
//         localStorage.setItem("currentUserId", user.sub);
//       }
//       localStorage.setItem("userRole", role);
//       dispatch(setUserRole(role));

//       console.log("✅ Role updated successfully:", data);

//       if (role === "builder") {
//         dispatch(fetchProjects(user.sub));
//       }
//       return true;
//     } catch (error) {
//       console.error("Error updating role:", error.message);
//       return false;
//     }
//   };

//   const handleBuilderSelect = async () => {
//     if (await updateUserRole("builder")) {
//       setShowProjectModal(true);
//       const selectedProject = JSON.parse(
//         localStorage.getItem("selectedProject")
//       );
//       if (selectedProject) {
//         dispatch(selectProject(selectedProject)); // ✅ Store selected project in Redux
//       }
//     }
//   };

//   const handleWorkerSelect = async () => {
//     if (await updateUserRole("worker")) {
//       // navigate("/browse-job", { replace: true });
//       setTimeout(() => navigate("/browse-job"), 500);
//     }
//   };

//   const roles = [
//     {
//       imgSrc: role1,
//       h1Text: "Builder",
//       pText:
//         "Choose Builder role to streamline construction, assign tasks, and ensure project success-your key to find skilled workers!",
//       buttonText: "submit",
//       onClick: handleBuilderSelect,
//     },
//     {
//       imgSrc: role2,
//       h1Text: "Worker",
//       pText:
//         "Opt for the Worker role to contribute to construction projects, track tasks, report progress, and collaborate seamlessly!",
//       buttonText: "submit",
//       onClick: handleWorkerSelect,
//     },
//   ];

//   return (
//     <>
//       <Login />
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12 text-center mt-5 ">
//             <h1 style={{ color: "#f58800" }}>Select Your Role ! </h1>
//           </div>

//           {roles.map((role, index) => (
//             <SelectRole
//               key={index}
//               imgSrc={role.imgSrc}
//               h1Text={role.h1Text}
//               pText={role.pText}
//               buttonText={role.buttonText}
//               onClick={role.onClick}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Modal component jo builder role select hone par show hoga */}
//       <ProjectModal
//         show={showProjectModal}
//         handleClose={() => {
//           setShowProjectModal(false);
//           // Agar Redux ke through project select ho jata hai,
//           // dashboard page par navigate karne ka logic modal ke andar ya Redux middleware me implement kar sakti ho.
//           // Yahan simple example ke liye navigate kar sakti ho agar project selection complete ho jaye.
//           if (localStorage.getItem("userRole") === "builder") {
//             navigate("/Builder-Dashboard");
//           }
//         }}
//       />
//     </>
//   );
// }
// export default RoleSelectionPage;

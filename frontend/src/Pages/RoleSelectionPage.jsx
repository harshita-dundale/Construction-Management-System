// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import role1 from "../assets/images/photos/role1.svg";
// import role2 from "../assets/images/photos/role2.svg";
// import SelectRole from "../Components/SelectRole";
// import ProjectModal from "../Components/ProjectModal";
// import { useAuth0 } from "@auth0/auth0-react";
// import Login from "./Login";

// function RoleSelectionPage() {
//   const navigate = useNavigate();
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const { user, isAuthenticated } = useAuth0();
//   //const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       localStorage.setItem("auth0Id", user.sub);
//       localStorage.setItem("userName", user.name);
//       localStorage.setItem("userEmail", user.email);
//       console.log("User data stored in localStorage:", user);

//       fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`)
//         .then( res => {
//           if (!res.ok) {
//               throw new Error(`HTTP error! Status: ${res.status}`);
//           }
//           return res.json();
//       })
//         .then(data => {
//           if (data.role === "builder")  navigate("/Builder-Dashboard");
//            else if (data.role === "worker") navigate("/browse-job");
//       })
//         .catch(err => console.error("Error fetching role:", err.message));
//     }
//   }, [isAuthenticated, user]);

//   // Function to update user role in the backend
//   const updateUserRole = async (role) => {

//     // if (!userData) {
//     //   console.error("User data not available yet!");
//     //   return false;
//     // }
//     try {
//       const auth0Id = localStorage.getItem("auth0Id") || user?.sub || "";
//       const userName = localStorage.getItem("userName") || user?.name || "";
//       const userEmail = localStorage.getItem("userEmail") || user?.email || "";

//       console.log("🚀 Sending to Backend:", { auth0Id, role, userName, userEmail });

//       // if (!auth0Id || !role) {
//       if (!userEmail || !role) {
//         console.error("❌ Missing userEmail or role!");
//         return false;
//       }

//       fetch(`http://localhost:5000/api/get-user/${userEmail}`)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Failed to fetch user role! Status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => console.log(data))
//     .catch(error => console.error("Error fetching role:", error));


//       const response = await fetch("http://localhost:5000/api/auth/set-role", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ auth0Id, name: userName, email: userEmail, role }),
//       });

//       const data = await response.json();
//       console.log("✅ Backend Response:", data);

//       if (!response.ok) {
//         //const errorText = await response.json();
//         // throw new Error(`Failed to update role: ${errorText || "Unknown error"}`);
//         throw new Error(`Failed to update role: ${JSON.stringify(data)}`);

//       }

//       console.log("✅ Role updated successfully");
//       //console.log(data.message); // Log success message
//       localStorage.setItem("userRole", role);

//       return true;

//     } catch (error) {
//       console.error("Error updating role:", error.message);
//       return false;
//     }
//   }

//   const handleBuilderSelect = async () => {
//     const roleUpdated = await updateUserRole("builder");
//     if (roleUpdated) {
//       //localStorage.setItem("userRole", "builder"); 
//       setShowProjectModal(true);
//     }
//   };

//   const handleWorkerSelect = async () => {
//     const roleUpdated = await updateUserRole("worker");
//     if (roleUpdated) {
//       // localStorage.setItem("userRole", "worker"); 
//       navigate("/browse-job");
//     }
//   };

//   const roles = [
//     {
//       imgSrc: role1,
//       h1Text: "Builder",
//       pText: "Choose Builder role to streamline construction, assign tasks, and ensure project success-your key to find skilled workers!",
//       buttonText: "submit",
//       onClick: handleBuilderSelect,
//     },
//     {
//       imgSrc: role2,
//       h1Text: "Worker",
//       pText: "Opt for the Worker role to contribute to construction projects, track tasks, report progress, and collaborate seamlessly!",
//       buttonText: "submit",
//       onClick: handleWorkerSelect,
//     }
//   ];

//   return (
//     <>
//      <Login/>
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

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import role1 from "../assets/images/photos/role1.svg";
import role2 from "../assets/images/photos/role2.svg";
import SelectRole from "../Components/SelectRole";
import ProjectModal from "../Components/ProjectModal";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./Login";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
       fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`)
    }
 }, [user?.email]);
 

  // Role update function
  const updateUserRole = async (role) => {
    try {
      const userEmail = user?.email || "";
      if (!userEmail || !role) return false;

      const response = await fetch("http://localhost:5000/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0Id: user.auth0Id,
          name: user.name,
          email: user.email,
          role: role
      })      });

      if (!response.ok) throw new Error("Failed to update role");
      //localStorage.setItem("userRole", role);
      // const roleUpdated = await updateUserRole("worker");
      // if (roleUpdated) {
      //   setTimeout(() => navigate("/browse-job"), 500);
      // }

      return true;
    } catch (error) {
      console.error("Error updating role:", error.message);
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
      //navigate("/browse-job", { replace: true });
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
     <Login/>
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
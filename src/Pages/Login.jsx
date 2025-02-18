import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { user, isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        const fetchUserRole = async (email) => {
            try {
                if (!email || email.trim() === "") {
                    throw new Error("Email is required to fetch user role");
                  }
                const response = await fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`);
                // const response = await fetch(`http://localhost:5000/api/get-user/${email}`);

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
               
                const text = await response.text(); // Read the response as text first
                console.log("Response text:", text); // Check the raw response
                
                const data = JSON.parse(text); // Then parse as JSON
                console.log(data);
                // const data = await response.json();
                // console.log(data);
                if (data.role) {
                    navigate(data.role === "builder" ? "/builder-dashboard" : "/browse-job", { replace: true });
                }
            } catch (err) {
                console.error("Error fetching role:", err.message);
               // alert("User not found or error fetching data.");
            } finally {
                setLoading(false);
            }
        };
        const email = user?.email;  // Safely access user.email
        console.log("Email:", email);  // Log the email to make sure it's correct

        if (email) {
            fetchUserRole(email);
        } else {
            alert("No email found for the user.");
            setLoading(false);
        }
    }, [isAuthenticated, user, navigate]);

    if (loading) {
        return <p>Loading...</p>; // 🔥 Flickering avoid karne ke liye
    }

    return null;
};

export default Login;



// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkUserRole = async () => {
//           const auth0Id = localStorage.getItem("auth0Id");
    
//           if (auth0Id) {
//             try {
//               const response = await fetch(`http://localhost:5000/api/auth/get-user/${auth0Id}`);
//               const data = await response.json();
    
//               if (data.role) {
//                 localStorage.setItem("userRole", data.role); // ✅ Role localStorage me store karo
                
//                 // ✅ Role ke hisaab se redirect karo
//                 if (data.role === "builder") {
//                   navigate("/Builder-Dashboard");
//                 } else if (data.role === "worker") {
//                   navigate("/browse-job");
//                 }
//               } else {
//                 navigate("/role-selection"); 
//               }
    
//             } catch (error) {
//               console.error("Error fetching user role:", error);
//             }
//           }
//         };
    
//         checkUserRole();
//       }, [navigate]);    

//     return <div>Loading...</div>;
// };

// export default Login;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        const fetchUserRole = async (email) => {

            try {
                if (!email || email.trim() === "") {
                    throw new Error("Email is required to fetch user role");
                  }

                  const storedRole = localStorage.getItem("userRole");
                  if (storedRole) {
                      navigate(storedRole === "builder" ? "/builder-dashboard" : "/browse-job", { replace: true });
                      return;
                  }
                  
                  console.log("User Object:", user);
                  console.log("Email Passed:", user?.email);

                const response = await fetch(`http://localhost:5000/api/auth/get-role?email=${user.email}`);
                // const response = await fetch(`http://localhost:5000/api/get-user/${email}`);

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
               
                const data = await response.json();
                console.log("User Role Data:",data);

                if (data.role) {
                    localStorage.setItem("userRole", data.role);
                    navigate(data.role === "builder" ? "/builder-dashboard" : "/browse-job", { replace: true });
                }
                else {
                    setError("No role found. Please select your role.");
                }

            } catch (err) {
                console.error("Error fetching role:", err.message);
                setError("Error fetching user role. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        // const email = user?.email;  // Safely access user.email
        // console.log("Email:", email);  // Log the email to make sure it's correct

        if (user?.email) {
            fetchUserRole(user.email);
        } else {
            setLoading(false);
        }
    }, [isAuthenticated,  isLoading, user, navigate]);

    if (isLoading || loading) {
        return <p>Loading...</p>; // 🔥 Flickering avoid karne ke liye
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return null;
};

export default Login;

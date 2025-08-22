
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchUserRole = async (email) => {
        try {
            if (!email || email.trim() === "") {
                throw new Error("Email is required to fetch user role");
            }

            // ✅ Agar localStorage me role hai toh backend call avoid karo
            const storedRole = localStorage.getItem("userRole");
            if (storedRole) {
                return storedRole; // Backend call ki zaroorat nahi
            }

            console.log("Fetching role from backend for:", email);

             const response = await fetch(`http://localhost:5000/api/auth/get-role?email=${email}`);
           // const response = await fetch(`http://localhost:5000/get-role?email=${email}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("User does not exist in database. Let them select a role first.");
                    navigate("/role-selection", { replace: true }); // ✅ Redirect immediately
                    return null; // ✅ Role nahi mila toh NULL return karo
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User Role Data:", data);

            if (data.role) {
                localStorage.setItem("userRole", data.role);
                return data.role;
            } else {
                setError("No role found. Please select your role.");
                return null;
            }

        } catch (err) {
            console.error("Error fetching role:", err.message);
            setError("Error fetching user role. Please try again.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        const checkAndNavigate = async () => {
            try {
                if (!user?.email) throw new Error("Email is missing!");

                // ✅ Pehle localStorage check karo
                const storedRole = localStorage.getItem("userRole");
                if (storedRole) {
                    navigate(storedRole === "builder" ? "/builder-dashboard" : "/browse-job", { replace: true });
                    return;
                }

                // ✅ Backend se role fetch karo
                const role = await fetchUserRole(user.email);

                // ✅ Agar role mila toh navigate karo
                if (role) {
                    navigate(role === "builder" ? "/builder-dashboard" : "/browse-job", { replace: true });
                } else {
                    console.log("Redirecting user to role selection...");
                    navigate("/role-selection", { replace: true }); // Role selection page pe bhejo
                }
            } catch (err) {
                console.error("❌ Error in checkAndNavigate:", err.message);
                setError("Error fetching user role. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        checkAndNavigate();
    }, [isAuthenticated, isLoading, user, navigate]);

    if (isLoading || loading) {
        return <p>Loading...</p>; // 🔥 Flickering avoid karne ke liye
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return null;
};

export default Login;

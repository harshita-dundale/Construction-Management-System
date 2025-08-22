const API_BASE = "http://localhost:5000/api";

export const assignRole = async (email, role) => {
    const response = await fetch(`${API_BASE}/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
    });

    return response.json();
};

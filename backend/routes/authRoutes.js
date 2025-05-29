
import User from "../models/user.js"; 
import express from "express";
const router = express.Router();

router.post('/set-role', async (req, res) => {
    const { auth0Id, name, email, role } = req.body;
    console.log("📩 Received in Backend:", { auth0Id, name, email, role });

    if (!auth0Id || !role) {
        console.error("Missing auth0Id or selectedRole!");
        return res.status(400).json({ message: "User ID and role are required" });
    }
    try {
        let user = await User.findOne({ auth0Id });

        if (!user) {
            user = new User({ auth0Id, name, email, role });
            await user.save();
        } else {

                await User.findOneAndUpdate(
                  {auth0Id}, 
                  {  email , name, role },
                  { new: true, upsert: true }
                );
        }
        res.json({ message: "Role updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error updating role", error });
    }
});

router.get("/get-role", async (req, res) => {
    try {
        const { email } = req.query;
    
        if (!email)   return res.status(400).json({ error: "Email is required" });

        const user = await User.findOne({ email }).select("role");
    
        if (!user) return res.status(404).json({ role: null });
    
        res.json({ role: user.role });
    } catch (error) {  
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
});

router.get('/api/get-user/:email', async (req, res) => {
    const email = req.params.email;
    console.log("Fetching user for email:", email); 

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(` No user found for email: ${email}`);  
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
});
export default router;
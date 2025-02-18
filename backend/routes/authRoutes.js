// // const bycript = require('bycriptjs');
// // const jwt = require('jsonwebtoken');
// // require("dotenv").config();
// import express from "express";
// import ser from "../models/user.js";
// const router = express.Router();

// // ✅ User register (Agar database me nahi hai toh add karega)
// router.post('/register', async (req, res) => {
//     const { auth0Id, name, email } = req.body;

//     try {
//         let user = await user.findOne({ auth0Id });

//         if (!user) {
//             user = new user({ auth0Id, name, email });
//             await user.save();
//         }

//         res.json(user);

//     } catch (error) {
//         res.status(500).json({ message: "Error registering user", error });
//     }
// })

// // ✅ User role update (Builder/Worker select hone ke baad)
// router.post ('/set-role', async (req, res) =>{
//     const { auth0Id, role } = req.body;

//     if (!auth0Id || !role) {
//         return res.status(400).json({ message: "User ID and role are required" });
//     }

// try {
//         await user.findOneAndUpdate({ auth0Id }, { role });
//         res.json({ message: "Role updated successfully!" });

// } catch (error) {
//         res.status(500).json({ message: "Error updating role", error });
// }
// })

// // ✅ Get user details (Role check karne ke liye)
// router.get("/get-user/:email", async (req, res) => {
//     const { email } = req.params;

//     try {
//         const user = await user.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(user);

//     } catch (error) {
//        res.status(500).json({ message: "Error fetching user", error });
//     }
// });
// export default router;


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
          //  try {
                // await User.findOneAndUpdate(
                //   { email }, 
                //   { auth0Id, name, role },
                //   { new: true, upsert: true }
                // );
                await User.findOneAndUpdate(
                    { auth0Id }, 
                    { $set: { name, email, role } },
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
    
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
    
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        res.json({ role: user.role });
    } catch (error) {  // 🛠️ Yeh pehle err tha, ise error kar diya
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
});

// router.get('/api/get-user/:email', async (req, res) => {
//     const email = req.params.email;
//     console.log("📩 Fetching user for email:", email); 

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.json(user);
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ message: "Error fetching user", error });
//     }
// });

export default router;



// ✅ Get user details
// router.get("/get-role", async (req, res) => {
//     try {
//         const { email } = req.query; // URL parameter se email fetch karo
    
//         if (!email) {
//           return res.status(400).json({ error: "Email is required" });
//         }
    
//         const user = await User.findOne({ email });
    
//         if (!user) {
//           return res.status(404).json({ error: "User not found" });
//         }
    
//         res.json({ role: user.role });

//     } catch (error) {
//         console.error("Error fetching role:", err);
//         res.status(500).json({ message: "Error fetching user", error });
//     }
// });
// import User from "../models/user.js";

// // 🔹 Set or Update User Role
// export const setUserRole = async (req, res) => {
//   const { auth0Id, name, email, role } = req.body;
//   console.log("📩 Received in Backend:", { auth0Id, name, email, role });

//   if (!auth0Id || !role) {
//     return res.status(400).json({ message: "User ID and role are required" });
//   }

//   try {
//     let user = await User.findOne({ auth0Id });

//     if (!user) {
//       user = new User({ auth0Id, name, email: email.toLowerCase(), role });
//       await user.save();
//     } else {
//       await User.findOneAndUpdate(
//         { auth0Id },
//         { $set: { name, email: email.toLowerCase(), role } },
//         { new: true, upsert: true }
//       );
//     }

//     res.json({ message: "Role updated successfully!" });
//   } catch (error) {
//     console.error("Error updating role:", error);
//     res.status(500).json({ message: "Error updating role", error });
//   }
// };

// // 🔹 Get Role by Email
// export const getUserRole = async (req, res) => {
//   try {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ error: "Email is required" });

//     const user = await User.findOne({ email: email.toLowerCase() }).select("role");

//     if (!user) return res.status(404).json({ role: null });

//     res.json({ role: user.role });
//   } catch (error) {
//     console.error("Error fetching role:", error);
//     res.status(500).json({ message: "Error fetching user", error });
//   }
// };

// // 🔹 Get Full User Details by Email
// export const getUserByEmail = async (req, res) => {
//   const email = req.params.email;
//   console.log("📩 Fetching user for email:", email);

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Error fetching user", error });
//   }
// };

import User from "../models/user.js";

// 🔹 Set or Update User Role
export const setUserRole = async (req, res) => {
  const { auth0Id, name, email, role } = req.body;

  if (!auth0Id || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({ auth0Id, name, email: email.toLowerCase(), role });
      await user.save();
    } else {
      await User.findOneAndUpdate(
        { auth0Id },
        { $set: { name, email: email.toLowerCase(), role } },
        { new: true }
      );
    }

    res.json({ message: "Role updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
};

// 🔹 Get Role by Email
export const getUserRole = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("role");

    if (!user) return res.status(404).json({ role: null });

    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// 🔹 Get Full User Details by Email (FIXED FOR FRONTEND)
export const getUserByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Return data in the format frontend expects
    res.json({
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage, // 🔹 Important: Frontend expects this field
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// 🔹 Save Uploaded Profile Image to DB (IMPROVED)
export const uploadProfileImage = async (req, res) => {
  const { auth0Id, imageUrl } = req.body;

  if (!auth0Id) {
    return res.status(400).json({ error: 'auth0Id is required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { 
        profileImage: imageUrl, // Can be null for delete
        updatedAt: new Date()
      },
      { new: true, upsert: true } // Create if doesn't exist
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: imageUrl ? 'Profile image updated successfully' : 'Profile image deleted successfully',
      profileImage: user.profileImage 
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 🔹 Delete Profile Image
export const deleteProfileImage = async (req, res) => {
  const { auth0Id } = req.body;

  if (!auth0Id) {
    return res.status(400).json({ error: 'auth0Id is required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { 
        profileImage: null,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Profile image deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};